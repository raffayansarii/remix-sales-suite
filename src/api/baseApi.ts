import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://vwpjpxlnvzhvabxidfkk.supabase.co/rest/v1/";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("apikey", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3cGpweGxudnpodmFieGlkZmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMTg4NDMsImV4cCI6MjA1Mjc5NDg0M30.j0KMz0TmEjLzFM2bKLDT-Iqzd9KT4Qax1fYxfh3cT40");
      headers.set("Content-Type", "application/json");
      headers.set("Prefer", "return=representation");
      return headers;
    },
  }),
  tagTypes: [
    "Opportunity",
    "Task",
    "User",
    "Tenant",
    "KanbanColumn",
    "KanbanCard",
    "Tag",
    "Kanban",
  ],
  endpoints: () => ({}),
});
