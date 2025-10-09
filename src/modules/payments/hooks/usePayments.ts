import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponse, PaginatedResponse } from "@/types/apiResponse";
import api from "@/services/axios";
import type { Payment } from "@/types/paymentTypes";
import type { PaymentListItem, PaymentDetails, CreatePaymentPayload, UpdatePaymentPayload } from "../types/paymentTypes";

// ==============================
// 🔹 ENDPOINT BASE
// ==============================
const PAYMENTS_ENDPOINT = "/payments";

// ==============================
// 🔹 LISTAR PAGAMENTOS (paginado + filtro opcional por status)
// ==============================
export function useGetPayments(
  page: number = 1,
  limit: number = 10,
  status?: string
) {
  return useQuery<PaginatedResponse<PaymentListItem>>({
    queryKey: ["payments", page, status],
    queryFn: async (): Promise<PaginatedResponse<PaymentListItem>> => {
      const params: Record<string, string | number> = { page, limit };
      if (status) params.status = status;

      const { data } = await api.get<PaginatedResponse<PaymentListItem>>(
        PAYMENTS_ENDPOINT,
        { params }
      );
      return data;
    },
  });
}

// ==============================
// 🔹 BUSCAR PAGAMENTO POR ID (detalhes)
// ==============================
export function useGetPaymentById(id: number | null) {
  return useQuery<ApiResponse<PaymentDetails>>({
    queryKey: ["payment", id],
    queryFn: async (): Promise<ApiResponse<PaymentDetails>> => {
      const { data } = await api.get<ApiResponse<PaymentDetails>>(
        `${PAYMENTS_ENDPOINT}/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
}

// ==============================
// 🔹 BUSCAR STATUS DO PAGAMENTO POR SALE ID
// ==============================
export function useGetPaymentBySaleId(saleId: number | null) {
  return useQuery<ApiResponse<Payment>>({
    queryKey: ["paymentBySale", saleId],
    queryFn: async (): Promise<ApiResponse<Payment>> => {
      const { data } = await api.get<ApiResponse<Payment>>(
        `${PAYMENTS_ENDPOINT}/by-sale/${saleId}`
      );
      return data;
    },
    enabled: !!saleId,
  });
}

// ==============================
// 🔹 CRIAR NOVO PAGAMENTO
// ==============================
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Payment>, unknown, CreatePaymentPayload>({
    mutationFn: async (payload): Promise<ApiResponse<Payment>> => {
      const { data } = await api.post<ApiResponse<Payment>>(
        PAYMENTS_ENDPOINT,
        payload
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

// ==============================
// 🔹 ATUALIZAR PAGAMENTO EXISTENTE
// ==============================
export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Payment>, unknown, UpdatePaymentPayload>({
    mutationFn: async (payload): Promise<ApiResponse<Payment>> => {
      const { data } = await api.put<ApiResponse<Payment>>(
        `${PAYMENTS_ENDPOINT}/${payload.id}`,
        payload
      );
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["payment", variables.id] });
      if (variables.saleId) {
        queryClient.invalidateQueries({
          queryKey: ["paymentBySale", variables.saleId],
        });
      }
    },
  });
}

// ==============================
// 🔹 EXCLUIR PAGAMENTO
// ==============================
export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, unknown, number>({
    mutationFn: async (id): Promise<ApiResponse<void>> => {
      const { data } = await api.delete<ApiResponse<void>>(
        `${PAYMENTS_ENDPOINT}/${id}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}
