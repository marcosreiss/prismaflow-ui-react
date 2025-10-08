import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type {
  BrandsResponse,
  BrandResponse,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@/modules/brands/brandTypes";
import type { ApiResponse } from "@/types/apiResponse";
import baseApi from "@/services/config/api";

// =============================
// 🔹 HOOK: GET ALL (paginated)
// =============================
export const useGetBrands = ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery<BrandsResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["brands", page, limit, search],
    queryFn: async () => {
      const { data } = await baseApi.get<BrandsResponse>("/api/brands", {
        params: { page, limit, search: search || "" },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

// =============================
// 🔹 HOOK: CREATE BRAND
// =============================
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<BrandResponse, AxiosError<ApiResponse<null>>, CreateBrandPayload>({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<BrandResponse>("/api/brands", payload);
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      console.log("✅ Marca criada:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao criar marca:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE BRAND
// =============================
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<BrandResponse, AxiosError<ApiResponse<null>>, { id: number; data: UpdateBrandPayload }>({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<BrandResponse>(`/api/brands/${id}`, data);
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      console.log("✅ Marca atualizada:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao atualizar marca:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: DELETE BRAND
// =============================
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(`/api/brands/${id}`);
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      console.log("✅ Marca excluída:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao excluir marca:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: GET BY ID
// =============================
export const useGetBrandById = (id?: number) => {
  return useQuery<BrandResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["brand", id],
    queryFn: async () => {
      const { data } = await baseApi.get<BrandResponse>(`/api/brands/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
