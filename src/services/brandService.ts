// Versão final
import type { EntityService } from "@/services/entityService";
import type { Brand, BrandsResponse, BrandResponse } from "@/types/brandTypes";
import type { ApiResponse } from "@/types/apiResponse";
import api from "./config/api";

export const brandService: EntityService<Brand> = {
  getAll: async ({ page, size, search }) => {

    const res = await api.get<BrandsResponse>("/brands", {
      params: { page, size, search },
    });
    console.log(res.data.data);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get<BrandResponse>(`/brands/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post<BrandResponse>("/brands", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put<BrandResponse>(`/brands/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete<ApiResponse<null>>(`/brands/${id}`);
    return res.data;
  },
};