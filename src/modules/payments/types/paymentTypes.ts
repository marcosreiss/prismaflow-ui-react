// ==============================
// 🔹 ENUMS E LABELS
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
  DEBIT: "Cartão de débito",
  CREDIT: "Cartão de crédito",
  INSTALLMENT: "Parcelado",
};

export type PaymentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
};

// ==============================
// 🔹 ENTIDADE: PAYMENT
// ==============================
export type Payment = {
  id: number;
  saleId: number;
  method: PaymentMethod | null;
  status: PaymentStatus;
  total: number;
  discount: number;
  downPayment: number;
  installmentsTotal: number | null;
  paidAmount: number;
  installmentsPaid: number;
  lastPaymentAt: string | null;
  firstDueDate: string | null;
  isActive: boolean;
  branchId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;

  // 🔹 Relações
  installments?: PaymentInstallment[];
};

// ==============================
// 🔹 ENTIDADE: PAYMENT INSTALLMENT
// ==============================
export type PaymentInstallment = {
  id: number;
  paymentId: number;
  sequence: number;
  amount: number;
  paidAmount: number;
  paidAt: string | null;
  isActive: boolean;
  branchId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

// ==============================
// 🔹 TIPOS PARA TABELAS E LISTAGENS
// ==============================
export type PaymentListItem = {
  id: number;
  saleId: number;
  clientName: string;
  method: PaymentMethod | null;
  total: number;
  status: PaymentStatus;
  createdAt: string;
};

// ==============================
// 🔹 TIPOS COMPLETOS (para página de detalhes)
// ==============================
export type PaymentDetails = Payment & {
  installments: PaymentInstallment[];
  sale?: {
    id: number;
    total: number;
    clientName: string;
  };
};

// ==============================
// 🔹 PAYLOADS
// ==============================
export type CreatePaymentPayload = {
  saleId: number;
  method: PaymentMethod;
  total: number;
  discount?: number;
  downPayment?: number;
  installmentsTotal?: number;
  firstDueDate?: string;
  branchId: string;

  // Parcelamento opcional
  installments?: {
    sequence: number;
    amount: number;
    dueDate: string;
  }[];
};

export type UpdatePaymentPayload = Partial<CreatePaymentPayload> & {
  id: number;
};

// ==============================
// 🔹 TIPOS AUXILIARES PARA FORMULÁRIOS
// ==============================
export type PaymentFormValues = {
  method: PaymentMethod;
  total: number;
  discount: number;
  downPayment: number;
  installmentsTotal: number;
  firstDueDate: string;
  installments: PaymentInstallment[];
};
