import { createHttpClient } from "../../../lib/http";

import type {
  Brand,
  PaginatedResponse,
  ActionResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
} from "../types/brand";



const http = createHttpClient();

const BASE = "/api/v1/products/brand";

export function searchBrands(search: string, page: number, size: number) {
  const params = new URLSearchParams({
    search,
    page: String(page),
    size: String(size),
  });

  return http.get<PaginatedResponse<Brand>>(
    `${BASE}/search?${params.toString()}`
  );
}

export function createBrand(payload: CreateBrandRequest) {
  return http.post<ActionResponse, CreateBrandRequest>(
    `${BASE}/create`,
    payload
  );
}

export function updateBrand(payload: UpdateBrandRequest) {
  return http.put<ActionResponse, UpdateBrandRequest>(
    `${BASE}/update`,
    payload
  );
}