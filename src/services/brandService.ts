import type { EntityService } from "@/interfaces/entityService";
import type { Brand } from "@/types/brandTypes";
import api from "./config/api";

export const brandService: EntityService<Brand> = {
  list: async ({ skip, take, search }) => {
    const res = await api.get("/brands", { params: { skip, take, search } });
    return { items: res.data.items, total: res.data.total };
  },
  get: async (id) => {
    const res = await api.get(`/brands/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/brands", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/brands/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    await api.delete(`/brands/${id}`);
  },
};
