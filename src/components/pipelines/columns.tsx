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

const getStageColor = (stage: string) => {
  const stageColors = {
    Lead: "bg-stage-lead text-white",
    Qualified: "bg-stage-qualified text-white",
    Proposal: "bg-stage-proposal text-white",
    Negotiation: "bg-stage-negotiation text-white",
    "Closed Won": "bg-stage-won text-white",
  };
  return stageColors[stage as keyof typeof stageColors] || "bg-muted";
};

const getAwardTypeColor = (awardType: string) => {
  const awardTypeColors = {
    Contract: "bg-primary text-primary-foreground",
    Grant: "bg-success text-success-foreground",
    "Cooperative Agreement": "bg-warning text-warning-foreground",
    "Purchase Order": "bg-muted text-muted-foreground",
  };
  return awardTypeColors[awardType as keyof typeof awardTypeColors] || "bg-muted";
};

export interface OpportunityColumnsContext {
  editingCell: { opportunityId: string; field: string } | null;
  editValue: string;
  setEditValue: (value: string) => void;
  startEditing: (opportunityId: string, field: string, currentValue: any) => void;
  cancelEditing: () => void;
  saveEdit: (opportunity: IOpportunity, field: string, value: any) => void;
  handleViewOpportunity: (opportunity: IOpportunity) => void;
  handleDeleteOpportunity: (opportunity: IOpportunity) => void;
  togglePin: (id: string, opportunity: IOpportunity) => void;
  isPinned: (id: string) => boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  visibleColumns: Array<{ id: string; label: string; field?: string }>;
}

export const createOpportunityColumns = (
  context: OpportunityColumnsContext
): ColumnDef<IOpportunity>[] => {
  const {
    editingCell,
    editValue,
    setEditValue,
    startEditing,
    cancelEditing,
    saveEdit,
    handleViewOpportunity,
    handleDeleteOpportunity,
    togglePin,
    isPinned,
    inputRef,
    visibleColumns,
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
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(row, "title", editValue);
                    else if (e.key === "Escape") cancelEditing();
                  }}
                  className="h-8"
                />
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(row, "title", editValue)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="cursor-pointer hover:bg-muted/50 p-1 rounded" onDoubleClick={() => startEditing(row.id, "title", row.title)}>
                <div className="font-medium text-sm">{row.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{row.company}</div>
                {row?.tags?.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {row.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs shadow" style={{ color: tag.color }}>
                        {tag.name}
                      </Badge>
                    ))}
                    {row.tags.length > 2 && <Badge variant="secondary" className="text-xs">+{row.tags.length - 2}</Badge>}
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
          <div className="flex items-center gap-2">
            <Select value={editValue} onValueChange={(value) => { setEditValue(value); saveEdit(row, "stage", value); }}>
              <SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal">Proposal</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Closed Won">Closed Won</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Badge className={`${getStageColor(row.stage)} border-0 cursor-pointer`} onClick={() => startEditing(row.id, "stage", row.stage)}>
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
          <div className="flex items-center gap-2">
            <Select value={editValue} onValueChange={(value) => { setEditValue(value); saveEdit(row, "award_type", value); }}>
              <SelectTrigger className="h-8 w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Grant">Grant</SelectItem>
                <SelectItem value="Cooperative Agreement">Cooperative Agreement</SelectItem>
                <SelectItem value="Purchase Order">Purchase Order</SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Badge className={`${getAwardTypeColor(row.award_type)} border-0 text-xs cursor-pointer`} onClick={() => startEditing(row.id, "award_type", row.award_type)}>
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
          <div className="flex items-center gap-2">
            <Input ref={inputRef} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(row, "agency", editValue);
              else if (e.key === "Escape") cancelEditing();
            }} className="h-8" />
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(row, "agency", editValue)}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block" onDoubleClick={() => startEditing(row.id, "agency", row.agency)}>
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
          <div className="flex items-center gap-2">
            <Input ref={inputRef} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(row, "solicitation", editValue);
              else if (e.key === "Escape") cancelEditing();
            }} className="h-8" />
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(row, "solicitation", editValue)}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm text-primary underline cursor-pointer hover:text-primary/80" onDoubleClick={() => startEditing(row.id, "solicitation", row.solicitation)}>
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
          <div className="flex items-center gap-2">
            <Input ref={inputRef} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(row, "company", editValue);
              else if (e.key === "Escape") cancelEditing();
            }} className="h-8" />
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(row, "company", editValue)}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block" onDoubleClick={() => startEditing(row.id, "company", row.company)}>
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
          <div className="flex items-center gap-2">
            <Input ref={inputRef} value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(row, "value", editValue);
              else if (e.key === "Escape") cancelEditing();
            }} className="h-8" />
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(row, "value", editValue)}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block" onDoubleClick={() => startEditing(row.id, "value", row.value)}>
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
          <div className="flex items-center gap-2">
            <Input ref={inputRef} type="number" min="0" max="100" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(row, "probability", parseInt(editValue));
              else if (e.key === "Escape") cancelEditing();
            }} className="h-8" />
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(row, "probability", parseInt(editValue))}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block" onDoubleClick={() => startEditing(row.id, "probability", row.probability)}>
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
          <div className="flex items-center gap-2">
            <Input ref={inputRef} type="date" value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") saveEdit(row, "close_date", editValue);
              else if (e.key === "Escape") cancelEditing();
            }} className="h-8" />
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => saveEdit(row, "close_date", editValue)}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={cancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block" onDoubleClick={() => {
            const date = new Date(row.close_date);
            const formattedDate = date.toISOString().split('T')[0];
            startEditing(row.id, "close_date", formattedDate);
          }}>
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
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
            <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); togglePin(row.id, row); }}>
              {isPinned(row.id) || row.pinned ? (
                <><PinOff className="mr-2 h-4 w-4" />Unpin</>
              ) : (
                <><Pin className="mr-2 h-4 w-4" />Pin to top</>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleViewOpportunity(row); }}>
              <Eye className="mr-2 h-4 w-4" />View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteOpportunity(row); }}>
              <Trash2 className="mr-2 h-4 w-4" />Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  };

  // Return only the columns that are visible
  return visibleColumns.map((col) => columnMap[col.id]).filter(Boolean);
};
