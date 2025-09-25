import { useState, useEffect } from "react";
import { KanbanBoard } from "./kanban/KanbanBoard";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import { Opportunity } from "@/types/crm";
import { toast } from "@/hooks/use-toast";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { useMoveOpportunityToStageMutation } from "@/api/kanban/kanbanApi";

interface KanbanViewProps {
  opportunities: IOpportunity[];
  onOpportunityUpdate?: (updatedOpportunity: IOpportunity) => void;
  onOpportunityDelete?: (opportunityId: string) => void;
}

export function KanbanView({
  opportunities: initialOpportunities,
  onOpportunityUpdate,
  onOpportunityDelete,
}: KanbanViewProps) {
  // TODO: This will be replaced by real-time opportunity data from backend
  const [opportunities, setOpportunities] =
    useState<IOpportunity[]>(initialOpportunities);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<IOpportunity | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const [moveCardHandler, moveCardStatus] = useMoveOpportunityToStageMutation();
  const userData = JSON.parse(localStorage.getItem("user"));
  // Update opportunities when props change
  useEffect(() => {
    setOpportunities(initialOpportunities);
  }, [initialOpportunities]);

  const handleOpportunityClick = (opportunity: IOpportunity) => {
    setSelectedOpportunity(opportunity as IOpportunity);
    setDetailModalOpen(true);
  };

  const handleOpportunityMove = async (
    opportunityId: string,
    newStage: string,
    movedOpportunity: IOpportunity
  ) => {
    console.log(
      "🔄 [KANBAN] Moving opportunity:",
      opportunityId,
      "to stager:",
      newStage,
      movedOpportunity
    );
    // Call the mutation to update the backend
    const body={
      p_opportunity_id: opportunityId,
      p_new_stage: newStage,
      p_tenant_id: movedOpportunity?.tenant_id,
      p_user_id: userData?.id,
    }
    // Optimistic update
    const updatedOpportunities = opportunities.map((opp) =>
      opp.id === opportunityId
        ? {
            ...opp,
            stage: newStage as Opportunity["stage"],
            updatedAt: new Date().toISOString(),
          }
        : opp
    );
    try {
      moveCardHandler(body).unwrap().then(()=>{
         toast({
        title: "Opportunity moved",
        description: `Opportunity moved to ${newStage}`,
      });
      });
    } catch (error) {
      console.error("❌ [KANBAN] Failed to move opportunity:", error);
      // Revert on error
      setOpportunities(opportunities);
      toast({
        title: "Error",
        description: "Failed to move opportunity. Please try again.",
        variant: "destructive",
      });
    }
    setOpportunities(updatedOpportunities);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-auto">
      <KanbanBoard
        opportunities={opportunities}
        onOpportunityMove={handleOpportunityMove}
        onOpportunityClick={handleOpportunityClick}
      />

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onUpdate={onOpportunityUpdate}
        onDelete={onOpportunityDelete}
      />
    </div>
  );
}
