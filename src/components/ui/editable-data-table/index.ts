/**
 * Editable Data Table
 * 
 * A flexible inline-editable table component with optimistic updates.
 * 
 * @see EditableDataTable - Main component
 * @see useInlineEditing - Hook for custom implementations
 * @see EditableCell - Pre-built editable cell component
 */

export { EditableDataTable } from './EditableDataTable';
export { EditableCell } from './EditableCell';
export { useInlineEditing } from './useInlineEditing';
export type {
  EditableDataTableProps,
  EditableColumnDef,
  EditingContext,
  EditingCell,
  UseInlineEditingReturn,
  EditableColumnConfig,
} from './types';
