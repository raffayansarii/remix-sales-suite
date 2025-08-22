import { Droppable } from 'react-beautiful-dnd';
import { KanbanHeader } from './KanbanHeader';
import { KanbanCard } from './KanbanCard';
import { Opportunity } from '@/types/crm';

interface Stage {
  name: string;
  color: string;
  textColor: string;
}

interface KanbanColumnProps {
  stage: Stage;
  opportunities: Opportunity[];
}

export function KanbanColumn({ stage, opportunities }: KanbanColumnProps) {
  const stageValue = opportunities.reduce((sum, opp) => sum + opp.value, 0);

  return (
    <div className="flex-shrink-0 w-80">
      <KanbanHeader
        stage={stage}
        count={opportunities.length}
        totalValue={stageValue}
      />
      
      <Droppable droppableId={stage.name}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-muted/50 p-3 rounded-b-lg min-h-[600px] space-y-3 transition-colors ${
              snapshot.isDraggingOver ? 'bg-muted/70' : ''
            }`}
          >
            {opportunities.map((opportunity, index) => (
              <KanbanCard
                key={opportunity.id}
                opportunity={opportunity}
                index={index}
              />
            ))}
            
            {opportunities.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-sm">No opportunities in this stage</p>
              </div>
            )}
            
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}