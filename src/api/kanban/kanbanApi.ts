import { string } from "zod";
import { baseApi } from "../baseApi";

export const kanbanApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    moveOpportunityToStage: build.mutation<
      any,
      {
        p_opportunity_id: string;
        p_new_stage: string;
        p_tenant_id: string;
        p_user_id: string;
      }
    >({
      query: (body) => ({
        url: "rpc/move_opportunity_to_stage",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Opportunity", id: "LIST" },
        { type: "Kanban", id: "LIST" },
      ],
    }),
    searchKanbanOpportunities: build.query<any, { search: string }>({
      query: (body) => ({
        url: "rpc/search_kanban_opportunities",
        method: "POST",
        body,
      }),
      providesTags: [{ type: "Kanban", id: "LIST" }],
    }),
    getKanbanData: build.query<any, void>({
      query: () => ({ url: "rpc/get_kanban_data", method: "POST" }),
      providesTags: [{ type: "Kanban", id: "LIST" }],
    }),
  }),
});

export const {
  useMoveOpportunityToStageMutation,
  useSearchKanbanOpportunitiesQuery,
  useGetKanbanDataQuery,
} = kanbanApi;
