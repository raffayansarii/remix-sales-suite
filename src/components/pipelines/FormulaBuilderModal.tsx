import { useState, useCallback } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, Connection, Node, Edge, Controls, Background, Handle, Position, NodeProps } from '@xyflow/react';
import { Plus, Minus, DivideIcon as Divide, Asterisk, Calculator, Trash2, ParenthesesIcon as Parentheses, X } from 'lucide-react';
import '@xyflow/react/dist/style.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface AvailableColumn {
  id: string;
  name: string;
  type: 'system' | 'default' | 'custom';
}

interface NodeData extends Record<string, unknown> {
  label: string;
  value: string;
  nodeType: 'column' | 'operator' | 'number';
  columnType?: string;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, value: string) => void;
}

interface FormulaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateColumn: (data: { name: string; formula: string }) => void;
}

// Only number type columns for formula creation
const mockColumns: AvailableColumn[] = [
  { id: 'value', name: 'Opportunity Value', type: 'system' },
  { id: 'probability', name: 'Probability %', type: 'system' },
  { id: 'budget', name: 'Budget Amount', type: 'default' },
  { id: 'revenue', name: 'Expected Revenue', type: 'default' },
  { id: 'discount', name: 'Discount %', type: 'custom' },
  { id: 'quantity', name: 'Quantity', type: 'custom' },
];

const operators = [
  { id: 'add', symbol: '+', icon: Plus, label: 'Add' },
  { id: 'subtract', symbol: '-', icon: Minus, label: 'Subtract' },
  { id: 'multiply', symbol: '*', icon: Asterisk, label: 'Multiply' },
  { id: 'divide', symbol: '/', icon: Divide, label: 'Divide' },
];

