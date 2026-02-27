import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import baseApi from "@/utils/axios";

import type {
  ExpensesResponse,
  ExpenseResponse,
  CreateExpensePayload,
  UpdateExpensePayload,
} from "../types/expenseTypes";
import type { ApiResponse } from "@/utils/apiResponse";

// =============================
// 🔹 HOOK: GET ALL (paginated)
// =============================
export const useGetExpenses = ({
  page,
  limit,
  branchId,
  status,
  search,
}: {
  page: number;
  limit: number;
  branchId?: string;
  status?: string;
  search?: string;
}) => {
  return useQuery<ExpensesResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["expenses", page, limit, branchId, status, search],
    queryFn: async () => {
      const { data } = await baseApi.get<ExpensesResponse>("/api/expenses", {
        params: {
          page,
          limit,
          branchId: branchId || undefined,
          status: status || undefined,
          search: search || undefined,
        },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

// =============================
// 🔹 HOOK: GET BY ID
// =============================
export const useGetExpenseById = (id?: number) => {
  return useQuery<ExpenseResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["expense", id],
    queryFn: async () => {
      const { data } = await baseApi.get<ExpenseResponse>(
        `/api/expenses/${id}`,
      );
      return data;
    },
    enabled: !!id,
  });
};

// =============================
// 🔹 HOOK: CREATE EXPENSE
// =============================
export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ExpenseResponse,
    AxiosError<ApiResponse<null>>,
    CreateExpensePayload
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<ExpenseResponse>(
        "/api/expenses",
        payload,
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      console.log("✅ Despesa criada:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao criar despesa:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE EXPENSE
// =============================
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ExpenseResponse,
    AxiosError<ApiResponse<null>>,
    { id: number; data: UpdateExpensePayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<ExpenseResponse>(
        `/api/expenses/${id}`,
        data,
      );
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      console.log("✅ Despesa atualizada:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar despesa:",
        err.response?.data?.message,
      );
    },
  });
};

// =============================
// 🔹 HOOK: DELETE EXPENSE
// =============================
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(
        `/api/expenses/${id}`,
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      console.log("✅ Despesa excluída:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao excluir despesa:", err.response?.data?.message);
    },
  });
};
