// src/types/brandTypes.ts
import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

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

// Tipos de resposta específicos
export type BrandsResponse = ApiResponse<PaginatedResponse<Brand>>;
export type BrandResponse = ApiResponse<Brand>;