// Atualize seus tipos para bater PERFEITAMENTE:
export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;        // ← Remova o '?' (não é opcional)
  timestamp: string;
  path: string;
};

export type PaginatedResponse<T> = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  limit: number;   // ← Adicione este campo
  content: T[];
};