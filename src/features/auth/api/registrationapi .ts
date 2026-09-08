import type { BaseAPIResponse, PasswordRequest, RegistrationOTPRequest, RegistrationPersonalDetailsRequest, RegistrationResponse, TokenResponseDTO } from "../types/registration";
import { apiPost } from "./client";


// Matches @RequestMapping("/api/v1/registrations") on AuthenticationController
const BASE = "/api/v1/registrations";

export function submitPersonalDetails(payload: RegistrationPersonalDetailsRequest) {
  return apiPost<BaseAPIResponse<RegistrationResponse>>(`${BASE}/personal-details`, payload);
}

export function verifyOtp(payload: RegistrationOTPRequest) {
  return apiPost<BaseAPIResponse<RegistrationResponse>>(`${BASE}/verify-otp`, payload);
}

export function setPassword(payload: PasswordRequest) {
  return apiPost<BaseAPIResponse<RegistrationResponse>>(`${BASE}/password`, payload);
}

// Your controller declares this as `@PostMapping("/verify-users")` taking
// `email` as a @RequestParam (not a JSON body) — sent as a query string here
// to match. This reads like a "log the user in right after registration"
// step rather than a general login endpoint — confirm that's the intent.
export function verifyUsers(email: string) {
  return apiPost<BaseAPIResponse<TokenResponseDTO>>(
    `${BASE}/verify-users?email=${encodeURIComponent(email)}`
  );
}