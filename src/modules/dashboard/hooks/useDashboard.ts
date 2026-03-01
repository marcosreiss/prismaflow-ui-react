// src/modules/dashboard/hooks/useDashboard.ts

import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";
import type { DashboardFilters } from "../types/dashboardTypes";
import type {
  BalanceResponse,
  SalesSummaryResponse,
  PaymentsByStatusResponse,
  TopProductsResponse,
  TopClientsResponse,
  OverdueInstallmentsResponse,
} from "../types/dashboardTypes";

const DASHBOARD_ENDPOINT = "/api/dashboard";

// ==============================
// 🔹 BALANÇO
// ==============================
export function useGetBalance(filters?: DashboardFilters) {
  return useQuery<BalanceResponse>({
    queryKey: ["dashboard", "balance", filters],
    queryFn: async () => {
      const { data } = await api.get(`${DASHBOARD_ENDPOINT}/balance`, {
        params: filters,
      });
      return data;
    },
  });
}

// ==============================
// 🔹 RESUMO DE VENDAS
// ==============================
export function useGetSalesSummary(filters?: DashboardFilters) {
  return useQuery<SalesSummaryResponse>({
    queryKey: ["dashboard", "sales-summary", filters],
    queryFn: async () => {
      const { data } = await api.get(`${DASHBOARD_ENDPOINT}/sales-summary`, {
        params: filters,
      });
      return data;
    },
  });
}

// ==============================
// 🔹 PAGAMENTOS POR STATUS
// ==============================
export function useGetPaymentsByStatus(filters?: DashboardFilters) {
  return useQuery<PaymentsByStatusResponse>({
    queryKey: ["dashboard", "payments-status", filters],
    queryFn: async () => {
      const { data } = await api.get(`${DASHBOARD_ENDPOINT}/payments-status`, {
        params: filters,
      });
      return data;
    },
  });
}

// ==============================
// 🔹 TOP PRODUTOS
// ==============================
export function useGetTopProducts(
  filters?: DashboardFilters & { limit?: number },
) {
  return useQuery<TopProductsResponse>({
    queryKey: ["dashboard", "top-products", filters],
    queryFn: async () => {
      const { data } = await api.get(`${DASHBOARD_ENDPOINT}/top-products`, {
        params: filters,
      });
      return data;
    },
  });
}

// ==============================
// 🔹 TOP CLIENTES
// ==============================
export function useGetTopClients(
  filters?: DashboardFilters & { limit?: number },
) {
  return useQuery<TopClientsResponse>({
    queryKey: ["dashboard", "top-clients", filters],
    queryFn: async () => {
      const { data } = await api.get(`${DASHBOARD_ENDPOINT}/top-clients`, {
        params: filters,
      });
      return data;
    },
  });
}

// ==============================
// 🔹 PARCELAS EM ATRASO
// ==============================
export function useGetOverdueInstallments(
  filters?: Pick<DashboardFilters, "branchId">,
) {
  return useQuery<OverdueInstallmentsResponse>({
    queryKey: ["dashboard", "overdue-installments", filters],
    queryFn: async () => {
      const { data } = await api.get(
        `${DASHBOARD_ENDPOINT}/overdue-installments`,
        {
          params: filters,
        },
      );
      return data;
    },
  });
}
