import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContentLoader } from "@/components/ui/content-loader";
import { DataTableProps, ColumnDef } from "./types";

export function DataTable<TData extends Record<string, any>>({
  data,
  columns,
  isLoading,
  emptyMessage = "No data available",
  onRowClick,
  getRowClassName,
}: DataTableProps<TData>) {
  if (isLoading) {
    return <ContentLoader type="table" rows={5} />;
  }

  const getCellValue = (row: TData, column: ColumnDef<TData>) => {
    if (column.accessorKey) {
      return row[column.accessorKey];
    }
    return null;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className={column.className}>
                {typeof column.header === "function"
                  ? column.header(data)
                  : column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={index}
                className={getRowClassName ? getRowClassName(row) : ""}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = getCellValue(row, column);
                  return (
                    <TableCell key={column.id} className={column.className}>
                      {column.cell ? column.cell(row, value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
