import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  LoginRequest,
  LoginResponse,
  UserRegisterRequest,
  UserRegisterResponse,
  AdminBranchSelectionResponse,
} from "@/modules/auth/types/auth";
import { registerService } from "@/services/authService";
import baseApi from "@/services/config/api";
import type { ApiResponse } from "@/types/apiResponse";

/**
 * 🔐 Hook para autenticação (login) do usuário
 */
export const useLogin = () => {
  return useMutation<
    LoginResponse | AdminBranchSelectionResponse, // 👈 aceita ambos os tipos de resposta
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
      // Detecta se é fluxo de seleção de filial
      if (
        "data" in data &&
        data.data !== undefined &&
        "branches" in data.data &&
        "tempToken" in data.data
      ) {
        console.log("⚙️ Admin com múltiplas filiais — seleção necessária");
        // Guarda temporariamente no storage para próxima etapa
        localStorage.setItem("tempAuthToken", data.data.tempToken);
        localStorage.setItem(
          "availableBranches",
          JSON.stringify(data.data.branches)
        );
        return; // o frontend (UI) exibirá a seleção de filiais
      }

      // 🔹 Caso normal (login direto)
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
 * 🧑‍💻 Hook para registro de novo usuário
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
