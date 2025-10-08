import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";

// ==============================
// 🔹 ENTIDADE: PRESCRIPTION
// ==============================
export type Prescription = {
  id: number;
  clientId: number;
  prescriptionDate: string;

  doctorName?: string | null;
  crm?: string | null;

  // Olho Direito (OD)
  odSpherical?: string | null;
  odCylindrical?: string | null;
  odAxis?: string | null;
  odDnp?: string | null;
  additionRight?: string | null;
  opticalCenterRight?: string | null;

  // Olho Esquerdo (OE)
  oeSpherical?: string | null;
  oeCylindrical?: string | null;
  oeAxis?: string | null;
  oeDnp?: string | null;
  additionLeft?: string | null;
  opticalCenterLeft?: string | null;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ==============================
// 📨 PAYLOADS (REQUEST)
// ==============================
export type CreatePrescriptionPayload = {
  clientId: number;
  prescriptionDate: string;
  doctorName?: string;
  crm?: string;

  odSpherical?: string;
  odCylindrical?: string;
  odAxis?: string;
  odDnp?: string;
  additionRight?: string;
  opticalCenterRight?: string;

  oeSpherical?: string;
  oeCylindrical?: string;
  oeAxis?: string;
  oeDnp?: string;
  additionLeft?: string;
  opticalCenterLeft?: string;

  isActive?: boolean;
};

export type UpdatePrescriptionPayload = Partial<CreatePrescriptionPayload>;

// ==============================
// 📦 RESPONSE TYPES
// ==============================
export type PrescriptionsResponse = ApiResponse<
  PaginatedResponse<Prescription>
>;
export type PrescriptionResponse = ApiResponse<Prescription>;
