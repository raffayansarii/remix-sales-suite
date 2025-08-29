import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Eye, Edit, MoreHorizontal, Pin, PinOff, Palette, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { Opportunity } from '@/types/crm';
import { useState } from 'react';
import { usePinnedItems, PIN_COLORS, PinColor } from '@/hooks/usePinnedItems';
import { useColumnManager } from '@/hooks/useColumnManager';
import { ColumnManagerModal } from './ColumnManagerModal';

interface TableViewProps {
  opportunities: Opportunity[];
}

type SortField = 'title' | 'company' | 'value' | 'stage' | 'awardType' | 'agency' | 'solicitation' | 'createdAt' | 'probability';
type SortDirection = 'asc' | 'desc';

export function TableView({ opportunities }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const { togglePin, isPinned, setItemColor, getItemColor, separateItems } = usePinnedItems<Opportunity>();
  const columnManager = useColumnManager();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Separate pinned and unpinned items
  const { pinnedItems, unpinnedItems } = separateItems(opportunities);
  
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setColumnModalOpen(true)}
          className="gap-2"
        >
          <Settings className="h-4 w-4" />
          Manage Columns
        </Button>
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
              const color = getItemColor(opportunity.id);
              
              return (
                <TableRow 
                  key={opportunity.id} 
                  className={`cursor-pointer transition-colors ${
                    pinned && color
                      ? `${color.bg} ${color.hover} ${color.border}` 
                      : pinned 
                        ? 'bg-primary/5 hover:bg-primary/10 border-primary/20' 
                        : 'hover:bg-muted/50'
                  }`}
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
                                  onClick={() => togglePin(opportunity.id)}
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
                                
                                {(isPinned(opportunity.id) || opportunity.pinned) && (
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="cursor-pointer">
                                      <Palette className="mr-2 h-4 w-4" />
                                      Change color
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-background border shadow-lg z-50">
                                      <div className="grid grid-cols-2 gap-1 p-2">
                                        {PIN_COLORS.map((color) => (
                                          <DropdownMenuItem
                                            key={color.name}
                                            className="cursor-pointer"
                                            onClick={() => setItemColor(opportunity.id, color)}
                                          >
                                            <div className={`w-4 h-4 rounded mr-2 ${color.bg} ${color.border} border`} />
                                            <span className="text-xs">{color.name}</span>
                                          </DropdownMenuItem>
                                        ))}
                                      </div>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                )}
                                
                                <DropdownMenuItem className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
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
                      <TableCell key={column.id}>
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
    </div>
  );
}