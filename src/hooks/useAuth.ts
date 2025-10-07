// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  LoginRequest,
  LoginResponse,
  UserRegisterRequest,
  UserRegisterResponse,
} from "@/types/auth";
import { registerService } from "@/services/authService";
import baseApi from "@/services/config/api";
import type { ApiResponse } from "@/types/apiResponse";

/**
 * 🔐 Hook para autenticação (login) do usuário
 */
export const useLogin = () => {
  return useMutation<LoginResponse, AxiosError<ApiResponse<null>>, LoginRequest>({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<LoginResponse>(
        "/api/auth/login",
        payload
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("authToken", data.token ?? "");
      console.log("✅ Login efetuado com sucesso:", data.data?.name);
    },
    onError: (error) => {
      const errData = error.response?.data;
      console.error(`❌ ${errData?.message ?? "Erro desconhecido."}`);
    },
  });
};

/**
 * Hook para registro de novo usuário
 */
export const useRegister = () => {
  return useMutation<UserRegisterResponse, AxiosError, UserRegisterRequest>({
    mutationFn: (payload) => registerService(payload),
    onSuccess: (data) => {
      console.log("Usuário registrado com sucesso:", data);
    },
    onError: (error) => {
      console.error("Erro ao registrar usuário:", error);
    },
  });
};
