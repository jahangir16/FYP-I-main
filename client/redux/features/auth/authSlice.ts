import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define User Type (Modify as per your user model)
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  token: string;
  user: User | null;
}

// Load auth state from localStorage
const loadAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      return JSON.parse(savedAuth);
    }
  }
  return { token: "", user: null };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      localStorage.setItem("auth", JSON.stringify(state)); // Persist state
    },

    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("auth", JSON.stringify(state)); // Persist state
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
      localStorage.removeItem("auth"); // Clear persisted state
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
