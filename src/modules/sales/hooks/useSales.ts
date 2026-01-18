import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/utils/axios";
import type {
  SalePayload,
  SalesResponse,
  SaleResponse,
} from "../types/salesTypes";
import type { ApiResponse } from "@/utils/apiResponse";

const SALES_ENDPOINT = "/api/sales";

// ==============================
// 🔹 LISTAR VENDAS (paginado + filtro opcional)
// ==============================
export function useGetSales(
  page: number = 1,
  limit: number = 10,
  clientId?: number,
  clientName?: string,
) {
  return useQuery<SalesResponse>({
    queryKey: ["sales", page, limit, clientId, clientName], 
    queryFn: async (): Promise<SalesResponse> => {
      const params: Record<string, string | number> = {
        page,
        limit,
      };

      if (clientId !== undefined) {
        params.clientId = clientId;
      }

      if (clientName !== undefined && clientName.trim() !== "") {
        params.clientName = clientName.trim();
      }

      const { data } = await api.get<SalesResponse>(SALES_ENDPOINT, {
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
  return useQuery<SaleResponse>({
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

  return useMutation<SaleResponse, unknown, SalePayload>({
    mutationFn: async (payload) => {
      console.log("Creating sale with payload:", payload);
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

  return useMutation<SaleResponse, unknown, SalePayload>({
    mutationFn: async (payload) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { clientId, id, ...updatePayload } = payload;
      console.log("Updating sale with payload:", updatePayload);
      const { data } = await api.put(`${SALES_ENDPOINT}/${id}`, updatePayload);
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

  return useMutation<ApiResponse<null>, unknown, number>({
    mutationFn: async (id) => {
      const { data } = await api.delete(`${SALES_ENDPOINT}/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
