import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import baseApi from "@/utils/axios";

import type {
  ProductsResponse,
  ProductResponse,
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/productTypes";
import type { ApiResponse } from "@/utils/apiResponse";

// =============================
// 🔹 HOOK: GET ALL (paginated)
// =============================
export const useGetProducts = ({
  page,
  limit,
  search,
  category,
}: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}) => {
  return useQuery<ProductsResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["products", page, limit, search, category],
    queryFn: async () => {
      const { data } = await baseApi.get<ProductsResponse>("/api/products", {
        params: { page, limit, search: search || "", category: category || "" },
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

// =============================
// 🔹 HOOK: CREATE PRODUCT
// =============================
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProductResponse,
    AxiosError<ApiResponse<null>>,
    CreateProductPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<ProductResponse>(
        "/api/products",
        payload
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("✅ Produto criado:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao criar produto:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE PRODUCT
// =============================
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProductResponse,
    AxiosError<ApiResponse<null>>,
    { id: number; data: UpdateProductPayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<ProductResponse>(
        `/api/products/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("✅ Produto atualizado:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar produto:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: DELETE PRODUCT
// =============================
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(
        `/api/products/${id}`
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      console.log("✅ Produto excluído:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao excluir produto:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: GET BY ID
// =============================
export const useGetProductById = (id?: number) => {
  return useQuery<ProductResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await baseApi.get<ProductResponse>(
        `/api/products/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};

// =============================
// 🔹 HOOK: GET PRODUCT STOCK
// =============================
export const useGetProductStock = (id?: number) => {
  return useQuery<
    ApiResponse<ProductResponse>,
    AxiosError<ApiResponse<null>>
  >({
    queryKey: ["productStock", id],
    queryFn: async () => {
      const { data } = await baseApi.get<
        ApiResponse<ProductResponse>
      >(`/api/products/${id}/stock`);
      return data;
    },
    enabled: !!id,
  });
};
