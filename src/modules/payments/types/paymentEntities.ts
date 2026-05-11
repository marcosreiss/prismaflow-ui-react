import type { PaymentMethod, PaymentStatus } from "./paymentEnums";

export type PaymentInstallmentItem = {
  id: number;
  paymentMethodItemId?: number;
  paymentMethodId?: number;
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
  method?: PaymentMethod;
  isPaid?: boolean;
  isPartiallyPaid?: boolean;
  isOverdue?: boolean;
  daysOverdue?: number;
  remainingAmount?: number;
  paymentMethodItem?: {
    id: number;
    method: PaymentMethod;
    amount: number;
    payment: {
      id: number;
      saleId: number;
      total: number;
      status: PaymentStatus;
      tenantId: string;
    };
  };
};

export type PaymentMethodItem = {
  id: number;
  paymentId: number;
  method: PaymentMethod;
  amount: number;
  isPaid: boolean;
  paidAt: string | null;
  // Exclusivos de INSTALLMENT
  installments?: number;
  firstDueDate?: string | null;
  installmentItems: PaymentInstallmentItem[];
};

export type Payment = {
  id: number;
  saleId: number;
  saleDate?: string | null;
  subtotal?: number;
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
    saleDate?: string | null;
    clientId?: number;
    subtotal?: number;
    discount?: number;
    total: number;
    notes?: string | null;
    client?: {
      id: number;
      name: string;
      phone01?: string | null;
    };
  };
};
