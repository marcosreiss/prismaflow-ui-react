import type { ApiResponse, PaginatedResponse } from "@/utils/apiResponse";

// ===========================
// 🔹 ENTIDADE BASE
// ===========================
export type OpticalService = {
  id: number;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  branchId: string;
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
export type CreateOpticalServicePayload = {
  name: string;
  description: string;
  price: number;
  branchId: string;
  isActive: boolean;
};

export type UpdateOpticalServicePayload = {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
};

// ===========================
// 📦 RESPONSE TYPES
// ===========================
export type OpticalServicesResponse = ApiResponse<
  PaginatedResponse<OpticalService>
>;

export type OpticalServiceResponse = ApiResponse<OpticalService>;
