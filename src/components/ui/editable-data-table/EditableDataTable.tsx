/**
 * EditableDataTable Component
 * 
 * A flexible, inline-editable data table with optimistic updates.
 * 
 * Features:
 * - Inline editing with optimistic updates
 * - Tab navigation between editable cells
 * - Click outside to cancel editing
 * - Double-tab to move to next row (optional)
 * - Automatic save on Enter key
 * - Escape to cancel editing
 * 
 * @example Basic Usage
 * ```tsx
 * import { EditableDataTable } from '@/components/ui/editable-data-table';
 * 
 * function MyTable() {
 *   const columns = [
 *     {
 *       id: 'name',
 *       header: 'Name',
 *       accessorKey: 'name',
 *       cell: (row, context) => (
 *         <EditableCell
 *           row={row}
 *           field="name"
 *           context={context}
 *           type="input"
 *         />
 *       ),
 *     },
 *   ];
 * 
 *   return (
 *     <EditableDataTable
 *       data={data}
 *       columns={columns}
 *       editableFields={['name', 'email', 'role']}
 *       rowIdKey="id"
 *       onSave={async (id, changes) => {
 *         await api.update(id, changes);
 *       }}
 *     />
 *   );
 * }
 * ```
 * 
 * @example With Custom Cell Editors
 * ```tsx
 * // Use the context in your cell renderer
 * cell: (row, context) => {
 *   const isEditing = context.editingCell?.rowId === row.id && 
 *                     context.editingCell?.field === 'status';
 *   
 *   return isEditing ? (
 *     <div ref={context.editingContainerRef}>
 *       <Select
 *         value={context.editValue}
 *         onValueChange={(val) => context.updateOptimisticData(row.id, 'status', val)}
 *       >
 *         <SelectItem value="active">Active</SelectItem>
 *         <SelectItem value="inactive">Inactive</SelectItem>
 *       </Select>
 *     </div>
 *   ) : (
 *     <Badge onClick={() => context.startEditing(row.id, 'status', row.status)}>
 *       {row.status}
 *     </Badge>
 *   );
 * }
 * ```
 */

import { DataTable } from "@/components/ui/data-table";
import { useInlineEditing } from "./useInlineEditing";
import { EditableDataTableProps } from "./types";

export function EditableDataTable<TData extends Record<string, any>>({
  data,
  columns,
  editableFields,
  rowIdKey = 'id' as keyof TData,
  onSave,
  isLoading = false,
  emptyMessage = "No data found",
  onRowClick,
  getRowClassName,
  enableDoubleTabNavigation = true,
}: EditableDataTableProps<TData>) {
  
  // Get visible field names from columns (prefer accessorKey to match data keys)
  const visibleFields = columns
    .filter(col => !col.omit)
    .map(col => (col.accessorKey ? String(col.accessorKey) : col.id));

  // Initialize inline editing hook
  const editing = useInlineEditing({
    data,
    rowIdKey,
    editableFields,
    visibleFields,
    onSave,
    enableDoubleTab: enableDoubleTabNavigation,
  });

  // Create editing context for cell renderers
  const editingContext = {
    editingCell: editing.editingCell,
    editValue: editing.editValue,
    hasPendingChanges: editing.hasPendingChanges,
    startEditing: editing.startEditing,
    cancelEditing: editing.cancelEditing,
    updateOptimisticData: editing.updateOptimisticData,
    savePendingChanges: editing.savePendingChanges,
    handleTabNavigation: editing.handleTabNavigation,
    inputRef: editing.inputRef,
    editingContainerRef: editing.editingContainerRef,
  };

  // Transform columns to inject editing context
  const enhancedColumns = columns.map(col => ({
    ...col,
    cell: col.cell 
      ? (row: TData, value: any) => col.cell!(row, editingContext)
      : undefined,
  }));

  return (
    <DataTable
      data={editing.optimisticData}
      columns={enhancedColumns}
      isLoading={isLoading}
      emptyMessage={emptyMessage}
      onRowClick={onRowClick}
      getRowClassName={getRowClassName}
    />
  );
}

/**
 * Helper component for rendering editable input cells
 * 
 * @example
 * ```tsx
 * import { EditableCell } from '@/components/ui/editable-data-table';
 * 
 * cell: (row, context) => (
 *   <EditableCell
 *     row={row}
 *     field="name"
 *     context={context}
 *     type="input"
 *   />
 * )
 * ```
 */
export { EditableCell } from './EditableCell';
