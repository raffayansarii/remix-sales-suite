import { ReactNode } from "react";

export interface ColumnDef<TData = any> {
  id: string;
  header: string | ((data: TData[]) => ReactNode);
  accessorKey?: keyof TData;
  cell?: (row: TData, value: any) => ReactNode;
  
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

export interface DataTableProps<TData = any> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  getRowClassName?: (row: TData) => string;
}
