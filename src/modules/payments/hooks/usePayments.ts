import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import baseApi from "@/utils/axios";

import type {
  Payment,
  PaymentListItem,
  PaymentDetails,
  CreatePaymentPayload,
  UpdatePaymentPayload,
  PaymentStatus,
  PaymentMethod,
  PaymentApiDetailResponse,
  PaymentValidationResponse,
  InstallmentListResponse,
  OverdueInstallmentsResponse,
  PaymentInstallmentWithCalculations,
  PayInstallmentPayload,
  PaymentInstallment,
  UpdateInstallmentPayload,
} from "../types/paymentTypes";
import type { ApiResponse } from "@/utils/apiResponse";

// =============================
// 🔹 HOOK: GET ALL PAYMENTS (paginated) - ATUALIZADO
// =============================
export const useGetPayments = ({
  page,
  limit,
  clientName,
  clientId,
  status,
  method,
  startDate,
  endDate,
  hasOverdueInstallments,
  isPartiallyPaid,
  dueDaysAhead,
}: {
  page: number;
  limit: number;
  clientName?: string;
  clientId?: number;
  status?: PaymentStatus;
  method?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  hasOverdueInstallments?: boolean; // ✅ NOVO
  isPartiallyPaid?: boolean; // ✅ NOVO
  dueDaysAhead?: number; // ✅ NOVO
}) => {
  return useQuery<
    ApiResponse<{
      content: PaymentListItem[];
      totalElements: number;
      currentPage: number;
      totalPages: number;
      limit: number;
    }>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: [
      "payments",
      page,
      limit,
      clientName,
      clientId,
      status,
      method,
      startDate,
      endDate,
      hasOverdueInstallments,
      isPartiallyPaid,
      dueDaysAhead,
    ],
    queryFn: async () => {
      const { data } = await baseApi.get<
        ApiResponse<{
          content: PaymentListItem[];
          totalElements: number;
          currentPage: number;
          totalPages: number;
          limit: number;
        }>
      >("/api/payments", {
        params: {
          page,
          limit,
          clientName: clientName || undefined,
          clientId: clientId || undefined,
          status: status || undefined,
          method: method || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          hasOverdueInstallments: hasOverdueInstallments || undefined,
          isPartiallyPaid: isPartiallyPaid || undefined,
          dueDaysAhead: dueDaysAhead || undefined,
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

// =============================
// 🔹 HOOK: VALIDATE PAYMENT INTEGRITY - NOVO
// =============================
export const useValidatePayment = (id?: number) => {
  return useQuery<
    ApiResponse<PaymentValidationResponse>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: ["payment", "validate", id],
    queryFn: async () => {
      const { data } = await baseApi.get<
        ApiResponse<PaymentValidationResponse>
      >(`/api/payments/${id}/validate`);
      return data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// =============================
// 🔹 HOOK: GET PAYMENT STATUS BY SALE ID - NOVO
// =============================
export const useGetPaymentStatusBySale = (saleId?: number) => {
  return useQuery<
    ApiResponse<{ saleId: number; paymentId: number; status: PaymentStatus }>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: ["payment", "status", "sale", saleId],
    queryFn: async () => {
      const { data } = await baseApi.get<
        ApiResponse<{
          saleId: number;
          paymentId: number;
          status: PaymentStatus;
        }>
      >(`/api/payments/by-sale/${saleId}`);
      return data;
    },
    enabled: !!saleId,
    staleTime: 30 * 1000, // 30 segundos
  });
};

// =============================
// 🔹 HOOK: GET INSTALLMENTS BY PAYMENT ID - NOVO
// =============================
export const useGetInstallmentsByPayment = (paymentId?: number) => {
  return useQuery<
    ApiResponse<InstallmentListResponse>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: ["installments", "payment", paymentId],
    queryFn: async () => {
      const { data } = await baseApi.get<ApiResponse<InstallmentListResponse>>(
        `/api/payments/${paymentId}/installments`
      );
      return data;
    },
    enabled: !!paymentId,
    staleTime: 30 * 1000, // 30 segundos
  });
};

// =============================
// 🔹 HOOK: GET INSTALLMENT BY ID - NOVO
// =============================
export const useGetInstallmentById = (id?: number) => {
  return useQuery<
    ApiResponse<PaymentInstallmentWithCalculations>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: ["installment", id],
    queryFn: async () => {
      const { data } = await baseApi.get<
        ApiResponse<PaymentInstallmentWithCalculations>
      >(`/api/payments/installments/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 segundos
  });
};

// =============================
// 🔹 HOOK: GET OVERDUE INSTALLMENTS - NOVO
// =============================
export const useGetOverdueInstallments = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return useQuery<
    ApiResponse<OverdueInstallmentsResponse>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: ["installments", "overdue", page, limit],
    queryFn: async () => {
      const { data } = await baseApi.get<
        ApiResponse<OverdueInstallmentsResponse>
      >("/api/payments/installments/overdue", {
        params: { page, limit },
      });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// =============================
// 🔹 HOOK: PAY INSTALLMENT - NOVO (substitui useProcessPaymentInstallment)
// =============================
export const usePayInstallment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PaymentInstallmentWithCalculations>,
    AxiosError<ApiResponse<null>>,
    { id: number; data: PayInstallmentPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.patch<
        ApiResponse<PaymentInstallmentWithCalculations>
      >(`/api/payments/installments/${id}/pay`, data);
      return res.data;
    },
    onSuccess: (res, variables) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({
        queryKey: ["installment", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["payments"] });

      // Invalida o payment específico se soubermos o ID
      if (res.data?.paymentId) {
        queryClient.invalidateQueries({
          queryKey: ["payment", "details", res.data.paymentId],
        });
      }

      console.log("✅ Parcela paga:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao pagar parcela:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE INSTALLMENT - NOVO
// =============================
export const useUpdateInstallment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PaymentInstallment>,
    AxiosError<ApiResponse<null>>,
    { id: number; data: UpdateInstallmentPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<ApiResponse<PaymentInstallment>>(
        `/api/payments/installments/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({
        queryKey: ["installment", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["payments"] });

      // Invalida o payment específico se soubermos o ID
      if (res.data?.paymentId) {
        queryClient.invalidateQueries({
          queryKey: ["payment", "details", res.data.paymentId],
        });
      }

      console.log("✅ Parcela atualizada:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar parcela:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: CREATE PAYMENT
// =============================
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payment>,
    AxiosError<ApiResponse<null>>,
    CreatePaymentPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<ApiResponse<Payment>>(
        "/api/payments",
        payload
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      console.log("✅ Pagamento criado:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao criar pagamento:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE PAYMENT
// =============================
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payment>,
    AxiosError<ApiResponse<null>>,
    { id: number; data: UpdatePaymentPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<ApiResponse<Payment>>(
        `/api/payments/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      // ✅ ADICIONAR variables
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payment", "details", variables.id],
      }); // ✅ CORRIGIR
      queryClient.invalidateQueries({ queryKey: ["installments"] }); // ✅ ADICIONAR (caso gere parcelas)
      console.log("✅ Pagamento atualizado:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar pagamento:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: DELETE PAYMENT
// =============================
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(
        `/api/payments/${id}`
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      console.log("✅ Pagamento excluído:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao excluir pagamento:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: GET PAYMENT BY ID
// =============================

export const useGetPaymentById = (id?: number) => {
  return useQuery<ApiResponse<PaymentDetails>, AxiosError<ApiResponse<null>>>({
    queryKey: ["payment", "details", id],
    queryFn: async () => {
      const { data } = await baseApi.get<ApiResponse<PaymentApiDetailResponse>>(
        `/api/payments/${id}`
      );

      // ✅ Mapear para garantir que clientName esteja preenchido
      if (data.data) {
        const paymentDetails = mapApiResponseToPaymentDetails(data.data);
        return {
          ...data,
          data: paymentDetails,
        };
      }

      return data as ApiResponse<PaymentDetails>;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// 🔹 Função auxiliar para mapeamento
function mapApiResponseToPaymentDetails(
  apiData: PaymentApiDetailResponse
): PaymentDetails {
  // ✅ Agora temos type safety
  const clientName =
    apiData.sale?.clientName || // ← PRIMEIRO: busca em sale.clientName
    apiData.sale?.client?.name || // ← DEPOIS: busca em sale.client.name (fallback)
    apiData.clientName || // ← fallback adicional
    "Cliente não informado";

  return {
    // Campos básicos
    id: apiData.id,
    saleId: apiData.saleId,
    method: apiData.method,
    status: apiData.status,
    total: apiData.total,
    discount: apiData.discount,
    downPayment: apiData.downPayment,
    installmentsTotal: apiData.installmentsTotal,
    paidAmount: apiData.paidAmount,
    installmentsPaid: apiData.installmentsPaid,
    lastPaymentAt: apiData.lastPaymentAt,
    firstDueDate: apiData.firstDueDate,
    isActive: apiData.isActive,
    branchId: apiData.branchId,
    tenantId: apiData.tenantId,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,

    // Relações
    installments: apiData.installments || [],

    // Campos específicos do PaymentDetails
    clientName,
    sale: apiData.sale
      ? {
          id: apiData.sale.id,
          total: apiData.sale.total,
        }
      : undefined,
  };
}

// =============================
// 🔹 HOOK: UPDATE PAYMENT STATUS
// =============================
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payment>,
    AxiosError<ApiResponse<null>>,
    { id: number; status: PaymentStatus; reason?: string }
  >({
    mutationFn: async ({ id, status, reason }) => {
      const res = await baseApi.patch<ApiResponse<Payment>>(
        `/api/payments/${id}/status`,
        { status, reason }
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      // ✅ ADICIONAR variables
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payment", "details", variables.id],
      }); // ✅ CORRIGIR
      queryClient.invalidateQueries({ queryKey: ["installments"] }); // ✅ ADICIONAR
      console.log("✅ Status do pagamento atualizado:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar status do pagamento:",
        err.response?.data?.message
      );
    },
  });
};
