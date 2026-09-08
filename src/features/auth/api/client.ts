// Set VITE_API_BASE_URL in your .env file, e.g. VITE_API_BASE_URL=http://localhost:8080
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export async function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : null;

  if (!response.ok) {
    // BaseAPIResponse still comes through on error responses in most setups —
    // fall back to a generic message if this one doesn't.
    const message = json?.message ?? `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return json as TResponse;
}