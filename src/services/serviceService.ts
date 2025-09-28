import type { EntityService } from "@/services/entityService";
import type { Service } from "@/types/serviceTypes";
import api from "./config/api";

export const serviceService: EntityService<Service> = {
    getAll: async ({ page, size, search }) => {
        const res = await api.get("/api/services", {
            params: { page, size, search },
        });
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/api/services/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post("/api/services", data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`/api/services/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/api/services/${id}`);
        return res.data;
    },
};