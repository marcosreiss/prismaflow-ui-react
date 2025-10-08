import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

// ==============================
// 🔹 ENTIDADE: PRESCRIPTION
// ==============================
export type Prescription = {
  id: number;
  clientId: number;
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
};

// ==============================
// 📨 PAYLOADS (REQUEST)
// ==============================
export type CreatePrescriptionPayload = {
  clientId: number;
  prescriptionDate?: string;
  doctorName: string;
  crm: string;
  odSpherical?: string;
  odCylindrical?: string;
  odAxis?: string;
  odDnp?: string;
  oeSpherical?: string;
  oeCylindrical?: string;
  oeAxis?: string;
  oeDnp?: string;
  addition?: string;
  opticalCenter?: string;
};

export type UpdatePrescriptionPayload = Partial<CreatePrescriptionPayload>;

// ==============================
// 📦 RESPONSE TYPES
// ==============================
export type PrescriptionsResponse = ApiResponse<
  PaginatedResponse<Prescription>
>;
export type PrescriptionResponse = ApiResponse<Prescription>;
