import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User, GripVertical } from 'lucide-react';
import { Opportunity } from '@/types/crm';
import { IOpportunity } from '@/api/opportunity/opportunityTypes';

interface KanbanCardProps {
  opportunity: IOpportunity;
  index: number;
  onOpportunityClick?: (opportunity: IOpportunity) => void;
}

export function KanbanCard({ opportunity, index, onOpportunityClick }: KanbanCardProps) {
  return (
    <Draggable draggableId={opportunity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={` rounded p-4 cursor-pointer`}
          onClick={() => onOpportunityClick?.(opportunity)}
        >
          {/* Left Drag Handle */}
          <div
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing p-1 rounded bg-muted/80 hover:bg-muted opacity-0 hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>

          {/* Right Drag Handle */}
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 cursor-grab active:cursor-grabbing p-1 rounded bg-muted/80 hover:bg-muted opacity-0 hover:opacity-100 transition-opacity"
          >
            <GripVertical className="w-3 h-3 text-muted-foreground" />
          </div>

          <Card 
            className={`hover:shadow-md transition-shadow bg-background select-none cursor-pointer ${
              snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
            }`}
            onClick={() => onOpportunityClick?.(opportunity)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm leading-tight mb-1">
                    {opportunity.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {opportunity.company}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {opportunity.probability}%
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 space-y-3">
              <div className="flex items-center gap-2 text-success">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">
                  ${opportunity.value.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <User className="w-3 h-3" />
                <span>{opportunity.contact}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Calendar className="w-3 h-3" />
                <span>Close: {new Date(opportunity.close_date).toLocaleDateString()}</span>
              </div>
              
              {/* {opportunity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )} */}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}