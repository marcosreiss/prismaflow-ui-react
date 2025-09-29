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

// Tipo para criação (sem campos obrigatórios do backend)
export type ProtocolCreate = {
    recordNumber?: string | null;
    book?: string | null;
    page?: number | null;
    os?: string | null;
    prescription?: Omit<Prescription, 'id' | 'protocol' | 'createdAt' | 'updatedAt' | 'isActive'> | null;
};

// Tipo para Prescription na criação
export type PrescriptionCreate = Omit<Prescription, 'id' | 'protocol' | 'createdAt' | 'updatedAt' | 'isActive'>;