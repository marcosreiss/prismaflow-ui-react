// src/services/utils/responseParser.ts

import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

export function parseList<T>(res: ApiResponse<PaginatedResponse<T>>) {
  const page = res.data!;
  return { items: page.content, total: page.totalElements };
}

export function parseEntity<T>(res: ApiResponse<T>) {
  return res.data!;
}

export function parseDelete(res: ApiResponse<unknown>) {
  if (res.status !== 200 && res.status !== 204) {
    throw new Error(res.message || "Erro ao excluir");
  }
}
