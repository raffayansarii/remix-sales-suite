import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { GripVertical, RotateCcw } from "lucide-react";
import { ColumnDefinition, ColumnType } from "@/hooks/useColumnManager";
import { ColumnManagerModalProps } from "./types-and-schemas";
import { createPortal } from "react-dom";

const getColumnTypeStyles = (type: ColumnType) => {
  switch (type) {
    case "system":
      return "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100";
    case "default":
      return "bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100";
    case "custom":
      return "bg-purple-50 border-purple-200 text-purple-900 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-100";
    default:
      return "bg-muted/10 border-muted/20";
  }
};

const getColumnTypeBadge = (type: ColumnType) => {
  const styles = {
    system: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    default: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    custom: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  };

  const labels = {
    system: "System",
    default: "Default",
    custom: "Custom",
  };

  return (
    <Badge variant="secondary" className={`text-xs border-0 ${styles[type]}`}>
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
    <Draggable draggableId={column.id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => {
        const child = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
            }}
            className={`
              p-4 rounded-lg border-2 transition-all duration-200 bg-card hover:shadow-md
              ${getColumnTypeStyles(column.type)}
              ${snapshot.isDragging ? "shadow-xl z-[9999] bg-background border-primary" : "shadow-sm"}
              ${isDragDisabled ? "opacity-60 cursor-not-allowed" : "hover:border-primary/40"}
            `}
          >
            <div className="flex items-center gap-3">
              <div
                {...provided.dragHandleProps}
                className="p-1 rounded cursor-grab active:cursor-grabbing hover:bg-muted/80"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-sm truncate">{column.label}</span>
                  {getColumnTypeBadge(column.type)}
                  {column.required && (
                    <Badge variant="outline" className="text-xs border-red-200 text-red-700 bg-red-50">
                      Required
                    </Badge>
                  )}
                </div>
                {column.field && (
                  <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">{column.field}</span>
                )}
              </div>
            </div>
          </div>
        );

        return snapshot.isDragging ? createPortal(child, document.body) : child;
      }}
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

    const sourceList = source.droppableId as "visible" | "hidden";
    const destinationList = destination.droppableId as "visible" | "hidden";

    reorderColumns(source.index, destination.index, sourceList, destinationList);
  };

  const handleReset = () => {
    resetToDefault();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">Manage Table Columns</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Drag columns between sections to customize your table view. Required system columns cannot be hidden.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </Button>
          </div>
        </DialogHeader>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-8 flex-1 overflow-hidden py-6">
            {/* Hidden Columns */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-bold text-lg text-muted-foreground">Available Columns</h3>
                <Badge variant="outline" className="text-sm px-3 py-1 font-semibold">
                  {hiddenColumns.length}
                </Badge>
              </div>

              <Droppable droppableId="hidden">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 space-y-3 p-6 rounded-xl border-2 border-dashed min-h-96 overflow-y-auto transition-all
                      ${
                        snapshot.isDraggingOver
                          ? "border-primary/50 bg-primary/5 shadow-inner"
                          : "border-border/50 bg-muted/30 hover:bg-muted/40"
                      }
                    `}
                  >
                    {hiddenColumns.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-3">
                          <GripVertical className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium">All columns are visible</p>
                        <p className="text-xs mt-1">Drag columns here to hide them</p>
                      </div>
                    ) : (
                      hiddenColumns.map((column, index) => <ColumnItem key={column.id} column={column} index={index} />)
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {/* Visible Columns */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-bold text-lg">Visible Columns</h3>
                <Badge variant="default" className="text-sm px-3 py-1 font-semibold">
                  {visibleColumns.length - 1}
                </Badge>
              </div>

              <Droppable droppableId="visible">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      flex-1 space-y-3 p-6 rounded-xl border-2 border-dashed min-h-96 overflow-y-auto transition-all
                      ${
                        snapshot.isDraggingOver
                          ? "border-primary/50 bg-primary/5 shadow-inner"
                          : "border-primary/30 bg-primary/5 hover:bg-primary/10"
                      }
                    `}
                  >
                    {visibleColumns
                      .filter((col) => col.label.toLowerCase() !== "actions")
                      .map((column, index) => (
                        <ColumnItem key={column.id} column={column} index={index} isDragDisabled={false} />
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>

        <div className="flex-shrink-0 border-t pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                {getColumnTypeBadge("system")}
                <span className="text-muted-foreground">Essential system columns</span>
              </div>
              <div className="flex items-center gap-2">
                {getColumnTypeBadge("default")}
                <span className="text-muted-foreground">Standard columns</span>
              </div>
              <div className="flex items-center gap-2">
                {getColumnTypeBadge("custom")}
                <span className="text-muted-foreground">Custom user columns</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => onOpenChange(false)}>Apply Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
