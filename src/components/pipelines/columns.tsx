import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Pin, PinOff, Trash2, Check, X } from "lucide-react";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { ColumnDef } from "@/components/ui/data-table";


export interface OpportunityColumnsContext {
  editingCell: { opportunityId: string; field: string } | null;
  editValue: string;
  updateOptimisticData: (opportunityId: string, field: string, value: any) => void;
  startEditing: (opportunityId: string, field: string, currentValue: any) => void;
  cancelEditing: () => void;
  savePendingChanges: () => void;
  handleTabNavigation: (opportunity: IOpportunity, field: string) => void;
  handleViewOpportunity: (opportunity: IOpportunity) => void;
  handleDeleteOpportunity: (opportunity: IOpportunity) => void;
  togglePin: (id: string, opportunity: IOpportunity) => void;
  isPinned: (id: string) => boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  editingContainerRef: React.RefObject<HTMLDivElement>;
  visibleColumns: Array<{ id: string; label: string; field?: string }>;
  hasPendingChanges: boolean;
}

export const createOpportunityColumns = (context: OpportunityColumnsContext): ColumnDef<IOpportunity>[] => {
  const {
    editingCell,
    editValue,
    updateOptimisticData,
    startEditing,
    cancelEditing,
    savePendingChanges,
    handleTabNavigation,
    handleViewOpportunity,
    handleDeleteOpportunity,
    togglePin,
    isPinned,
    inputRef,
    editingContainerRef,
    visibleColumns,
    hasPendingChanges,
  } = context;

  const columnMap: Record<string, ColumnDef<IOpportunity>> = {
    title: {
      id: "title",
      header: "Title",
      accessorKey: "title",
      grow: 2,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "title";
        return (
          <div>
            {isEditing ? (
              <div ref={editingContainerRef} className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={editValue}
                  onChange={(e) => updateOptimisticData(row.id, "title", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") savePendingChanges();
                    else if (e.key === "Escape") cancelEditing();
                    else if (e.key === "Tab") {
                      e.preventDefault();
                      handleTabNavigation(row, "title");
                    }
                  }}
                  className="h-8"
                />
              </div>
            ) : (
              <div
                className="cursor-pointer p-1 rounded"
                onClick={() => startEditing(row.id, "title", row.title)}
              >
                <div className="font-medium text-sm">{row.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{row.company}</div>
                {row?.tags?.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {row.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs shadow" style={{ color: tag.color }}>
                        {tag.name}
                      </Badge>
                    ))}
                    {row.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{row.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    stage: {
      id: "stage",
      header: "Stage",
      accessorKey: "stage",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "stage";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Select
              value={editValue}
              onValueChange={(value) => updateOptimisticData(row.id, "stage", value)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Badge
            variant="secondary"
            className="cursor-pointer"
            onClick={() => startEditing(row.id, "stage", row.stage)}
          >
            {row.stage}
          </Badge>
        );
      },
    },
    awardType: {
      id: "awardType",
      header: "Award Type",
      accessorKey: "award_type",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "award_type";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Select
              value={editValue}
              onValueChange={(value) => updateOptimisticData(row.id, "award_type", value)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Grant">Grant</SelectItem>
                <SelectItem value="Cooperative Agreement">Cooperative Agreement</SelectItem>
                <SelectItem value="Purchase Order">Purchase Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Badge
            variant="outline"
            className="cursor-pointer text-xs"
            onClick={() => startEditing(row.id, "award_type", row.award_type)}
          >
            {row.award_type}
          </Badge>
        );
      },
    },
    agency: {
      id: "agency",
      header: "Agency",
      accessorKey: "agency",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "agency";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => updateOptimisticData(row.id, "agency", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePendingChanges();
                else if (e.key === "Escape") cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  handleTabNavigation(row, "agency");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => startEditing(row.id, "agency", row.agency)}
          >
            {row.agency}
          </span>
        );
      },
    },
    solicitation: {
      id: "solicitation",
      header: "Solicitation",
      accessorKey: "solicitation",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "solicitation";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => updateOptimisticData(row.id, "solicitation", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePendingChanges();
                else if (e.key === "Escape") cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  handleTabNavigation(row, "solicitation");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm text-primary underline cursor-pointer p-1 rounded"
            onClick={() => startEditing(row.id, "solicitation", row.solicitation)}
          >
            {row.solicitation}
          </span>
        );
      },
    },
    company: {
      id: "company",
      header: "Company",
      accessorKey: "company",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "company";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => updateOptimisticData(row.id, "company", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePendingChanges();
                else if (e.key === "Escape") cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  handleTabNavigation(row, "company");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => startEditing(row.id, "company", row.company)}
          >
            {row.company}
          </span>
        );
      },
    },
    value: {
      id: "value",
      header: "Value",
      accessorKey: "value",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "value";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={editValue}
              onChange={(e) => updateOptimisticData(row.id, "value", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePendingChanges();
                else if (e.key === "Escape") cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  handleTabNavigation(row, "value");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => startEditing(row.id, "value", row.value)}
          >
            ${parseFloat(row.value).toLocaleString()}
          </span>
        );
      },
    },
    probability: {
      id: "probability",
      header: "Probability",
      accessorKey: "probability",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "probability";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="number"
              min="0"
              max="100"
              value={editValue}
              onChange={(e) => updateOptimisticData(row.id, "probability", parseInt(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePendingChanges();
                else if (e.key === "Escape") cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  handleTabNavigation(row, "probability");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => startEditing(row.id, "probability", row.probability)}
          >
            {row.probability}%
          </span>
        );
      },
    },
    closeDate: {
      id: "closeDate",
      header: "Close Date",
      accessorKey: "close_date",
      grow: 1,
      cell: (row) => {
        const isEditing = editingCell?.opportunityId === row.id && editingCell?.field === "close_date";
        return isEditing ? (
          <div ref={editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              type="date"
              value={editValue}
              onChange={(e) => updateOptimisticData(row.id, "close_date", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") savePendingChanges();
                else if (e.key === "Escape") cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  handleTabNavigation(row, "close_date");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => {
              const date = new Date(row.close_date);
              const formattedDate = date.toISOString().split("T")[0];
              startEditing(row.id, "close_date", formattedDate);
            }}
          >
            {new Date(row.close_date).toLocaleDateString()}
          </span>
        );
      },
    },
    createdAt: {
      id: "createdAt",
      header: "Created At",
      accessorKey: "created_at",
      grow: 1,
      cell: (row) => <span className="text-sm">{new Date(row.created_at).toLocaleDateString()}</span>,
    },
    actions: {
      id: "actions",
      header: "Actions",
      grow: 0,
      width: "100px",
      right: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          {editingCell?.opportunityId === row.id && hasPendingChanges && (
            <Button
              size="sm"
              variant="default"
              onClick={savePendingChanges}
              className="h-7"
            >
              Save
            </Button>
          )}
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
                  togglePin(row.id, row);
                }}
              >
                {isPinned(row.id) || row.pinned ? (
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
                  handleViewOpportunity(row);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteOpportunity(row);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  };

  // Return only the columns that are visible
  return visibleColumns.map((col) => columnMap[col.id]).filter(Boolean);
};
