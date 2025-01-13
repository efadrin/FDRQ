// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse, User } from "@shared-types/auth";
import { RootState } from "@store/store";

interface AuthState {
  user: User | null;
  apiToken: string | null; // Changed from apiKey to apiToken
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  apiToken: null,
  token: null
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
    saveLoginResponse: (state, action: PayloadAction<LoginResponse>) => {
      const { api_token, token, user } = action.payload;
      state.user = user;
      state.apiToken = api_token;
      state.token = token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.apiToken = null;
    }
  }
});

export const { setUser, setApiToken, logout, saveLoginResponse } = authSlice.actions;
export default authSlice.reducer;
export const selectAuth = (state: RootState) => state.auth;
