import { useState } from 'react';
import { Search, Kanban, Table, BarChart3, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockOpportunities } from '@/data/mockData';
import { Opportunity, ViewType } from '@/types/crm';
import { KanbanView } from '@/components/pipelines/KanbanView';
import { TableView } from '@/components/pipelines/TableView';

export default function Pipelines() {
  const [viewType, setViewType] = useState<ViewType>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);

  const filteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const averageDealSize = totalValue / filteredOpportunities.length || 0;
  const winRate = (filteredOpportunities.filter(opp => opp.stage === 'Closed Won').length / filteredOpportunities.length * 100) || 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/30">
      {/* Header Section */}
      <div className="bg-background border-b p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Opportunity Pipelines</h1>
            <p className="text-muted-foreground mt-1">Manage and track your sales opportunities</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Button>
            <Button className="gap-2 bg-gradient-primary hover:bg-primary-hover">
              <Plus className="w-4 h-4" />
              Add Opportunity
            </Button>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search opportunities, companies, or contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewType === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('kanban')}
              className="gap-2"
            >
              <Kanban className="w-4 h-4" />
              Kanban
            </Button>
            <Button
              variant={viewType === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('table')}
              className="gap-2"
            >
              <Table className="w-4 h-4" />
              Table
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <div className="text-2xl font-bold text-primary">{filteredOpportunities.length}</div>
            <div className="text-sm text-muted-foreground">Total Opportunities</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-success">${totalValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Pipeline Value</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-warning">${Math.round(averageDealSize).toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Avg Deal Size</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-stage-negotiation">{winRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </Card>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {viewType === 'kanban' ? (
          <KanbanView opportunities={filteredOpportunities} />
        ) : (
          <TableView opportunities={filteredOpportunities} />
        )}
      </div>
    </div>
  );
}