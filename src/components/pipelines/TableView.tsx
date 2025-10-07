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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const columnManager = useColumnManager();
  const { togglePin, isPinned } = usePinnedItems<IOpportunity>();

  const handleViewOpportunity = (opportunity: IOpportunity) => {
    setSelectedOpportunity(opportunity);
    setViewModalOpen(true);
  };

  const startEditing = (opportunityId: string, field: string, currentValue: any) => {
    setEditingCell({ opportunityId, field });
    setEditValue(currentValue?.toString() || "");
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = async (opportunity: IOpportunity, field: string, value: any) => {
    try {
      await updateTrigger({
        id: opportunity.id,
        body: { [field]: value },
      }).unwrap();
      
      toast({
        title: "Success",
        description: "Opportunity updated successfully",
      });
      
      setEditingCell(null);
      setEditValue("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update opportunity",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
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
    setEditValue,
    startEditing,
    cancelEditing,
    saveEdit,
    handleViewOpportunity,
    handleDeleteOpportunity,
    togglePin,
    isPinned,
    inputRef,
    visibleColumns: columnManager.visibleColumns,
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
        data={opportunities}
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
