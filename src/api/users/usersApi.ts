import { baseApi } from "../baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<any[], any>({
      query: (params) => ({ url: "users", method: "GET", params }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "User" as const, id })), { type: "User", id: "LIST" }]
          : [{ type: "User", id: "LIST" }],
    }),
    getUserById: build.query<any, string>({
      query: (id) => ({ url: `users?id=eq.${id}`, method: "GET" }),
      providesTags: (_res, _err, id) => [{ type: "User", id }],
    }),
    createUser: build.mutation<any, any>({
      query: (body) => ({ url: "users", method: "POST", body }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: build.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({ url: `users?id=eq.${id}`, method: "PATCH", body }),
      invalidatesTags: (_res, _err, { id }) => [{ type: "User", id }],
    }),
    deleteUser: build.mutation<any, string>({
      query: (id) => ({ url: `users?id=eq.${id}`, method: "DELETE" }),
      invalidatesTags: (_res, _err, id) => [{ type: "User", id }, { type: "User", id: "LIST" }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
