import { useState, useCallback } from "react";

export type ColumnType = "system" | "default" | "custom";

export interface ColumnDefinition {
  id: string;
  label: string;
  type: ColumnType;
  field?: string;
  visible: boolean;
  required?: boolean; // System columns that cannot be hidden
  sortable?: boolean;
}

// Default column definitions
const DEFAULT_COLUMNS: ColumnDefinition[] = [
  {
    id: "title",
    label: "Title",
    type: "system",
    field: "title",
    visible: true,
    required: true,
    sortable: true,
  },
  {
    id: "stage",
    label: "Status",
    type: "system",
    field: "stage",
    visible: true,
    required: true,
    sortable: true,
  },
  {
    id: "createdAt",
    label: "Created",
    type: "system",
    field: "createdAt",
    visible: true,
    required: true,
    sortable: true,
  },
  {
    id: "awardType",
    label: "Award Type",
    type: "default",
    field: "awardType",
    visible: true,
    sortable: true,
  },
  {
    id: "agency",
    label: "Agency",
    type: "default",
    field: "agency",
    visible: true,
    sortable: true,
  },
  {
    id: "solicitation",
    label: "Solicitation",
    type: "default",
    field: "solicitation",
    visible: true,
    sortable: true,
  },
  {
    id: "company",
    label: "Company",
    type: "default",
    field: "company",
    visible: false,
    sortable: true,
  },
  {
    id: "value",
    label: "Value",
    type: "default",
    field: "value",
    visible: false,
    sortable: true,
  },
  {
    id: "probability",
    label: "Probability",
    type: "default",
    field: "probability",
    visible: false,
    sortable: true,
  },
  {
    id: "closeDate",
    label: "Close Date",
    type: "default",
    field: "closeDate",
    visible: false,
    sortable: true,
  },
  {
    id: "actions",
    label: "Actions",
    type: "system",
    visible: true,
    required: true,
    sortable: false,
  },
];

export interface UseColumnManagerReturn {
  columns: ColumnDefinition[];
  visibleColumns: ColumnDefinition[];
  hiddenColumns: ColumnDefinition[];
  toggleColumnVisibility: (columnId: string) => void;
  reorderColumns: (
    sourceIndex: number,
    destinationIndex: number,
    sourceList: "visible" | "hidden",
    destinationList: "visible" | "hidden"
  ) => void;
  addCustomColumn: (column: Omit<ColumnDefinition, "id" | "type">) => void;
  removeCustomColumn: (columnId: string) => void;
  resetToDefault: () => void;
}

export function useColumnManager(): UseColumnManagerReturn {
  const [columns, setColumns] = useState<ColumnDefinition[]>(DEFAULT_COLUMNS);

  const visibleColumns = columns.filter((col) => col.visible);
  const hiddenColumns = columns.filter((col) => !col.visible);

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId && !col.required) {
          return { ...col, visible: !col.visible };
        }
        return col;
      })
    );
  }, []);

  const reorderColumns = useCallback(
    (
      sourceIndex: number,
      destinationIndex: number,
      sourceList: "visible" | "hidden",
      destinationList: "visible" | "hidden"
    ) => {
      setColumns((prev) => {
        const newColumns = [...prev];
        const visibleCols = newColumns.filter((col) => col.visible);
        const hiddenCols = newColumns.filter((col) => !col.visible);

        const sourceArray = sourceList === "visible" ? visibleCols : hiddenCols;
        const destinationArray =
          destinationList === "visible" ? visibleCols : hiddenCols;

        // Remove from source
        const [movedColumn] = sourceArray.splice(sourceIndex, 1);

        // Allow moving all columns, but system required ones will show a warning in UI
        // Business logic can be handled at the API level

        // Update visibility
        movedColumn.visible = destinationList === "visible";

        // Add to destination
        destinationArray.splice(destinationIndex, 0, movedColumn);

        // Rebuild the full array maintaining order
        const result = [...visibleCols, ...hiddenCols];

        return result;
      });
    },
    []
  );

  const addCustomColumn = useCallback(
    (column: Omit<ColumnDefinition, "id" | "type">) => {
      const newColumn: ColumnDefinition = {
        ...column,
        id: `custom_${Date.now()}`,
        type: "custom",
      };
      setColumns((prev) => [...prev, newColumn]);
    },
    []
  );

  const removeCustomColumn = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.filter((col) => !(col.id === columnId && col.type === "custom"))
    );
  }, []);

  const resetToDefault = useCallback(() => {
    setColumns(DEFAULT_COLUMNS);
  }, []);

  return {
    columns,
    visibleColumns,
    hiddenColumns,
    toggleColumnVisibility,
    reorderColumns,
    addCustomColumn,
    removeCustomColumn,
    resetToDefault,
  };
}
