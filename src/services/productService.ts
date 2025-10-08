import type { EntityService } from "@/services/entityService";
import type { Product } from "@/modules/products/types/productTypes";
import api from "./config/api";

export const productService: EntityService<Product> = {
  getAll: async ({ page, size, search }) => {
    const res = await api.get("/api/products", {
      params: { page, size, search },
    });
    return res.data; // ApiResponse<PaginatedResponse<Product>>
  },

  getById: async (id) => {
    const res = await api.get(`/api/products/${id}`);
    return res.data; // ApiResponse<Product>
  },

  create: async (data) => {
    const res = await api.post("/api/products", data);
    return res.data; // ApiResponse<Product>
  },

  update: async (id, data) => {
    const res = await api.put(`/api/products/${id}`, data);
    return res.data; // ApiResponse<Product>
  },

  delete: async (id) => {
    const res = await api.delete(`/api/products/${id}`);
    return res.data; // ApiResponse<null>
  },
};
