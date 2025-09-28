import type { Customer } from "./customerTypes";
import type { ItemProduct } from "./itemProductTypes";
import type { ItemService } from "./itemServiceTypes";
import type { Payment } from "./paymentTypes";
import type { Protocol } from "./protocolTypes";

export type Sale = {
    id: number;
    client: Customer;
    protocol: Protocol | null;
    payment: Payment | null;
    productItems: ItemProduct[];
    serviceItems: ItemService[];
    subtotal: number;
    discount: number;
    total: number;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
};