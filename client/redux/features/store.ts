"use client";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

// Call the load user function on every page load if token exists
const initializeApp = async () => {
  const token = store.getState().auth.token;
  if (token) {
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true })
    );
  }
};

initializeApp();
