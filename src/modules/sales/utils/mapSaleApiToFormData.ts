// ==============================
// 🔹 mapSaleApiToFormData.ts
// ==============================
import type {
  Sale,
  CreateSalePayload,
  SaleProductItem,
  SaleServiceItem,
  Protocol,
} from "@/modules/sales/types/salesTypes";

/**
 * Mapeia o retorno da API (Sale completo) para o formato usado pelo formulário.
 * Isso permite reusar o hook `useSaleForm` tanto em criação quanto edição.
 */
export const mapSaleApiToFormData = (sale: Sale): CreateSalePayload => {
  if (!sale)
    throw new Error("mapSaleApiToFormData: parâmetro 'sale' é obrigatório");

  // ==============================
  // 🔹 Mapear produtos
  // ==============================
  const productItems =
    sale.productItems?.map((item: SaleProductItem) => ({
      productId: item.productId,
      quantity: item.quantity,
      frameDetails: item.frameDetails
        ? {
            material: item.frameDetails.material,
            reference: item.frameDetails.reference,
            color: item.frameDetails.color,
          }
        : undefined,
    })) ?? [];

  // ==============================
  // 🔹 Mapear serviços
  // ==============================
  const serviceItems =
    sale.serviceItems?.map((item: SaleServiceItem) => ({
      serviceId: item.serviceId,
    })) ?? [];

  // ==============================
  // 🔹 Mapear protocolo
  // ==============================
  const protocol: Protocol | null = sale.protocol
    ? {
        recordNumber: sale.protocol.recordNumber ?? "",
        book: sale.protocol.book ?? "",
        page: sale.protocol.page ?? null,
        os: sale.protocol.os ?? "",
      }
    : null;

  // ==============================
  // 🔹 Retorno final no formato do formulário
  // ==============================
  const payload: CreateSalePayload = {
    clientId: sale.clientId,
    prescriptionId: sale.prescriptionId ?? null,
    productItems,
    serviceItems,
    protocol,
    subtotal: sale.subtotal ?? 0,
    discount: sale.discount ?? 0,
    total: sale.total ?? 0,
    notes: sale.notes ?? "",
  };

  return payload;
};
