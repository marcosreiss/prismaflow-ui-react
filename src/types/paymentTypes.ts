import type { PaymentInstallment } from "./paymentInstallmentTypes";
import type { Sale } from "./saleTypes";

// Replicando o Enum de métodos de pagamento
export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "CASH" | "BANK_SLIP" | "OTHER";

// Replicando o Enum de status de pagamento
export type PaymentStatus = "PENDING" | "PAID" | "PARTIALLY_PAID" | "CANCELED" | "OVERDUE";

// Mapeamento opcional para rótulos na UI
export const PaymentMethodLabels: Record<PaymentMethod, string> = {
    CREDIT_CARD: "Cartão de Crédito",
    DEBIT_CARD: "Cartão de Débito",
    PIX: "Pix",
    CASH: "Dinheiro",
    BANK_SLIP: "Boleto",
    OTHER: "Outro",
};

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    PARTIALLY_PAID: "Parcialmente Pago",
    CANCELED: "Cancelado",
    OVERDUE: "Vencido",
};

export type Payment = {
    id: number;
    sale: Sale;
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