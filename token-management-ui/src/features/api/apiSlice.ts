// src/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types based on your Go structs
interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  organization?: Organization;
  organization_id: number;
}

interface Organization {
  id: number;
  name: string;
  users?: User[];
}

interface Token {
  id: number;
  token: string;
  expiry_date: string;
  user_id: number;
  permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
  is_admin: boolean;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Users
    getUsers: builder.query<User[], void>({
      query: () => "users",
    }),
    getUser: builder.query<User, number>({
      query: (id) => `users/${id}`,
    }),
    createUser: builder.mutation<void, Partial<User>>({
      query: (user) => ({
        url: "users",
        method: "POST",
        body: user,
      }),
    }),
    updateUser: builder.mutation<void, { id: number; user: Partial<User> }>({
      query: ({ id, user }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: user,
      }),
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),

    // Organizations
    getOrganizations: builder.query<Organization[], void>({
      query: () => "organizations",
    }),
    createOrganization: builder.mutation<void, Partial<Organization>>({
      query: (org) => ({
        url: "organizations",
        method: "POST",
        body: org,
      }),
    }),

    // Tokens
    getTokens: builder.query<Token[], void>({
      query: () => "tokens",
    }),
    createToken: builder.mutation<void, Partial<Token>>({
      query: (token) => ({
        url: "tokens",
        method: "POST",
        body: token,
      }),
    }),

    // Permissions
    getPermissions: builder.query<Permission[], void>({
      query: () => "permissions",
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useGetTokensQuery,
  useCreateTokenMutation,
  useGetPermissionsQuery,
} = apiSlice;
