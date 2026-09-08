// Mirrors com.example.demo.dtos.registration.* and BaseAPIResponse<T>

export interface BaseAPIResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Mirrors com.example.demo.enums.RegistrationStatus
export const RegistrationStatus = {
  PERSONAL_INFORMATION: "PERSONAL_INFORMATION",
  OTP_VERIFIED: "OTP_VERIFIED",
  PASSWORD_SET: "PASSWORD_SET",
} as const;

export type RegistrationStatus =
  typeof RegistrationStatus[keyof typeof RegistrationStatus];

// Mirrors RegistrationResponse(journeyId, status)
export interface RegistrationResponse {
  journeyId: string;
  status: RegistrationStatus;
}

// Mirrors RegistrationPersonalDetailsRequest
export interface RegistrationPersonalDetailsRequest {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string; // yyyy-MM-dd, matches java.time.LocalDate JSON serialization
}

// Mirrors RegistrationOTPRequest
export interface RegistrationOTPRequest {
  journeyId: string;
  otp: string;
}

// Mirrors PasswordRequest
export interface PasswordRequest {
  journeyId: string;
  password: string;
  confirmPassword: string;
}

// GUESSED shape — you haven't shared TokenResponseDTO, adjust field names to match.
export interface TokenResponseDTO {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
}