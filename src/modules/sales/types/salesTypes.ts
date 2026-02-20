import type { Client } from "@/modules/clients/types/clientTypes";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import type { Payment } from "@/modules/payments/types";
import type { Product } from "@/modules/products/types/productTypes";
import type { ApiResponse, PaginatedResponse } from "@/utils/apiResponse";

// ==============================
// 🔹 ENTIDADE: SALE
// ==============================
export type Sale = {
  id: number;
  clientId: number;
  saleDate: string;
  prescriptionId?: number | null;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  isActive: boolean;
  tenantId: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;

  // 🔹 Relações
  client?: Client | null;
  prescription?: Prescription | null;
  productItems?: SaleProductItem[];
  serviceItems?: SaleServiceItem[];
  payment?: Payment | null;
  protocol?: Protocol | null;
};

// ==============================
// 🔹 ENTIDADE: SALE PRODUCT ITEM
// ==============================
export type SaleProductItem = {
  id?: number;
  saleId?: number;
  productId: number;
  quantity: number;
  product?: Product;
  frameDetails?: FrameDetails | null;

  /** usado no front para comparar mudanças no modo edição */
  _original?: {
    productId: number;
    quantity: number;
  };
};

// ==============================
// 🔹 ENTIDADE: SALE SERVICE ITEM
// ==============================
export type SaleServiceItem = {
  id?: number;
  saleId?: number;
  serviceId: number;
  service?: OpticalService;
};

// ======================================
// 🔹 ENTIDADE: FrameDetails e Protocol
// ======================================
export type FrameDetails = {
  id?: number;
  material: string;
  reference?: string | null;
  color?: string | null;
};

export type Protocol = {
  book?: string | null;
  page?: number | null;
  os?: string | null;
};

// ==============================
// 🔹 PAYLOADS
// ==============================
export type SalePayload = {
  id?: number;
  clientId: number;
  saleDate: string;
  prescriptionId?: number | null;
  productItems?: SaleProductItem[];
  serviceItems?: SaleServiceItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
  notes?: string;
  protocol?: Protocol | null;
};

export type FrameMaterialType =
  | "ACETATE"
  | "METAL"
  | "TITANIUM"
  | "TR90"
  | "OTHER";

export const FrameMaterialTypeLabels: Record<FrameMaterialType, string> = {
  ACETATE: "Acetato",
  METAL: "Metal",
  TITANIUM: "Titânio",
  TR90: "TR-90",
  OTHER: "Outro",
};


export type SalesResponse = ApiResponse<PaginatedResponse<Sale>>;
export type SaleResponse = ApiResponse<Sale>;