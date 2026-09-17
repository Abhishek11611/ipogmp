import { apiPost } from "./client";
import type {
  BaseAPIResponse,
  TokenResponseDTO,
  SendOtpRequest,
  VerifyOtpRequest,
  VerifyPasswordRequest,
} from "../types/auth";

const BASE = "/api/v1/auth";

export function sendOtp(payload: SendOtpRequest) {
  return apiPost<BaseAPIResponse<null>>(`${BASE}/send-otp`, payload);
}

export function verifyOtp(payload: VerifyOtpRequest) {
  return apiPost<BaseAPIResponse<TokenResponseDTO>>(`${BASE}/verify-otp`, payload);
}

// Your curl showed this as GET-with-a-body, which fetch cannot send.
// Calling it as POST — make sure the backend uses @PostMapping.
export function verifyPassword(payload: VerifyPasswordRequest) {
  return apiPost<BaseAPIResponse<TokenResponseDTO>>(`${BASE}/verify-password`, payload);
}

// Sends the stored refresh token in the "Refresh-Token" header, matching
// servletRequest.getHeader("Refresh-Token") on the backend.
export function refreshToken() {
  return apiPost<BaseAPIResponse<TokenResponseDTO>>(
    `${BASE}/refresh-token`,
    undefined,
    { withRefreshToken: true }
  );
}