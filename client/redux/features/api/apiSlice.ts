import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../auth/authSlice";

// Define the expected structure of the refresh response
interface RefreshResponse {
  accessToken: string;
  user: any;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as { auth: { token: string } })?.auth?.token;

    // Retrieve token from localStorage if not available in Redux store
    if (!token && typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("auth");
      if (savedAuth) {
        const parsedAuth = JSON.parse(savedAuth);
        token = parsedAuth.token;
      }
    }

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    console.warn("Access token expired, attempting to refresh token...");

    const refreshResult = await baseQuery(
      { url: "refresh", method: "GET" },
      api,
      extraOptions
    );

    console.log("Refresh Token Response:", refreshResult);
    const data = refreshResult.data as RefreshResponse | undefined;

    if (data?.accessToken) {
      api.dispatch(
        userLoggedIn({
          accessToken: data.accessToken,
          user: data.user || null,
        })
      );

      // Persist new token in localStorage
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: data.accessToken, user: data.user })
      );

      // Retry the original request with the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.error("Failed to refresh token, logging out user.");
      api.dispatch(userLoggedOut());
      localStorage.removeItem("auth"); // Clear stored auth state
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    refreshToken: builder.query<RefreshResponse, void>({
      query: () => ({
        url: "refresh",
        method: "GET",
      }),
    }),
    loadUser: builder.query<RefreshResponse, void>({
      query: () => ({
        url: "me",
        method: "GET",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          if (result.data) {
            dispatch(
              userLoggedIn({
                accessToken: result.data.accessToken,
                user: result.data.user || null,
              })
            );

            // Persist user info in localStorage
            localStorage.setItem(
              "auth",
              JSON.stringify({
                token: result.data.accessToken,
                user: result.data.user,
              })
            );
          }
        } catch (error: any) {
          console.error("Error loading user:", error.message);
        }
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
export default apiSlice.reducer;
