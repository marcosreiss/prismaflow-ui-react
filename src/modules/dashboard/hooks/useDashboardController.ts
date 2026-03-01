import { useState, useMemo, useCallback } from "react";
import type { DashboardFilters } from "../types/dashboardTypes";
import {
  useGetBalance,
  useGetSalesSummary,
  useGetPaymentsByStatus,
  useGetTopProducts,
  useGetTopClients,
  useGetOverdueInstallments,
} from "./useDashboard";

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    startDate: start.toISOString().substring(0, 10),
    endDate: end.toISOString().substring(0, 10),
  };
}

export function useDashboardController() {
  const [filters, setFilters] = useState<DashboardFilters>({
    ...getCurrentMonthRange(),
    branchId: undefined,
  });

  const handleFilterChange = useCallback(
    (newFilters: Partial<DashboardFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setFilters(getCurrentMonthRange());
  }, []);

  const { data: balanceData, isLoading: loadingBalance } =
    useGetBalance(filters);
  const { data: salesSummaryData, isLoading: loadingSales } =
    useGetSalesSummary(filters);
  const { data: paymentsByStatusData, isLoading: loadingPayments } =
    useGetPaymentsByStatus(filters);
  const { data: topProductsData, isLoading: loadingTopProducts } =
    useGetTopProducts({ ...filters, limit: 5 });
  const { data: topClientsData, isLoading: loadingTopClients } =
    useGetTopClients({ ...filters, limit: 5 });
  const { data: overdueData, isLoading: loadingOverdue } =
    useGetOverdueInstallments({ branchId: filters.branchId });

  const balance = balanceData?.data ?? null;
  const salesSummary = salesSummaryData?.data ?? null;
  const paymentsByStatus = paymentsByStatusData?.data ?? [];
  const topProducts = topProductsData?.data ?? [];
  const topClients = topClientsData?.data ?? [];
  const overdueInstallments = overdueData?.data ?? [];

  const isLoading =
    loadingBalance ||
    loadingSales ||
    loadingPayments ||
    loadingTopProducts ||
    loadingTopClients ||
    loadingOverdue;

  const overdueCount = overdueInstallments.length;
  const overdueTotal = useMemo(
    () =>
      overdueInstallments.reduce(
        (acc, i) => acc + (i.amount - i.paidAmount),
        0,
      ),
    [overdueInstallments],
  );

  return {
    filters,
    handleFilterChange,
    handleClearFilters,

    balance,
    salesSummary,
    paymentsByStatus,
    topProducts,
    topClients,
    overdueInstallments,

    overdueCount,
    overdueTotal,
    isLoading,

    loadingBalance,
    loadingSales,
    loadingPayments,
    loadingTopProducts,
    loadingTopClients,
    loadingOverdue,
  };
}
