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
  total: number;
  discount: number;
  paidAmount: number;
  installmentsPaid: number;
  methodsCount: number;
  sumOfMethods: number;
  installmentsCreated: number;
  sumOfInstallments: number;
};

export type PaymentValidationResponse = {
  valid: boolean;
  stats: PaymentValidationStats;
  issues?: IntegrityIssue[];
  installments: Array<{
    id: number;
    method: PaymentMethod;
    sequence: number;
    amount: number;
    paidAmount: number;
    dueDate: string | null;
    isPaid: boolean;
  }>;
};
