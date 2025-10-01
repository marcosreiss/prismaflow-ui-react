/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ItemProduct } from "./itemProductTypes";
import type { ProtocolCreate } from "./protocolTypes";

export type SaleApi = {
    id?: number;
    client?: {
        id: number;
        name: string;
        cpf: string;
    };
    products?: Array<{
        id: number;
        productId: number;
        name: string;
        quantity: number;
        unitPrice: number;
        total: number;
        frameDetailsResponse: any | null;
    }>;
    services?: Array<{
        id: number;
        opticalServiceId: number;
        description: string;
        price: number;
    }>;
    protocol?: ProtocolCreate;
    discount: number;
    notes: string;
    isActive: boolean;
    subtotal: number;
    total: number;
    createdAt?: string;
    updatedAt?: string;
};

export type Sale = {
    id: number;
    client?: any;
    productItems: ItemProduct[];
    clientName: string;
    serviceItems: Array<{
        service: any;
    }>;
    discount: number;
    notes: string;
    isActive: boolean;
    subtotal: number;
    total: number;
    protocol?: ProtocolCreate; // Usar o tipo de criação
    createdAt: string;
    updatedAt?: string;

};

// Tipo para a lista de vendas (response da API)
export type SaleListResponse = {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    content: SaleListItem[];
};

export type SaleListItem = {
    id: number;
    clientName: string;
    total: number;
    createdAt: string;
};