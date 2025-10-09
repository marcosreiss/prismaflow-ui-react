export type ApiResponse<T> = {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
};

export type PaginatedResponse<T> = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  limit: number;
  content: T[];
};