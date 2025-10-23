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
// 🔹 ENTIDADE PRINCIPAL: PAYMENT
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
  sale?: {
    id: number;
    total: number;
    clientName?: string;
  };
  // Relações
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
// 🔹 TIPOS PARA TABELAS E LISTAGENS (Estava perfeito)
// ==============================
export type PaymentListItem = {
  id: number;
  saleId: number;
  clientName: string;
  method: PaymentMethod | null;
  total: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;

  // Para conversão fácil
  discount?: number;
  downPayment?: number;
  installmentsTotal?: number | null;
  paidAmount?: number;
  installmentsPaid?: number;
  lastPaymentAt?: string | null;
  firstDueDate?: string | null;
  isActive?: boolean;
  branchId?: string;
  tenantId?: string;
  installments?: PaymentInstallment[];
  sale?: {
    id: number;
    total: number;
    client?: {
      name: string;
    };
  };
};

// Helper type para conversão
export type PaymentFromListItem = PaymentListItem & {
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
  installments: PaymentInstallment[];
};

// ==============================
// 🔹 TIPO COMPLETO (Estava perfeito)
// ==============================
export type PaymentDetails = Payment & {
  installments: PaymentInstallment[];
  sale?: {
    id: number;
    total: number;
  };
  clientName: string;
};

// ==============================
// 🔹 PAYLOADS (Refatorado para reutilizar o tipo Payment)
// ==============================


export type CreatePaymentPayload = Omit<
  Payment,
  | 'id'
  | 'isActive'
  | 'lastPaymentAt'
  | 'createdAt'
  | 'updatedAt'
  | 'installments'
> & {
  installments?: {
    sequence: number;
    amount: number;
    dueDate: string;
  }[];
  // ✅ CORRIGIDO: Permitir undefined
  firstDueDate?: string | null | undefined;
};


export type UpdatePaymentPayload = Partial<
  Pick<
    Payment,
    | 'method'
    | 'status'
    | 'total'
    | 'discount'
    | 'downPayment'
    | 'installmentsTotal'
    | 'firstDueDate'
  >
>;


// ==============================
// 🔹 TIPOS AUXILIARES PARA FORMULÁRIOS (Refatorado)
// ==============================

export type PaymentFormValues = Pick<
  CreatePaymentPayload, // Derivado do payload de criação
  | 'saleId'
  | 'method'
  | 'status'
  | 'total'
  | 'discount'
  | 'downPayment'
  | 'installmentsTotal'
  | 'firstDueDate'
> & {
  // Sobrescreve 'firstDueDate' para garantir que não seja opcional no form
  firstDueDate: string;
  // Adiciona o tipo para as parcelas no formulário, se necessário
  // installments: { amount: number; dueDate: string; }[];
};

// Adicione esses tipos no seu arquivo de tipos
export type PaymentFilters = {
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
  clientSearch?: string; // 🆕 ADICIONE ESTA LINHA
};

export type PaymentListQuery = PaymentFilters & {
  page: number;
  limit: number;
};

// paymentTypes.ts - ADICIONE ESTES TIPOS

// ==============================
// 🔹 TIPOS PARA API RESPONSE (Detalhes)
// ==============================
export type PaymentApiDetailResponse = {
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
  installments?: PaymentInstallment[];
  sale?: {
    id: number;
    subtotal: number;
    discount: number;
    total: number;
    notes: string | null;
    clientName: string; // ✅ CORRETO: clientName está aqui
    client?: {
      id: number;
      name: string;
    };
  };
  clientName?: string; // Caso venha direto do backend
};