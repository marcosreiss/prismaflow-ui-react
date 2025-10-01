import type { EntityService } from "@/services/entityService";
import type { Payment, PaymentStatusBySale } from "@/types/paymentTypes";
import type { ApiResponse } from "@/types/apiResponse";
import api from "./config/api";

export const paymentService: EntityService<Payment> & {
  getStatusBySaleId: (
    saleId: number
  ) => Promise<ApiResponse<PaymentStatusBySale>>;
} = {
  getAll: async ({ page, size, search }) => {
    const res = await api.get("/api/payments", {
      params: { page, size, search },
    });
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/api/payments/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await api.post("/api/payments", data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/api/payments/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/api/payments/${id}`);
    return res.data;
  },

  // rota extra: status por venda
  getStatusBySaleId: async (saleId) => {
    const res = await api.get(`/api/payments/status/${saleId}`);
    return res.data;
  },
};
