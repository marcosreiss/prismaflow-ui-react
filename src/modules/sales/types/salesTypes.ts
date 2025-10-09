import type { Client } from "@/modules/clients/types/clientTypes";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import type { Payment } from "@/modules/payments/types/paymentTypes";
import type { Product } from "@/modules/products/types/productTypes";

// ==============================
// 🔹 ENTIDADE: SALE
// ==============================
export type Sale = {
  id: number;
  clientId: number;
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
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  branchId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;

  product?: Product;
  frameDetails?: FrameDetails | null;
};

// ==============================
// 🔹 ENTIDADE: SALE SERVICE ITEM
// ==============================
export type SaleServiceItem = {
  id: number;
  saleId: number;
  serviceId: number;
  branchId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;

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
  recordNumber?: string | null;
  book?: string | null;
  page?: number | null;
  os?: string | null;
};

// ==============================
// 🔹 PAYLOADS
// ==============================
export type CreateSalePayload = {
  clientId: number;
  prescriptionId?: number | null;
  productItems?: SaleProductItem[];
  serviceItems?: SaleServiceItem[];
  subtotal?: number;
  discount?: number;
  total?: number;
  notes?: string;
  protocol?: Protocol | null;
};

export type UpdateSalePayload = Partial<CreateSalePayload> & {
  id: number;
};

