// src/interfaces/apiResponse.ts
export type ApiResponse<T> = {
  status: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
};

export type PageResponse<T> = {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  content: T[];
};
