import type { EntityService } from "@/services/entityService";
import type { Service } from "@/types/serviceTypes";
import api from "./config/api";

export const serviceService: EntityService<Service> = {
    getAll: async ({ page, size, search }) => {
        const res = await api.get('/api/optical-services', {
            params: { page, size, search },
        });
        return res.data;
    },

    getById: async (id) => {
        const res = await api.get(`/api/optical-services/${id}`);
        return res.data;
    },

    create: async (data) => {
        const res = await api.post("/api/optical-services", data);
        return res.data;
    },

    update: async (id, data) => {
        const res = await api.put(`/api/optical-services/${id}`, data);
        return res.data;
    },

    delete: async (id) => {
        const res = await api.delete(`/api/optical-services/${id}`);
        return res.data;
    },
};