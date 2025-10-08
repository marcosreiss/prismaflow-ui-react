import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import type { Brand } from "@/modules/brands/types/brandTypes";

// ===========================
// 🔹 ENUM / CATEGORIAS
// ===========================
export type ProductCategory = "FRAME" | "LENS" | "ACCESSORY";

export const ProductCategoryLabels: Record<ProductCategory, string> = {
  FRAME: "Armação",
  LENS: "Lente",
  ACCESSORY: "Acessório",
};

// ===========================
// 🔹 ENTIDADE BASE
// ===========================
export type Product = {
  id: number;
  name: string;
  description: string;
  costPrice: number;
  markup: number;
  salePrice: number;
  stockQuantity: number;
  minimumStock: number;
  category: ProductCategory;
  brand: Brand | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: { name: string };
  updatedBy: { name: string };
  branch?: { id: string; name: string };
};

// ===========================
// 📨 PAYLOADS (REQUEST)
// ===========================
export type CreateProductPayload = {
  name: string;
  description: string;
  costPrice: number;
  markup: number;
  salePrice: number;
  stockQuantity: number;
  minimumStock: number;
  category: ProductCategory;
  brandId?: number | null;
  branchId?: string;
  isActive?: boolean;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ===========================
// 📦 RESPONSE TYPES
// ===========================
export type ProductsResponse = ApiResponse<PaginatedResponse<Product>>;
export type ProductResponse = ApiResponse<Product>;
