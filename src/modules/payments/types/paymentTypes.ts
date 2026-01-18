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
  INSTALLMENT: "Carnê",
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
  dueDate: string | null;
  paidAt: string | null;
  isActive: boolean;
  branchId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
};

// ==============================
// 🔹 TIPOS PARA PARCELAS COM CAMPOS CALCULADOS
// ==============================
export type PaymentInstallmentWithCalculations = PaymentInstallment & {
  isPaid: boolean;
  isPartiallyPaid: boolean;
  isOverdue: boolean;
  daysOverdue: number;
  remainingAmount: number;
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

// ==============================
// 🔹 TIPOS PARA LISTAGEM DE PARCELAS
// ==============================
export type InstallmentListItem = PaymentInstallmentWithCalculations & {
  clientName?: string;
  clientPhone?: string;
  payment?: {
    id: number;
    saleId: number;
    status: PaymentStatus;
    method: PaymentMethod | null;
    sale?: {
      id: number;
      client?: {
        id: number;
        name: string;
        phone01?: string;
      };
    };
  };
};

export type InstallmentSummary = {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
};

export type InstallmentListResponse = {
  paymentId: number;
  saleId: number;
  summary: InstallmentSummary;
  installments: PaymentInstallmentWithCalculations[];
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
// 🔹 TIPO COMPLETO
// ==============================
export type PaymentDetails = Payment & {
  installments: PaymentInstallment[];
  sale?: {
    id: number;
    subtotal?: number; // ✅ ADICIONAR
    discount?: number; // ✅ ADICIONAR
    total: number;
    notes?: string | null; // ✅ ADICIONAR
    clientName?: string;
    client?: {
      id: number;
      name: string;
    };
  };
  clientName?: string; // Para compatibilidade
  // ✅ ADICIONAR campos calculados que vêm do backend
  hasOverdueInstallments?: boolean;
  overdueCount?: number;
  nextDueDate?: string | null;
  nextDueAmount?: number | null;
};

// ==============================
// 🔹 PAYLOADS (Refatorado para reutilizar o tipo Payment)
// ==============================

export type CreatePaymentPayload = Omit<
  Payment,
  | "id"
  | "isActive"
  | "lastPaymentAt"
  | "createdAt"
  | "updatedAt"
  | "installments"
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
    | "method"
    | "status"
    | "total"
    | "discount"
    | "downPayment"
    | "installmentsTotal"
    | "firstDueDate"
  >
>;

// ==============================
// 🔹 TIPOS AUXILIARES PARA FORMULÁRIOS (Refatorado)
// ==============================

export type PaymentFormValues = Pick<
  CreatePaymentPayload, // Derivado do payload de criação
  | "saleId"
  | "method"
  | "status"
  | "total"
  | "discount"
  | "downPayment"
  | "installmentsTotal"
  | "firstDueDate"
> & {
  // Sobrescreve 'firstDueDate' para garantir que não seja opcional no form
  firstDueDate: string;
  // Adiciona o tipo para as parcelas no formulário, se necessário
  // installments: { amount: number; dueDate: string; }[];
};

// ==============================
// 🔹 FILTROS PARA LISTAGEM
// ==============================
export type PaymentFilters = {
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
  clientSearch?: string;
  clientId?: number; // ✅ ADICIONAR
  clientName?: string; // ✅ ADICIONAR
  hasOverdueInstallments?: boolean; // ✅ ADICIONAR
  isPartiallyPaid?: boolean; // ✅ ADICIONAR
  dueDaysAhead?: number; // ✅ ADICIONAR
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

// ==============================
// 🔹 TIPOS PARA RELATÓRIO DE PARCELAS VENCIDAS
// ==============================
export type OverdueInstallmentStats = {
  totalOverdue: number;
  totalAmount: number;
  averageDaysOverdue: number;
};

export type OverdueInstallmentsResponse = {
  content: InstallmentListItem[];
  stats: OverdueInstallmentStats;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  limit: number;
};

// ==============================
// 🔹 TIPOS PARA VALIDAÇÃO DE INTEGRIDADE
// ==============================
export type IntegrityIssue = {
  field: string;
  expected?: number | number[];
  found?: number | number[];
  difference?: number;
  message: string;
  installments?: number[];
};

export type PaymentValidationStats = {
  paymentId: number;
  saleId: number;
  method: PaymentMethod | null;
  status: PaymentStatus;
  total: number;
  discount: number;
  downPayment: number;
  amountToInstall: number;
  installmentsTotal: number | null;
  installmentsCreated: number;
  installmentsPaid: number;
  paidAmount: number;
  sumOfInstallments: number;
};

export type PaymentValidationResponse = {
  valid: boolean;
  stats: PaymentValidationStats;
  issues?: IntegrityIssue[];
  installments: Array<{
    id: number;
    sequence: number;
    amount: number;
    paidAmount: number;
    dueDate: string | null;
    isPaid: boolean;
  }>;
};

// ==============================
// 🔹 PAYLOADS PARA PARCELAS
// ==============================
export type PayInstallmentPayload = {
  paidAmount: number;
  paidAt?: string; // Opcional, default agora no backend
};

export type UpdateInstallmentPayload = {
  amount?: number;
  dueDate?: string;
  sequence?: number;
};

// ==============================
// 🔹 PAYLOAD PARA ATUALIZAÇÃO DE STATUS
// ==============================
export type UpdatePaymentStatusPayload = {
  status: PaymentStatus;
  reason?: string; // Para justificativa de cancelamento
};
