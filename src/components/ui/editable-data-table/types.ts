/**
 * Types and interfaces for the EditableDataTable component
 *
 * This file defines all the types needed for creating an inline-editable data table.
 */

import { ReactNode } from "react";
import { ConditionalStyles } from "react-data-table-component";

/**
 * Represents the current editing state of a cell
 */
export interface EditingCell {
  /** Unique identifier of the row being edited */
  rowId: string;
  /** Field name of the cell being edited */
  field: string;
}

/**
 * Configuration for editable columns
 * Defines which columns can be edited and their properties
 */
export interface EditableColumnConfig {
  /** Field name (must match the data object key) */
  field: string;
  /** Whether this is an editable field */
  editable: boolean;
  /** Optional: Custom editor component */
  editor?: "input" | "select" | "date" | "number";
  /** Optional: Options for select editor */
  selectOptions?: Array<{ label: string; value: any }>;
}

/**
 * Column definition for the editable table
 */
export interface EditableColumnDef<TData = any> {
  id: string;
  header: string | ((data: TData[]) => ReactNode);
  accessorKey?: keyof TData;
  cell?: (row: TData, context: EditingContext<TData>) => ReactNode;

  // Sorting
  sortable?: boolean;
  sortFunction?: (rowA: TData, rowB: TData) => number;

  // Formatting
  format?: (row: TData) => ReactNode;

  // Width and sizing
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  grow?: number;

  // Alignment
  right?: boolean;
  center?: boolean;

  // Display options
  compact?: boolean;
  wrap?: boolean;
  allowOverflow?: boolean;
  button?: boolean;
  ignoreRowClick?: boolean;

  // Visibility
  hide?: number;
  omit?: boolean;

  // Styling
  className?: string;
  style?: React.CSSProperties;
  conditionalCellStyles?: Array<{
    when: (row: TData) => boolean;
    style?: React.CSSProperties;
    classNames?: string[];
  }>;
}

/**
 * Context passed to cell renderers
 * Provides access to editing state and functions
 */
export interface EditingContext<TData = any> {
  /** Current editing cell state */
  editingCell: EditingCell | null;
  /** Current value being edited */
  editValue: string;
  /** Whether there are unsaved changes */
  hasPendingChanges: boolean;
  /** Start editing a cell */
  startEditing: (rowId: string, field: string, currentValue: any) => void;
  /** Cancel editing and revert changes */
  cancelEditing: () => void;
  /** Update optimistic data (UI updates immediately) */
  updateOptimisticData: (rowId: string, field: string, value: any) => void;
  /** Save all pending changes */
  savePendingChanges: () => Promise<void>;
  /** Navigate to next editable cell on Tab */
  handleTabNavigation: (row: TData, field: string) => void;
  /** Ref for input element (for auto-focus) */
  inputRef: React.RefObject<HTMLInputElement>;
  /** Ref for editing container (for click-outside detection) */
  editingContainerRef: React.RefObject<HTMLDivElement>;
}

/**
 * Props for the EditableDataTable component
 */
export interface EditableDataTableProps<TData = any> {
  /** Array of data to display */
  data: TData[];
  /** Column definitions */
  columns: EditableColumnDef<TData>[];
  /** List of editable column field names in order */
  editableFields: string[];
  /** Unique identifier key for rows */
  rowIdKey?: keyof TData;
  /** Callback when changes need to be saved (returns updated row data) */
  onSave?: (rowId: string, changes: Partial<TData>) => Promise<void>;
  /** Optional: Loading state */
  isLoading?: boolean;
  /** Optional: Empty state message */
  emptyMessage?: string;
  /** Optional: Row click handler */
  onRowClick?: (row: TData) => void;
  /** Optional: Custom row className */
  conditionalRowStyles?: ConditionalStyles<TData>[];
  /** Optional: Enable double-tab to move to next row */
  enableDoubleTabNavigation?: boolean;
}

/**
 * Return type for the useInlineEditing hook
 */
export interface UseInlineEditingReturn<TData = any> {
  /** Current editing cell state */
  editingCell: EditingCell | null;
  /** Current value being edited */
  editValue: string;
  /** Optimistic data (includes unsaved changes) */
  optimisticData: TData[];
  /** Pending changes object */
  pendingChanges: Record<string, any>;
  /** Whether there are unsaved changes */
  hasPendingChanges: boolean;
  /** Start editing a cell */
  startEditing: (rowId: string, field: string, currentValue: any) => void;
  /** Cancel editing and revert changes */
  cancelEditing: () => void;
  /** Update optimistic data */
  updateOptimisticData: (rowId: string, field: string, value: any) => void;
  /** Save pending changes */
  savePendingChanges: () => Promise<void>;
  /** Handle tab navigation */
  handleTabNavigation: (row: TData, field: string) => void;
  /** Input ref for focus */
  inputRef: React.RefObject<HTMLInputElement>;
  /** Container ref for click-outside */
  editingContainerRef: React.RefObject<HTMLDivElement>;
}
