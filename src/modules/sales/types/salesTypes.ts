// ==============================
// 🔹 ENTIDADE: SALE
// ==============================
export type Sale = {
  id: number;
  clientId: number;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  isActive: boolean;
  tenantId: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;

  // 🔹 Relações diretas
  client?: ClientSummary | null;
  productItems?: SaleProductItem[];
  serviceItems?: SaleServiceItem[];
  payment?: PaymentSummary | null;
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

  product?: ProductSummary;
  frameDetails?: FrameDetailsSummary | null;
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

  service?: OpticalServiceSummary;
};

// ==============================
// 🔹 RESUMOS (para tabelas e selects)
// ==============================
export type ClientSummary = {
  id: number;
  name: string;
  phone01?: string | null;
};

export type ProductSummary = {
  id: number;
  name: string;
  salePrice?: number | null;
};

export type OpticalServiceSummary = {
  id: number;
  name: string;
  price: number;
};

export type FrameDetailsSummary = {
  id: number;
  material: string;
  reference?: string | null;
  color?: string | null;
};

export type PaymentSummary = {
  id: number;
  total: number;
  status: PaymentStatus;
  method: PaymentMethod;
};

// ==============================
// 🔹 ENUMS RELACIONADOS
// ==============================
export type PaymentMethod =
  | "PIX"
  | "MONEY"
  | "DEBIT"
  | "CREDIT"
  | "INSTALLMENT";

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: "Pix",
  MONEY: "Dinheiro",
  DEBIT: "Débito",
  CREDIT: "Crédito",
  INSTALLMENT: "Parcelado",
};

export type PaymentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
};

// ==============================
// 🔹 PAYLOADS
// ==============================
export type CreateSalePayload = {
  clientId: number;
  productItems?: {
    productId: number;
    quantity: number;
  }[];
  serviceItems?: {
    serviceId: number;
  }[];
  subtotal?: number;
  discount?: number;
  total?: number;
  notes?: string;
  branchId: string;
};

export type UpdateSalePayload = Partial<CreateSalePayload> & {
  id: number;
};

// ==============================
// 🔹 TIPOS AUXILIARES PARA UI
// ==============================
export type SaleListItem = {
  id: number;
  clientName: string;
  total: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

export type SaleDetails = Sale & {
  client: ClientSummary;
  productItems: SaleProductItem[];
  serviceItems: SaleServiceItem[];
  payment?: PaymentSummary | null;
};
