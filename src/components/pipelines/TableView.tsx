import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { usePinnedItems } from "@/hooks/usePinnedItems";
import { useColumnManager } from "@/hooks/useColumnManager";
import { ColumnManagerModal } from "./ColumnManagerModal";
import { CreateColumnButton } from "./CreateColumnButton";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { useToast } from "@/hooks/use-toast";
import { TableViewProps } from "./types-and-schemas";
import { useDeleteOpportunityMutation, useUpdateOpportunityMutation } from "@/api/opportunity/opportunityApi";
import { DeleteModal } from "../ui/delete-modal";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import { createOpportunityColumns } from "./columns";
import { EditableDataTable } from "../ui/editable-data-table";
import { useMoveOpportunityToStageMutation } from "@/api/kanban/kanbanApi";

export function TableView({ opportunities }: TableViewProps) {
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<IOpportunity | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] = useState<IOpportunity | null>(null);

  // Define editable columns in order for Tab navigation
  const { toast } = useToast();
  const editableFields = [
    "title",
    "stage",
    "award_type",
    "agency",
    "solicitation",
    "company",
    "value",
    "probability",
    "close_date",
  ];

  const columnManager = useColumnManager();
  const { togglePin, isPinned } = usePinnedItems<IOpportunity>();

  const handleViewOpportunity = (opportunity: IOpportunity) => {
    setSelectedOpportunity(opportunity);
    setViewModalOpen(true);
  };

  const [moveToStage] = useMoveOpportunityToStageMutation();

  const userData = JSON.parse(localStorage.getItem("user") || "null");

  const handleSaveChanges = async (opportunityId: string, changes: Partial<IOpportunity>) => {
    try {
      if (changes.stage && userData?.id) {
        const opportunity = opportunities.find((opp) => opp.id === opportunityId);
        if (!opportunity) throw new Error("Opportunity not found");

        await moveToStage({
          p_opportunity_id: opportunityId,
          p_new_stage: changes.stage,
          p_tenant_id: opportunity.tenant_id,
          p_user_id: userData.id,
        }).unwrap();

        toast({
          title: "Success",
          description: "Stage updated successfully",
        });
        // return;
      }
      await updateTrigger({
        id: opportunityId,
        body: changes,
      }).unwrap();

      toast({
        title: "Success",
        description: "Opportunity updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update opportunity",
        variant: "destructive",
      });
      throw error; // Re-throw to let EditableDataTable handle optimistic revert
    }
  };

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

  const [updateTrigger, updateStatus] = useUpdateOpportunityMutation();
  const [deleteTrigger, deleteStatus] = useDeleteOpportunityMutation();

  // Create columns with context
  const columns = createOpportunityColumns({
    handleViewOpportunity,
    handleDeleteOpportunity,
    togglePin,
    isPinned,
    visibleColumns: columnManager.visibleColumns,
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Opportunities</h2>
        <div className="flex items-center gap-2">
          <CreateColumnButton />
          <Button variant="outline" size="sm" onClick={() => setColumnModalOpen(true)} className="gap-2">
            <Settings className="h-4 w-4" />
            Manage Columns
          </Button>
        </div>
      </div>

      <EditableDataTable
        data={opportunities}
        columns={columns}
        editableFields={editableFields}
        rowIdKey="id"
        onSave={handleSaveChanges}
        isLoading={updateStatus.isLoading}
        emptyMessage="No opportunities found matching your search criteria."
        conditionalRowStyles={[
          {
            when: (row) => !!row.pinned,
            style: {
              backgroundColor: "rgb(240 253 244)",
            },
            classNames: ["bg-green-50 dark:bg-green-900  hover:bg-green-100"],
          },
        ]}
        enableDoubleTabNavigation={false}
      />
      <ColumnManagerModal open={columnModalOpen} onOpenChange={setColumnModalOpen} columnManager={columnManager} />
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
