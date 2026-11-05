// Matches the actual /api/v1/products/brand/* responses.

export interface Brand {
  brandCode: string;
  name: string;
  slug: string;
  description: string;
  assignedProducts?: number;
  status?: string;
}

export interface PaginatedResponse<T> {
  message: string;
  status: boolean;
  data: T[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize: number;
  lastPage: boolean;
}

export interface ActionResponse {
  message: string;
  status: boolean;
  data: string;
}

// brandCode is server-generated on create, so it isn't sent.
export interface CreateBrandRequest {
  name: string;
  slug: string;
  description: string;
}

// brandCode identifies which brand to update.
export interface UpdateBrandRequest {
  brandCode: string;
  name: string;
  slug: string;
  description: string;
}