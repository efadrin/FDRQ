// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LoginCredentials,
  LoginResponse,
  ApiKeyResponse,
  LoginRequest,
} from "../../types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
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
