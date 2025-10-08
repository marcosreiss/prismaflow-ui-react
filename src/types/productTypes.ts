import type { Brand } from "../modules/brands/types/brandTypes";

export type ProductCategory = "FRAME" | "LENS" | "ACCESSORY";

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
};

export const ProductCategoryLabels: Record<ProductCategory, string> = {
  FRAME: "Armação",
  LENS: "Lente",
  ACCESSORY: "Acessório",
};
