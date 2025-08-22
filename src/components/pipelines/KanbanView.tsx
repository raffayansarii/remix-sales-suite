import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, User } from 'lucide-react';
import { Opportunity } from '@/types/crm';

interface KanbanViewProps {
  opportunities: Opportunity[];
}

const stages = [
  { name: 'Lead', color: 'bg-stage-lead', textColor: 'text-white' },
  { name: 'Qualified', color: 'bg-stage-qualified', textColor: 'text-white' },
  { name: 'Proposal', color: 'bg-stage-proposal', textColor: 'text-white' },
  { name: 'Negotiation', color: 'bg-stage-negotiation', textColor: 'text-white' },
  { name: 'Closed Won', color: 'bg-stage-won', textColor: 'text-white' }
];

export function KanbanView({ opportunities }: KanbanViewProps) {
  const getOpportunitiesByStage = (stageName: string) => {
    return opportunities.filter(opp => opp.stage === stageName);
  };

  const getStageValue = (stageName: string) => {
    return getOpportunitiesByStage(stageName).reduce((sum, opp) => sum + opp.value, 0);
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex gap-6 min-w-max">
        {stages.map((stage) => {
          const stageOpportunities = getOpportunitiesByStage(stage.name);
          const stageValue = getStageValue(stage.name);
          
          return (
            <div key={stage.name} className="flex-shrink-0 w-80">
              {/* Stage Header */}
              <div className={`${stage.color} ${stage.textColor} p-4 rounded-t-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{stage.name}</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    {stageOpportunities.length}
                  </Badge>
                </div>
                <div className="text-sm opacity-90">
                  ${stageValue.toLocaleString()} total value
                </div>
              </div>

              {/* Opportunity Cards */}
              <div className="bg-muted/50 p-3 rounded-b-lg min-h-[600px] space-y-3">
                {stageOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="cursor-pointer hover:shadow-md transition-shadow bg-background">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm leading-tight mb-1">{opportunity.title}</h4>
                          <p className="text-xs text-muted-foreground">{opportunity.company}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {opportunity.probability}%
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex items-center gap-2 text-success">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold">${opportunity.value.toLocaleString()}</span>
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
                ))}
                
                {stageOpportunities.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <p className="text-sm">No opportunities in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}