import type { EntityService } from "@/interfaces/entityService";
import type { Brand } from "@/types/brandTypes";
import api from "./config/api";

export const brandService: EntityService<Brand> = {
  list: async ({ skip, take, search }) => {
    console.log("[brandService] list → params:", { skip, take, search });
    const res = await api.get("/api/brands", {
      params: { skip, take, search },
    });
    console.log("[brandService] list → response:", res.data);
    return { items: res.data.items, total: res.data.total };
  },

  get: async (id) => {
    console.log("[brandService] get → id:", id);
    const res = await api.get(`/api/brands/${id}`);
    console.log("[brandService] get → response:", res.data);
    return res.data;
  },

  create: async (data) => {
    console.log("[brandService] create → payload:", data);
    const res = await api.post("/api/brands", data);
    console.log("[brandService] create → response:", res.data);
    return res.data;
  },

  update: async (id, data) => {
    console.log("[brandService] update → id:", id, "payload:", data);
    const res = await api.put(`/api/brands/${id}`, data);
    console.log("[brandService] update → response:", res.data);
    return res.data;
  },

  remove: async (id) => {
    console.log("[brandService] remove → id:", id);
    const res = await api.delete(`/api/brands/${id}`);
    console.log("[brandService] remove → response:", res.status);
  },
};
