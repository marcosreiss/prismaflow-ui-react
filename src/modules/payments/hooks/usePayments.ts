import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import baseApi from "@/utils/axios";

import type { ApiResponse } from "@/utils/apiResponse";
import type { PaymentStatus, PaymentMethod } from "../types/paymentEnums";
import type { Payment, PaymentInstallmentItem } from "../types/paymentEntities";
import type {
  PaymentDetails,
  PaymentApiDetailResponse,
  PaymentInstallmentWithCalculations,
} from "../types/paymentDetails";
import type {
  PaymentListItem,
  InstallmentListResponse,
  OverdueInstallmentsResponse,
} from "../types/paymentListTypes";
import type {
  ConfigurePaymentPayload,
  PayInstallmentPayload,
} from "../types/paymentPayloads";
import type { PaymentValidationResponse } from "../types/paymentValidation";

// =============================
// HOOK: GET ALL PAYMENTS (paginated)
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
  hasOverdueInstallments?: boolean;
  isPartiallyPaid?: boolean;
  dueDaysAhead?: number;
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
// HOOK: VALIDATE PAYMENT INTEGRITY
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
// HOOK: GET PAYMENT STATUS BY SALE ID
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
// HOOK: GET INSTALLMENTS BY PAYMENT ID
// =============================
export const useGetInstallmentsByPayment = (paymentId?: number) => {
  return useQuery<
    ApiResponse<InstallmentListResponse>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: ["installments", "payment", paymentId],
    queryFn: async () => {
      const { data } = await baseApi.get<ApiResponse<InstallmentListResponse>>(
        `/api/payment-installments/by-payment/${paymentId}`,
      );
      return data;
    },
    enabled: !!paymentId,
    staleTime: 30 * 1000, // 30 segundos
  });
};

