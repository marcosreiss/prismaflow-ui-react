import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

// ===========================
// 🔹 ENTIDADE BASE
// ===========================
export type Brand = {
  id: number;
  name: string;
  isActive: boolean;
  tenantId: string;
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string };
  updatedBy: { name: string };
};

// ===========================
// 📨 PAYLOADS (REQUEST)
// ===========================
export type CreateBrandPayload = {
  name: string;
  isActive: boolean;
};

export type UpdateBrandPayload = {
  name: string;
  isActive: boolean;
};

// ===========================
// 📦 RESPONSE TYPES
// ===========================
export type BrandsResponse = ApiResponse<PaginatedResponse<Brand>>;
export type BrandResponse = ApiResponse<Brand>;
