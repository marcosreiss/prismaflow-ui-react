import type { ApiResponse } from "../../../utils/apiResponse";

export type UserRegisterRequest = {
  username: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UserRegisterData = {
  id: string | number;
  username: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

export type UserRegisterResponse = ApiResponse<UserRegisterData>;

// =======================
// 📨 REQUEST
// =======================
export type LoginRequest = {
  email: string;
  password: string;
};

// =======================
// 📦 RESPONSE (data)
// =======================
export type UserLoginData = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  branchId: string | null;
  createdById: string | null;
  updatedById: string | null;
  createdAt: string;
  updatedAt: string;
  tenant: {
    id: string;
    name: string;
    createdById: string | null;
    updatedById: string | null;
    createdAt: string;
    updatedAt: string;
  };
  branch: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

// =======================
// 🏢 TIPOS PARA LOGIN DE ADMIN (multi-filial)
// =======================

/**
 * Representa uma filial (branch) retornada no login do admin.
 */
export type BranchSummary = {
  id: string;
  name: string;
};

/**
 * Quando o admin possui múltiplas filiais, o backend retorna um token temporário
 * e a lista de filiais disponíveis para seleção.
 */
export type AdminBranchSelectionData = {
  branches: BranchSummary[];
  tempToken: string; // JWT válido por 5 minutos
};

/**
 * Resposta do login para o caso de admin com múltiplas filiais.
 */
export type AdminBranchSelectionResponse = ApiResponse<AdminBranchSelectionData>;

/**
 * Requisição enviada ao endpoint /auth/branch-selection.
 */
export type BranchSelectionRequest = {
  branchId: string;
};

/**
 * Resposta ao completar o login definitivo após seleção de filial.
 * (mesmo formato do LoginResponse normal)
 */
export type BranchSelectionResponse = LoginResponse;


// =======================
// 🔐 FULL RESPONSE
// =======================
export type LoginResponse = ApiResponse<UserLoginData> & {
  token: string;
};

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export const UserRoleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  EMPLOYEE: "Funcionário",
};
