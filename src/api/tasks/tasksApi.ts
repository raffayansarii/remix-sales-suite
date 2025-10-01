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
      providesTags: ["Task"],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
        headers: {
          Prefer: "return=representation",
        },
      }),
      invalidatesTags: ["Task"],
    }),
    updateTasks: build.mutation<any, any>({
      query: ({ id, ...patch }) => ({
        url: `tasks?id=eq.${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTasksMutation } = tasksApi;
