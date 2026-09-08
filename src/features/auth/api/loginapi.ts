


// TODO: you haven't shared a returning-user login controller yet.
// This assumes POST /api/v1/auth/login with { email, password } -> a token.

import type { BaseAPIResponse, TokenResponseDTO } from "../types/registration";
import { apiPost } from "./client";



// Update the path/shape once you share the real controller.
export interface LoginRequest {
  email: string;
  password: string;
}

export function login(payload: LoginRequest) {
  return apiPost<BaseAPIResponse<TokenResponseDTO>>("/api/v1/auth/login", payload);
}