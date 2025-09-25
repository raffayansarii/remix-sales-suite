import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const customBaseQuery = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl:
      "https://c2p-crm-pgr.jollytree-b86081c8.westus.azurecontainerapps.io/", // TODO: Move to env variable
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    window.location.href = "/auth";
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["User", "Opportunity", "OpportunityTag", "Tag", "Tenant", "Kanban"],

  endpoints: () => ({}), // Empty endpoints, ready for injection
});
