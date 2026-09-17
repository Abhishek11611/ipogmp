import { getAccessToken, getRefreshToken } from "../storage/tokenStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface RequestOptions {
  /** Attach "Authorization: Bearer <accessToken>" from storage. */
  auth?: boolean;
  /** Attach "Refresh-Token: <refreshToken>" — for the refresh endpoint. */
  withRefreshToken?: boolean;
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options: RequestOptions = {}
): Promise<TResponse> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "*/*",
  };

  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  if (options.withRefreshToken) {
    const refresh = getRefreshToken();
    if (refresh) headers["Refresh-Token"] = refresh;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = json?.message ?? `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return json as TResponse;
}