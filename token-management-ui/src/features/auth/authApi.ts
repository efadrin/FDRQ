// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LoginCredentials,
  LoginResponse,
  ApiKeyResponse,
} from "../../types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || "/api",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getApiKey: builder.query<ApiKeyResponse, void>({
      query: () => "/api-key",
    }),
  }),
});

export const { useLoginMutation, useGetApiKeyQuery } = authApi;
