import { LoginResponse } from "@/components/auth/authTypes";
import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "https://c2p-crm-auth.jollytree-b86081c8.westus.azurecontainerapps.io/token?grant_type=password",
        method: "POST",
        body: credentials,
      }),
    }),
    getCurrentUser: build.query<any, void>({
      query: () => ({
        url: "https://c2p-crm-auth.jollytree-b86081c8.westus.azurecontainerapps.io/user",
        method: "GET",
      }),
      // No tags needed as user data is usually fetched once on app load
    }),
    getAllUsers: build.query<any, void>({
      query: () => ({
        url: "https://c2p-crm-auth.jollytree-b86081c8.westus.azurecontainerapps.io/admin/users",
        method: "GET",
      }),
      // No tags needed as user data is usually fetched once on app load
    }),
  }),
});

export const { useLoginMutation, useGetCurrentUserQuery, useGetAllUsersQuery , useLazyGetAllUsersQuery } =
  authApi;
