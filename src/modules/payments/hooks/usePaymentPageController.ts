import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { AxiosError } from "axios";

import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";

import {
  useGetPayments,
  useUpdatePaymentStatus,
  usePayInstallment,
} from "./usePayments";

import type { PaymentFilters } from "../types/paymentFilters";
import type {
  PaymentListItem,
  PaymentDetails,
  Payment,
  PaymentStatus,
} from "../types";

// ==============================
// Helpers (sem hooks)
// ==============================
function buildPaymentsQueryParams(
  page: number,
  limit: number,
  filters: PaymentFilters,
) {
  return {
    page: page + 1, // API usa paginação baseada em 1
    limit,

    ...(filters.status && { status: filters.status }),
    ...(filters.method && { method: filters.method }),
    ...(filters.startDate && { startDate: filters.startDate }),
    ...(filters.endDate && { endDate: filters.endDate }),
    ...(filters.clientSearch && { clientName: filters.clientSearch }),

    ...(filters.hasOverdueInstallments !== undefined && {
      hasOverdueInstallments: filters.hasOverdueInstallments,
    }),
    ...(filters.isPartiallyPaid !== undefined && {
      isPartiallyPaid: filters.isPartiallyPaid,
    }),
    ...(filters.dueDaysAhead !== undefined && {
      dueDaysAhead: filters.dueDaysAhead,
    }),
    ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
  };
}

function normalizePaymentFilters(
  current: PaymentFilters,
  next: Partial<PaymentFilters>,
): PaymentFilters {
  const merged = { ...current, ...next };

  if (merged.hasOverdueInstallments && merged.dueDaysAhead !== undefined) {
    merged.dueDaysAhead = undefined;
  }

  if (merged.method && merged.method !== "INSTALLMENT") {
    merged.hasOverdueInstallments = undefined;
    merged.dueDaysAhead = undefined;
  }

  return merged;
}

function mapPaymentsToListItems(
  data?: ApiResponse<{ content: PaymentListItem[] }>,
) {
  const content = data?.data?.content;
  if (!content) return [];

  return content.map((item: PaymentListItem) => ({
    ...item,
    saleDate: item.saleDate ?? item.sale?.saleDate ?? null,
    clientName:
      item.sale?.client?.name || item.clientName || "Cliente não informado",
    discount: item.discount ?? 0,
    paidAmount: item.paidAmount ?? 0,
    installmentsPaid: item.installmentsPaid ?? 0,
    lastPaymentAt: item.lastPaymentAt ?? null,
    isActive: item.isActive ?? true,
    branchId: item.branchId ?? "",
    tenantId: item.tenantId ?? "",
    methods: item.methods ?? [],
  }));
}

// ==============================
// Custom hooks internos (com hooks)
// ==============================
function usePaymentsFiltersState() {
  const [filters, setFilters] = useState<PaymentFilters>({
    status: undefined,
    method: undefined,
    startDate: "",
    endDate: "",
    clientSearch: "",
    hasOverdueInstallments: undefined,
    isPartiallyPaid: undefined,
    dueDaysAhead: undefined,
    sortOrder: "desc",
  });

  return { filters, setFilters };
}

function useDrawerState() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"edit" | "view">("view");
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(
    null,
  );

  return {
    drawerOpen,
    setDrawerOpen,
    drawerMode,
    setDrawerMode,
    selectedPayment,
    setSelectedPayment,
  };
}

function useErrorNotificationEffect(error: unknown) {
  const { addNotification } = useNotification();
  const addNotificationRef = useRef(addNotification);

  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  useEffect(() => {
    if (!error) return;

    const axiosErr = error as AxiosError<ApiResponse<null>>;
    const message =
      axiosErr.response?.data?.message ?? "Erro ao carregar pagamentos.";
    addNotificationRef.current(message, "error");
  }, [error]);

  return { addNotification };
}

