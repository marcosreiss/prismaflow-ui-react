import type { Prescription } from "./prescriptionTypes";
import type { Sale } from "./saleTypes";

export type Protocol = {
    id: number;
    sale: Sale;
    prescription: Prescription | null;
    recordNumber: string | null;
    book: string | null;
    page: number | null;
    os: string | null;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
};