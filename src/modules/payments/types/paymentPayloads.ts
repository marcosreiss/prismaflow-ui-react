import type { PaymentStatus } from "./paymentEnums";

// Item de método enviado no PUT /payments/:id
export type PaymentMethodPayload = {
  method: "PIX" | "MONEY" | "DEBIT" | "CREDIT" | "INSTALLMENT";
  amount: number;
  // Obrigatório para métodos à vista — backend não assume now()
  paidAt?: string;
  // Obrigatórios apenas quando method === "INSTALLMENT"
  installments?: number;
  firstDueDate?: string;
};

// PUT /payments/:id — único endpoint para configurar o pagamento após a venda
export type ConfigurePaymentPayload = {
  total: number;
  discount: number;
  methods: PaymentMethodPayload[];
};

// PATCH /payment-installments/:id/pay
export type PayInstallmentPayload = {
  paidAmount: number;
  paidAt?: string;
};

export type UpdatePaymentStatusPayload = {
  status: PaymentStatus;
  reason?: string;
};
