// modules/sales/context/useSaleFormContext.ts
import { useContext } from "react";
import { SaleFormContext } from "./SaleFormContext";

/**
 * Hook de acesso ao contexto do fluxo de vendas.
 * Deve ser usado somente dentro de <SaleFormProvider>.
 */
export const useSaleFormContext = () => {
  const ctx = useContext(SaleFormContext);
  if (!ctx) {
    throw new Error(
      "useSaleFormContext must be used within a SaleFormProvider"
    );
  }
  return ctx;
};

export default useSaleFormContext;
