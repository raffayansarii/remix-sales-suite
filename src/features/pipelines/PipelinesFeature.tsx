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
import { CreateOpportunityModal } from '@/components/pipelines/CreateOpportunityModal';

export function PipelinesFeature() {
  const [viewType, setViewType] = useState<ViewType>('table');
  const [searchTerm, setSearchTerm] = useState('');
  // TODO: Replace with API call - GET /api/opportunities with real-time updates
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [activeFilters, setActiveFilters] = useState<FilterGroup[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  console.log('🔍 [PIPELINES] Component initialized with opportunities:', opportunities.length);
  console.log('🔍 [PIPELINES] Current search term:', searchTerm);
  console.log('🔍 [PIPELINES] Active filters:', activeFilters);

  // Apply search filter
  // TODO: Replace with backend search - POST /api/opportunities/search
  const searchFilteredOpportunities = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.solicitation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('🔍 [SEARCH] Filtered opportunities:', searchFilteredOpportunities.length, 'of', opportunities.length);

  // Apply advanced filters
  // TODO: Replace with backend filtering - POST /api/opportunities/filter
  const applyFilters = (opportunities: Opportunity[], filters: FilterGroup[]): Opportunity[] => {
    console.log('🔧 [FILTERS] Applying filters:', filters.length, 'filters to', opportunities.length, 'opportunities');
    
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
  console.log('📊 [ANALYTICS] Final filtered opportunities:', filteredOpportunities.length);

  // TODO: Replace with real-time analytics from backend - GET /api/analytics/pipeline
  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const averageDealSize = totalValue / filteredOpportunities.length || 0;
  const winRate = (filteredOpportunities.filter(opp => opp.stage === 'Closed Won').length / filteredOpportunities.length * 100) || 0;

  console.log('📊 [ANALYTICS] Total value:', totalValue, 'Average deal size:', averageDealSize, 'Win rate:', winRate);

  const handleOpportunityUpdate = (updatedOpportunity: Opportunity) => {
    // TODO: Replace with actual API call to backend
    // PUT /api/opportunities/:id
    console.log('🔄 [API CALL] PUT /api/opportunities/' + updatedOpportunity.id, updatedOpportunity);
    console.log('✅ [PIPELINES] Opportunity updated successfully');
  };

  const handleOpportunityDelete = (opportunityId: string) => {
    // TODO: Replace with actual API call to backend
    // DELETE /api/opportunities/:id
    console.log('🗑️ [API CALL] DELETE /api/opportunities/' + opportunityId);
    console.log('✅ [PIPELINES] Opportunity deleted successfully');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/30">
      {/* Header Section */}
      <div className="bg-background border-b p-4 sm:p-6 shrink-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">Opportunity Pipelines</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage and track your sales opportunities</p>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant={showAnalytics ? "default" : "outline"} 
              className="gap-2 text-xs sm:text-sm"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </Button>
            <Button 
              className="gap-2 bg-gradient-primary hover:bg-primary-hover text-xs sm:text-sm" 
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Opportunity</span>
            </Button>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => {
                  console.log('🔍 [SEARCH] Search term changed:', e.target.value);
                  setSearchTerm(e.target.value);
                  // TODO: Debounce search and call backend API
                }}
                className="pl-10 bg-background text-sm"
              />
            </div>
            
            <Button
              variant={activeFilters.length > 0 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="gap-2 relative shrink-0"
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

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={viewType === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('kanban')}
              className="gap-2"
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
            <Button
              variant={viewType === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('table')}
              className="gap-2"
            >
              <Table className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {showAnalytics ? (
          <PipelineAnalytics opportunities={filteredOpportunities} />
        ) : viewType === 'kanban' ? (
          <KanbanView 
            opportunities={filteredOpportunities}
            onOpportunityUpdate={handleOpportunityUpdate}
            onOpportunityDelete={handleOpportunityDelete}
          />
        ) : (
          <TableView 
            opportunities={filteredOpportunities}
            onOpportunityUpdate={handleOpportunityUpdate}
            onOpportunityDelete={handleOpportunityDelete}
          />
        )}
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onApplyFilters={setActiveFilters}
        activeFilters={activeFilters}
      />

      {/* Create Opportunity Modal */}
      <CreateOpportunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}