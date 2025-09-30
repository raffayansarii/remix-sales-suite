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
import { useState } from "react";
import { usePinnedItems, PIN_COLORS, PinColor } from "@/hooks/usePinnedItems";
import { useColumnManager } from "@/hooks/useColumnManager";
import { ColumnManagerModal } from "./ColumnManagerModal";
import { CreateColumnButton } from "./CreateColumnButton";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { TableViewProps } from "./types-and-schemas";
import { EditOpportunityModal } from "./EditOpportunityModal";
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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] =
    useState<IOpportunity | null>(null);

  const columnManager = useColumnManager();
  const { togglePin, isPinned } = usePinnedItems<IOpportunity>();

  const handleViewOpportunity = (
    opportunity: IOpportunity,
    mode: "view" | "edit"
  ) => {
    setSelectedOpportunity(opportunity);
    mode === "view" ? setViewModalOpen(true) : setDetailModalOpen(true);
  };

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
                        return (
                          <div>
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
                        );
                      case "stage":
                        return (
                          <Badge
                            className={`${getStageColor(
                              opportunity.stage
                            )} border-0`}
                          >
                            {opportunity.stage}
                          </Badge>
                        );
                      case "awardType":
                        return (
                          <Badge
                            className={`${getAwardTypeColor(
                              opportunity.award_type
                            )} border-0 text-xs`}
                          >
                            {opportunity.award_type}
                          </Badge>
                        );
                      case "agency":
                        return (
                          <span className="text-sm">{opportunity.agency}</span>
                        );
                      case "solicitation":
                        return (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-primary hover:text-primary-hover text-sm underline"
                            onClick={() => {
                              /* Handle edit */
                            }}
                          >
                            {opportunity.solicitation}
                          </Button>
                        );
                      case "company":
                        return (
                          <span className="text-sm">{opportunity.company}</span>
                        );
                      case "value":
                        return (
                          <span className="text-sm">
                            ${opportunity.value.toLocaleString()}
                          </span>
                        );
                      case "probability":
                        return (
                          <span className="text-sm">
                            {opportunity.probability}%
                          </span>
                        );
                      case "closeDate":
                        return (
                          <span className="text-sm">
                            {new Date(
                              opportunity.close_date
                            ).toLocaleDateString()}
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
                                  handleViewOpportunity(opportunity, "view");
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOpportunity(opportunity, "edit");
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
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
      {detailModalOpen && (
        <EditOpportunityModal
          isOpen
          onClose={() => setDetailModalOpen(false)}
          onSubmit={(data) => {
            updateTrigger({
              id: selectedOpportunity.id,
              body: data,
            })
              .unwrap()
              .then(() => {
                setDetailModalOpen(false);
              })
              .catch(() => {});
          }}
          status={updateStatus}
          initialData={{
            ...selectedOpportunity,
            value: selectedOpportunity.value.toString(),
          }}
        />
      )}
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
import { useState } from "react";
import { usePinnedItems, PIN_COLORS, PinColor } from "@/hooks/usePinnedItems";
import { useColumnManager } from "@/hooks/useColumnManager";
import { ColumnManagerModal } from "./ColumnManagerModal";
import { CreateColumnButton } from "./CreateColumnButton";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";
import { TableViewProps } from "./types-and-schemas";
import { EditOpportunityModal } from "./EditOpportunityModal";
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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [opportunityToDelete, setOpportunityToDelete] =
    useState<IOpportunity | null>(null);

  const columnManager = useColumnManager();
  const { togglePin, isPinned } = usePinnedItems<IOpportunity>();

  const handleViewOpportunity = (
    opportunity: IOpportunity,
    mode: "view" | "edit"
  ) => {
    setSelectedOpportunity(opportunity);
    mode === "view" ? setViewModalOpen(true) : setDetailModalOpen(true);
  };

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
                        return (
                          <div>
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
                        );
                      case "stage":
                        return (
                          <Badge
                            className={`${getStageColor(
                              opportunity.stage
                            )} border-0`}
                          >
                            {opportunity.stage}
                          </Badge>
                        );
                      case "awardType":
                        return (
                          <Badge
                            className={`${getAwardTypeColor(
                              opportunity.award_type
                            )} border-0 text-xs`}
                          >
                            {opportunity.award_type}
                          </Badge>
                        );
                      case "agency":
                        return (
                          <span className="text-sm">{opportunity.agency}</span>
                        );
                      case "solicitation":
                        return (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-primary hover:text-primary-hover text-sm underline"
                            onClick={() => {
                              /* Handle edit */
                            }}
                          >
                            {opportunity.solicitation}
                          </Button>
                        );
                      case "company":
                        return (
                          <span className="text-sm">{opportunity.company}</span>
                        );
                      case "value":
                        return (
                          <span className="text-sm">
                            ${opportunity.value.toLocaleString()}
                          </span>
                        );
                      case "probability":
                        return (
                          <span className="text-sm">
                            {opportunity.probability}%
                          </span>
                        );
                      case "closeDate":
                        return (
                          <span className="text-sm">
                            {new Date(
                              opportunity.close_date
                            ).toLocaleDateString()}
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
                                  handleViewOpportunity(opportunity, "view");
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewOpportunity(opportunity, "edit");
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
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
      {detailModalOpen && (
        <EditOpportunityModal
          isOpen
          onClose={() => setDetailModalOpen(false)}
          onSubmit={(data) => {
            updateTrigger({
              id: selectedOpportunity.id,
              body: data,
            })
              .unwrap()
              .then(() => {
                setDetailModalOpen(false);
              })
              .catch(() => {});
          }}
          status={updateStatus}
          initialData={{
            ...selectedOpportunity,
            value: selectedOpportunity.value.toString(),
          }}
        />
      )}
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
