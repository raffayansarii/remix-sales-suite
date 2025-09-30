import { baseApi } from "../baseApi";
import { Task } from "./tasksTypes";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<Task[], any>({
      query: (params) => ({
        url: `tasks?${params}&order=created_at.desc`,
        method: "GET",
        headers: {
          Prefer: "count=exact",
        },
      }),
    }),
    updateTasks: build.mutation<any, any>({
      query: ({ id, ...patch }) => ({
        url: `tasks?id=eq.${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),
  }),
});

export const { useGetTasksQuery, useUpdateTasksMutation } = tasksApi;
