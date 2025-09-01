import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { X, Plus, Minus, DivideIcon as Divide, Asterisk, Calculator, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface FormulaElement {
  id: string;
  type: 'column' | 'operator' | 'number';
  value: string;
  label?: string;
}

interface AvailableColumn {
  id: string;
  name: string;
  type: 'system' | 'default' | 'custom';
}

interface FormulaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateColumn: (data: { name: string; formula: string }) => void;
}

const mockColumns: AvailableColumn[] = [
  { id: 'value', name: 'Opportunity Value', type: 'system' },
  { id: 'probability', name: 'Probability %', type: 'system' },
  { id: 'closeDate', name: 'Close Date', type: 'default' },
  { id: 'createdAt', name: 'Created Date', type: 'default' },
  { id: 'stage', name: 'Stage', type: 'default' },
  { id: 'awardType', name: 'Award Type', type: 'default' },
];

const operators = [
  { id: 'add', symbol: '+', icon: Plus, label: 'Add' },
  { id: 'subtract', symbol: '-', icon: Minus, label: 'Subtract' },
  { id: 'multiply', symbol: '*', icon: Asterisk, label: 'Multiply' },
  { id: 'divide', symbol: '/', icon: Divide, label: 'Divide' },
];

export function FormulaBuilderModal({ isOpen, onClose, onCreateColumn }: FormulaBuilderModalProps) {
  const [columnName, setColumnName] = useState('');
  const [formula, setFormula] = useState<FormulaElement[]>([]);

  const getColumnTypeStyles = (type: string) => {
    switch (type) {
      case 'system':
        return 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100';
      case 'default':
        return 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100';
      case 'custom':
        return 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100';
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Dragging from available columns to canvas
    if (source.droppableId === 'available-columns' && destination.droppableId === 'formula-canvas') {
      const columnId = result.draggableId;
      const column = mockColumns.find(col => col.id === columnId);
      
      if (column) {
        const newElement: FormulaElement = {
          id: `${column.id}-${Date.now()}`,
          type: 'column',
          value: column.id,
          label: column.name,
        };

        const newFormula = [...formula];
        newFormula.splice(destination.index, 0, newElement);
        setFormula(newFormula);
      }
    }

    // Dragging from operators to canvas
    if (source.droppableId === 'operators' && destination.droppableId === 'formula-canvas') {
      const operatorId = result.draggableId;
      const operator = operators.find(op => op.id === operatorId);
      
      if (operator) {
        const newElement: FormulaElement = {
          id: `${operator.id}-${Date.now()}`,
          type: 'operator',
          value: operator.symbol,
          label: operator.label,
        };

        const newFormula = [...formula];
        newFormula.splice(destination.index, 0, newElement);
        setFormula(newFormula);
      }
    }

    // Reordering within canvas
    if (source.droppableId === 'formula-canvas' && destination.droppableId === 'formula-canvas') {
      const newFormula = Array.from(formula);
      const [reorderedItem] = newFormula.splice(source.index, 1);
      newFormula.splice(destination.index, 0, reorderedItem);
      setFormula(newFormula);
    }
  };

  const addNumber = () => {
    const newElement: FormulaElement = {
      id: `number-${Date.now()}`,
      type: 'number',
      value: '0',
    };
    setFormula([...formula, newElement]);
  };

  const updateNumber = (id: string, value: string) => {
    setFormula(formula.map(element => 
      element.id === id ? { ...element, value } : element
    ));
  };

  const removeElement = (id: string) => {
    setFormula(formula.filter(element => element.id !== id));
  };

  const clearFormula = () => {
    setFormula([]);
  };

  const handleCreate = () => {
    if (!columnName.trim() || formula.length === 0) return;
    
    const formulaString = formula.map(element => {
      if (element.type === 'column') return `[${element.label}]`;
      return element.value;
    }).join(' ');

    onCreateColumn({
      name: columnName,
      formula: formulaString,
    });

    // Reset form
    setColumnName('');
    setFormula([]);
  };

  const reset = () => {
    setColumnName('');
    setFormula([]);
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

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Column Name Input */}
          <div className="space-y-2">
            <Label htmlFor="column-name">Column Name</Label>
            <Input
              id="column-name"
              placeholder="Enter column name..."
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
            />
          </div>

          <Separator />

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex-1 flex gap-6 overflow-hidden">
              {/* Left Panel - Available Elements */}
              <div className="w-80 flex flex-col gap-4">
                {/* Available Columns */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Available Columns</h3>
                  <Droppable droppableId="available-columns" isDropDisabled={true}>
                    {(provided) => (
                      <ScrollArea className="h-48">
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 p-1">
                          {mockColumns.map((column, index) => (
                            <Draggable key={column.id} draggableId={column.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing text-sm font-medium transition-all
                                    ${getColumnTypeStyles(column.type)}
                                    ${snapshot.isDragging ? 'shadow-lg scale-105 rotate-1 z-50' : 'shadow-sm'}
                                  `}
                                >
                                  {column.name}
                                  <Badge variant="outline" className="ml-2 text-xs">
                                    {column.type}
                                  </Badge>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                        {provided.placeholder}
                      </ScrollArea>
                    )}
                  </Droppable>
                </div>

                {/* Operators */}
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Operators</h3>
                  <Droppable droppableId="operators" isDropDisabled={true}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-2">
                        {operators.map((operator, index) => (
                          <Draggable key={operator.id} draggableId={operator.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`
                                  p-3 rounded-lg border-2 cursor-grab active:cursor-grabbing 
                                  bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100
                                  flex items-center gap-2 text-sm font-medium transition-all
                                  ${snapshot.isDragging ? 'shadow-lg scale-105 rotate-1 z-50' : 'shadow-sm'}
                                `}
                              >
                                <operator.icon className="w-4 h-4" />
                                {operator.symbol}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* Add Number Button */}
                <Button variant="outline" onClick={addNumber} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Number
                </Button>
              </div>

              {/* Right Panel - Formula Canvas */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm">Formula Canvas</h3>
                  <Button variant="ghost" size="sm" onClick={clearFormula} className="gap-2 text-destructive">
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                </div>

                <Droppable droppableId="formula-canvas">
                  {(provided, snapshot) => (
                    <ScrollArea className="flex-1">
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          min-h-40 p-4 border-2 border-dashed rounded-lg transition-colors
                          ${snapshot.isDraggingOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                          ${formula.length === 0 ? 'flex items-center justify-center' : 'space-y-3'}
                        `}
                      >
                        {formula.length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            Drag columns, operators, and numbers here to build your formula
                          </p>
                        ) : (
                          formula.map((element, index) => (
                            <Draggable key={element.id} draggableId={element.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    group flex items-center gap-3 p-3 bg-background border rounded-lg
                                    ${snapshot.isDragging ? 'shadow-lg scale-105 rotate-1 z-50' : 'shadow-sm'}
                                  `}
                                >
                                  <div className="flex-1 flex items-center gap-2">
                                    {element.type === 'column' && (
                                      <Badge variant="outline" className={getColumnTypeStyles('default')}>
                                        {element.label}
                                      </Badge>
                                    )}
                                    {element.type === 'operator' && (
                                      <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-800">
                                        {element.value} {element.label}
                                      </Badge>
                                    )}
                                    {element.type === 'number' && (
                                      <Input
                                        type="number"
                                        value={element.value}
                                        onChange={(e) => updateNumber(element.id, e.target.value)}
                                        className="w-24"
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeElement(element.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>

                {/* Formula Preview */}
                {formula.length > 0 && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <Label className="text-xs font-medium text-muted-foreground">Formula Preview:</Label>
                    <p className="text-sm font-mono mt-1">
                      {formula.map(element => {
                        if (element.type === 'column') return `[${element.label}]`;
                        return element.value;
                      }).join(' ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DragDropContext>

          {/* Footer Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!columnName.trim() || formula.length === 0}
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