import type { ApiResponse } from "./apiResponse";

//  Register
export type UserRegisterRequest = {
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER"; // pode expandir conforme sua API
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
  role: string;
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
// 🔐 FULL RESPONSE
// =======================
export type LoginResponse = ApiResponse<UserLoginData> & {
  token: string;
};
