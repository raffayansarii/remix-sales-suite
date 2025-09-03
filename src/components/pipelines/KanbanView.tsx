import { useState, useEffect } from 'react';
import { KanbanBoard } from './kanban/KanbanBoard';
import { Opportunity } from '@/types/crm';
import { toast } from '@/hooks/use-toast';

interface KanbanViewProps {
  opportunities: Opportunity[];
}

export function KanbanView({ opportunities: initialOpportunities }: KanbanViewProps) {
  // TODO: This will be replaced by real-time opportunity data from backend
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);

  console.log('📋 [KANBAN] KanbanView initialized with opportunities:', opportunities.length);

  // Update opportunities when props change
  useEffect(() => {
    console.log('📋 [KANBAN] Opportunities updated from parent:', initialOpportunities.length);
    setOpportunities(initialOpportunities);
  }, [initialOpportunities]);

  const handleOpportunityMove = async (opportunityId: string, newStage: string) => {
    console.log('🔄 [KANBAN] Moving opportunity:', opportunityId, 'to stage:', newStage);
    
    // Optimistic update
    const updatedOpportunities = opportunities.map(opp =>
      opp.id === opportunityId 
        ? { ...opp, stage: newStage as Opportunity['stage'], updatedAt: new Date().toISOString() }
        : opp
    );
    
    setOpportunities(updatedOpportunities);
    console.log('✅ [KANBAN] Optimistic update applied');

    try {
      // TODO: Replace with actual backend API call
      // await updateOpportunityStage(opportunityId, newStage);
      // Expected API: PATCH /api/opportunities/${opportunityId} { stage: newStage }
      console.log('🌐 [API] Would call PATCH /api/opportunities/' + opportunityId, { stage: newStage });
      
      toast({
        title: "Opportunity moved",
        description: `Opportunity moved to ${newStage}`,
      });
      
      console.log('✅ [KANBAN] Opportunity moved successfully');
    } catch (error) {
      console.error('❌ [KANBAN] Failed to move opportunity:', error);
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