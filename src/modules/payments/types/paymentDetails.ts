import type { Payment, PaymentInstallmentItem, PaymentMethodItem } from "./paymentEntities";
import type { PaymentMethod, PaymentStatus } from "./paymentEnums";


// Parcela com campos calculados — retornados por GET /payment-installments/by-payment/:id
export type PaymentInstallmentWithCalculations = PaymentInstallmentItem & {
  method: PaymentMethod;
  isPaid: boolean;
  isPartiallyPaid: boolean;
  isOverdue: boolean;
  daysOverdue: number;
  remainingAmount: number;
};

export type PaymentDetails = Payment & {
  methods: PaymentMethodItem[];
  sale?: {
    id: number;
    subtotal?: number;
    discount?: number;
    total: number;
    notes?: string | null;
    clientName?: string;
    client?: {
      id: number;
      name: string;
    };
  };
  clientName?: string;
  hasOverdueInstallments?: boolean;
  overdueCount?: number;
  nextDueDate?: string | null;
  nextDueAmount?: number | null;
};

// Resposta tipada do GET /payments/:id
export type PaymentApiDetailResponse = {
  id: number;
  saleId: number;
  status: PaymentStatus;
  total: number;
  discount: number;
  paidAmount: number;
  installmentsPaid: number;
  lastPaymentAt: string | null;
  isActive: boolean;
  branchId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  methods: PaymentMethodItem[];
  sale?: {
    id: number;
    subtotal: number;
    discount: number;
    total: number;
    notes: string | null;
    clientName: string;
    client?: {
      id: number;
      name: string;
    };
  };
  clientName?: string;
};
