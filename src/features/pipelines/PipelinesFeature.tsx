import { useEffect, useState } from "react";
import { Search, Kanban, Table, BarChart3, Plus, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ViewType } from "@/types/crm";
import { KanbanView } from "@/components/pipelines/KanbanView";
import { TableView } from "@/components/pipelines/TableView";
import { FilterDrawer } from "@/components/pipelines/FilterDrawer";
import { PipelineAnalytics } from "@/components/pipelines/PipelineAnalytics";
import {
  useCreateOpportunityMutation,
  useGetOpportunitiesQuery,
} from "@/api/opportunity/opportunityApi";
import { IOpportunity } from "@/api/opportunity/opportunityTypes";
import { CreateOpportunityModal } from "@/components/pipelines/CreateOpportunityModal";
import { ContentLoader } from "@/components/ui/content-loader";
import { OpportunityFormData } from "@/components/pipelines/types-and-schemas";

function isPaginatedData(
  data: any
): data is { items: IOpportunity[]; totalCount: number } {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.items) &&
    typeof data.totalCount === "number"
  );
}

export function PipelinesFeature() {
  const [viewType, setViewType] = useState<ViewType>("table");
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  // TODO: Replace with API call - GET /api/opportunities with real-time updates
  const [opportunities, setOpportunities] = useState<IOpportunity[]>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilters, setActiveFilters] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Build query string for search, filters, and pagination
  const queryParts = [];
  if (searchTerm) queryParts.push(`company=ilike.%${searchTerm}%`);
  if (activeFilters) queryParts.push(activeFilters);
  queryParts.push(`limit=${rowsPerPage}`);
  queryParts.push(`offset=${(currentPage - 1) * rowsPerPage}`);
  const queryString = queryParts.join("&");

  // API Calls
  const { data, isLoading, isFetching, isError, error } =
    useGetOpportunitiesQuery(queryString);
  
  const [createHandler , createStatus] = useCreateOpportunityMutation();

  useEffect(() => {
    if (data?.data) {
      if (Array.isArray(data?.data)) {
        setOpportunities(data?.data);
        setTotalCount(data?.pagination.totalCount);
      } else if (isPaginatedData(data)) {
        setOpportunities(
          (data as { items: IOpportunity[]; totalCount: number }).items
        );
        setTotalCount(
          (data as { items: IOpportunity[]; totalCount: number }).totalCount
        );
      } else {
        setOpportunities([]);
        setTotalCount(0);
      }
    }
  }, [data]);

  const handleOpportunityUpdate = (updatedOpportunity: IOpportunity) => {
    // TODO: Replace with actual API call to backend
    // PUT /api/opportunities/:id
    console.log(
      "🔄 [API CALL] PUT /api/opportunities/" + updatedOpportunity.id,
      updatedOpportunity
    );
    console.log("✅ [PIPELINES] Opportunity updated successfully");
  };

  const handleOpportunityDelete = (opportunityId: string) => {
    // TODO: Replace with actual API call to backend
    // DELETE /api/opportunities/:id
    console.log("🗑️ [API CALL] DELETE /api/opportunities/" + opportunityId);
  };

  const onCreateOpportunityHandler = (
    newOpportunity: OpportunityFormData
  ) => {

    createHandler(newOpportunity).unwrap().then((res)=>{
      console.log("✅ [PIPELINES] Opportunity created successfully");
      setIsCreateModalOpen(false);
    }).catch((err)=>{
      console.error("❌ [PIPELINES] Failed to create opportunity", err);
    });

  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(rawSearchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [rawSearchTerm]);

  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-muted/30 ">
        {/* Header Section */}
        <div className="bg-background border-b p-4 sm:p-6 shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4 sm:mb-6">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                Opportunity Pipelines
              </h1>
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
                  value={rawSearchTerm}
                  onChange={(e) => {
                    setRawSearchTerm(e.target.value);
                  }}
                  className="pl-10 bg-background text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={activeFilters.length > 0 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="gap-2 relative shrink-0"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFilters.length > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {activeFilters.length}
                    </Badge>
                  )}
                </Button>
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveFilters("");
                      setCurrentPage(1);
                    }}
                    className="gap-1 shrink-0"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={viewType === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("kanban")}
                className="gap-2"
              >
                <Kanban className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </Button>
              <Button
                variant={viewType === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("table")}
                className="gap-2"
              >
                <Table className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
            </div>
          </div>
        </div>
        {isLoading || isFetching ? (
          <ContentLoader />
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center h-full min-h-[300px]">
            <span className="text-destructive text-base">
              Failed to load opportunities.{" "}
              {error && (error as any).message ? (error as any).message : ""}
            </span>
          </div>
        ) : !data?.data?.length ? (
          <div className="flex flex-1 items-center justify-center h-full min-h-[300px]">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">
                No opportunities found
              </h2>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters.
              </p>
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
        ) : (
          // Main Content Area
          <div className="flex-1 overflow-auto ">
            {showAnalytics ? (
              <PipelineAnalytics
                opportunities={opportunities as IOpportunity[]}
              />
            ) : viewType === "kanban" ? (
              <KanbanView
                opportunities={opportunities as IOpportunity[]}
                onOpportunityUpdate={handleOpportunityUpdate}
                onOpportunityDelete={handleOpportunityDelete}
              />
            ) : (
              <TableView
                opportunities={opportunities || []}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}
        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          onApplyFilters={setActiveFilters}
          activeFilters={""}
        />
        <CreateOpportunityModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={onCreateOpportunityHandler}
          status={createStatus}
        />
      </div>
    </>
  );
}
