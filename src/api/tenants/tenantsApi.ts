import { baseApi } from "../baseApi";
import { ITenant, PaginationMeta } from "./tenantsTypes";

export const tenantsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTenants: build.query<any, any>({
      query: (params) => ({
        url: "tenants",
        method: "GET",
        params,
        headers: {
          Prefer: "count=exact",
        },
      }),
      transformResponse: (
        response: ITenant[],
        meta: {
          response?: { headers: { get: (key: string) => string | null } };
        },
        arg: string
      ): { data: ITenant[]; pagination: PaginationMeta } => {
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
    }),
    getUserDetailsWithTenants: build.query<any, any>({
      query: (params) => ({
        url: "user_details_with_tenants",
        method: "GET",
        params,
      }),
    }),
    getUserTenantsDetails: build.query<any, string>({
      query: (userId) => ({
        url: `user_tenants_details?user_id=eq.${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTenantsQuery,
  useGetUserDetailsWithTenantsQuery,
  useGetUserTenantsDetailsQuery,
} = tenantsApi;
