import { getAccessToken } from "../features/auth/storage/tokenStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8090";

export function createHttpClient(baseUrl: string = API_BASE_URL) {

  async function request<TResponse, TBody = unknown>(
    method: string,
    path: string,
    body?: TBody
  ): Promise<TResponse> {

    const headers: Record<string, string> = {
      Accept: "*/*",
    };

    const token = getAccessToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (body !== undefined) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body !== undefined
        ? JSON.stringify(body)
        : undefined,
    });

    const text = await response.text();

    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(
        data?.message ?? `Request failed (${response.status})`
      );
    }

    return data as TResponse;
  }

  return {
    get<TResponse>(path: string) {
      return request<TResponse>("GET", path);
    },

    post<TResponse, TBody = unknown>(
      path: string,
      body?: TBody
    ) {
      return request<TResponse, TBody>(
        "POST",
        path,
        body
      );
    },

    put<TResponse, TBody = unknown>(
      path: string,
      body?: TBody
    ) {
      return request<TResponse, TBody>(
        "PUT",
        path,
        body
      );
    },

    delete<TResponse>(path: string) {
      return request<TResponse>("DELETE", path);
    },
  };
}