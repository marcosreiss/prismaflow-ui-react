export type Prescription = {
    id: number;
    protocol: any; // Protocol type
    doctorName: string;
    crm: string;
    odSpherical: string;
    odCylindrical: string;
    odAxis: string;
    odDnp: string;
    oeSpherical: string;
    oeCylindrical: string;
    oeAxis: string;
    oeDnp: string;
    addition: string;
    opticalCenter: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
};

// Tipo para criação (sem campos obrigatórios do backend)
export type PrescriptionCreate = {
    doctorName: string;
    crm: string;
    odSpherical: string;
    odCylindrical: string;
    odAxis: string;
    odDnp: string;
    oeSpherical: string;
    oeCylindrical: string;
    oeAxis: string;
    oeDnp: string;
    addition: string;
    opticalCenter: string;
};