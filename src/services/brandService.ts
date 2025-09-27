// src/services/brandService.ts
import type { EntityService } from "@/interfaces/entityService";
import type { Brand } from "@/types/brandTypes";
import api from "./config/api";

export const brandService: EntityService<Brand> = {
  getAll: async ({ skip, take, search }) => {
    const res = await api.get("/api/brands", {
      params: { skip, take, search },
    });
    return res.data; // ApiResponse<PaginatedResponse<Brand>>
  },

  getById: async (id) => {
    const res = await api.get(`/api/brands/${id}`);
    return res.data; // ApiResponse<Brand>
  },

  create: async (data) => {
    const res = await api.post("/api/brands", data);
    return res.data; // ApiResponse<Brand>
  },

  update: async (id, data) => {
    const res = await api.put(`/api/brands/${id}`, data);
    return res.data; // ApiResponse<Brand>
  },

  delete: async (id) => {
    const res = await api.delete(`/api/brands/${id}`);
    return res.data; // ApiResponse<null>
  },
};
