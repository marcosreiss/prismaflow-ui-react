import type { Payment } from "./paymentTypes";

export type PaymentInstallment = {
    id: number;
    payment: Payment;
    sequence: number;
    amount: number;
    paidAmount: number;
    paidAt: string | null;
};