import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import baseApi from "@/services/axios";

import type {
  ClientsResponse,
  ClientResponse,
  CreateClientPayload,
  UpdateClientPayload,
  ClientSelectResponse,
} from "../types/clientTypes";
import type { ApiResponse } from "@/types/apiResponse";

// =============================
// 🔹 HOOK: GET ALL (paginated)
// =============================
export const useGetClients = ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery<ClientsResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["clients", page, limit, search],
    queryFn: async () => {
      const { data } = await baseApi.get<ClientsResponse>("/api/clients", {
        params: { page, limit, search: search || "" },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

// =============================
// 🔹 HOOK: CREATE CLIENT
// =============================
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ClientResponse,
    AxiosError<ApiResponse<null>>,
    CreateClientPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<ClientResponse>(
        "/api/clients",
        payload
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      console.log("✅ Cliente criado:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao criar cliente:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE CLIENT
// =============================
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ClientResponse,
    AxiosError<ApiResponse<null>>,
    { id: number; data: UpdateClientPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<ClientResponse>(`/api/clients/${id}`, data);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      console.log("✅ Cliente atualizado:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar cliente:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: DELETE CLIENT
// =============================
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(
        `/api/clients/${id}`
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      console.log("✅ Cliente excluído:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao excluir cliente:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: GET BY ID
// =============================
export const useGetClientById = (id?: number) => {
  return useQuery<ClientResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["client", id],
    queryFn: async () => {
      const { data } = await baseApi.get<ClientResponse>(`/api/clients/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// =============================
// 🔹 HOOK: SELECT CLIENTS (autocomplete)
// =============================
export const useSelectClients = (name: string) => {
  return useQuery<ClientSelectResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["clients", "select", name],
    queryFn: async () => {
      const { data } = await baseApi.get<ClientSelectResponse>(
        "/api/clients/select",
        { params: { name } }
      );
      return data;
    },
    enabled: !!name && name.length >= 2, // só busca se tiver pelo menos 2 letras
    staleTime: 1000 * 60 * 5, // cache por 5 minutos
  });
};
