import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { KanbanColumn } from './KanbanColumn';
import { Opportunity } from '@/types/crm';

interface KanbanBoardProps {
  opportunities: Opportunity[];
  onOpportunityMove?: (opportunityId: string, newStage: string) => void;
}

const stages = [
  { name: 'Lead', color: 'bg-stage-lead', textColor: 'text-white' },
  { name: 'Qualified', color: 'bg-stage-qualified', textColor: 'text-white' },
  { name: 'Proposal', color: 'bg-stage-proposal', textColor: 'text-white' },
  { name: 'Negotiation', color: 'bg-stage-negotiation', textColor: 'text-white' },
  { name: 'Closed Won', color: 'bg-stage-won', textColor: 'text-white' }
];

export function KanbanBoard({ opportunities, onOpportunityMove }: KanbanBoardProps) {
  const getOpportunitiesByStage = (stageName: string) => {
    return opportunities.filter(opp => opp.stage === stageName);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, return
    if (!destination) return;

    // If dropped in the same position, return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the new stage from droppableId
    const newStage = destination.droppableId;
    
    // Call the callback if provided (for future backend integration)
    onOpportunityMove?.(draggableId, newStage);
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 min-w-max">
          {stages.map((stage) => {
            const stageOpportunities = getOpportunitiesByStage(stage.name);
            
            return (
              <KanbanColumn
                key={stage.name}
                stage={stage}
                opportunities={stageOpportunities}
              />
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}