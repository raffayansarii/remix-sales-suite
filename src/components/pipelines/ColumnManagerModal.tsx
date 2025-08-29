import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { GripVertical, RotateCcw } from 'lucide-react';
import { ColumnDefinition, UseColumnManagerReturn, ColumnType } from '@/hooks/useColumnManager';

interface ColumnManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnManager: UseColumnManagerReturn;
}

const getColumnTypeStyles = (type: ColumnType) => {
  switch (type) {
    case 'system':
      return 'bg-primary/10 border-primary/20 text-primary-foreground';
    case 'default':
      return 'bg-secondary/10 border-secondary/20 text-secondary-foreground';
    case 'custom':
      return 'bg-accent/10 border-accent/20 text-accent-foreground';
    default:
      return 'bg-muted/10 border-muted/20';
  }
};

const getColumnTypeBadge = (type: ColumnType) => {
  const styles = {
    system: 'bg-primary/20 text-primary hover:bg-primary/30',
    default: 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30',
    custom: 'bg-accent/20 text-accent-foreground hover:bg-accent/30',
  };
  
  const labels = {
    system: 'System',
    default: 'Default',
    custom: 'Custom',
  };

  return (
    <Badge variant="secondary" className={`text-xs ${styles[type]}`}>
      {labels[type]}
    </Badge>
  );
};

interface ColumnItemProps {
  column: ColumnDefinition;
  index: number;
  isDragDisabled?: boolean;
}

function ColumnItem({ column, index, isDragDisabled = false }: ColumnItemProps) {
  return (
    <Draggable
      draggableId={column.id}
      index={index}
      isDragDisabled={isDragDisabled || column.required}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`
            p-3 rounded-lg border transition-all duration-200
            ${getColumnTypeStyles(column.type)}
            ${snapshot.isDragging ? 'shadow-lg rotate-1' : ''}
            ${isDragDisabled || column.required ? 'opacity-60 cursor-not-allowed' : 'cursor-move'}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              {...provided.dragHandleProps}
              className={isDragDisabled || column.required ? 'cursor-not-allowed' : 'cursor-grab'}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{column.label}</span>
                {getColumnTypeBadge(column.type)}
                {column.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
              {column.field && (
                <span className="text-xs text-muted-foreground">Field: {column.field}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function ColumnManagerModal({ open, onOpenChange, columnManager }: ColumnManagerModalProps) {
  const { visibleColumns, hiddenColumns, reorderColumns, resetToDefault } = columnManager;

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const sourceList = source.droppableId as 'visible' | 'hidden';
    const destinationList = destination.droppableId as 'visible' | 'hidden';

    reorderColumns(source.index, destination.index, sourceList, destinationList);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Manage Table Columns</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Drag columns between lists to show or hide them. System columns marked as required cannot be hidden.
          </p>
        </DialogHeader>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 flex-1 overflow-hidden">
            {/* Hidden Columns */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-base">Available Columns</h3>
                <Badge variant="secondary" className="text-xs">
                  {hiddenColumns.length}
                </Badge>
              </div>
              
              <Droppable droppableId="hidden">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 space-y-2 p-4 rounded-lg border-2 border-dashed min-h-32 overflow-y-auto
                      ${snapshot.isDraggingOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 bg-muted/20'
                      }
                    `}
                  >
                    {hiddenColumns.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                        All columns are currently visible
                      </div>
                    ) : (
                      hiddenColumns.map((column, index) => (
                        <ColumnItem key={column.id} column={column} index={index} />
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Visible Columns */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-base">Visible Columns</h3>
                <Badge variant="secondary" className="text-xs">
                  {visibleColumns.length}
                </Badge>
              </div>
              
              <Droppable droppableId="visible">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 space-y-2 p-4 rounded-lg border-2 border-dashed min-h-32 overflow-y-auto
                      ${snapshot.isDraggingOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted-foreground/25 bg-muted/20'
                      }
                    `}
                  >
                    {visibleColumns.map((column, index) => (
                      <ColumnItem 
                        key={column.id} 
                        column={column} 
                        index={index}
                        isDragDisabled={column.required}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>

        <div className="flex-shrink-0 border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {getColumnTypeBadge('system')}
                <span>Essential system columns</span>
              </div>
              <div className="flex items-center gap-2">
                {getColumnTypeBadge('default')}
                <span>Standard columns</span>
              </div>
              <div className="flex items-center gap-2">
                {getColumnTypeBadge('custom')}
                <span>Custom user columns</span>
              </div>
            </div>
            <Button onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}