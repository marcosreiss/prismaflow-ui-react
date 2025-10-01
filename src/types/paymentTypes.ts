// paymentTypes.ts
import type { Sale } from "./saleTypes";

// ----------------------
// Enums
// ----------------------
export type PaymentStatus = "PENDING" | "CONFIRMED" | "CANCELED";

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
};

export type PaymentMethod = "PIX" | "MONEY" | "DEBIT" | "CREDIT"; // | "INSTALLMENT"

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  PIX: "Pix",
  MONEY: "Dinheiro",
  DEBIT: "Débito",
  CREDIT: "Crédito",
  // INSTALLMENT: "Parcelado",
};

// ----------------------
// Entidades
// ----------------------
export type PaymentInstallment = {
  id: number;
  payment: Payment | null;
  sequence: number;
  amount: number;
  paidAmount: number;
  paidAt: string | null;
};

export type Payment = {
  id: number;
  clientName: string;
  sale: Sale | null;
  method: PaymentMethod;
  status: PaymentStatus;
  total: number;
  discount: number;
  downPayment: number;
  installmentsTotal: number | null;
  paidAmount: number;
  installmentsPaid: number;
  lastPaymentAt: string | null;
  installments: PaymentInstallment[];
  firstDueDate: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};

export type PaymentStatusBySale = {
  saleId: number;
  paymentId: number;
  status: PaymentStatus;
};
