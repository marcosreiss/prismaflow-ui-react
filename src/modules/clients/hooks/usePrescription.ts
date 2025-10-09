import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import baseApi from "@/services/axios";

import type {
  PrescriptionsResponse,
  PrescriptionResponse,
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
} from "../types/prescriptionTypes";
import type { ApiResponse } from "@/types/apiResponse";

// =============================
// 🔹 HOOK: GET ALL (paginated)
// =============================
export const useGetPrescriptions = ({
  page,
  limit,
  clientId,
}: {
  page: number;
  limit: number;
  clientId?: number;
}) => {
  return useQuery<PrescriptionsResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["prescriptions", page, limit, clientId],
    queryFn: async () => {
      const { data } = await baseApi.get<PrescriptionsResponse>(
        "/api/prescriptions",
        {
          params: { page, limit, clientId },
        }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

// =============================
// 🔹 HOOK: CREATE PRESCRIPTION
// =============================
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PrescriptionResponse,
    AxiosError<ApiResponse<null>>,
    CreatePrescriptionPayload
  >({
    mutationFn: async (payload) => {
      const { data } = await baseApi.post<PrescriptionResponse>(
        "/api/prescriptions",
        payload
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      console.log("✅ Receita criada:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao criar receita:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: UPDATE PRESCRIPTION (CORRIGIDO E TYPE-SAFE)
// =============================
export const useUpdatePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PrescriptionResponse,
    AxiosError<ApiResponse<null>>,
    { id: number; data: UpdatePrescriptionPayload }
  >({
    mutationFn: async ({ id, data }) => {
      // AQUI ESTÁ A CORREÇÃO TYPE-SAFE (sem 'any'):
      // Definimos que 'data' é do tipo UpdatePrescriptionPayload E (&) também
      // possui uma propriedade opcional 'clientId' do tipo number.

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { clientId, ...dataToSend } = data as UpdatePrescriptionPayload & {
        clientId?: number;
      };

      const res = await baseApi.put<PrescriptionResponse>(
        `/api/prescriptions/${id}`,
        dataToSend // Agora 'dataToSend' é 100% compatível com UpdatePrescriptionPayload
      );
      return res.data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      console.log("✅ Receita atualizada:", res.message);
    },
    onError: (err) => {
      console.error(
        "❌ Erro ao atualizar receita:",
        err.response?.data?.message
      );
    },
  });
};

// =============================
// 🔹 HOOK: DELETE PRESCRIPTION
// =============================
export const useDeletePrescription = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ApiResponse<null>>, number>({
    mutationFn: async (id) => {
      const { data } = await baseApi.delete<ApiResponse<null>>(
        `/api/prescriptions/${id}`
      );
      return data;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      console.log("✅ Receita excluída:", res.message);
    },
    onError: (err) => {
      console.error("❌ Erro ao excluir receita:", err.response?.data?.message);
    },
  });
};

// =============================
// 🔹 HOOK: GET BY ID
// =============================
export const useGetPrescriptionById = (id?: number) => {
  return useQuery<PrescriptionResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["prescription", id],
    queryFn: async () => {
      const { data } = await baseApi.get<PrescriptionResponse>(
        `/api/prescriptions/${id}`
      );
      return data;
    },
    enabled: !!id,
  });
};

// =============================
// 🔹 HOOK: GET ALL BY CLIENT ID (paginated)
// =============================
export const useGetPrescriptionsByClientId = ({
  clientId,
  page,
  limit,
}: {
  clientId: number;
  page: number;
  limit: number;
}) => {
  return useQuery<PrescriptionsResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["prescriptions-by-client", clientId, page, limit],
    queryFn: async () => {
      const { data } = await baseApi.get<PrescriptionsResponse>(
        `/api/clients/${clientId}/prescriptions`,
        {
          params: { page, limit },
        }
      );
      return data;
    },
    enabled: !!clientId,
    placeholderData: keepPreviousData,
  });
};
