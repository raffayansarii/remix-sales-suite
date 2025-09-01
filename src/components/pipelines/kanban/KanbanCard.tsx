import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User } from 'lucide-react';
import { Opportunity } from '@/types/crm';

interface KanbanCardProps {
  opportunity: Opportunity;
  index: number;
}

export function KanbanCard({ opportunity, index }: KanbanCardProps) {
  return (
    <Draggable draggableId={opportunity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card 
            className={`cursor-pointer hover:shadow-md transition-shadow bg-background select-none ${
              snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
            }`}
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
                <span>Close: {new Date(opportunity.closeDate).toLocaleDateString()}</span>
              </div>
              
              {opportunity.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
}