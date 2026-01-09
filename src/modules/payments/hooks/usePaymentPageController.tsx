import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { AxiosError } from "axios";

import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";

import {
    useGetPayments,
    useDeletePayment,
    useUpdatePaymentStatus,
    usePayInstallment,
} from "./usePayments";

import type {
    Payment,
    PaymentDetails,
    PaymentStatus,
    PaymentListItem,
    PaymentFilters,
} from "../types/paymentTypes";

// ==============================
// Helpers (sem hooks)
// ==============================
function buildPaymentsQueryParams(page: number, limit: number, filters: PaymentFilters) {
    return {
        page: page + 1, // API usa paginação baseada em 1
        limit,

        // Filtros básicos
        ...(filters.status && { status: filters.status }),
        ...(filters.method && { method: filters.method }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.clientSearch && { clientName: filters.clientSearch }),

        // Filtros avançados
        ...(filters.hasOverdueInstallments !== undefined && {
            hasOverdueInstallments: filters.hasOverdueInstallments,
        }),
        ...(filters.isPartiallyPaid !== undefined && {
            isPartiallyPaid: filters.isPartiallyPaid,
        }),
        ...(filters.dueDaysAhead !== undefined && {
            dueDaysAhead: filters.dueDaysAhead,
        }),
    };
}

function mapPaymentsToListItems(data?: ApiResponse<{ content: PaymentListItem[] }>) {
    const content = data?.data?.content;
    if (!content) return [];

    return content.map((item: PaymentListItem) => ({
        ...item,
        clientName: item.sale?.client?.name || item.clientName || "Cliente não informado",
        discount: item.discount ?? 0,
        downPayment: item.downPayment ?? 0,
        installmentsTotal: item.installmentsTotal ?? null,
        paidAmount: item.paidAmount ?? 0,
        installmentsPaid: item.installmentsPaid ?? 0,
        lastPaymentAt: item.lastPaymentAt ?? null,
        firstDueDate: item.firstDueDate ?? null,
        isActive: item.isActive ?? true,
        branchId: item.branchId ?? "",
        tenantId: item.tenantId ?? "",
        installments: item.installments ?? [],
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
    });

    return { filters, setFilters };
}

function useDrawerState() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);

    return {
        drawerOpen,
        setDrawerOpen,
        drawerMode,
        setDrawerMode,
        selectedPayment,
        setSelectedPayment,
    };
}

function useConfirmationsState() {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);

    return { confirmDelete, setConfirmDelete, confirmDeleteSelected, setConfirmDeleteSelected };
}

function useSelectionState() {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

    return { selectedIds, setSelectedIds, deletingIds, setDeletingIds };
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
        const message = axiosErr.response?.data?.message ?? "Erro ao carregar pagamentos.";
        addNotificationRef.current(message, "error");
    }, [error]);

    return { addNotification };
}

