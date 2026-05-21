// src/modules/sales/utils/salePayloadMapper.ts
// Transforma o estado do formulário no payload final para a API
import type { Product } from "@/modules/products/types/productTypes";
import type { SalePayload, Protocol } from "../types/salesTypes";

const normalizeString = (value?: string | null): string | undefined =>
  value?.trim().length ? value.trim() : undefined;

const normalizeNumber = (value?: number | string | null): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

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
  const normalizedPage = normalizeNumber(p?.page);
  const hasProtocol =
    p &&
    (normalizeString(p.book) ||
      normalizedPage !== null ||
      normalizeString(p.os));

  const protocol: Protocol | null = hasProtocol
    ? {
        book: normalizeString(p?.book) ?? null,
        page: normalizedPage,
        os: normalizeString(p?.os) ?? null,
      }
    : null;

  return {
    clientId: data.clientId,
    saleDate: data.saleDate,
    prescriptionId: data.prescriptionId ?? null,
    productItems,
    serviceItems,
    discount: data.discount ?? 0,
    notes: normalizeString(data.notes),
    protocol,
  };
}
