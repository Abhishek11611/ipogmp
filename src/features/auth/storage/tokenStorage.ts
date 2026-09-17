// Single place that owns token persistence, so components and the API
// client never touch localStorage keys directly.

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "expiresAt";
const EMAIL_KEY = "email";

export interface StoredSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  email: string;
}

export function saveSession(session: StoredSession): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  localStorage.setItem(EXPIRES_AT_KEY, session.expiresAt);
  localStorage.setItem(EMAIL_KEY, session.email);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

// Sent as the "Refresh-Token" header, matching your refreshToken() endpoint
// which reads servletRequest.getHeader("Refresh-Token").
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSession(): StoredSession | null {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  if (!accessToken || !refreshToken) return null;

  return {
    accessToken,
    refreshToken,
    expiresAt: localStorage.getItem(EXPIRES_AT_KEY) ?? "",
    email: localStorage.getItem(EMAIL_KEY) ?? "",
  };
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
  localStorage.removeItem(EMAIL_KEY);
}