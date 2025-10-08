// src/services/authService.ts
import api from "./config/api";
import type {
  UserRegisterRequest,
  UserRegisterResponse,
  LoginRequest,
  LoginResponse,
} from "@/modules/auth/types/auth";

//  Registro
export const registerService = async (
  payload: UserRegisterRequest
): Promise<UserRegisterResponse> => {
  const response = await api.post<UserRegisterResponse>("/api/auth/register", payload);
  return response.data;
};

//  Login
export const loginService = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/api/auth/login", payload);
  return response.data;
};
