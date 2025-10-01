import { baseApi } from "../../baseApi";
import {
  ApplyCustomFiltersRequest,
  CreateUserFilterRequest,
  DeleteUserFilterRequest,
  GetUserFiltersRequest,
  UpdateUserFilterRequest,
} from "./filtersTypes";

export const filtersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFilters: build.mutation<any, GetUserFiltersRequest>({
      query: (body) => ({
        url: "rpc/get_user_filters",
        method: "POST",
        body: {
          p_user_id: body.p_user_id,
          p_tenant_id: body.p_tenant_id,
        },
      }),
    }),
    createFilter: build.mutation<any, CreateUserFilterRequest>({
      query: (body) => ({
        url: "rpc/create_user_filter",
        method: "POST",
        body,
      }),
    }),
    updateFilter: build.mutation<any, UpdateUserFilterRequest>({
      query: (body) => ({
        url: "rpc/update_user_filter",
        method: "POST",
        body,
      }),
    }),
    deleteFilter: build.mutation<any, DeleteUserFilterRequest>({
      query: (body) => ({
        url: "rpc/delete_user_filter",
        method: "POST",
        body,
      }),
    }),
    applyCustomFilters: build.mutation<any, ApplyCustomFiltersRequest>({
      query: (body) => ({
        url: "rpc/apply_custom_filters",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetFiltersMutation,
  useCreateFilterMutation,
  useUpdateFilterMutation,
  useDeleteFilterMutation,
  useApplyCustomFiltersMutation,
} = filtersApi;