// Custom Node Components
function ColumnNode({ data, id }: { data: NodeData; id: string }) {
  return (
    <div className="relative bg-blue-50 border-2 border-blue-200 rounded-lg p-3 min-w-32 text-center">
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <button
        onClick={() => data.onDelete?.(id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
      >
        <X className="w-3 h-3" />
      </button>
      <div className="text-sm font-medium text-blue-800">{data.label}</div>
      <div className="text-xs text-blue-600">{data.columnType}</div>
    </div>
  );
}

function OperatorNode({ data, id }: { data: NodeData; id: string }) {
  return (
    <div className="relative bg-purple-50 border-2 border-purple-200 rounded-full w-16 h-16 flex items-center justify-center">
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <button
        onClick={() => data.onDelete?.(id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
      >
        <X className="w-3 h-3" />
      </button>
      <div className="text-lg font-bold text-purple-800">{data.value}</div>
    </div>
  );
}

function NumberNode({ data, id }: { data: NodeData; id: string }) {
  return (
    <div className="relative bg-green-50 border-2 border-green-200 rounded-lg p-3 min-w-20 text-center">
      <Handle type="source" position={Position.Right} className="w-3 h-3" />
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      <button
        onClick={() => data.onDelete?.(id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
      >
        <X className="w-3 h-3" />
      </button>
      <input
        type="number"
        value={data.value}
        onChange={(e) => data.onUpdate?.(id, e.target.value)}
        className="w-full bg-transparent border-none text-center text-sm font-medium text-green-800 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

const nodeTypes = {
  column: ColumnNode,
  operator: OperatorNode,
  number: NumberNode,
};

export function FormulaBuilderModal({ isOpen, onClose, onCreateColumn }: FormulaBuilderModalProps) {
  const [columnName, setColumnName] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const updateNodeValue = useCallback((nodeId: string, value: string) => {
    setNodes((nds) => nds.map((node) => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, value } }
        : node
    ));
  }, [setNodes]);

  const isValidConnection = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target) return false;
    
    const sourceNode = nodes.find(node => node.id === connection.source);
    const targetNode = nodes.find(node => node.id === connection.target);
    
    if (!sourceNode || !targetNode) return false;
    
    const sourceType = sourceNode.data.nodeType;
    const targetType = targetNode.data.nodeType;
    
    // Allow connections: column -> operator, operator -> column, number -> operator, operator -> number
    const validConnections = [
      (sourceType === 'column' && targetType === 'operator'),
      (sourceType === 'operator' && targetType === 'column'),
      (sourceType === 'number' && targetType === 'operator'),
      (sourceType === 'operator' && targetType === 'number'),
    ];
    
    return validConnections.some(Boolean);
  }, [nodes]);

  const onConnect = useCallback((params: Connection) => {
    if (isValidConnection(params)) {
      setEdges((eds) => addEdge(params, eds));
    }
  }, [setEdges, isValidConnection]);

  const addColumnNode = useCallback((column: AvailableColumn) => {
    const newNode: Node<NodeData> = {
      id: `column-${column.id}-${Date.now()}`,
      type: 'column',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: column.name,
        value: column.id,
        nodeType: 'column',
        columnType: column.type,
        onDelete: deleteNode
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, deleteNode]);

  const addOperatorNode = useCallback((operator: typeof operators[0]) => {
    const newNode: Node<NodeData> = {
      id: `operator-${operator.id}-${Date.now()}`,
      type: 'operator',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: operator.symbol,
        value: operator.symbol,
        nodeType: 'operator',
        onDelete: deleteNode
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, deleteNode]);

  const addNumberNode = useCallback(() => {
    const newNode: Node<NodeData> = {
      id: `number-${Date.now()}`,
      type: 'number',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: '0',
        value: '0',
        nodeType: 'number',
        onDelete: deleteNode,
        onUpdate: updateNodeValue
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, deleteNode, updateNodeValue]);

  // Generate formula by traversing the connected graph
  const generateFormulaFromGraph = useCallback(() => {
    if (nodes.length === 0) return '';
    
    // Find nodes with no incoming edges (start nodes)
    const nodeConnections = edges.reduce((acc, edge) => {
      acc[edge.target] = edge.source;
      return acc;
    }, {} as Record<string, string>);
    
    const startNodes = nodes.filter(node => !nodeConnections[node.id]);
    
    if (startNodes.length === 0) {
      // If no start node found, just list nodes
      return nodes.map(node => {
        if (node.data.nodeType === 'column') return `[${node.data.label}]`;
        return node.data.value;
      }).join(' ');
    }
    
    // Traverse from start node following connections
    const traverseNode = (nodeId: string, visited = new Set()): string => {
      if (visited.has(nodeId)) return '';
      visited.add(nodeId);
      
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return '';
      
      let result = node.data.nodeType === 'column' ? `[${node.data.label}]` : node.data.value;
      
      // Find connected nodes
      const connectedEdges = edges.filter(edge => edge.source === nodeId);
      if (connectedEdges.length > 0) {
        const nextResults = connectedEdges.map(edge => traverseNode(edge.target, visited)).filter(Boolean);
        if (nextResults.length > 0) {
          result += ' ' + nextResults.join(' ');
        }
      }
      
      return result;
    };
    
    return startNodes.map(node => traverseNode(node.id)).filter(Boolean).join(' ');
  }, [nodes, edges]);

  const clearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const handleCreate = () => {
    if (!columnName.trim() || nodes.length === 0) return;
    
    // Generate formula from connected graph
    const formulaString = generateFormulaFromGraph();

    // Console log the result for debugging
    console.log('Formula creation result:', {
      columnName,
      formulaString,
      nodes: nodes.map(n => ({ id: n.id, type: n.data.nodeType, value: n.data.value, label: n.data.label })),
      edges: edges.map(e => ({ source: e.source, target: e.target })),
      rawNodes: nodes,
      rawEdges: edges,
      generatedFormula: formulaString
    });

    onCreateColumn({
      name: columnName,
      formula: formulaString,
    });

    // Reset form
    setColumnName('');
    setNodes([]);
    setEdges([]);
  };

  const reset = () => {
    setColumnName('');
    setNodes([]);
    setEdges([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Create Formula Column
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Column Name Input */}
          <div className="space-y-2 shrink-0">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              placeholder="Enter column name..."
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
            />
          </div>

          <Separator className="shrink-0" />

          <div className="flex-1 flex gap-6 min-h-0">
            {/* Left Panel - Available Elements */}
            <div className="w-80 flex flex-col gap-4 min-h-0">
              {/* Operators */}
              <div className="space-y-2 shrink-0">
                <h3 className="font-medium text-sm">Operators & Brackets</h3>
                <div className="flex gap-1 flex-wrap">
                  {operators.map((operator) => (
                    <Button
                      key={operator.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addOperatorNode(operator)}
                      className={`
                        px-2 py-1 h-auto
                        ${operator.id.includes('bracket') 
                          ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' 
                          : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
                        }
                      `}
                    >
                      {!operator.id.includes('bracket') && <operator.icon className="w-3 h-3 mr-1" />}
                      {operator.symbol}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Available Columns - Only Number Types */}
              <div className="space-y-3 flex-1 min-h-0">
                <h3 className="font-medium text-sm">Available Number Columns</h3>
                <ScrollArea className="flex-1 border rounded-lg">
                  <div className="space-y-2 p-2">
                    {mockColumns.map((column) => (
                      <Button
                        key={column.id}
                        variant="outline"
                        onClick={() => addColumnNode(column)}
                        className={`
                          w-full justify-start p-3 h-auto text-sm font-medium
                          ${column.type === 'system' ? 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100' :
                            column.type === 'default' ? 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100' :
                            'bg-green-50 border-green-200 text-green-800 hover:bg-green-100'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between w-full">
                          {column.name}
                          <Badge variant="outline" className="text-xs">
                            {column.type}
                          </Badge>
                        </div>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Add Number Button */}
              <Button variant="outline" onClick={addNumberNode} className="gap-2 shrink-0">
                <Plus className="w-4 h-4" />
                Add Number
              </Button>
            </div>

            {/* Right Panel - React Flow Canvas */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-medium text-sm">Formula Canvas</h3>
                <Button variant="ghost" size="sm" onClick={clearCanvas} className="gap-2 text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </div>

              <div className="flex-1 border-2 border-dashed border-muted-foreground/30 rounded-xl bg-gradient-to-br from-muted/20 to-muted/5">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  nodeTypes={nodeTypes}
                  isValidConnection={isValidConnection}
                  fitView
                  className="rounded-xl"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Controls />
                  <Background color="#94a3b8" gap={16} />
                </ReactFlow>
              </div>

              {/* Formula Preview */}
              {nodes.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50">
                  <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                    <Calculator className="w-3 h-3" />
                    Formula Preview:
                  </Label>
                  <div className="mt-2 p-3 bg-background/80 rounded-lg border font-mono text-sm leading-relaxed">
                    {generateFormulaFromGraph() || 'Connect nodes to create formula...'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between pt-4 border-t shrink-0">
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!columnName.trim() || nodes.length === 0}
              >
                Create Column
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}