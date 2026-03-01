// src/modules/dashboard/types/dashboardTypes.ts

import type { ApiResponse } from "@/utils/apiResponse";

// ==============================
// 🔹 BALANÇO
// ==============================
export type Balance = {
  revenue: number;
  expenses: number;
  netProfit: number;
};

// ==============================
// 🔹 RESUMO DE VENDAS
// ==============================
export type SalesSummary = {
  count: number;
  totalRevenue: number;
  averageTicket: number;
};

// ==============================
// 🔹 PAGAMENTOS POR STATUS
// ==============================
export type PaymentsByStatus = {
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  _count: { id: number };
  _sum: { total: number | null };
};

// ==============================
// 🔹 TOP PRODUTOS
// ==============================
export type TopProduct = {
  productId: number;
  _sum: { quantity: number | null };
  _count: { id: number };
  product?: {
    id: number;
    name: string;
    category: string;
  } | null;
};

// ==============================
// 🔹 TOP CLIENTES
// ==============================
export type TopClient = {
  clientId: number;
  _sum: { total: number | null };
  _count: { id: number };
  client?: {
    id: number;
    name: string;
  } | null;
};

// ==============================
// 🔹 PARCELAS EM ATRASO
// ==============================
export type OverdueInstallment = {
  id: number;
  paymentMethodItemId: number;
  sequence: number;
  amount: number;
  paidAmount: number;
  dueDate: string;
  paidAt: string | null;
  isActive: boolean;
  tenantId: string;
  branchId: string;
  paymentMethodItem?: {
    payment?: {
      sale?: {
        client?: {
          id: number;
          name: string;
        } | null;
      } | null;
    } | null;
  } | null;
};

// ==============================
// 🔹 FILTROS COMUNS
// ==============================
export type DashboardFilters = {
  startDate?: string;
  endDate?: string;
  branchId?: string;
};

// ==============================
// 🔹 RESPONSES
// ==============================
export type BalanceResponse = ApiResponse<Balance>;
export type SalesSummaryResponse = ApiResponse<SalesSummary>;
export type PaymentsByStatusResponse = ApiResponse<PaymentsByStatus[]>;
export type TopProductsResponse = ApiResponse<TopProduct[]>;
export type TopClientsResponse = ApiResponse<TopClient[]>;
export type OverdueInstallmentsResponse = ApiResponse<OverdueInstallment[]>;
