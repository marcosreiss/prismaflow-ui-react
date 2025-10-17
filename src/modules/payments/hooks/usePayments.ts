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
} from "../types/paymentTypes";
import type { ApiResponse } from "@/utils/apiResponse";

// =============================
// 🔹 HOOK: GET ALL PAYMENTS (paginated)
// =============================
export const useGetPayments = ({
    page,
    limit,
    search,
    status,
    method,
}: {
    page: number;
    limit: number;
    search?: string;
    status?: PaymentStatus;
    method?: PaymentMethod;
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
        queryKey: ["payments", page, limit, search, status, method],
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
                    search: search || "",
                    status: status || "",
                    method: method || ""
                },
            });
            return data;
        },
        placeholderData: keepPreviousData,
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
            // Remover campos que não podem ser atualizados
            const updateData = data;
            const res = await baseApi.put<ApiResponse<Payment>>(
                `/api/payments/${id}`,
                updateData
            );
            return res.data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payment", res.data?.id] });
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
            console.error("❌ Erro ao excluir pagamento:", err.response?.data?.message);
        },
    });
};

// =============================
// 🔹 HOOK: GET PAYMENT BY ID
// =============================
export const useGetPaymentById = (id?: number) => {
    return useQuery<ApiResponse<PaymentDetails>, AxiosError<ApiResponse<null>>>({
        queryKey: ["payment", id],
        queryFn: async () => {
            const { data } = await baseApi.get<ApiResponse<PaymentDetails>>(
                `/api/payments/${id}`
            );
            return data;
        },
        enabled: !!id,
    });
};

// =============================
// 🔹 HOOK: GET PAYMENTS BY SALE ID
// =============================
export const useGetPaymentsBySaleId = (saleId?: number) => {
    return useQuery<ApiResponse<Payment[]>, AxiosError<ApiResponse<null>>>({
        queryKey: ["payments", "sale", saleId],
        queryFn: async () => {
            const { data } = await baseApi.get<ApiResponse<Payment[]>>(
                `/api/sales/${saleId}/payments`
            );
            return data;
        },
        enabled: !!saleId,
    });
};

// =============================
// 🔹 HOOK: UPDATE PAYMENT STATUS
// =============================
// usePayments.ts - Ajuste o hook useUpdatePaymentStatus
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
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payment", res.data?.id] });
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

// =============================
// 🔹 HOOK: PROCESS PAYMENT INSTALLMENT
// =============================
export const useProcessPaymentInstallment = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ApiResponse<Payment>,
        AxiosError<ApiResponse<null>>,
        { paymentId: number; installmentId: number; paidAmount: number }
    >({
        mutationFn: async ({ paymentId, installmentId, paidAmount }) => {
            const res = await baseApi.post<ApiResponse<Payment>>(
                `/api/payments/${paymentId}/installments/${installmentId}/process`,
                { paidAmount }
            );
            return res.data;
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ["payments"] });
            queryClient.invalidateQueries({ queryKey: ["payment", res.data?.id] });
            console.log("✅ Parcela processada:", res.message);
        },
        onError: (err) => {
            console.error(
                "❌ Erro ao processar parcela:",
                err.response?.data?.message
            );
        },
    });
};