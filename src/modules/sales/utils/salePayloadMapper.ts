// src/modules/sales/utils/salePayloadMapper.ts
// Transforma o estado do formulário no payload final para a API
import type { Product } from "@/modules/products/types/productTypes";
import type { SalePayload, Protocol } from "../types/salesTypes";

const normalizeString = (value?: string | null): string | undefined =>
  value?.trim().length ? value.trim() : undefined;

export function buildSalePayload(data: SalePayload): SalePayload {
  // --- Produtos
  const productItems = (data.productItems ?? [])
    .map((item) => {
      const productId = item.productId ?? (item.product as Product)?.id;
      if (!productId) return undefined;

      return {
        productId,
        quantity: item.quantity ?? 1,
        ...(item.frameDetails && {
          frameDetails: {
            material: item.frameDetails.material,
            reference: normalizeString(item.frameDetails.reference),
            color: normalizeString(item.frameDetails.color),
          },
        }),
      };
    })
    .filter(Boolean) as SalePayload["productItems"];

  // --- Serviços
  const serviceItems = (data.serviceItems ?? [])
    .map((item) => {
      const serviceId = item.serviceId ?? item.service?.id;
      if (!serviceId) return undefined;
      return { serviceId };
    })
    .filter(Boolean) as SalePayload["serviceItems"];

  // --- Protocolo (só inclui se tiver ao menos um campo preenchido)
  const p = data.protocol;
  const hasProtocol =
    p &&
    (normalizeString(p.book) ||
      typeof p.page === "number" ||
      normalizeString(p.os));

  const protocol: Protocol | null = hasProtocol
    ? {
        book: normalizeString(p?.book) ?? null,
        page: typeof p?.page === "number" ? p.page : null,
        os: normalizeString(p?.os) ?? null,
      }
    : null;

  return {
    clientId: data.clientId,
    saleDate: data.saleDate,
    prescriptionId: data.prescriptionId ?? null,
    productItems,
    serviceItems,
    notes: normalizeString(data.notes),
    protocol,
  };
}
