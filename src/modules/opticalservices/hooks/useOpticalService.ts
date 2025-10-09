import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import baseApi from "@/services/axios";
import type { ApiResponse } from "@/types/apiResponse";

import type {
  OpticalServicesResponse,
  OpticalServiceResponse,
  CreateOpticalServicePayload,
  UpdateOpticalServicePayload,
} from "../types/opticalServiceTypes";

// =============================
// 🔹 HOOK: GET ALL (paginated)
// =============================
export const useGetOpticalServices = ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery<OpticalServicesResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["optical-services", page, limit, search],
    queryFn: async () => {
      const { data } = await baseApi.get<OpticalServicesResponse>(
        "/api/optical-services",
        {
          params: { page, limit, search: search || "" },
        }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

// =============================
// 🔹 HOOK: CREATE
// =============================
export const useCreateOpticalService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    OpticalServiceResponse,
    AxiosError<ApiResponse<null>>,
    CreateOpticalServicePayload
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<OpticalServiceResponse>(
        "/api/optical-services",
        payload
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["optical-services"] });
      console.log("✅ Serviço ótico criado:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao criar serviço ótico:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE
// =============================
export const useUpdateOpticalService = () => {
  const queryClient = useQueryClient();

  return useMutation<
    OpticalServiceResponse,
    AxiosError<ApiResponse<null>>,
    { id: number; data: UpdateOpticalServicePayload }
  >({
    mutationFn: async ({ id, data }) => {
      const res = await baseApi.put<OpticalServiceResponse>(
        `/api/optical-services/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["optical-services"] });
      console.log("✅ Serviço ótico atualizado:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar serviço ótico:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: DELETE
// =============================
export const useDeleteOpticalService = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(
        `/api/optical-services/${id}`
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["optical-services"] });
      console.log("✅ Serviço ótico excluído:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao excluir serviço ótico:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: GET BY ID
// =============================
export const useGetOpticalServiceById = (id?: number) => {
  return useQuery<OpticalServiceResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["optical-service", id],
    queryFn: async () => {
      const { data } = await baseApi.get<OpticalServiceResponse>(
        `/api/optical-services/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};
