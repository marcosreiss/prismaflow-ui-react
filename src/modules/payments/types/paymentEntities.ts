import type { PaymentMethod, PaymentStatus } from "./paymentEnums";

export type PaymentInstallmentItem = {
  id: number;
  paymentMethodId: number;
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

export type PaymentMethodItem = {
  id: number;
  paymentId: number;
  method: PaymentMethod;
  amount: number;
  installments?: number;
  firstDueDate?: string | null;
  installmentItems: PaymentInstallmentItem[];
};

export type Payment = {
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
    total: number;
    clientName?: string;
  };
};
