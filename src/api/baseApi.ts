import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "@/config/api.config";

const AUTH_URL = API_CONFIG.AUTH_URL;
const API_URL = API_CONFIG.BASE_URL;

// helper: refresh token flow
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();

    // Save tokens back
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("expires_at", data.expires_at.toString());

    return data.access_token;
  } catch (err) {
    console.error("Failed to refresh token", err);
    return null;
  }
};

const customBaseQuery = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  // proactive check: is token expired (or about to expire)?
  const expiresAt = parseInt(localStorage.getItem("expires_at") || "0", 10);
  const now = Math.floor(Date.now() / 1000);

  if (expiresAt && now >= expiresAt - 60) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      localStorage.clear();
      window.location.href = "/auth";
      return { error: { status: 401, data: "Unauthorized" } };
    }
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  // fallback: if 401, try refresh once
  if (result.error && result.error.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      localStorage.clear();
      window.location.href = "/auth";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: [
    "User",
    "Opportunity",
    "OpportunityTag",
    "Tag",
    "Tenant",
    "Kanban",
    "Task",
  ],
  endpoints: () => ({}), // Empty endpoints, ready for injection
});
