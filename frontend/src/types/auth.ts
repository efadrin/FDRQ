// src/types/auth.ts
export interface User {
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string; // JWT token
  api_token: string; // API token
}

export interface ApiKeyResponse {
  apiKey: string;
}

export interface LoginRequest {
  username_or_email: string;
  password: string;
}
