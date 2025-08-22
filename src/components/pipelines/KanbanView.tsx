import { useState, useEffect } from 'react';
import { KanbanBoard } from './kanban/KanbanBoard';
import { Opportunity } from '@/types/crm';
import { toast } from '@/hooks/use-toast';

interface KanbanViewProps {
  opportunities: Opportunity[];
}

export function KanbanView({ opportunities: initialOpportunities }: KanbanViewProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);

  // Update opportunities when props change
  useEffect(() => {
    setOpportunities(initialOpportunities);
  }, [initialOpportunities]);

  const handleOpportunityMove = async (opportunityId: string, newStage: string) => {
    // Optimistic update
    const updatedOpportunities = opportunities.map(opp =>
      opp.id === opportunityId 
        ? { ...opp, stage: newStage as Opportunity['stage'], updatedAt: new Date().toISOString() }
        : opp
    );
    
    setOpportunities(updatedOpportunities);

    try {
      // Future backend integration point
      // await updateOpportunityStage(opportunityId, newStage);
      
      toast({
        title: "Opportunity moved",
        description: `Opportunity moved to ${newStage}`,
      });
    } catch (error) {
      // Revert on error
      setOpportunities(opportunities);
      toast({
        title: "Error",
        description: "Failed to move opportunity. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <KanbanBoard 
      opportunities={opportunities} 
      onOpportunityMove={handleOpportunityMove}
    />
  );
}