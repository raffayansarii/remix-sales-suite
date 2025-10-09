import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { usePinnedItems } from "@/hooks/usePinnedItems";
import { useColumnManager } from "@/hooks/useColumnManager";
import { ColumnManagerModal } from "./ColumnManagerModal";
import { CreateColumnButton } from "./CreateColumnButton";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { TableViewProps } from "./types-and-schemas";
import { useDeleteOpportunityMutation, useUpdateOpportunityMutation } from "@/api/opportunity/opportunityApi";
import { DeleteModal } from "../ui/delete-modal";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import { DataTable } from "@/components/ui/data-table";
import { createOpportunityColumns } from "./columns";

export function TableView({
  opportunities,
  currentPage,
  rowsPerPage,
  totalCount,
  onPageChange,
}: TableViewProps) {

  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<IOpportunity | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] =
    useState<IOpportunity | null>(null);
  const [editingCell, setEditingCell] = useState<{
    opportunityId: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>({});
  const [optimisticData, setOptimisticData] = useState<IOpportunity[]>(opportunities);
  const inputRef = useRef<HTMLInputElement>(null);
  const editingContainerRef = useRef<HTMLDivElement>(null);
  const [lastTabTime, setLastTabTime] = useState<number>(0);
  
  // Define editable columns in order for Tab navigation
  const editableColumns = ['title', 'stage', 'award_type', 'agency', 'solicitation', 'company', 'value', 'probability', 'close_date'];
  
  const { toast } = useToast();

  const columnManager = useColumnManager();
  const { togglePin, isPinned } = usePinnedItems<IOpportunity>();

  const handleViewOpportunity = (opportunity: IOpportunity) => {
    setSelectedOpportunity(opportunity);
    setViewModalOpen(true);
  };

  const startEditing = (opportunityId: string, field: string, currentValue: any) => {
    // If switching to a different row, save pending changes first
    if (editingCell && editingCell.opportunityId !== opportunityId && Object.keys(pendingChanges).length > 0) {
      savePendingChanges();
    }
    
    setEditingCell({ opportunityId, field });
    
    // Get the current value from optimistic data if available, otherwise from current value
    const optimisticOpp = optimisticData.find(o => o.id === opportunityId);
    const valueToEdit = optimisticOpp ? optimisticOpp[field as keyof IOpportunity] : currentValue;
    setEditValue(valueToEdit?.toString() || "");
  };

  const cancelEditing = () => {
    // Revert optimistic changes
    setOptimisticData(opportunities);
    setPendingChanges({});
    setEditingCell(null);
    setEditValue("");
  };

  const updateOptimisticData = (opportunityId: string, field: string, value: any) => {
    // Update optimistic data immediately
    setOptimisticData(prev => prev.map(opp => 
      opp.id === opportunityId ? { ...opp, [field]: value } : opp
    ));
    
    // Track pending change
    setPendingChanges(prev => ({ ...prev, [field]: value }));
    setEditValue(value?.toString() || "");
  };

  const savePendingChanges = async () => {
    if (!editingCell || Object.keys(pendingChanges).length === 0) return;
    
    try {
      await updateTrigger({
        id: editingCell.opportunityId,
        body: pendingChanges,
      }).unwrap();
      
      toast({
        title: "Success",
        description: "Opportunity updated successfully",
      });
      
      setPendingChanges({});
      setEditingCell(null);
      setEditValue("");
    } catch (error) {
      // Revert optimistic changes on error
      setOptimisticData(opportunities);
      toast({
        title: "Error",
        description: "Failed to update opportunity",
        variant: "destructive",
      });
    }
  };

  const handleTabNavigation = (currentOpportunity: IOpportunity, currentField: string) => {
    const currentTime = Date.now();
    const isDoubleTap = currentTime - lastTabTime < 300;
    setLastTabTime(currentTime);
    
    // Get only editable columns that are currently visible
    const visibleEditableColumns = editableColumns.filter(col => 
      columnManager.visibleColumns.some(visCol => 
        visCol.id === col || visCol.field === col
      )
    );
    
    if (isDoubleTap) {
      // Double-tab: Save and move to next row, same column
      savePendingChanges();
      const currentIndex = optimisticData.findIndex(opp => opp.id === currentOpportunity.id);
      if (currentIndex < optimisticData.length - 1) {
        const nextOpportunity = optimisticData[currentIndex + 1];
        const fieldValue = nextOpportunity[currentField as keyof IOpportunity];
        startEditing(nextOpportunity.id, currentField, fieldValue);
      }
    } else {
      // Single tab: Move to next visible editable cell in same row
      const currentFieldIndex = visibleEditableColumns.indexOf(currentField);
      if (currentFieldIndex < visibleEditableColumns.length - 1) {
        const nextField = visibleEditableColumns[currentFieldIndex + 1];
        const fieldValue = currentOpportunity[nextField as keyof IOpportunity];
        startEditing(currentOpportunity.id, nextField, fieldValue);
      }
    }
  };

  // Sync optimistic data with opportunities when they change
  useEffect(() => {
    if (!editingCell) {
      setOptimisticData(opportunities);
    }
  }, [opportunities, editingCell]);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  // Handle click outside to cancel editing
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingCell && editingContainerRef.current && !editingContainerRef.current.contains(event.target as Node)) {
        cancelEditing();
      }
    };

    if (editingCell) {
      // Add a small delay to avoid immediate cancellation
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingCell]);

  const handleDeleteOpportunity = (opportunity: IOpportunity) => {
    setOpportunityToDelete(opportunity);
    setDeleteModalOpen(true);
  };

  const confirmDeleteOpportunity = async () => {
    if (opportunityToDelete) {
      console.log("Deleting opportunity:", opportunityToDelete);
      deleteTrigger(opportunityToDelete.id)
        .unwrap()
        .then(() => {
          setDeleteModalOpen(false);
          setOpportunityToDelete(null);
        })
        .catch(() => {
          // Handle error (optional)
        });
    }
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const [updateTrigger, updateStatus] = useUpdateOpportunityMutation();
  const [deleteTrigger, deleteStatus] = useDeleteOpportunityMutation();

  // Create columns with context
  const columns = createOpportunityColumns({
    editingCell,
    editValue,
    updateOptimisticData,
    startEditing,
    cancelEditing,
    savePendingChanges,
    handleTabNavigation,
    handleViewOpportunity,
    handleDeleteOpportunity,
    togglePin,
    isPinned,
    inputRef,
    editingContainerRef,
    visibleColumns: columnManager.visibleColumns,
    hasPendingChanges: Object.keys(pendingChanges).length > 0,
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Opportunities</h2>
        <div className="flex items-center gap-2">
          <CreateColumnButton />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColumnModalOpen(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Columns
          </Button>
        </div>
      </div>

      <DataTable
        data={optimisticData}
        columns={columns}
        isLoading={false}
        emptyMessage="No opportunities found matching your search criteria."
        getRowClassName={(row) =>
          row.pinned
            ? "bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100"
            : ""
        }
      />

      {totalPages > 1 && (
        <div className="flex justify-center py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    onPageChange(Math.min(totalPages, currentPage + 1))
                  }
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ColumnManagerModal
        open={columnModalOpen}
        onOpenChange={setColumnModalOpen}
        columnManager={columnManager}
      />
      {viewModalOpen && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          onDelete={(opportunityId) => {
            handleDeleteOpportunity(selectedOpportunity!);
          }}
        />
      )}
      <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Opportunity"
        itemName={opportunityToDelete?.title}
        onConfirm={confirmDeleteOpportunity}
        loading={deleteStatus.isLoading}
      />
    </div>
  );
}