// ==============================
// Hook principal - Controller da página de pagamentos
// ==============================
export function usePaymentPageController() {
  console.log("usePaymentPageController render");

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");

  const { filters, setFilters } = usePaymentsFiltersState();
  const {
    drawerOpen,
    setDrawerOpen,
    drawerMode,
    setDrawerMode,
    selectedPayment,
    setSelectedPayment,
  } = useDrawerState();
  const queryParams = useMemo(
    () => buildPaymentsQueryParams(page, limit, filters),
    [page, limit, filters],
  );

  const { data, isLoading, isFetching, refetch, error } =
    useGetPayments(queryParams);

  const updatePaymentStatus = useUpdatePaymentStatus();
  const payInstallment = usePayInstallment();

  const { addNotification } = useErrorNotificationEffect(error);

  // Handlers de filtros
  const handleFilterChange = useCallback(
    (newFilters: Partial<PaymentFilters>) => {
      setFilters((prev) => normalizePaymentFilters(prev, newFilters));
      setPage(0);
    },
    [setFilters],
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      status: undefined,
      method: undefined,
      startDate: "",
      endDate: "",
      clientSearch: "",
      hasOverdueInstallments: undefined,
      isPartiallyPaid: undefined,
      dueDaysAhead: undefined,
      sortOrder: "desc",
    });
    setSearch("");
    setPage(0);
  }, [setFilters]);

  // Handlers do drawer
  const handleOpenDrawer = useCallback(
    (mode: "edit" | "view", payment?: Payment | PaymentListItem | null) => {
      setDrawerMode(mode);
      setSelectedPayment((payment as PaymentDetails) ?? null);
      setDrawerOpen(true);
    },
    [setDrawerMode, setSelectedPayment, setDrawerOpen],
  );

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedPayment(null), 300);
  }, [setDrawerOpen, setSelectedPayment]);

  const handleDrawerEdit = useCallback(() => {
    if (!selectedPayment) return;
    handleOpenDrawer("edit", selectedPayment);
  }, [selectedPayment, handleOpenDrawer]);

  // Atualização de status
  const handleUpdateStatus = useCallback(
    async (paymentId: number, status: PaymentStatus, reason?: string) => {
      try {
        const res = await updatePaymentStatus.mutateAsync({
          id: paymentId,
          status,
          reason,
        });
        addNotification(res.message, "success");
        refetch();
      } catch (err) {
        const axiosErr = err as AxiosError<ApiResponse<null>>;
        const message =
          axiosErr.response?.data?.message ?? "Erro ao atualizar status.";
        addNotification(message, "error");
      }
    },
    [updatePaymentStatus, addNotification, refetch],
  );

  // Pagamento de parcela
  const handlePayInstallment = useCallback(
    async (installmentId: number, paidAmount: number, paidAt?: string) => {
      try {
        const res = await payInstallment.mutateAsync({
          id: installmentId,
          data: { paidAmount, paidAt },
        });
        addNotification(res.message, "success");
        refetch();
      } catch (err) {
        const axiosErr = err as AxiosError<ApiResponse<null>>;
        const message =
          axiosErr.response?.data?.message ?? "Erro ao pagar parcela.";
        addNotification(message, "error");
      }
    },
    [payInstallment, addNotification, refetch],
  );

  const payments: PaymentListItem[] = useMemo(() => mapPaymentsToListItems(data), [data]);
  const total = data?.data?.totalElements ?? 0;

  const isUpdatingStatus = updatePaymentStatus.isPending;
  const isPayingInstallment = payInstallment.isPending;

  return {
    // Paginação e busca
    page,
    limit,
    search,

    // UI
    drawerOpen,
    drawerMode,
    selectedPayment,

    // Filtros
    filters,

    // Dados
    payments,
    total,
    isLoading,
    isFetching,

    // Loading de mutations
    isUpdatingStatus,
    isPayingInstallment,

    // Setters
    setPage,
    setLimit,
    setSearch,
    setDrawerOpen,
    setDrawerMode,
    setSelectedPayment,

    // Handlers
    handleFilterChange,
    handleClearFilters,
    handleOpenDrawer,
    handleCloseDrawer,
    refetch,

    // Ações específicas
    handleUpdateStatus,
    handlePayInstallment,

    // Ações do drawer
    handleDrawerEdit,
    // Utilitários
    addNotification,
    hasSelectedItems: false,
    selectedCount: 0,
    isAnyMutationPending: isUpdatingStatus || isPayingInstallment,
  };
}
