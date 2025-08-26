import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Eye, Edit, MoreHorizontal, Pin, PinOff } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Opportunity } from '@/types/crm';
import { useState } from 'react';
import { usePinnedItems } from '@/hooks/usePinnedItems';

interface TableViewProps {
  opportunities: Opportunity[];
}

type SortField = 'title' | 'company' | 'value' | 'stage' | 'awardType' | 'agency' | 'solicitation' | 'createdAt' | 'probability';
type SortDirection = 'asc' | 'desc';

export function TableView({ opportunities }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const { togglePin, isPinned, separateItems } = usePinnedItems<Opportunity>();

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
      <div className="bg-background rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              <TableHead className="font-semibold">
                <SortButton field="title">Title</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="stage">Status</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="awardType">Award Type</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="agency">Agency</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="solicitation">Solicitation</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="createdAt">Created</SortButton>
              </TableHead>
              <TableHead className="font-semibold w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOpportunities.map((opportunity) => (
              <TableRow 
                key={opportunity.id} 
                className={`cursor-pointer transition-colors ${
                  isPinned(opportunity.id) || opportunity.pinned
                    ? 'bg-primary/5 hover:bg-primary/10 border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Badge className={`${getStageColor(opportunity.stage)} border-0`}>
                    {opportunity.stage}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${getAwardTypeColor(opportunity.awardType)} border-0 text-xs`}>
                    {opportunity.awardType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{opportunity.agency}</TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="h-auto p-0 text-primary hover:text-primary-hover text-sm underline"
                    onClick={() => {/* Handle edit */}}
                  >
                    {opportunity.solicitation}
                  </Button>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(opportunity.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border shadow-lg">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {sortedOpportunities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No opportunities found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}