// =============================
// HOOK: GET INSTALLMENT BY ID
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
      >(`/api/payment-installments/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 30 * 1000, // 30 segundos
  });
};

// =============================
// HOOK: GET OVERDUE INSTALLMENTS
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
      >("/api/payment-installments/overdue", {
        params: { page, limit },
      });
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

// =============================
// HOOK: PAY INSTALLMENT
// paidAmount é acumulativo — a parcela é quitada quando paidAmount >= amount
// =============================
export const usePayInstallment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PaymentInstallmentItem>,
    AxiosError<ApiResponse<null>>,
    { id: number; data: PayInstallmentPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.patch<ApiResponse<PaymentInstallmentItem>>(
        `/api/payment-installments/${id}/pay`,
        data,
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({
        queryKey: ["installment", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payment", "details"],
      });

      if (res.data?.paymentMethodId) {
        queryClient.invalidateQueries({
          queryKey: ["installments", "payment", res.data.paymentMethodId],
        });
      }

      console.log("Parcela paga:", res.message);
    },
    onError: (err) => {
      console.error("Erro ao pagar parcela:", err.response?.data?.message);
    },
  });
};

// =============================
// HOOK: UPDATE INSTALLMENT
// Atualiza campos da parcela (amount, dueDate, sequence)
// Não use para registrar pagamento — use usePayInstallment para isso
// =============================
export const useUpdateInstallment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<PaymentInstallmentItem>,
    AxiosError<ApiResponse<null>>,
    {
      id: number;
      data: Partial<
        Pick<PaymentInstallmentItem, "amount" | "dueDate" | "sequence">
      >;
    }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<ApiResponse<PaymentInstallmentItem>>(
        `/api/payment-installments/${id}`,
        data,
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      queryClient.invalidateQueries({
        queryKey: ["installment", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["payments"] });

      if (res.data?.paymentMethodId) {
        queryClient.invalidateQueries({
          queryKey: ["payment", "details", res.data.paymentMethodId],
        });
      }

      console.log("Parcela atualizada:", res.message);
    },
    onError: (err) => {
      console.error("Erro ao atualizar parcela:", err.response?.data?.message);
    },
  });
};

// =============================
// HOOK: CREATE PAYMENT
// Cria o registro de pagamento vinculado a uma venda.
// Após criar, use useConfigurePayment para definir os métodos.
// =============================
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payment>,
    AxiosError<ApiResponse<null>>,
    { saleId: number; branchId: string; tenantId: string }
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<ApiResponse<Payment>>(
        "/api/payments",
        payload,
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      console.log("Pagamento criado:", res.message);
    },
    onError: (err) => {
      console.error("Erro ao criar pagamento:", err.response?.data?.message);
    },
  });
};

// =============================
// HOOK: CONFIGURE PAYMENT (substitui useUpdatePayment)
// Configura ou reconfigura os métodos via PUT /payments/:id.
// Substitui todos os métodos anteriores se nenhuma parcela foi paga.
// A soma de methods[].amount deve ser igual ao total (tolerância R$ 0,01).
// =============================
export const useConfigurePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Payment>,
    AxiosError<ApiResponse<null>>,
    { id: number; data: ConfigurePaymentPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<ApiResponse<Payment>>(
        `/api/payments/${id}`,
        data,
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payment", "details", variables.id],
      });
      // Parcelas são regeradas pelo backend ao reconfigurar
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      console.log("Pagamento configurado:", res.message);
    },
    onError: (err) => {
      console.error(
        "Erro ao configurar pagamento:",
        err.response?.data?.message,
      );
    },
  });
};

// =============================
// HOOK: DELETE PAYMENT
// =============================
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(
        `/api/payments/${id}`,
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      console.log("Pagamento excluído:", res.message);
    },
    onError: (err) => {
      console.error("Erro ao excluir pagamento:", err.response?.data?.message);
    },
  });
};

// =============================
// HOOK: GET PAYMENT BY ID
// =============================
export const useGetPaymentById = (id?: number) => {
  return useQuery<ApiResponse<PaymentDetails>, AxiosError<ApiResponse<null>>>({
    queryKey: ["payment", "details", id],
    queryFn: async () => {
      const { data } = await baseApi.get<ApiResponse<PaymentApiDetailResponse>>(
        `/api/payments/${id}`,
      );

      // Mapear para garantir que clientName esteja preenchido
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

// =============================
// HOOK: UPDATE PAYMENT STATUS
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
        { status, reason },
      );
      return res.data;
    },
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({
        queryKey: ["payment", "details", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["installments"] });
      console.log("Status do pagamento atualizado:", res.message);
    },
    onError: (err) => {
      console.error(
        "Erro ao atualizar status do pagamento:",
        err.response?.data?.message,
      );
    },
  });
};

// =============================
// HELPERS
// =============================

// Normaliza a resposta da API para o tipo PaymentDetails consumido pelo front.
// Garante que clientName esteja preenchido independente de onde vier na resposta.
// Prioridade: sale.clientName > sale.client.name > clientName direto
function mapApiResponseToPaymentDetails(
  apiData: PaymentApiDetailResponse,
): PaymentDetails {
  const clientName =
    apiData.sale?.clientName ||
    apiData.sale?.client?.name ||
    apiData.clientName ||
    "Cliente não informado";

  return {
    id: apiData.id,
    saleId: apiData.saleId,
    saleDate: apiData.saleDate ?? apiData.sale?.saleDate ?? null,
    status: apiData.status,
    total: apiData.total,
    discount: apiData.discount,
    paidAmount: apiData.paidAmount,
    installmentsPaid: apiData.installmentsPaid,
    lastPaymentAt: apiData.lastPaymentAt,
    isActive: apiData.isActive,
    branchId: apiData.branchId,
    tenantId: apiData.tenantId,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    methods: apiData.methods ?? [],
    clientName,
    sale: apiData.sale
      ? {
          id: apiData.sale.id,
          saleDate: apiData.sale.saleDate ?? apiData.saleDate ?? null,
          subtotal: apiData.sale.subtotal,
          discount: apiData.sale.discount,
          total: apiData.sale.total,
          notes: apiData.sale.notes,
          clientName: apiData.sale.clientName,
          client: apiData.sale.client,
        }
      : undefined,
  };
}
