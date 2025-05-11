// src/redux/api/quizApi.ts
import { apiSlice } from "../api/apiSlice";

export const quizApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new quiz
    createQuiz: builder.mutation({
      query: (data) => ({
        url: "create-quiz",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),

    // Get all quizzes
    getQuizzes: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Delete a quiz
    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),

    // Update a quiz
    updateQuiz: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
    }),

    // Get a single quiz
    getQuizById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Save quiz result
    saveQuizResult: builder.mutation({
      query: (data) => ({
        url: "/quiz-result",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateQuizMutation,
  useGetQuizzesQuery,
  useDeleteQuizMutation,
  useUpdateQuizMutation,
  useGetQuizByIdQuery,
  useSaveQuizResultMutation,
} = quizApi;
