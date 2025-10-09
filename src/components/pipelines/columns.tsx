/**
 * Opportunity Table Columns
 * 
 * This file defines the column configurations for the opportunities table.
 * Uses the EditableDataTable component for inline editing functionality.
 */

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
import { MoreHorizontal, Eye, Pin, PinOff, Trash2 } from "lucide-react";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { EditableColumnDef, EditingContext } from "@/components/ui/editable-data-table";
import { ColumnDefinition } from "@/hooks/useColumnManager";

/**
 * Additional context for opportunity-specific actions
 * (These are not part of the editing context but specific to this table)
 */
export interface OpportunityActionsContext {
  handleViewOpportunity: (opportunity: IOpportunity) => void;
  handleDeleteOpportunity: (opportunity: IOpportunity) => void;
  togglePin: (id: string, opportunity: IOpportunity) => void;
  isPinned: (id: string) => boolean;
  visibleColumns: ColumnDefinition[];
}

/**
 * Creates column definitions for the opportunities table
 * 
 * @param actionsContext - Context containing action handlers (view, delete, pin)
 * @returns Array of column definitions ordered by: editable -> non-editable -> actions
 */
export const createOpportunityColumns = (actionsContext: OpportunityActionsContext): EditableColumnDef<IOpportunity>[] => {
  const {
    handleViewOpportunity,
    handleDeleteOpportunity,
    togglePin,
    isPinned,
    visibleColumns,
  } = actionsContext;

  // All available columns with their configurations
  const columnMap: Record<string, EditableColumnDef<IOpportunity>> = {
    title: {
      id: "title",
      header: "Title",
      accessorKey: "title",
      grow: 2,
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "title";
        return (
          <div>
            {isEditing ? (
              <div ref={context.editingContainerRef} className="flex items-center gap-2">
                <Input
                  ref={context.inputRef}
                  value={context.editValue}
                  onChange={(e) => context.updateOptimisticData(row.id, "title", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") context.savePendingChanges();
                    else if (e.key === "Escape") context.cancelEditing();
                    else if (e.key === "Tab") {
                      e.preventDefault();
                      context.handleTabNavigation(row, "title");
                    }
                  }}
                  className="h-8"
                />
              </div>
            ) : (
              <div
                className="cursor-pointer p-1 rounded"
                onClick={() => context.startEditing(row.id, "title", row.title)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "stage";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Select
              value={context.editValue}
              onValueChange={(value) => context.updateOptimisticData(row.id, "stage", value)}
            >
              <SelectTrigger className="h-8 w-full" onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  context.handleTabNavigation(row, 'stage');
                }
              }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  context.handleTabNavigation(row, 'stage');
                }
              }}>
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
            onClick={() => context.startEditing(row.id, "stage", row.stage)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "award_type";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Select
              value={context.editValue}
              onValueChange={(value) => context.updateOptimisticData(row.id, "award_type", value)}
            >
              <SelectTrigger className="h-8 w-full" onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  context.handleTabNavigation(row, 'award_type');
                }
              }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  e.preventDefault();
                  context.handleTabNavigation(row, 'award_type');
                }
              }}>
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
            onClick={() => context.startEditing(row.id, "award_type", row.award_type)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "agency";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={context.inputRef}
              value={context.editValue}
              onChange={(e) => context.updateOptimisticData(row.id, "agency", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") context.savePendingChanges();
                else if (e.key === "Escape") context.cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  context.handleTabNavigation(row, "agency");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => context.startEditing(row.id, "agency", row.agency)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "solicitation";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={context.inputRef}
              value={context.editValue}
              onChange={(e) => context.updateOptimisticData(row.id, "solicitation", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") context.savePendingChanges();
                else if (e.key === "Escape") context.cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  context.handleTabNavigation(row, "solicitation");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm text-primary underline cursor-pointer p-1 rounded"
            onClick={() => context.startEditing(row.id, "solicitation", row.solicitation)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "company";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={context.inputRef}
              value={context.editValue}
              onChange={(e) => context.updateOptimisticData(row.id, "company", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") context.savePendingChanges();
                else if (e.key === "Escape") context.cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  context.handleTabNavigation(row, "company");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => context.startEditing(row.id, "company", row.company)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "value";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={context.inputRef}
              value={context.editValue}
              onChange={(e) => context.updateOptimisticData(row.id, "value", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") context.savePendingChanges();
                else if (e.key === "Escape") context.cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  context.handleTabNavigation(row, "value");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => context.startEditing(row.id, "value", row.value)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "probability";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={context.inputRef}
              type="number"
              min="0"
              max="100"
              value={context.editValue}
              onChange={(e) => context.updateOptimisticData(row.id, "probability", parseInt(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") context.savePendingChanges();
                else if (e.key === "Escape") context.cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  context.handleTabNavigation(row, "probability");
                }
              }}
              className="h-8"
            />
          </div>
        ) : (
          <span
            className="text-sm cursor-pointer p-1 rounded block"
            onClick={() => context.startEditing(row.id, "probability", row.probability)}
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
      cell: (row, context: EditingContext<IOpportunity>) => {
        const isEditing = context.editingCell?.rowId === row.id && context.editingCell?.field === "close_date";
        return isEditing ? (
          <div ref={context.editingContainerRef} className="flex items-center gap-2">
            <Input
              ref={context.inputRef}
              type="date"
              value={context.editValue}
              onChange={(e) => context.updateOptimisticData(row.id, "close_date", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") context.savePendingChanges();
                else if (e.key === "Escape") context.cancelEditing();
                else if (e.key === "Tab") {
                  e.preventDefault();
                  context.handleTabNavigation(row, "close_date");
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
              context.startEditing(row.id, "close_date", formattedDate);
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
      cell: (row, context: EditingContext<IOpportunity>) => (
        <div className="flex items-center gap-2">
          {context.editingCell?.rowId === row.id && context.hasPendingChanges && (
            <Button
              size="sm"
              variant="default"
              onClick={() => context.savePendingChanges()}
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

  // Define column order: editable first, then non-editable, actions last
  const editableColumnIds = ['title', 'stage', 'awardType', 'agency', 'solicitation', 'company', 'value', 'probability', 'closeDate'];
  // Return only the columns that are visible, preserving the configured order
  return visibleColumns.map((col) => columnMap[col.id]).filter(Boolean);
};
