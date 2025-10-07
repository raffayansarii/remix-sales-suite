import DataTableComponent from "react-data-table-component";
import { ContentLoader } from "@/components/ui/content-loader";
import { DataTableProps } from "./types";

export function DataTable<TData extends Record<string, any>>({
  data,
  columns,
  isLoading,
  emptyMessage = "No data available",
  onRowClick,
  getRowClassName,
}: DataTableProps<TData>) {
  // Convert our column format to react-data-table-component format
  const reactTableColumns = columns.map((column) => {
    const reactColumn: any = {
      name: typeof column.header === "function" ? column.header(data) : column.header,
      selector: column.accessorKey 
        ? (row: TData) => row[column.accessorKey!]
        : undefined,
      cell: column.cell 
        ? (row: TData) => {
            const value = column.accessorKey ? row[column.accessorKey] : null;
            return column.cell!(row, value);
          }
        : undefined,
      format: column.format,
      sortable: column.sortable,
      sortFunction: column.sortFunction,
      width: column.width,
      minWidth: column.minWidth,
      maxWidth: column.maxWidth,
      grow: column.grow,
      right: column.right || column.className?.includes("text-right"),
      center: column.center,
      compact: column.compact,
      wrap: column.wrap,
      allowOverflow: column.allowOverflow,
      button: column.button,
      ignoreRowClick: column.ignoreRowClick,
      hide: column.hide,
      omit: column.omit,
    };

    // Add style if provided
    if (column.style) {
      reactColumn.style = column.style;
    }

    // Add conditionalCellStyles if provided
    if (column.conditionalCellStyles) {
      reactColumn.conditionalCellStyles = column.conditionalCellStyles;
    }

    return reactColumn;
  });

  const customStyles = {
    headRow: {
      style: {
        borderTopStyle: 'solid' as const,
        borderTopWidth: '1px',
        borderTopColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--muted) / 0.5)',
      },
    },
    headCells: {
      style: {
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'hsl(var(--muted-foreground))',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      },
    },
    rows: {
      style: {
        fontSize: '0.875rem',
        color: 'hsl(var(--foreground))',
        backgroundColor: 'hsl(var(--background))',
        borderBottomStyle: 'solid' as const,
        borderBottomWidth: '1px',
        borderBottomColor: 'hsl(var(--border))',
        '&:hover': {
          backgroundColor: 'hsl(var(--muted) / 0.5)',
          cursor: onRowClick ? 'pointer' : 'default',
        },
      },
    },
    cells: {
      style: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
      },
    },
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <DataTableComponent
        columns={reactTableColumns}
        data={data}
        progressPending={isLoading}
        progressComponent={<ContentLoader type="table" rows={5} />}
        noDataComponent={
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        }
        onRowClicked={onRowClick}
        customStyles={customStyles}
      />
    </div>
  );
}
