/**
 * EditableCell Component
 * 
 * A pre-built cell component for common editing patterns.
 * Supports text input, numbers, dates, and select dropdowns.
 */

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EditingContext } from "./types";

interface EditableCellProps<TData = any> {
  /** The row data */
  row: TData;
  /** Field name to edit */
  field: string;
  /** Editing context from EditableDataTable */
  context: EditingContext<TData>;
  /** Type of editor */
  type?: 'input' | 'number' | 'date' | 'select';
  /** Options for select type */
  selectOptions?: Array<{ label: string; value: any }>;
  /** Custom render for view mode */
  renderView?: (value: any, row: TData) => React.ReactNode;
  /** Custom render for edit mode */
  renderEdit?: (
    value: any,
    onChange: (val: any) => void,
    ref: React.RefObject<HTMLInputElement>
  ) => React.ReactNode;
}

export function EditableCell<TData extends Record<string, any>>({
  row,
  field,
  context,
  type = 'input',
  selectOptions = [],
  renderView,
  renderEdit,
}: EditableCellProps<TData>) {
  const isEditing = context.editingCell?.rowId === String(row.id) && 
                    context.editingCell?.field === field;
  
  const currentValue = row[field];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      context.savePendingChanges();
    } else if (e.key === "Escape") {
      context.cancelEditing();
    } else if (e.key === "Tab") {
      e.preventDefault();
      context.handleTabNavigation(row, field);
    }
  };

  if (isEditing) {
    // Edit mode
    if (renderEdit) {
      return (
        <div ref={context.editingContainerRef}>
          {renderEdit(
            context.editValue,
            (val) => context.updateOptimisticData(String(row.id), field, val),
            context.inputRef
          )}
        </div>
      );
    }

    if (type === 'select') {
      return (
        <div ref={context.editingContainerRef}>
          <Select
            value={context.editValue}
            onValueChange={(val) => context.updateOptimisticData(String(row.id), field, val)}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div ref={context.editingContainerRef}>
        <Input
          ref={context.inputRef}
          type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
          value={context.editValue}
          onChange={(e) => context.updateOptimisticData(String(row.id), field, e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-8"
        />
      </div>
    );
  }

  // View mode
  if (renderView) {
    return (
      <div
        className="cursor-pointer p-1 rounded"
        onClick={() => context.startEditing(String(row.id), field, currentValue)}
      >
        {renderView(currentValue, row)}
      </div>
    );
  }

  return (
    <span
      className="text-sm cursor-pointer p-1 rounded block"
      onClick={() => context.startEditing(String(row.id), field, currentValue)}
    >
      {currentValue?.toString() || '-'}
    </span>
  );
}
