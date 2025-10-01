import { baseApi } from "../baseApi";
import { ICreateOpportunityRequest, IOpportunity, IOptionalOpportunity } from "./opportunityTypes";

export interface PaginationMeta {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  offset: number;
}

const opportunityApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    opportunityTags: build.query<any, any>({
      query: (params) => ({
        url: "opportunity_tags",
        method: "GET",
        params,
      }),
    }),
    opportunityTagsById: build.query<any, any>({
      query: (id) => ({
        url: `opportunity_tags?opportunity_id=eq.${id}`,
        method: "GET",
      }),
    }),
    getOpportunities: build.query<
      { data: IOpportunity[]; pagination: PaginationMeta },
      any
    >({
      query: (params) => ({
        url: `opportunities?${params}&order=pinned.desc,created_at.desc`,
        method: "GET",
        headers: {
          Prefer: "count=exact",
        },
      }),
      transformResponse: (
        response: IOpportunity[],
        meta: {
          response?: { headers: { get: (key: string) => string | null } };
        },
        arg: string
      ): { data: IOpportunity[]; pagination: PaginationMeta } => {
        // meta contains headers when using fetchBaseQuery
        const contentRange = meta?.response?.headers.get("content-range");
        const totalCount = contentRange
          ? Number(contentRange.split("/")[1])
          : 0;

        // extract limit & offset from queryString to compute pagination
        const params = new URLSearchParams(arg);
        const limit = Number(params.get("limit") ?? 10);
        const offset = Number(params.get("offset") ?? 0);
        const currentPage = Math.floor(offset / limit) + 1;
        const totalPages = Math.ceil(totalCount / limit);

        return {
          data: response,
          pagination: {
            totalCount,
            currentPage,
            totalPages,
            limit,
            offset,
          },
        };
      },
        providesTags: (result) =>
    result?.data
      ? [
          // Tag each individual opportunity
          ...result.data.map(({ id }) => ({ type: "Opportunity" as const, id })),
          // Tag the list itself
          { type: "Opportunity", id: "LIST" },
        ]
      : [{ type: "Opportunity", id: "LIST" }],
    }),
    getOpportunityById: build.query<any, string>({
      query: (id) => ({ url: `opportunities?id=eq.${id}`, method: "GET" }),
      providesTags: (_res, _err, id) => [{ type: "Opportunity", id }],
    }),
    createOpportunity: build.mutation<any, ICreateOpportunityRequest>({
      query: (body) => ({ url: "opportunities", method: "POST", body }),
      invalidatesTags: ["Opportunity"],
    }),
    updateOpportunity: build.mutation<any, { id: string; body: IOptionalOpportunity }>({
      query: ({ id, body }) => ({
        url: `opportunities?id=eq.${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "Opportunity", id }],
    }),
    deleteOpportunity: build.mutation<any, string>({
      query: (id) => ({ url: `opportunities?id=eq.${id}`, method: "DELETE" }),
      invalidatesTags: ["Opportunity"],
    }),
  }),
});

export const {
  useOpportunityTagsQuery,
  useOpportunityTagsByIdQuery,
  useGetOpportunitiesQuery,
  useLazyGetOpportunitiesQuery,
  useGetOpportunityByIdQuery,
  useCreateOpportunityMutation,
  useUpdateOpportunityMutation,
  useDeleteOpportunityMutation,
} = opportunityApi;

// Example usage in a React component:
// const [login, { data, error, isLoading }] = useLoginMutation();
// const { data: userProfile, error: profileError } = useFetchUserProfileQuery();
