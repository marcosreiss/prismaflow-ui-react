import { useState, useCallback, useMemo, useEffect } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";
// ✅ ATUALIZADO: Substituído useProcessPaymentInstallment por usePayInstallment
import {
    useGetPayments,
    useDeletePayment,
    useUpdatePaymentStatus,
    usePayInstallment // ✅ NOVO HOOK (substitui useProcessPaymentInstallment)
} from "./usePayments";
import type {
    Payment,
    PaymentDetails,
    PaymentStatus,
    PaymentListItem,
    PaymentFilters
} from "../types/paymentTypes";

// ==============================
// 🔹 Hook principal - Controller da página de pagamentos
// ==============================
export function usePaymentPageController() {
    // ==========================
    // 🔹 Estados locais de paginação e busca
    // ==========================
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");

    // ==========================
    // 🔹 Estados de UI (Drawer e modais)
    // ==========================
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);

    // ==========================
    // 🔹 Estados de confirmação de ações
    // ==========================
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

    // ==========================
    // 🔹 Estados de filtros centralizados
    // ✅ ATUALIZADO: Adicionados novos filtros avançados
    // ==========================
    const [filters, setFilters] = useState<PaymentFilters>({
        status: undefined,
        method: undefined,
        startDate: '',
        endDate: '',
        clientSearch: '',
        // ✅ NOVOS FILTROS AVANÇADOS:
        hasOverdueInstallments: undefined, // Filtrar pagamentos com parcelas vencidas
        isPartiallyPaid: undefined,        // Filtrar pagamentos parcialmente pagos
        dueDaysAhead: undefined,           // Filtrar por parcelas vencendo nos próximos X dias
    });

    const { addNotification } = useNotification();

    // ==========================
    // 🔹 Preparação dos parâmetros de query para a API
    // ✅ ATUALIZADO: Incluídos novos filtros
    // ==========================
    const queryParams = useMemo(() => ({
        page: page + 1, // API usa paginação baseada em 1
        limit,
        // Filtros básicos
        ...(filters.status && { status: filters.status }),
        ...(filters.method && { method: filters.method }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
        ...(filters.clientSearch && { clientName: filters.clientSearch }),
        // ✅ NOVOS FILTROS AVANÇADOS:
        ...(filters.hasOverdueInstallments !== undefined && {
            hasOverdueInstallments: filters.hasOverdueInstallments
        }),
        ...(filters.isPartiallyPaid !== undefined && {
            isPartiallyPaid: filters.isPartiallyPaid
        }),
        ...(filters.dueDaysAhead !== undefined && {
            dueDaysAhead: filters.dueDaysAhead
        }),
    }), [page, limit, filters]);

    // ==========================
    // 🔹 Hooks de API - Queries e Mutations
    // ✅ ATUALIZADO: Substituído hook obsoleto
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
    const payInstallment = usePayInstallment(); // ✅ NOVO (substitui processPaymentInstallment)

    // ==========================
    // 🔹 Notificações automáticas de erro
    // ==========================
    useEffect(() => {
        if (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message = axiosErr.response?.data?.message ?? "Erro ao carregar pagamentos.";
            addNotification(message, "error");
        }
    }, [error, addNotification]);

    // ==========================
    // 🔹 Handlers do Drawer (abrir/fechar)
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
        // Delay para animação do drawer antes de limpar estado
        setTimeout(() => {
            setSelectedPayment(null);
        }, 300);
    }, []);

    // ==========================
    // 🔹 Ações do Drawer (editar/deletar/criar)
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
    // 🔹 Exclusão individual de pagamento
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
    // 🔹 Atualização de status do pagamento
    // ==========================
    const handleUpdateStatus = async (paymentId: number, status: PaymentStatus, reason?: string) => {
        try {
            const res = await updatePaymentStatus.mutateAsync({
                id: paymentId,
                status,
                reason // ✅ ADICIONADO: Motivo opcional (ex: cancelamento)
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
    // 🔹 Pagamento de parcela
    // ✅ NOVO HANDLER (substitui handleProcessInstallment)
    // ==========================
    const handlePayInstallment = async (
        installmentId: number,
        paidAmount: number,
        paidAt?: string
    ) => {
        try {
            const res = await payInstallment.mutateAsync({
                id: installmentId,
                data: { paidAmount, paidAt }
            });
            addNotification(res.message, "success");
            refetch();
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message = axiosErr.response?.data?.message ?? "Erro ao pagar parcela.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Seleção de linhas na tabela
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
    // 🔹 Exclusão em massa (múltiplos pagamentos)
    // Executa todas as exclusões em paralelo
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

            // Processa resultados individuais
            let successCount = 0;
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
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
            const message = axiosErr?.response?.data?.message ?? "Erro ao excluir pagamentos selecionados";
            addNotification(message, "error");
        } finally {
            setDeletingIds([]);
            setSelectedIds([]);
            refetch();
        }
    };

    // ==========================
    // 🔹 Gerenciamento de filtros
    // ==========================
    const handleFilterChange = useCallback((newFilters: Partial<PaymentFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPage(0); // Reset para primeira página ao alterar filtros
    }, []);

    // ✅ ATUALIZADO: Limpa TODOS os filtros (incluindo novos)
    const handleClearFilters = useCallback(() => {
        setFilters({
            status: undefined,
            method: undefined,
            startDate: '',
            endDate: '',
            clientSearch: '',
            hasOverdueInstallments: undefined,
            isPartiallyPaid: undefined,
            dueDaysAhead: undefined,
        });
        setSearch('');
        setPage(0);
    }, []);

    // ==========================
    // 🔹 Mapeamento de dados da API para formato da UI
    // ✅ CORRIGIDO: Compatibilidade de tipos
    // ==========================
    const payments: PaymentListItem[] = useMemo(() => {
        if (!data?.data?.content) return [];

        return data.data.content.map((item: PaymentListItem) => {
            // ✅ Retorna PaymentListItem diretamente (não precisa converter para PaymentDetails)
            return {
                ...item,
                // Garante que clientName sempre existe
                clientName: item.sale?.client?.name || item.clientName || "Cliente não informado",
                // Garante valores padrão para campos opcionais
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
            };
        });
    }, [data?.data?.content]);


    const total = data?.data?.totalElements ?? 0;

    // ==========================
    // 🔹 Indicadores de loading para cada operação
    // ✅ ATUALIZADO: Incluído isPayingInstallment
    // ==========================
    const isDeleting = deletePayment.isPending;
    const isUpdatingStatus = updatePaymentStatus.isPending;
    const isPayingInstallment = payInstallment.isPending; // ✅ NOVO

    // ==========================
    // 🔹 Retorno do controller
    // Expõe todos os estados e handlers para a página
    // ==========================
    return {
        // Estados base de paginação e busca
        page,
        limit,
        search,

        // Estados de UI
        drawerOpen,
        drawerMode,
        selectedPayment,
        confirmDelete,
        selectedIds,
        confirmDeleteSelected,
        deletingIds,
        filters,

        // Dados da API
        payments,
        isLoading,
        total,
        isFetching,

        // Estados de loading por operação
        isDeleting,
        isUpdatingStatus,
        isPayingInstallment, // ✅ NOVO

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
        handlePayInstallment, // ✅ NOVO (substitui handleProcessInstallment)

        // Ações do drawer
        handleDrawerEdit,
        handleDrawerDelete,
        handleDrawerCreateNew,

        // Utilitários
        addNotification,
        hasSelectedItems: selectedIds.length > 0,
        selectedCount: selectedIds.length,
        isAnyMutationPending: isDeleting || isUpdatingStatus || isPayingInstallment // ✅ ATUALIZADO
    };
}
