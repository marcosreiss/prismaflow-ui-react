import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";

// ==============================
// 🔹 ENTIDADE: CLIENT
// ==============================
export type Client = {
  id: number;
  name: string;
  nickname: string | null;
  cpf: string | null;
  rg: string | null;
  bornDate: string | null;
  gender: string | null;
  fatherName: string | null;
  motherName: string | null;
  spouse: string | null;
  email: string | null;
  company: string | null;
  occupation: string | null;
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  uf: string | null;
  cep: string | null;
  complement: string | null;
  isBlacklisted: boolean | null;
  obs: string | null;
  phone01: string | null;
  phone02: string | null;
  phone03: string | null;
  reference01: string | null;
  reference02: string | null;
  reference03: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // 🔹 Relacionamento: cliente possui várias receitas
  prescriptions?: Prescription[];
};

// ==============================
// 📨 PAYLOADS (REQUEST)
// ==============================
export type CreateClientPayload = {
  name: string;
  nickname?: string | null;
  cpf?: string | null;
  rg?: string | null;
  bornDate?: string | null;
  gender?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  spouse?: string | null;
  email?: string | null;
  company?: string | null;
  occupation?: string | null;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  uf?: string | null;
  cep?: string | null;
  complement?: string | null;
  obs?: string | null;
  phone01?: string | null;
  phone02?: string | null;
  phone03?: string | null;
  reference01?: string | null;
  reference02?: string | null;
  reference03?: string | null;
};

export type UpdateClientPayload = Partial<CreateClientPayload> & {
  isBlacklisted?: boolean | null;
  isActive?: boolean;
};

// ==============================
// 📦 RESPONSE TYPES
// ==============================
export type ClientsResponse = ApiResponse<PaginatedResponse<Client>>;
export type ClientResponse = ApiResponse<Client>;
