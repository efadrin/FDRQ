// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/auth";

interface AuthState {
  user: User | null;
  apiKey: string | null;
}

const initialState: AuthState = {
  user: null,
  apiKey: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setApiKey: (state, action: PayloadAction<string | null>) => {
      state.apiKey = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.apiKey = null;
    },
  },
});

export const { setUser, setApiKey, logout } = authSlice.actions;
export default authSlice.reducer;
