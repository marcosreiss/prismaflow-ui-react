import type { PaymentStatus } from "./paymentEnums";
import type { PaymentMethodPayload } from "./paymentPayloads";

// Representa um método em construção no formulário
export type PaymentMethodFormItem = PaymentMethodPayload & {
  // id local temporário para controle de lista no React (não enviado à API)
  _key: string;
};

// Valores do formulário de configuração de pagamento
export type PaymentFormValues = {
  saleId: number;
  total: number;
  discount: number;
  status: PaymentStatus;
  methods: PaymentMethodFormItem[];
};
