// NOTE: your API returns { message, status, data } — the boolean flag is
// called "status", not "success".
export interface BaseAPIResponse<T> {
  message: string;
  status: boolean;
  data: T;
}

// Matches the data block returned by verify-otp and verify-password.
export interface TokenResponseDTO {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  email: string;
}

export const RecipientType = {
  PHONE: "PHONE",
  EMAIL: "EMAIL",
} as const;

export type RecipientType = (typeof RecipientType)[keyof typeof RecipientType];

export interface SendOtpRequest {
  recipient: string;
  recipientType: RecipientType;
}

export interface VerifyOtpRequest {
  recipient: string;
  otpCode: string;
}

export interface VerifyPasswordRequest {
  recipient: string;
  password: string;
}