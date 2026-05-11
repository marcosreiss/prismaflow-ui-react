import type { PaymentMethod, PaymentStatus } from "./paymentEnums";

export type IntegrityIssue = {
  field: string;
  expected?: number | number[];
  found?: number | number[];
  difference?: number;
  message: string;
  installments?: number[];
};

// Stats retornados por GET /payments/:id/validate
export type PaymentValidationStats = {
  paymentId: number;
  saleId: number;
  status: PaymentStatus;
  subtotal: number;
  total: number;
  discount: number;
  paidAmount: number;
  installmentsPaid: number;
  methodsCount: number;
  sumMethods: number;
  instantMethodsPaid: number;
  installmentsCreated: number;
};

export type PaymentValidationResponse = {
  valid: boolean;
  stats: PaymentValidationStats;
  issues?: IntegrityIssue[];
  methods?: Array<{
    id: number;
    method: PaymentMethod;
    amount: number;
    isPaid: boolean;
    paidAt: string | null;
    installments?: number | null;
    installmentItems: Array<{
      id: number;
      sequence: number;
      amount: number;
      paidAmount: number;
      dueDate: string | null;
      isPaid: boolean;
      paidAt: string | null;
    }>;
  }>;
};
