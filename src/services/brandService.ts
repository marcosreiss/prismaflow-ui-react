// Versão final
import type { EntityService } from "@/services/entityService";
import type { Brand, BrandsResponse, BrandResponse } from "@/modules/brands/brandTypes";
import type { ApiResponse } from "@/types/apiResponse";
import api from "./config/api";

export const brandService: EntityService<Brand> = {
  getAll: async ({ page, size, search }) => {

    const res = await api.get<BrandsResponse>("/api/brands", {
      params: { page, size, search },
    });
    console.log(res.data.data);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get<BrandResponse>(`/api/brands/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post<BrandResponse>("/api/brands", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put<BrandResponse>(`/api/brands/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete<ApiResponse<null>>(`/api/brands/${id}`);
    return res.data;
  },
};