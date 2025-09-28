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

//  Login
export type UserLoginRequest = {
  username: string;
  password: string;
};

export type UserLoginData = {
  id: string | number;
  username: string;
  email: string;
  role: string;
  password?: string | null;
};

// 👇 Novo tipo de resposta que inclui token fora de data
export type UserLoginResponse = ApiResponse<UserLoginData> & {
  token: string;
};
