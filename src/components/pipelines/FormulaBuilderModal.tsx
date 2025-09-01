import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { X, Plus, Minus, DivideIcon as Divide, Asterisk, Calculator, Trash2, ParenthesesIcon as Parentheses, GripVertical } from 'lucide-react';
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
  { id: 'open-bracket', symbol: '(', icon: Parentheses, label: 'Open' },
  { id: 'close-bracket', symbol: ')', icon: Parentheses, label: 'Close' },
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
    if ((source.droppableId.startsWith('operator-') || source.droppableId === 'operators' || source.droppableId === 'brackets') && destination.droppableId === 'formula-canvas') {
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

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex-1 flex gap-6 min-h-0">
              {/* Left Panel - Available Elements */}
              <div className="w-80 flex flex-col gap-4 min-h-0">
                {/* Operators - Single Line at Top */}
                <div className="space-y-2 shrink-0">
                  <h3 className="font-medium text-sm">Operators & Brackets</h3>
                  <div className="flex gap-1 flex-wrap">
                    {operators.map((operator, index) => (
                      <Droppable key={`${operator.id}-droppable`} droppableId={`operator-${operator.id}`} isDropDisabled={true}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            <Draggable draggableId={operator.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                   className={`
                                     px-2 py-1 rounded border cursor-grab active:cursor-grabbing 
                                     ${operator.id.includes('bracket') 
                                       ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100' 
                                       : 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
                                     }
                                     flex items-center gap-1 text-xs font-medium transition-all
                                     ${snapshot.isDragging ? 'shadow-lg z-[9999] bg-background border-primary' : 'shadow-sm'}
                                   `}
                                >
                                  {!operator.id.includes('bracket') && <operator.icon className="w-3 h-3" />}
                                  <span className={operator.id.includes('bracket') ? 'text-sm font-bold' : 'font-bold'}>
                                    {operator.symbol}
                                  </span>
                                </div>
                              )}
                            </Draggable>
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </div>

                {/* Available Columns */}
                <div className="space-y-3 flex-1 min-h-0 overflow-y-auto">
                  <h3 className="font-medium text-sm">Available Columns</h3>
                  <Droppable droppableId="available-columns" isDropDisabled={true}>
                    {(provided) => (
                      <ScrollArea className="flex-1 border rounded-lg">
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 p-2">
                          {mockColumns.map((column, index) => (
                            <Draggable key={column.id} draggableId={column.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                   ref={provided.innerRef}
                                   {...provided.draggableProps}
                                   className="relative flex items-center gap-2"
                                 >
                                   <div
                                     {...provided.dragHandleProps}
                                     className="cursor-grab active:cursor-grabbing"
                                   >
                                     <GripVertical className="w-3 h-3 text-muted-foreground" />
                                   </div>
                                   <div className={`
                                      p-3 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2
                                      ${getColumnTypeStyles(column.type)}
                                      ${snapshot.isDragging ? 'shadow-lg z-[9999] bg-background border-primary' : 'shadow-sm'}
                                    `}>
                                     {column.name}
                                     <Badge variant="outline" className="text-xs">
                                       {column.type}
                                     </Badge>
                                   </div>
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

                {/* Add Number Button */}
                <Button variant="outline" onClick={addNumber} className="gap-2 shrink-0">
                  <Plus className="w-4 h-4" />
                  Add Number
                </Button>
              </div>

              {/* Right Panel - Formula Canvas */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 shrink-0">
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
                          min-h-48 p-6 border-2 rounded-xl transition-all duration-300 
                          ${snapshot.isDraggingOver 
                            ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-inner' 
                            : 'border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/20 to-muted/5'
                          }
                          ${formula.length === 0 ? 'flex items-center justify-center' : 'space-y-3'}
                        `}
                      >
                        {formula.length === 0 ? (
                          <div className="text-center space-y-2">
                            <Calculator className="w-12 h-12 mx-auto text-muted-foreground/50" />
                            <p className="text-muted-foreground text-sm font-medium">
                              Build Your Formula
                            </p>
                            <p className="text-muted-foreground/70 text-xs">
                              Drag columns, operators, brackets, and numbers here
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {formula.map((element, index) => (
                              <Draggable key={element.id} draggableId={element.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                     ref={provided.innerRef}
                                     {...provided.draggableProps}
                                     className={`
                                        group relative flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                                         ${snapshot.isDragging 
                                           ? 'shadow-xl z-[9999] bg-background border-2 border-primary' 
                                           : 'bg-background/80 backdrop-blur-sm border border-border/60 hover:border-primary/40 hover:shadow-md'
                                         }
                                      `}
                                   >
                                     <div
                                       {...provided.dragHandleProps}
                                       className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded"
                                     >
                                       <GripVertical className="w-3 h-3 text-muted-foreground" />
                                     </div>
                                     <div className="absolute left-6 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-primary/60 to-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                     
                                     <div className="flex-1 flex items-center gap-2 ml-2">
                                      {element.type === 'column' && (
                                        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-800 font-medium">
                                          <span className="text-xs">📊</span>
                                          <span className="ml-1">{element.label}</span>
                                        </Badge>
                                      )}
                                      {element.type === 'operator' && (
                                        <Badge variant="outline" className={`font-bold ${
                                          element.value === '(' || element.value === ')' 
                                            ? 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-800' 
                                            : 'bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 text-purple-800'
                                        }`}>
                                          <span className="text-lg">{element.value}</span>
                                          {element.label && element.value !== '(' && element.value !== ')' && (
                                            <span className="ml-1 text-xs font-normal">{element.label}</span>
                                          )}
                                        </Badge>
                                      )}
                                      {element.type === 'number' && (
                                        <div className="flex items-center gap-2">
                                          <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-800">
                                            <span className="text-xs">🔢</span>
                                          </Badge>
                                          <Input
                                            type="number"
                                            value={element.value}
                                            onChange={(e) => updateNumber(element.id, e.target.value)}
                                            className="w-20 h-8 text-sm font-mono bg-background/50"
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeElement(element.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    </ScrollArea>
                  )}
                </Droppable>

                {/* Formula Preview */}
                {formula.length > 0 && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border/50">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                      <Calculator className="w-3 h-3" />
                      Formula Preview:
                    </Label>
                    <div className="mt-2 p-3 bg-background/80 rounded-lg border font-mono text-sm leading-relaxed">
                      {formula.map((element, index) => (
                        <span key={element.id} className={
                          element.type === 'column' ? 'text-blue-700 font-semibold' :
                          element.type === 'operator' ? (
                            element.value === '(' || element.value === ')' ? 'text-amber-700 font-bold' : 'text-purple-700 font-bold'
                          ) : 'text-green-700 font-semibold'
                        }>
                          {element.type === 'column' ? `[${element.label}]` : element.value}
                          {index < formula.length - 1 && element.type !== 'operator' && formula[index + 1]?.type !== 'operator' ? ' ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DragDropContext>

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