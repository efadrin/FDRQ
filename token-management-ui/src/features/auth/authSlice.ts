// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/auth";

interface AuthState {
  user: User | null;
  apiToken: string | null; // Changed from apiKey to apiToken
}

const initialState: AuthState = {
  user: null,
  apiToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setApiToken: (state, action: PayloadAction<string | null>) => {
      // Changed from setApiKey
      state.apiToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.apiToken = null;
      localStorage.removeItem("token"); // Clear JWT token
    },
  },
});

export const { setUser, setApiToken, logout } = authSlice.actions;
export default authSlice.reducer;
