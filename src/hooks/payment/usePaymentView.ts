// hooks/usePaymentView.ts
import { useCallback } from "react";
import type { Payment } from "@/types/paymentTypes";

export function usePaymentView() {
  const money = useCallback(
    (val: number) =>
      val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    []
  );

  const getSaldo = useCallback((p: Payment) => {
    return (
      (p.total ?? 0) -
      (p.discount ?? 0) -
      (p.downPayment ?? 0) -
      (p.paidAmount ?? 0)
    );
  }, []);

  return { money, getSaldo };
}
