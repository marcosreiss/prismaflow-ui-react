import type { ApiResponse } from "@/utils/apiResponse";
import baseApi from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { BranchSelectResponse } from "./branch";

// =============================
// 🔹 HOOK: SELECT BRANCHES
// =============================
export const useSelectBranches = () => {
  return useQuery<BranchSelectResponse, AxiosError<ApiResponse<null>>>({
    queryKey: ["branches", "select"],
    queryFn: async () => {
      const { data } = await baseApi.get<BranchSelectResponse>(
        "/api/branches/select"
      );
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - dados de filiais mudam raramente
  });
};