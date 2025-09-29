import type { Protocol } from "./protocolTypes";

export type Prescription = {
    id: number;
    protocol: Protocol;
    doctorName: string | null;
    crm: string | null;

    // Olho Direito (OD)
    odSpherical: string | null;
    odCylindrical: string | null;
    odAxis: string | null;
    odDnp: string | null;

    // Olho Esquerdo (OE)
    oeSpherical: string | null;
    oeCylindrical: string | null;
    oeAxis: string | null;
    oeDnp: string | null;

    // Adicionais
    addition: string | null;
    opticalCenter: string | null;

    // Auditoria
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
};