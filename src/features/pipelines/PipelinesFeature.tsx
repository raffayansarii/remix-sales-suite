import { useState } from 'react';
import { Search, Kanban, Table, BarChart3, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockOpportunities } from '@/data/mockData';
import { Opportunity, ViewType } from '@/types/crm';
import { FilterGroup } from '@/types/filters';
import { KanbanView } from '@/components/pipelines/KanbanView';
import { TableView } from '@/components/pipelines/TableView';
import { FilterDrawer } from '@/components/pipelines/FilterDrawer';
import { PipelineAnalytics } from '@/components/pipelines/PipelineAnalytics';

export function PipelinesFeature() {
  const [viewType, setViewType] = useState<ViewType>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [activeFilters, setActiveFilters] = useState<FilterGroup[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Apply search filter
  const searchFilteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.solicitation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply advanced filters
  const applyFilters = (opportunities: Opportunity[], filters: FilterGroup[]): Opportunity[] => {
    return opportunities.filter(opportunity => {
      return filters.every(filter => {
        const fieldValue = opportunity[filter.field as keyof Opportunity];
        const filterValue = filter.value;
        
        if (!fieldValue && !['is_empty', 'is_not_empty'].includes(filter.operator)) return false;
        
        switch (filter.operator) {
          case 'contains_exactly':
            return String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'contains_any_of':
            return Array.isArray(filterValue) 
              ? filterValue.some(val => String(fieldValue).toLowerCase().includes(val.toLowerCase()))
              : String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'contains_all_of':
            return Array.isArray(filterValue)
              ? filterValue.every(val => String(fieldValue).toLowerCase().includes(val.toLowerCase()))
              : String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'doesnt_contain_exactly':
            return !String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'ends_with_any_of':
            return Array.isArray(filterValue)
              ? filterValue.some(val => String(fieldValue).toLowerCase().endsWith(val.toLowerCase()))
              : String(fieldValue).toLowerCase().endsWith(String(filterValue).toLowerCase());
          case 'starts_with_any_of':
            return Array.isArray(filterValue)
              ? filterValue.some(val => String(fieldValue).toLowerCase().startsWith(val.toLowerCase()))
              : String(fieldValue).toLowerCase().startsWith(String(filterValue).toLowerCase());
          case 'has_never_contained_exactly':
            return !String(fieldValue).toLowerCase().includes(String(filterValue).toLowerCase());
          case 'equals':
            return String(fieldValue).toLowerCase() === String(filterValue).toLowerCase();
          case 'not_equals':
            return String(fieldValue).toLowerCase() !== String(filterValue).toLowerCase();
          case 'is_empty':
            return !fieldValue || String(fieldValue).trim() === '';
          case 'is_not_empty':
            return fieldValue && String(fieldValue).trim() !== '';
          case 'greater_than':
            return Number(fieldValue) > Number(filterValue);
          case 'less_than':
            return Number(fieldValue) < Number(filterValue);
          case 'before_date':
            return new Date(String(fieldValue)) < new Date(String(filterValue));
          case 'after_date':
            return new Date(String(fieldValue)) > new Date(String(filterValue));
          default:
            return true;
        }
      });
    });
  };

  const filteredOpportunities = applyFilters(searchFilteredOpportunities, activeFilters);

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
            <Button 
              variant={showAnalytics ? "default" : "outline"} 
              className="gap-2"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
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
          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search opportunities, agencies, solicitations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            
            <Button
              variant={activeFilters.length > 0 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="gap-2 relative"
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilters.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
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
              Grid
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {showAnalytics ? (
          <PipelineAnalytics opportunities={filteredOpportunities} />
        ) : viewType === 'kanban' ? (
          <KanbanView opportunities={filteredOpportunities} />
        ) : (
          <TableView opportunities={filteredOpportunities} />
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={setActiveFilters}
        activeFilters={activeFilters}
      />
    </div>
  );
}