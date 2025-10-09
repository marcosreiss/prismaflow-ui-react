import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "@/utils/apiResponse";
import api from "@/utils/axios";
import type {
  CreateSalePayload,
  UpdateSalePayload,
  Sale,
} from "../types/salesTypes";

const SALES_ENDPOINT = "/sales";

// ==============================
// 🔹 LISTAR VENDAS (paginado + filtro opcional)
// ==============================
export function useGetSales(
  page: number = 1,
  limit: number = 10,
  clientId?: number
) {
  return useQuery<PaginatedResponse<Sale>>({
    queryKey: ["sales", page, clientId],
    queryFn: async (): Promise<PaginatedResponse<Sale>> => {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (clientId !== undefined) {
        params.clientId = clientId;
      }

      const { data } = await api.get<PaginatedResponse<Sale>>(SALES_ENDPOINT, {
        params,
      });

      return data;
    },
  });
}

// ==============================
// 🔹 BUSCAR VENDA POR ID (detalhes)
// ==============================
export function useGetSaleById(id: number | null) {
  return useQuery<ApiResponse<Sale>>({
    queryKey: ["sale", id],
    queryFn: async () => {
      const { data } = await api.get(`${SALES_ENDPOINT}/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// ==============================
// 🔹 CRIAR NOVA VENDA
// ==============================
export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Sale>, unknown, CreateSalePayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post(`${SALES_ENDPOINT}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}

// ==============================
// 🔹 ATUALIZAR VENDA EXISTENTE
// ==============================
export function useUpdateSale() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Sale>, unknown, UpdateSalePayload>({
    mutationFn: async (payload) => {
      const { data } = await api.put(
        `${SALES_ENDPOINT}/${payload.id}`,
        payload
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sale", variables.id] });
    },
  });
}

// ==============================
// 🔹 EXCLUIR VENDA
// ==============================
export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, unknown, number>({
    mutationFn: async (id) => {
      const { data } = await api.delete(`${SALES_ENDPOINT}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
