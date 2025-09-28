import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

export interface EntityService<T> {
  getAll: (params: { page: number; size: number; search: string }) => Promise<ApiResponse<PaginatedResponse<T>>>;
  getById: (id: number | string) => Promise<ApiResponse<T>>;
  create: (data: Partial<T>) => Promise<ApiResponse<T>>;
  update: (id: number | string, data: Partial<T>) => Promise<ApiResponse<T>>;
  delete: (id: number | string) => Promise<ApiResponse<null>>;
}