// ==============================
// 🔹 Hook principal - Controller da página de pagamentos
// ==============================
export function usePaymentPageController() {
    console.log("usePaymentPageController render");

    // Estados de paginação e busca
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    // Estados agrupados
    const { filters, setFilters } = usePaymentsFiltersState();
    const {
        drawerOpen,
        setDrawerOpen,
        drawerMode,
        setDrawerMode,
        selectedPayment,
        setSelectedPayment,
    } = useDrawerState();
    const { confirmDelete, setConfirmDelete, confirmDeleteSelected, setConfirmDeleteSelected } =
        useConfirmationsState();
    const { selectedIds, setSelectedIds, deletingIds, setDeletingIds } = useSelectionState();

    // Query params memoizados
    const queryParams = useMemo(() => buildPaymentsQueryParams(page, limit, filters), [
        page,
        limit,
        filters,
    ]);

    // API: query
    const { data, isLoading, isFetching, refetch, error } = useGetPayments(queryParams);

    // API: mutations
    const deletePayment = useDeletePayment();
    const updatePaymentStatus = useUpdatePaymentStatus();
    const payInstallment = usePayInstallment();

    // Notificação de erro (efeitos isolados)
    const { addNotification } = useErrorNotificationEffect(error);

    // Handlers filtros
    const handleFilterChange = useCallback(
        (newFilters: Partial<PaymentFilters>) => {
            setFilters((prev) => ({ ...prev, ...newFilters }));
            setPage(0);
        },
        [setFilters]
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
        });
        setSearch("");
        setPage(0);
    }, [setFilters]);

    // Handlers Drawer
    const handleOpenDrawer = useCallback(
        (mode: "create" | "edit" | "view", payment?: Payment | PaymentListItem | null) => {
            setDrawerMode(mode);
            setSelectedPayment((payment as PaymentDetails) ?? null);
            setDrawerOpen(true);
        },
        [setDrawerMode, setSelectedPayment, setDrawerOpen]
    );

    const handleCloseDrawer = useCallback(() => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedPayment(null), 300);
    }, [setDrawerOpen, setSelectedPayment]);

    // Ações do Drawer
    const handleDrawerEdit = useCallback(() => {
        if (!selectedPayment) return;
        handleOpenDrawer("edit", selectedPayment);
    }, [selectedPayment, handleOpenDrawer]);

    const handleDrawerDelete = useCallback(
        (payment: Payment | PaymentListItem) => {
            setSelectedPayment(payment as PaymentDetails);
            setConfirmDelete(true);
        },
        [setSelectedPayment, setConfirmDelete]
    );

    const handleDrawerCreateNew = useCallback(() => {
        setSelectedPayment(null);
        handleOpenDrawer("create");
    }, [setSelectedPayment, handleOpenDrawer]);

    // Exclusão individual
    const handleDelete = useCallback(async () => {
        if (!selectedPayment) return;

        try {
            const res = await deletePayment.mutateAsync(selectedPayment.id);
            addNotification(res.message, "success");
            setConfirmDelete(false);
            handleCloseDrawer();
            refetch();
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message = axiosErr.response?.data?.message ?? "Erro ao excluir pagamento.";
            addNotification(message, "error");
        }
    }, [
        selectedPayment,
        deletePayment,
        addNotification,
        setConfirmDelete,
        handleCloseDrawer,
        refetch,
    ]);

    // Atualização de status
    const handleUpdateStatus = useCallback(
        async (paymentId: number, status: PaymentStatus, reason?: string) => {
            try {
                const res = await updatePaymentStatus.mutateAsync({ id: paymentId, status, reason });
                addNotification(res.message, "success");
                refetch();
            } catch (err) {
                const axiosErr = err as AxiosError<ApiResponse<null>>;
                const message = axiosErr.response?.data?.message ?? "Erro ao atualizar status.";
                addNotification(message, "error");
            }
        },
        [updatePaymentStatus, addNotification, refetch]
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
                const message = axiosErr.response?.data?.message ?? "Erro ao pagar parcela.";
                addNotification(message, "error");
            }
        },
        [payInstallment, addNotification, refetch]
    );

    // Seleção de linhas
    const handleSelectRow = useCallback(
        (id: string | number, checked: boolean) => {
            setSelectedIds((prev) => (checked ? [...prev, id as number] : prev.filter((i) => i !== id)));
        },
        [setSelectedIds]
    );

    const handleSelectAll = useCallback(
        (checked: boolean, currentPageIds: (string | number)[]) => {
            setSelectedIds(checked ? (currentPageIds as number[]) : []);
        },
        [setSelectedIds]
    );

    // Exclusão em massa
    const handleDeleteSelected = useCallback(async () => {
        if (selectedIds.length === 0) return;

        setConfirmDeleteSelected(false);
        setDeletingIds(selectedIds);

        try {
            const deletePromises = selectedIds.map((id) => deletePayment.mutateAsync(id));
            const results = await Promise.allSettled(deletePromises);

            let successCount = 0;
            results.forEach((result, index) => {
                if (result.status === "fulfilled") {
                    successCount++;
                } else {
                    addNotification(`Erro ao excluir pagamento ${selectedIds[index]}`, "error");
                }
            });

            if (successCount > 0) {
                addNotification(`${successCount} pagamento(s) excluído(s) com sucesso`, "success");
            }
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr?.response?.data?.message ?? "Erro ao excluir pagamentos selecionados";
            addNotification(message, "error");
        } finally {
            setDeletingIds([]);
            setSelectedIds([]);
            refetch();
        }
    }, [
        selectedIds,
        setConfirmDeleteSelected,
        setDeletingIds,
        deletePayment,
        addNotification,
        setSelectedIds,
        refetch,
    ]);

    // Dados mapeados
    const payments: PaymentListItem[] = useMemo(() => mapPaymentsToListItems(data), [data]);
    const total = data?.data?.totalElements ?? 0;

    // Flags de loading
    const isDeleting = deletePayment.isPending;
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
        confirmDelete,

        // Seleção
        selectedIds,
        confirmDeleteSelected,
        deletingIds,

        // Filtros
        filters,

        // Dados
        payments,
        total,
        isLoading,
        isFetching,

        // Loading de mutations
        isDeleting,
        isUpdatingStatus,
        isPayingInstallment,

        // Setters
        setPage,
        setLimit,
        setSearch,
        setDrawerOpen,
        setDrawerMode,
        setSelectedPayment,
        setConfirmDelete,
        setConfirmDeleteSelected,

        // Handlers
        handleFilterChange,
        handleClearFilters,
        handleOpenDrawer,
        handleCloseDrawer,
        handleDelete,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        refetch,

        // Ações específicas
        handleUpdateStatus,
        handlePayInstallment,

        // Ações do drawer
        handleDrawerEdit,
        handleDrawerDelete,
        handleDrawerCreateNew,

        // Utilitários
        addNotification,
        hasSelectedItems: selectedIds.length > 0,
        selectedCount: selectedIds.length,
        isAnyMutationPending: isDeleting || isUpdatingStatus || isPayingInstallment,
    };
}
