import { baseApi } from "../baseApi";

export const tagsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTags: build.query<any, any>({
      query: (params) => ({ url: "tags", method: "GET", params }),
    }),
    getTagById: build.query<any, string>({
      query: (id) => ({ url: `tags?id=eq.${id}`, method: "GET" }),
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetTagByIdQuery,
} = tagsApi;
