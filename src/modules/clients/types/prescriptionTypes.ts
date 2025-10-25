// types/prescriptionTypes.ts

import type { ApiResponse, PaginatedResponse } from "@/utils/apiResponse";

// ==============================
// 🔹 ENTIDADE: PRESCRIPTION
// ==============================
export type Prescription = {
  id: number;
  clientId: number;
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

/**
 * Payload para CRIAR uma nova receita
 * - Não inclui: id, createdAt, updatedAt (gerados pelo backend)
 * - clientId e prescriptionDate são obrigatórios
 * - lensType é obrigatório e não pode ser null
 * - Demais campos são opcionais
 */
export type CreatePrescriptionPayload = Omit<
  Prescription,
  'id' | 'createdAt' | 'updatedAt' | 'lensType'
> & {
  clientId: number;           // obrigatório
  prescriptionDate: string;   // obrigatório
  lensType: string;           // 👈 NOVO: obrigatório e não-nullable
};

/**
 * Payload para ATUALIZAR uma receita existente
 * - Todos os campos são opcionais (atualização parcial)
 * - clientId não pode ser alterado (removido do payload)
 */
export type UpdatePrescriptionPayload = Partial<
  Omit<Prescription, 'id' | 'clientId' | 'createdAt' | 'updatedAt'>
>;

// ==============================
// 🔹 ENTIDADE: EXPIRING PRESCRIPTION
// ==============================
export type ExpiringPrescription = {
  // Dados do cliente
  clientId: number;
  clientName: string;
  phone01?: string | null;

  // Dados da receita
  id: number;
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
// 📦 RESPONSE TYPES
// ==============================
export type PrescriptionsResponse = ApiResponse<
  PaginatedResponse<Prescription>
>;
export type PrescriptionResponse = ApiResponse<Prescription>;
export type ExpiringPrescriptionsResponse = ApiResponse<
  PaginatedResponse<ExpiringPrescription>
>;
