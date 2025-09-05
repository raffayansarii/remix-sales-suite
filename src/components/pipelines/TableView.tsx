import { Opportunity } from '@/types/crm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Pin, PinOff, Columns } from 'lucide-react';
import { useState } from 'react';
import { usePinnedItems } from '@/hooks/usePinnedItems';
import { useColumnManager } from '@/hooks/useColumnManager';
import { ColumnManagerModal } from './ColumnManagerModal';
import { OpportunityDetailModal } from './OpportunityDetailModal';

interface TableViewProps {
  opportunities: Opportunity[];
  onOpportunityUpdate?: (updatedOpportunity: Opportunity) => void;
  onOpportunityDelete?: (opportunityId: string) => void;
}

type SortField = 'title' | 'company' | 'value' | 'stage' | 'awardType' | 'agency' | 'solicitation' | 'createdAt' | 'probability';
type SortDirection = 'asc' | 'desc';

export function TableView({ opportunities, onOpportunityUpdate, onOpportunityDelete }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { togglePin, isPinned } = usePinnedItems<Opportunity>();
  const columnManager = useColumnManager();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDetailModalOpen(true);
  };

  const handleViewOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setDetailModalOpen(true);
  };

  // Separate pinned and unpinned items
  const pinnedItems = opportunities.filter(opp => isPinned(opp.id) || opp.pinned);
  const unpinnedItems = opportunities.filter(opp => !isPinned(opp.id) && !opp.pinned);
  
  // Sort both pinned and unpinned items separately
  const sortItems = (items: Opportunity[]) => {
    return [...items].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedPinnedItems = sortItems(pinnedItems);
  const sortedUnpinnedItems = sortItems(unpinnedItems);
  const sortedOpportunities = [...sortedPinnedItems, ...sortedUnpinnedItems];

  const getStageColor = (stage: string) => {
    const stageColors = {
      'Lead': 'bg-stage-lead text-white',
      'Qualified': 'bg-stage-qualified text-white',
      'Proposal': 'bg-stage-proposal text-white',
      'Negotiation': 'bg-stage-negotiation text-white',
      'Closed Won': 'bg-stage-won text-white'
    };
    return stageColors[stage as keyof typeof stageColors] || 'bg-muted';
  };

  const getAwardTypeColor = (awardType: string) => {
    const awardTypeColors = {
      'Contract': 'bg-primary text-primary-foreground',
      'Grant': 'bg-success text-success-foreground',
      'Cooperative Agreement': 'bg-warning text-warning-foreground',
      'Purchase Order': 'bg-muted text-muted-foreground'
    };
    return awardTypeColors[awardType as keyof typeof awardTypeColors] || 'bg-muted';
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold hover:bg-transparent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Opportunities</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setColumnModalOpen(true)}
            className="gap-2"
          >
            <Columns className="h-4 w-4" />
            Manage Columns
          </Button>
        </div>
      </div>
      
      <div className="bg-background rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              {columnManager.visibleColumns.map((column) => (
                <TableHead key={column.id} className="font-semibold">
                  {column.sortable && column.field ? (
                    <SortButton field={column.field as SortField}>{column.label}</SortButton>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOpportunities.map((opportunity) => {
              const pinned = isPinned(opportunity.id) || opportunity.pinned;
              
              return (
                <TableRow 
                  key={opportunity.id}
                  className={`hover:bg-muted/50 transition-colors cursor-pointer ${
                    pinned ? 'border-l-4 border-primary bg-muted/20' : ''
                  }`}
                  onClick={() => handleRowClick(opportunity)}
                >
                  {columnManager.visibleColumns.map((column) => {
                    // Render cell content based on column
                    const renderCellContent = () => {
                      switch (column.id) {
                        case 'title':
                          return (
                            <div>
                              <div className="font-medium text-sm">{opportunity.title}</div>
                              <div className="text-xs text-muted-foreground mt-1">{opportunity.company}</div>
                              {opportunity.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {opportunity.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {opportunity.tags.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{opportunity.tags.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        case 'stage':
                          return (
                            <Badge className={`${getStageColor(opportunity.stage)} border-0`}>
                              {opportunity.stage}
                            </Badge>
                          );
                        case 'awardType':
                          return (
                            <Badge className={`${getAwardTypeColor(opportunity.awardType)} border-0 text-xs`}>
                              {opportunity.awardType}
                            </Badge>
                          );
                        case 'agency':
                          return <span className="text-sm">{opportunity.agency}</span>;
                        case 'solicitation':
                          return (
                            <Button 
                              variant="link" 
                              className="h-auto p-0 text-primary hover:text-primary-hover text-sm underline"
                              onClick={() => {/* Handle edit */}}
                            >
                              {opportunity.solicitation}
                            </Button>
                          );
                        case 'company':
                          return <span className="text-sm">{opportunity.company}</span>;
                        case 'value':
                          return <span className="text-sm">${opportunity.value.toLocaleString()}</span>;
                        case 'probability':
                          return <span className="text-sm">{opportunity.probability}%</span>;
                        case 'closeDate':
                          return <span className="text-sm">{new Date(opportunity.closeDate).toLocaleDateString()}</span>;
                        case 'createdAt':
                          return <span className="text-sm">{new Date(opportunity.createdAt).toLocaleDateString()}</span>;
                        case 'actions':
                          return (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                                 <DropdownMenuItem 
                                   className="cursor-pointer"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     togglePin(opportunity.id);
                                   }}
                                 >
                                   {isPinned(opportunity.id) || opportunity.pinned ? (
                                     <>
                                       <PinOff className="mr-2 h-4 w-4" />
                                       Unpin
                                     </>
                                   ) : (
                                     <>
                                       <Pin className="mr-2 h-4 w-4" />
                                       Pin to top
                                     </>
                                   )}
                                 </DropdownMenuItem>
                                
                                 <DropdownMenuItem 
                                   className="cursor-pointer"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleViewOpportunity(opportunity);
                                   }}
                                 >
                                   <Eye className="mr-2 h-4 w-4" />
                                   View
                                 </DropdownMenuItem>
                                 <DropdownMenuItem 
                                   className="cursor-pointer"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleViewOpportunity(opportunity);
                                   }}
                                 >
                                   <Edit className="mr-2 h-4 w-4" />
                                   Edit
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          );
                        default:
                          return column.field ? (
                            <span className="text-sm">{(opportunity as any)[column.field]}</span>
                          ) : null;
                      }
                    };

                     return (
                       <TableCell 
                         key={column.id}
                         onClick={column.id === 'actions' ? (e) => e.stopPropagation() : undefined}
                       >
                         {renderCellContent()}
                       </TableCell>
                     );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {sortedOpportunities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No opportunities found matching your search criteria.</p>
          </div>
        )}
      </div>

      <ColumnManagerModal 
        open={columnModalOpen}
        onOpenChange={setColumnModalOpen}
        columnManager={columnManager}
      />

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        onUpdate={onOpportunityUpdate}
        onDelete={onOpportunityDelete}
      />
    </div>
  );
}