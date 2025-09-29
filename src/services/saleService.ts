import type { EntityService } from "@/services/entityService";
import type { Sale } from "@/types/saleTypes";
import api from "./config/api";

export const saleService: EntityService<Sale> = {
    getAll: async ({ page, size, search }) => {
        const res = await api.get("/api/sales", {
            params: { page, size, search },
        });
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/api/sales/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post("/api/sales", data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`/api/sales/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/api/sales/${id}`);
        return res.data;
    },
};