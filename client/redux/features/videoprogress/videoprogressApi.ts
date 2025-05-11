import { apiSlice } from "../api/apiSlice";

export const videoProgressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    trackVideoProgress: builder.mutation({
      query: (data) => ({
        url: "/track-no-auth",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
    }),
    getVideoProgress: builder.query({
      query: () => ({
        url: "/getVideoProgress",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const { useTrackVideoProgressMutation, useGetVideoProgressQuery } =
  videoProgressApi;
