import { useState, useCallback, useMemo, useEffect } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";
import { useGetPayments, useDeletePayment, useUpdatePaymentStatus, useProcessPaymentInstallment } from "./usePayments";
import type { Payment, PaymentDetails, PaymentStatus, PaymentListItem, PaymentFilters } from "../types/paymentTypes";

// ==============================
// 🔹 Hook principal - Versão Melhorada
// ==============================
export function usePaymentPageController() {
    // ==========================
    // 🔹 Estados locais
    // ==========================
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10); // Aumentado para melhor UX
    const [search, setSearch] = useState("");

    // Estados de UI
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);

    // Estados de confirmação
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

    // 🔄 Estados de filtro centralizados
    // No usePaymentPageController.tsx - ATUALIZE:

    // 🔄 Estados de filtro centralizados (ATUALIZADO)
    const [filters, setFilters] = useState<PaymentFilters>({
        status: undefined,
        method: undefined,
        startDate: '',
        endDate: '',
        clientSearch: '', // 🆕 NOVO
    });

    const queryParams = useMemo(() => ({
        page: page + 1,
        limit,
        ...(filters.status && { status: filters.status }),
        ...(filters.method && { method: filters.method }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.clientSearch && { clientName: filters.clientSearch }), // Só essa linha para nome do cliente!
    }), [page, limit, filters]);


    // 🔄 Limpar filtros (ATUALIZADO)
    const handleClearFilters = useCallback(() => {
        setFilters({
            status: undefined,
            method: undefined,
            startDate: '',
            endDate: '',
            clientSearch: '', // 🆕 NOVO
        });
        setSearch('');
        setPage(0);
    }, []);

    const { addNotification } = useNotification();

    // const queryParams = useMemo(() => ({
    //     page: page + 1,
    //     limit,
    //     ...(search && { search }),
    //     ...(filters.status && { status: filters.status }),
    //     ...(filters.method && { method: filters.method }),
    //     ...(filters.startDate && { startDate: filters.startDate }),
    //     ...(filters.endDate && { endDate: filters.endDate })
    // }), [page, limit, search, filters]);

    // ==========================
    // 🔹 Hooks de dados
    // ==========================
    const {
        data,
        isLoading,
        isFetching,
        refetch,
        error
    } = useGetPayments(queryParams);

    const deletePayment = useDeletePayment();
    const updatePaymentStatus = useUpdatePaymentStatus();
    const processPaymentInstallment = useProcessPaymentInstallment();

    // ==========================
    // 🔹 Notificações de erro
    // ==========================
    useEffect(() => {
        if (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message = axiosErr.response?.data?.message ?? "Erro ao carregar pagamentos.";
            addNotification(message, "error");
        }
    }, [error, addNotification]);

    // ==========================
    // 🔹 Drawer handlers (otimizados com useCallback)
    // ==========================
    const handleOpenDrawer = useCallback((
        mode: "create" | "edit" | "view",
        payment?: Payment | PaymentListItem | null
    ) => {
        setDrawerMode(mode);
        setSelectedPayment(payment as PaymentDetails ?? null);
        setDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setDrawerOpen(false);
        // Pequeno delay para animação do drawer fechar
        setTimeout(() => {
            setSelectedPayment(null);
        }, 300);
    }, []);

    // ==========================
    // 🔹 Drawer: ações internas
    // ==========================
    const handleDrawerEdit = useCallback(() => {
        if (!selectedPayment) return;
        handleOpenDrawer("edit", selectedPayment);
    }, [selectedPayment, handleOpenDrawer]);

    const handleDrawerDelete = useCallback((payment: Payment | PaymentListItem) => {
        setSelectedPayment(payment as PaymentDetails);
        setConfirmDelete(true);
    }, []);

    const handleDrawerCreateNew = useCallback(() => {
        setSelectedPayment(null);
        handleOpenDrawer("create");
    }, [handleOpenDrawer]);

    // ==========================
    // 🔹 Exclusão individual
    // ==========================
    const handleDelete = async () => {
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
    };

    // ==========================
    // 🔹 Atualização de status
    // ==========================
    const handleUpdateStatus = async (paymentId: number, status: PaymentStatus) => {
        try {
            const res = await updatePaymentStatus.mutateAsync({
                id: paymentId,
                status
            });
            addNotification(res.message, "success");
            refetch();
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message = axiosErr.response?.data?.message ?? "Erro ao atualizar status.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Processamento de parcela
    // ==========================
    const handleProcessInstallment = async (
        paymentId: number,
        installmentId: number,
        paidAmount: number
    ) => {
        try {
            const res = await processPaymentInstallment.mutateAsync({
                paymentId,
                installmentId,
                paidAmount
            });
            addNotification(res.message, "success");
            refetch();
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message = axiosErr.response?.data?.message ?? "Erro ao processar parcela.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Seleção de linhas
    // ==========================
    const handleSelectRow = useCallback((id: string | number, checked: boolean) => {
        setSelectedIds(prev =>
            checked
                ? [...prev, id as number]
                : prev.filter(i => i !== id)
        );
    }, []);

    const handleSelectAll = useCallback((
        checked: boolean,
        currentPageIds: (string | number)[]
    ) => {
        setSelectedIds(checked ? (currentPageIds as number[]) : []);
    }, []);

    // ==========================
    // 🔹 Exclusão em massa otimizada
    // ==========================
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;

        setConfirmDeleteSelected(false);
        setDeletingIds(selectedIds);

        try {
            // Executa todas as exclusões em paralelo
            const deletePromises = selectedIds.map(id =>
                deletePayment.mutateAsync(id)
            );

            const results = await Promise.allSettled(deletePromises);

            // Processa resultados
            let successCount = 0;
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    successCount++;
                    addNotification(result.value.message, "success");
                } else {
                    addNotification(`Erro ao excluir pagamento ${selectedIds[index]}`, "error");
                }
            });

            if (successCount > 0) {
                addNotification(`${successCount} pagamento(s) excluído(s) com sucesso`, "success");
            }

        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message = axiosErr?.response?.data?.message ?? "Erro ao excluir pagamentos selecionados";
            addNotification(message, "error");
        } finally {
            setDeletingIds([]);
            setSelectedIds([]);
            refetch();
        }
    };

    // ==========================
    // 🔹 Filtros otimizados
    // ==========================
    const handleFilterChange = useCallback((newFilters: Partial<PaymentFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPage(0); // Reset para primeira página ao filtrar
    }, []);

    // const handleClearFilters = useCallback(() => {
    //     setFilters({
    //         status: undefined,
    //         method: undefined,
    //         startDate: '',
    //         endDate: ''
    //     });
    //     setSearch('');
    //     setPage(0);
    // }, []);

    // ==========================
    // 🔹 Dados derivados
    // ==========================


    const payments: PaymentDetails[] = useMemo(() => {
        if (!data?.data?.content) return [];

        return data.data.content.map((item: PaymentListItem) => {
            // ✅ Estratégia flexível para clientName
            const clientName = item.sale?.client?.name || "Cliente não informado";
            // ✅ Mapeia PaymentListItem para PaymentDetails
            return {
                // Campos do PaymentListItem
                id: item.id,
                saleId: item.saleId,
                method: item.method,
                status: item.status,
                total: item.total,
                clientName,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,

                // Campos padrão que não existem em PaymentListItem
                discount: 0,
                downPayment: 0,
                installmentsTotal: null,
                paidAmount: 0,
                installmentsPaid: 0,
                lastPaymentAt: null,
                firstDueDate: null,
                isActive: true,
                branchId: "",
                tenantId: "",
                installments: [],

                // Campo sale opcional
                sale: undefined
            };
        });
    }, [data?.data?.content]);

    const total = data?.data?.totalElements ?? 0;

    // ==========================
    // 🔹 Indicadores de loading
    // ==========================
    const isDeleting = deletePayment.isPending;
    const isUpdatingStatus = updatePaymentStatus.isPending;
    const isProcessingInstallment = processPaymentInstallment.isPending;

    // ==========================
    // 🔹 Retorno do controller
    // ==========================
    return {
        // Estados base
        page,
        limit,
        search,
        drawerOpen,
        drawerMode,
        selectedPayment,
        confirmDelete,
        selectedIds,
        confirmDeleteSelected,
        deletingIds,
        filters,

        // Dados de API
        payments,
        isLoading,
        total,
        isFetching,
        isDeleting,
        isUpdatingStatus,
        isProcessingInstallment,

        // Setters básicos
        setPage,
        setLimit,
        setSearch,
        setDrawerOpen,
        setDrawerMode,
        setSelectedPayment,
        setConfirmDelete,
        setConfirmDeleteSelected,

        // Handlers de filtro
        handleFilterChange,
        handleClearFilters,

        // Handlers principais
        handleOpenDrawer,
        handleCloseDrawer,
        handleDelete,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        refetch,

        // Ações específicas para pagamentos
        handleUpdateStatus,
        handleProcessInstallment,

        // Ações do drawer
        handleDrawerEdit,
        handleDrawerDelete,
        handleDrawerCreateNew,

        // Utilitários
        addNotification,
        hasSelectedItems: selectedIds.length > 0,
        selectedCount: selectedIds.length,
        isAnyMutationPending: isDeleting || isUpdatingStatus || isProcessingInstallment
    };
}