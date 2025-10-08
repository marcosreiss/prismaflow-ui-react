import type { EntityService } from "@/services/entityService";
import type { Client } from "@/types/clientTypes";
import api from "./config/api";

export const customerService: EntityService<Client> = {
    getAll: async ({ page, size, search }) => {
        const res = await api.get("/api/clients", {
            params: { page, size, search },
        });
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/api/clients/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post("/api/clients", data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`/api/clients/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/api/clients/${id}`);
        return res.data;
    },
};