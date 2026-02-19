import type { PaymentMethod, PaymentStatus } from "./paymentEnums";

export type PaymentFilters = {
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
  clientSearch?: string;
  clientId?: number;
  clientName?: string;
  hasOverdueInstallments?: boolean;
  isPartiallyPaid?: boolean;
  dueDaysAhead?: number;
};

export type PaymentListQuery = PaymentFilters & {
  page: number;
  limit: number;
};
