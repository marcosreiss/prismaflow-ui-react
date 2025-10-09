import type { Product } from "@/modules/products/types/productTypes";
import type { CreateSalePayload, Protocol } from "../types/salesTypes";


/**
 * Remove strings vazias e normaliza valores nulos
 */
const normalizeString = (value?: string | null): string | undefined =>
    value && value.trim().length > 0 ? value.trim() : undefined;

/**
 * Mapeia o estado do formulário de venda (front)
 * para o payload esperado pela API no fluxo de criação.
 */
export function mapSaleToPayload(
    data: CreateSalePayload
): CreateSalePayload {
    // --- Produtos
    const productItems =
        data.productItems
            ?.map((item): { productId: number; quantity: number; } | undefined => {
                const productId =
                    item.productId ??
                    (item.product ? (item.product as Product).id : undefined);

                if (!productId) return undefined;

                const productPayload: {
                    productId: number;
                    quantity: number;
                    frameDetails?: {
                        material: string;
                        reference?: string;
                        color?: string;
                    };
                } = {
                    productId,
                    quantity: item.quantity ?? 1,
                };

                if (item.frameDetails) {
                    productPayload.frameDetails = {
                        material: item.frameDetails.material,
                        reference: normalizeString(item.frameDetails.reference),
                        color: normalizeString(item.frameDetails.color),
                    };
                }

                return productPayload;
            })
            .filter(
                (item): item is {
                    productId: number;
                    quantity: number;
                    frameDetails?: {
                        material: string;
                        reference?: string;
                        color?: string;
                    };
                } => item !== undefined
            ) ?? [];

    // --- Serviços
    const serviceItems =
        data.serviceItems
            ?.map((item): { serviceId: number } | undefined => {
                const serviceId = item.serviceId ?? item.service?.id;
                if (!serviceId) return undefined;
                return { serviceId };
            })
            .filter((item): item is { serviceId: number } => item !== undefined) ?? [];

    // --- Protocolo (opcional)
    const hasProtocolFields =
        data.protocol &&
        (normalizeString(data.protocol.recordNumber) ||
            normalizeString(data.protocol.book) ||
            typeof data.protocol.page === "number" ||
            normalizeString(data.protocol.os));

    const protocol: Protocol | undefined = hasProtocolFields
        ? {
            recordNumber: normalizeString(data.protocol?.recordNumber) ?? null,
            book: normalizeString(data.protocol?.book) ?? null,
            page:
                typeof data.protocol?.page === "number"
                    ? data.protocol.page
                    : null,
            os: normalizeString(data.protocol?.os) ?? null,
        }
        : undefined;

    // --- Payload final
    const payload: CreateSalePayload = {
        clientId: data.clientId,
        prescriptionId: data.prescriptionId ?? null,
        productItems: productItems.length > 0 ? productItems : [],
        serviceItems: serviceItems.length > 0 ? serviceItems : [],
        subtotal: data.subtotal ?? 0,
        discount: data.discount ?? 0,
        total: data.total ?? 0,
        notes: normalizeString(data.notes),
        protocol: protocol ?? null,
    };

    return payload;
}

/**
 * Limpa e normaliza o estado do formulário antes de mapear
 */
export function sanitizeSaleData(
    data: CreateSalePayload
): CreateSalePayload {
    const sanitized: CreateSalePayload = {
        ...data,
        notes: normalizeString(data.notes),
        productItems:
            data.productItems?.map((item) => ({
                ...item,
                quantity: item.quantity ?? 1,
                frameDetails: item.frameDetails
                    ? {
                        material: item.frameDetails.material,
                        reference: normalizeString(item.frameDetails.reference),
                        color: normalizeString(item.frameDetails.color),
                    }
                    : undefined,
            })) ?? [],
        serviceItems:
            data.serviceItems?.map((item) => ({
                ...item,
            })) ?? [],
        protocol: data.protocol
            ? {
                recordNumber: normalizeString(data.protocol.recordNumber) ?? null,
                book: normalizeString(data.protocol.book) ?? null,
                page:
                    typeof data.protocol.page === "number"
                        ? data.protocol.page
                        : null,
                os: normalizeString(data.protocol.os) ?? null,
            }
            : null,
    };

    return sanitized;
}
