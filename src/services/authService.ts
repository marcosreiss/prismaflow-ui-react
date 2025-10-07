// src/services/authService.ts
import api from "./config/api";
import type {
  UserRegisterRequest,
  UserRegisterResponse,
  UserLoginRequest,
  UserLoginResponse,
} from "@/types/auth";

//  Registro
export const registerService = async (
  payload: UserRegisterRequest
): Promise<UserRegisterResponse> => {
  const response = await api.post<UserRegisterResponse>("/api/auth/register", payload);
  return response.data;
};

//  Login
export const loginService = async (
  payload: UserLoginRequest
): Promise<UserLoginResponse> => {
  const response = await api.post<UserLoginResponse>("/api/auth/login", payload);
  return response.data;
};
