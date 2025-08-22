import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Opportunity } from '@/types/crm';
import { useState } from 'react';

interface TableViewProps {
  opportunities: Opportunity[];
}

type SortField = 'title' | 'company' | 'value' | 'stage' | 'closeDate' | 'probability';
type SortDirection = 'asc' | 'desc';

export function TableView({ opportunities }: TableViewProps) {
  const [sortField, setSortField] = useState<SortField>('closeDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'closeDate') {
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
                <SortButton field="title">Opportunity</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="company">Company</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="value">Value</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="stage">Stage</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="probability">Probability</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="closeDate">Close Date</SortButton>
              </TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOpportunities.map((opportunity) => (
              <TableRow key={opportunity.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">{opportunity.title}</div>
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
                <TableCell className="text-sm">{opportunity.company}</TableCell>
                <TableCell>
                  <span className="font-semibold text-success">
                    ${opportunity.value.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStageColor(opportunity.stage)} border-0`}>
                    {opportunity.stage}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-muted rounded-full h-2 max-w-20">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all" 
                        style={{ width: `${opportunity.probability}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{opportunity.probability}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(opportunity.closeDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {opportunity.contact}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
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