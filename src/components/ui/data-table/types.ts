import { ReactNode } from "react";

export interface ColumnDef<TData = any> {
  id: string;
  header: string | ((data: TData[]) => ReactNode);
  accessorKey?: keyof TData;
  cell?: (row: TData, value: any) => ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

export interface DataTableProps<TData = any> {
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  getRowClassName?: (row: TData) => string;
}
