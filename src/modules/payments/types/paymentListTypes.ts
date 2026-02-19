import type { PaymentInstallmentWithCalculations } from "./paymentDetails";
import type { PaymentStatus } from "./paymentEnums";
import type { PaymentMethodItem } from "./paymentEntities";

export type PaymentListItem = {
  id: number;
  saleId: number;
  clientName: string;
  status: PaymentStatus;
  total: number;
  paidAmount: number;
  installmentsPaid: number;
  createdAt: string;
  updatedAt: string;
  methods: PaymentMethodItem[];
  discount?: number;
  lastPaymentAt?: string | null;
  isActive?: boolean;
  branchId?: string;
  tenantId?: string;
  sale?: {
    id: number;
    total: number;
    client?: {
      name: string;
    };
  };
};

// Parcela enriquecida para uso em listagens (ex: dashboard de inadimplência)
export type InstallmentListItem = PaymentInstallmentWithCalculations & {
  clientName?: string;
  clientPhone?: string;
  payment?: {
    id: number;
    saleId: number;
    status: PaymentStatus;
    methods: PaymentMethodItem[];
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

// Resposta de GET /payment-installments/by-payment/:paymentId
export type InstallmentListResponse = {
  paymentId: number;
  saleId: number;
  summary: InstallmentSummary;
  installments: PaymentInstallmentWithCalculations[];
};

// Resposta de GET /payment-installments/overdue
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
