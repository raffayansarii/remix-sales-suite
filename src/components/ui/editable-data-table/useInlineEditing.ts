/**
 * Custom hook for managing inline editing state and logic
 * 
 * This hook handles all the editing logic including:
 * - Optimistic updates (UI updates immediately)
 * - Pending changes tracking
 * - Tab navigation between editable cells
 * - Click-outside to cancel editing
 * 
 * @example
 * ```tsx
 * const editing = useInlineEditing({
 *   data: opportunities,
 *   rowIdKey: 'id',
 *   editableFields: ['title', 'stage', 'value'],
 *   onSave: async (rowId, changes) => {
 *     await api.updateOpportunity(rowId, changes);
 *   }
 * });
 * ```
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { EditingCell, UseInlineEditingReturn } from "./types";

interface UseInlineEditingProps<TData> {
  /** Original data array */
  data: TData[];
  /** Key to use as unique row identifier */
  rowIdKey: keyof TData;
  /** List of editable field names (in navigation order) */
  editableFields: string[];
  /** List of currently visible field names */
  visibleFields?: string[];
  /** Callback when changes need to be saved */
  onSave?: (rowId: string, changes: Partial<TData>) => Promise<void>;
  /** Enable double-tab to move to next row with same field */
  enableDoubleTab?: boolean;
}

export function useInlineEditing<TData = any>({
  data,
  rowIdKey,
  editableFields,
  visibleFields,
  onSave,
  enableDoubleTab = true,
}: UseInlineEditingProps<TData>): UseInlineEditingReturn<TData> {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [optimisticData, setOptimisticData] = useState<TData[]>(data);
  const lastTabTimeRef = useRef<number>(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const editingContainerRef = useRef<HTMLDivElement>(null);

  // Calculate visible editable fields
  const visibleEditableFields = visibleFields
    ? editableFields.filter(field => visibleFields.includes(field))
    : editableFields;

  /**
   * Start editing a cell
   * Automatically saves pending changes if switching to a different row
   */
  const startEditing = useCallback((rowId: string, field: string, currentValue: any) => {
    // If switching to a different row, save pending changes first
    if (editingCell && editingCell.rowId !== rowId && Object.keys(pendingChanges).length > 0) {
      savePendingChanges();
    }
    
    setEditingCell({ rowId, field });
    
    // Get the current value from optimistic data if available
    const optimisticRow = optimisticData.find(row => String(row[rowIdKey]) === rowId);
    const valueToEdit = optimisticRow ? optimisticRow[field as keyof TData] : currentValue;
    setEditValue(valueToEdit?.toString() || "");
  }, [editingCell, pendingChanges, optimisticData, rowIdKey]);

  /**
   * Cancel editing and revert all optimistic changes
   */
  const cancelEditing = useCallback(() => {
    setOptimisticData(data);
    setPendingChanges({});
    setEditingCell(null);
    setEditValue("");
  }, [data]);

  /**
   * Update optimistic data immediately (before API call)
   * This provides instant feedback to the user
   */
  const updateOptimisticData = useCallback((rowId: string, field: string, value: any) => {
    setOptimisticData(prev => prev.map(row => 
      String(row[rowIdKey]) === rowId ? { ...row, [field]: value } : row
    ));
    
    setPendingChanges(prev => ({ ...prev, [field]: value }));
    setEditValue(value?.toString() || "");
  }, [rowIdKey]);

  /**
   * Save all pending changes to the server
   * Reverts optimistic changes on error
   */
  const savePendingChanges = useCallback(async () => {
    if (!editingCell || Object.keys(pendingChanges).length === 0) return;
    
    try {
      if (onSave) {
        await onSave(editingCell.rowId, pendingChanges as Partial<TData>);
      }
      
      setPendingChanges({});
      setEditingCell(null);
      setEditValue("");
    } catch (error) {
      // Revert optimistic changes on error
      setOptimisticData(data);
      console.error("Failed to save changes:", error);
      throw error;
    }
  }, [editingCell, pendingChanges, onSave, data]);

  /**
   * Handle Tab key navigation between editable cells
   * Single Tab: Move to next editable field in same row
   * Double Tab (optional): Move to same field in next row
   */
  const handleTabNavigation = useCallback((currentRow: TData, currentField: string) => {
    const currentTime = Date.now();
    const isDoubleTap = enableDoubleTab && (currentTime - lastTabTimeRef.current < 300);
    lastTabTimeRef.current = currentTime;
    
    if (isDoubleTap) {
      // Double-tab: Save and move to next row, same column
      savePendingChanges();
      const currentIndex = optimisticData.findIndex(
        row => String(row[rowIdKey]) === String(currentRow[rowIdKey])
      );
      if (currentIndex < optimisticData.length - 1) {
        const nextRow = optimisticData[currentIndex + 1];
        const fieldValue = nextRow[currentField as keyof TData];
        startEditing(String(nextRow[rowIdKey]), currentField, fieldValue);
      }
    } else {
      // Single tab: Move to next visible editable field in same row
      const currentFieldIndex = visibleEditableFields.indexOf(currentField);
      if (currentFieldIndex < visibleEditableFields.length - 1) {
        const nextField = visibleEditableFields[currentFieldIndex + 1];
        const fieldValue = currentRow[nextField as keyof TData];
        startEditing(String(currentRow[rowIdKey]), nextField, fieldValue);
      }
    }
  }, [enableDoubleTab, optimisticData, rowIdKey, visibleEditableFields, startEditing, savePendingChanges]);

  // Sync optimistic data with source data when not editing
  useEffect(() => {
    if (!editingCell) {
      setOptimisticData(data);
    }
  }, [data, editingCell]);

  // Auto-focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingCell && editingContainerRef.current && 
          !editingContainerRef.current.contains(event.target as Node)) {
        cancelEditing();
      }
    };

    if (editingCell) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingCell, cancelEditing]);

  return {
    editingCell,
    editValue,
    optimisticData,
    pendingChanges,
    hasPendingChanges: Object.keys(pendingChanges).length > 0,
    startEditing,
    cancelEditing,
    updateOptimisticData,
    savePendingChanges,
    handleTabNavigation,
    inputRef,
    editingContainerRef,
  };
}
