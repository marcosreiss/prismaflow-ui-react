import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  LoginRequest,
  LoginResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  AdminBranchSelectionResponse,
} from "@/modules/auth/types/auth";
import baseApi from "@/utils/axios";
import type { ApiResponse } from "@/utils/apiResponse";

/**
 * 🔐 Hook para autenticação (login) do usuário
 */
export const useLogin = () => {
  return useMutation<
    LoginResponse | AdminBranchSelectionResponse,
    AxiosError<ApiResponse<null>>,
    LoginRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<
        LoginResponse | AdminBranchSelectionResponse
      >("/api/auth/login", payload);
      return data;
    },
    onSuccess: (data) => {
      if (
        "data" in data &&
        data.data !== undefined &&
        "branches" in data.data &&
        "tempToken" in data.data
      ) {
        console.log("⚙️ Admin com múltiplas filiais — seleção necessária");
        localStorage.setItem("tempAuthToken", data.data.tempToken);
        localStorage.setItem(
          "availableBranches",
          JSON.stringify(data.data.branches)
        );
        return;
      }

      const typedData = data as LoginResponse;
      localStorage.setItem("authToken", typedData.token ?? "");
      console.log("✅ Login efetuado com sucesso:", typedData.data?.name);
    },
    onError: (error) => {
      const errData = error.response?.data;
      console.error(`❌ ${errData?.message ?? "Erro desconhecido."}`);
    },
  });
};

/**
 * 🧑‍💻 Hook para registro de novo usuário (Manager ou Employee)
 */
export const useRegister = () => {
  return useMutation<
    UserRegisterResponse,
    AxiosError<ApiResponse<null>>,
    UserRegisterRequest
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<UserRegisterResponse>(
        "/api/auth/register-user",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken") ?? ""}`,
          },
        }
      );
      return data;
    },
    onSuccess: (data) => {
      console.log("✅ Usuário registrado com sucesso:", data);
    },
    onError: (error) => {
      const errData = error.response?.data;
      console.error(`❌ ${errData?.message ?? "Erro ao registrar usuário."}`);
    },
  });
};
