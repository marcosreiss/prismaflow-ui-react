import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import api from "@/services/config/api";
import type { SaleListItem, Sale } from "@/types/saleTypes";
import type {
  SaleDetails,
  CreateSalePayload,
  UpdateSalePayload,
} from "../types/salesTypes";

// ==============================
// 🔹 ENDPOINT BASE
// ==============================
const SALES_ENDPOINT = "/sales";

// ==============================
// 🔹 LISTAR VENDAS (paginado + filtro opcional)
// ==============================
export function useGetSales(
  page: number = 1,
  limit: number = 10,
  clientId?: number
) {
  return useQuery<PaginatedResponse<SaleListItem>>({
    queryKey: ["sales", page, clientId],
    queryFn: async (): Promise<PaginatedResponse<SaleListItem>> => {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (clientId !== undefined) {
        params.clientId = clientId;
      }

      const { data } = await api.get<PaginatedResponse<SaleListItem>>(
        "/sales",
        {
          params,
        }
      );

      return data;
    },
  });
}

// ==============================
// 🔹 BUSCAR VENDA POR ID (detalhes)
// ==============================
export function useGetSaleById(id: number | null) {
  return useQuery<ApiResponse<SaleDetails>>({
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
