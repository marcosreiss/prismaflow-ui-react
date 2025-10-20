import type { ApiResponse, PaginatedResponse } from "@/utils/apiResponse";

// ==============================
// 🔹 ENTIDADE: PRESCRIPTION
// ==============================
export type Prescription = {
  id: number;
  clientId: number;
  prescriptionId: number;
  prescriptionDate: string;

  doctorName?: string | null;
  crm?: string | null;

  // OD - Longe
  odSphericalFar?: string | null;
  odCylindricalFar?: string | null;
  odAxisFar?: string | null;
  odDnpFar?: string | null;

  // OD - Perto
  odSphericalNear?: string | null;
  odCylindricalNear?: string | null;
  odAxisNear?: string | null;
  odDnpNear?: string | null;

  // OE - Longe
  oeSphericalFar?: string | null;
  oeCylindricalFar?: string | null;
  oeAxisFar?: string | null;
  oeDnpFar?: string | null;

  // OE - Perto
  oeSphericalNear?: string | null;
  oeCylindricalNear?: string | null;
  oeAxisNear?: string | null;
  oeDnpNear?: string | null;

  // Películas
  odPellicleFar?: string | null;
  odPellicleNear?: string | null;
  oePellicleFar?: string | null;
  oePellicleNear?: string | null;

  // Gerais
  frameAndRef?: string | null;
  lensType?: string | null;
  notes?: string | null;

  additionRight?: string | null;
  additionLeft?: string | null;
  opticalCenterRight?: string | null;
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
  prescriptionId: number;
  prescriptionDate: string;
  doctorName?: string;
  crm?: string;

  odSphericalFar?: string;
  odCylindricalFar?: string;
  odAxisFar?: string;
  odDnpFar?: string;
  odSphericalNear?: string;
  odCylindricalNear?: string;
  odAxisNear?: string;
  odDnpNear?: string;

  oeSphericalFar?: string;
  oeCylindricalFar?: string;
  oeAxisFar?: string;
  oeDnpFar?: string;
  oeSphericalNear?: string;
  oeCylindricalNear?: string;
  oeAxisNear?: string;
  oeDnpNear?: string;

  odPellicleFar?: string;
  odPellicleNear?: string;
  oePellicleFar?: string;
  oePellicleNear?: string;

  frameAndRef?: string;
  lensType?: string;
  notes?: string;

  additionRight?: string;
  additionLeft?: string;
  opticalCenterRight?: string;
  opticalCenterLeft?: string;

  isActive?: boolean;
};

export type UpdatePrescriptionPayload = Partial<CreatePrescriptionPayload>;

// ==============================
// 🔹 ENTIDADE: EXPIRING PRESCRIPTION
// ==============================
export type ExpiringPrescription = {
  clientId: number;
  clientName: string;
  phone01?: string | null;

  id: number;
  prescriptionDate: string;
  doctorName?: string | null;
  crm?: string | null;

  odSphericalFar?: string | null;
  odCylindricalFar?: string | null;
  odAxisFar?: string | null;
  odDnpFar?: string | null;
  odSphericalNear?: string | null;
  odCylindricalNear?: string | null;
  odAxisNear?: string | null;
  odDnpNear?: string | null;

  oeSphericalFar?: string | null;
  oeCylindricalFar?: string | null;
  oeAxisFar?: string | null;
  oeDnpFar?: string | null;
  oeSphericalNear?: string | null;
  oeCylindricalNear?: string | null;
  oeAxisNear?: string | null;
  oeDnpNear?: string | null;

  odPellicleFar?: string | null;
  odPellicleNear?: string | null;
  oePellicleFar?: string | null;
  oePellicleNear?: string | null;

  frameAndRef?: string | null;
  lensType?: string | null;
  notes?: string | null;

  additionRight?: string | null;
  additionLeft?: string | null;
  opticalCenterRight?: string | null;
  opticalCenterLeft?: string | null;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ==============================
// 📦 RESPONSE TYPES
// ==============================
export type PrescriptionsResponse = ApiResponse<
  PaginatedResponse<Prescription>
>;
export type PrescriptionResponse = ApiResponse<Prescription>;
export type ExpiringPrescriptionsResponse = ApiResponse<
  PaginatedResponse<ExpiringPrescription>
>;
