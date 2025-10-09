import React from "react";
import type { ReactNode } from "react";
import { SaleFormProvider as SaleFormCoreProvider } from "./SaleFormContext";
import type { Sale } from "../types/salesTypes";

interface Props {
    mode: "create" | "edit";
    existingSale?: Sale | null;
    children: ReactNode;
}

/**
 * 🔹 Wrapper de alto nível que injeta o contexto do fluxo de vendas.
 * Deve envolver toda a tela de criação/edição de vendas
 * (ex: SaleFormManager e seus steps internos).
 *
 * Exemplo de uso:
 *
 * ```tsx
 * <SaleFormProvider mode="create">
 *   <SaleFormManager />
 * </SaleFormProvider>
 * ```
 */
export const SaleFormProvider: React.FC<Props> = ({ mode, existingSale, children }) => {
    return (
        <SaleFormCoreProvider mode={mode} existingSale={existingSale}>
            {children}
        </SaleFormCoreProvider>
    );
};

export default SaleFormProvider;
