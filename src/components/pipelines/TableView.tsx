import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  Eye,
  Edit,
  MoreHorizontal,
  Pin,
  PinOff,
  Palette,
  Settings,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useRef, useEffect } from "react";
import { usePinnedItems, PIN_COLORS, PinColor } from "@/hooks/usePinnedItems";
import { useColumnManager } from "@/hooks/useColumnManager";
import { ColumnManagerModal } from "./ColumnManagerModal";
import { CreateColumnButton } from "./CreateColumnButton";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { TableViewProps } from "./types-and-schemas";
import { useDeleteOpportunityMutation, useUpdateOpportunityMutation } from "@/api/opportunity/opportunityApi";
import { DeleteModal } from "../ui/delete-modal";
import { OpportunityDetailModal } from "./OpportunityDetailModal";

export function TableView({
  opportunities,
  currentPage,
  rowsPerPage,
  totalCount,
  onPageChange,
}: TableViewProps) {

  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<IOpportunity | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] =
    useState<IOpportunity | null>(null);
  const [editingCell, setEditingCell] = useState<{
    opportunityId: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const columnManager = useColumnManager();
  const { togglePin, isPinned } = usePinnedItems<IOpportunity>();

  const handleViewOpportunity = (opportunity: IOpportunity) => {
    setSelectedOpportunity(opportunity);
    setViewModalOpen(true);
  };

  const startEditing = (opportunityId: string, field: string, currentValue: any) => {
    setEditingCell({ opportunityId, field });
    setEditValue(currentValue?.toString() || "");
  };

  const cancelEditing = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const saveEdit = async (opportunity: IOpportunity, field: string, value: any) => {
    try {
      await updateTrigger({
        id: opportunity.id,
        body: { [field]: value },
      }).unwrap();
      
      toast({
        title: "Success",
        description: "Opportunity updated successfully",
      });
      
      setEditingCell(null);
      setEditValue("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update opportunity",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleDeleteOpportunity = (opportunity: IOpportunity) => {
    setOpportunityToDelete(opportunity);
    setDeleteModalOpen(true);
  };

    const confirmDeleteOpportunity = async () => {
    if (opportunityToDelete) {
      console.log("Deleting opportunity:", opportunityToDelete);
      deleteTrigger(opportunityToDelete.id)
        .unwrap()
        .then(() => {
          setDeleteModalOpen(false);
          setOpportunityToDelete(null);
        })
        .catch(() => {
          // Handle error (optional)
        });
      // Add your delete API call here
    }
  };


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
    return (
      awardTypeColors[awardType as keyof typeof awardTypeColors] || "bg-muted"
    );
  };

  const totalPages = Math.ceil(totalCount / rowsPerPage);
  const [updateTrigger, updateStatus] = useUpdateOpportunityMutation();
  const [deleteTrigger, deleteStatus] = useDeleteOpportunityMutation();
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Opportunities</h2>
        <div className="flex items-center gap-2">
          <CreateColumnButton />
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
      </div>

      <div className="bg-background rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              {columnManager.visibleColumns.map((column) => (
                <TableHead key={column.id} className="font-semibold">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {opportunities.map((opportunity) => (
              <TableRow
                key={opportunity.id}
                className={` ${
                  opportunity.pinned
                    ? "bg-yellow-50 dark:bg-yellow-950/30 hover:bg-yellow-100"
                    : "hover:bg-muted/50"
                }`}
              >
                {columnManager.visibleColumns.map((column) => {
                  const renderCellContent = () => {
                    switch (column.id) {
                      case "title":
                        const isEditingTitle = editingCell?.opportunityId === opportunity.id && editingCell?.field === "title";
                        return (
                          <div>
                            {isEditingTitle ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  ref={inputRef}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      saveEdit(opportunity, "title", editValue);
                                    } else if (e.key === "Escape") {
                                      cancelEditing();
                                    }
                                  }}
                                  className="h-8"
                                />
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={() => saveEdit(opportunity, "title", editValue)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={cancelEditing}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer hover:bg-muted/50 p-1 rounded"
                                onDoubleClick={() => startEditing(opportunity.id, "title", opportunity.title)}
                              >
                                <div className="font-medium text-sm">
                                  {opportunity.title}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {opportunity.company}
                                </div>
                                {opportunity?.tags?.length > 0 && (
                                  <div className="flex gap-1 mt-1">
                                    {opportunity?.tags?.slice(0, 2).map((tag) => (
                                      <Badge
                                        key={tag.id}
                                        variant="secondary"
                                        className="text-xs shadow"
                                        style={{ color: `${tag.color}` }}
                                      >
                                        {tag.name}
                                      </Badge>
                                    ))}
                                    {opportunity.tags.length > 2 && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        +{opportunity.tags.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      case "stage":
                        const isEditingStage = editingCell?.opportunityId === opportunity.id && editingCell?.field === "stage";
                        return isEditingStage ? (
                          <div className="flex items-center gap-2">
                            <Select
                              value={editValue}
                              onValueChange={(value) => {
                                setEditValue(value);
                                saveEdit(opportunity, "stage", value);
                              }}
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
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            className={`${getStageColor(opportunity.stage)} border-0 cursor-pointer`}
                            onClick={() => startEditing(opportunity.id, "stage", opportunity.stage)}
                          >
                            {opportunity.stage}
                          </Badge>
                        );
                      case "awardType":
                        const isEditingAwardType = editingCell?.opportunityId === opportunity.id && editingCell?.field === "award_type";
                        return isEditingAwardType ? (
                          <div className="flex items-center gap-2">
                            <Select
                              value={editValue}
                              onValueChange={(value) => {
                                setEditValue(value);
                                saveEdit(opportunity, "award_type", value);
                              }}
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
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Badge
                            className={`${getAwardTypeColor(opportunity.award_type)} border-0 text-xs cursor-pointer`}
                            onClick={() => startEditing(opportunity.id, "award_type", opportunity.award_type)}
                          >
                            {opportunity.award_type}
                          </Badge>
                        );
                      case "agency":
                        const isEditingAgency = editingCell?.opportunityId === opportunity.id && editingCell?.field === "agency";
                        return isEditingAgency ? (
                          <div className="flex items-center gap-2">
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEdit(opportunity, "agency", editValue);
                                } else if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              className="h-8"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => saveEdit(opportunity, "agency", editValue)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block"
                            onDoubleClick={() => startEditing(opportunity.id, "agency", opportunity.agency)}
                          >
                            {opportunity.agency}
                          </span>
                        );
                      case "solicitation":
                        const isEditingSolicitation = editingCell?.opportunityId === opportunity.id && editingCell?.field === "solicitation";
                        return isEditingSolicitation ? (
                          <div className="flex items-center gap-2">
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEdit(opportunity, "solicitation", editValue);
                                } else if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              className="h-8"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => saveEdit(opportunity, "solicitation", editValue)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="text-sm text-primary underline cursor-pointer hover:text-primary/80"
                            onDoubleClick={() => startEditing(opportunity.id, "solicitation", opportunity.solicitation)}
                          >
                            {opportunity.solicitation}
                          </span>
                        );
                      case "company":
                        const isEditingCompany = editingCell?.opportunityId === opportunity.id && editingCell?.field === "company";
                        return isEditingCompany ? (
                          <div className="flex items-center gap-2">
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEdit(opportunity, "company", editValue);
                                } else if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              className="h-8"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => saveEdit(opportunity, "company", editValue)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block"
                            onDoubleClick={() => startEditing(opportunity.id, "company", opportunity.company)}
                          >
                            {opportunity.company}
                          </span>
                        );
                      case "value":
                        const isEditingValue = editingCell?.opportunityId === opportunity.id && editingCell?.field === "value";
                        return isEditingValue ? (
                          <div className="flex items-center gap-2">
                            <Input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEdit(opportunity, "value", editValue);
                                } else if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              className="h-8"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => saveEdit(opportunity, "value", editValue)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block"
                            onDoubleClick={() => startEditing(opportunity.id, "value", opportunity.value)}
                          >
                            ${opportunity.value.toLocaleString()}
                          </span>
                        );
                      case "probability":
                        const isEditingProbability = editingCell?.opportunityId === opportunity.id && editingCell?.field === "probability";
                        return isEditingProbability ? (
                          <div className="flex items-center gap-2">
                            <Input
                              ref={inputRef}
                              type="number"
                              min="0"
                              max="100"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEdit(opportunity, "probability", parseInt(editValue));
                                } else if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              className="h-8"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => saveEdit(opportunity, "probability", parseInt(editValue))}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block"
                            onDoubleClick={() => startEditing(opportunity.id, "probability", opportunity.probability)}
                          >
                            {opportunity.probability}%
                          </span>
                        );
                      case "closeDate":
                        const isEditingCloseDate = editingCell?.opportunityId === opportunity.id && editingCell?.field === "close_date";
                        return isEditingCloseDate ? (
                          <div className="flex items-center gap-2">
                            <Input
                              ref={inputRef}
                              type="date"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEdit(opportunity, "close_date", editValue);
                                } else if (e.key === "Escape") {
                                  cancelEditing();
                                }
                              }}
                              className="h-8"
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => saveEdit(opportunity, "close_date", editValue)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={cancelEditing}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <span
                            className="text-sm cursor-pointer hover:bg-muted/50 p-1 rounded block"
                            onDoubleClick={() => {
                              const date = new Date(opportunity.close_date);
                              const formattedDate = date.toISOString().split('T')[0];
                              startEditing(opportunity.id, "close_date", formattedDate);
                            }}
                          >
                            {new Date(opportunity.close_date).toLocaleDateString()}
                          </span>
                        );
                      case "createdAt":
                        return (
                          <span className="text-sm">
                            {new Date(
                              opportunity.created_at
                            ).toLocaleDateString()}
                          </span>
                        );
                      case "actions":
                        return (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-background border shadow-lg z-50"
                            >
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePin(opportunity.id, opportunity);
                                }}
                              >
                                {isPinned(opportunity.id) ||
                                opportunity.pinned ? (
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
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteOpportunity(opportunity);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ); // Server-side: actions handled elsewhere
                      default:
                        return column.field ? (
                          <span className="text-sm">
                            {(opportunity as any)[column.field]}
                          </span>
                        ) : null;
                    }
                  };
                  return (
                    <TableCell key={column.id}>{renderCellContent()}</TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalCount === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No opportunities found matching your search criteria.</p>
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center py-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => onPageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      onPageChange(Math.min(totalPages, currentPage + 1))
                    }
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <ColumnManagerModal
        open={columnModalOpen}
        onOpenChange={setColumnModalOpen}
        columnManager={columnManager}
      />
     {viewModalOpen && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          onDelete={(opportunityId) => {
            handleDeleteOpportunity(selectedOpportunity);
          }}
        />
      )}
       <DeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Opportunity"
        itemName={opportunityToDelete?.title}
        onConfirm={confirmDeleteOpportunity}
        loading={deleteStatus.isLoading}
      />
    </div>
  );
}