// src/services/brandService.ts
import type { EntityService } from "@/interfaces/entityService";
import type { Brand } from "@/types/brandTypes";
import api from "./config/api";
import { parseList, parseEntity, parseDelete } from "./utils/responseParser";

export const brandService: EntityService<Brand> = {
  list: async ({ skip, take, search }) => {
    const res = await api.get("/api/brands", {
      params: { skip, take, search },
    });
    return parseList<Brand>(res.data);
  },

  get: async (id) => {
    const res = await api.get(`/api/brands/${id}`);
    return parseEntity<Brand>(res.data);
  },

  create: async (data) => {
    const res = await api.post("/api/brands", data);
    return parseEntity<Brand>(res.data);
  },

  update: async (id, data) => {
    const res = await api.put(`/api/brands/${id}`, data);
    return parseEntity<Brand>(res.data);
  },

  remove: async (id) => {
    const res = await api.delete(`/api/brands/${id}`);
    parseDelete(res.data);
  },
};
