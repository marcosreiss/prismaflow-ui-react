import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";
import { useGetPayments, useDeletePayment, useUpdatePaymentStatus, useProcessPaymentInstallment } from "./usePayments";
import type { Payment, PaymentDetails, PaymentStatus, PaymentListItem } from "../types/paymentTypes";

// ==============================
// 🔹 Hook principal
// ==============================
export function usePaymentPageController() {
    // ==========================
    // 🔹 Estados locais
    // ==========================
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(5);
    const [search, setSearch] = useState("");

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
        "view"
    );
    const [selectedPayment, setSelectedPayment] = useState<PaymentDetails | null>(null);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
    const [deletingIds, setDeletingIds] = useState<number[]>([]);

    const { addNotification } = useNotification();

    // ==========================
    // 🔹 Hooks de dados
    // ==========================
    const { data, isLoading, isFetching, refetch } = useGetPayments({
        page: page + 1,
        limit,
        search,
    });

    const deletePayment = useDeletePayment();
    const updatePaymentStatus = useUpdatePaymentStatus();
    const processPaymentInstallment = useProcessPaymentInstallment();

    // ==========================
    // 🔹 Drawer handlers
    // ==========================
    const handleOpenDrawer = (
        mode: "create" | "edit" | "view",
        payment?: Payment | PaymentListItem | null
    ) => {
        setDrawerMode(mode);
        setSelectedPayment(payment as PaymentDetails ?? null);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedPayment(null);
    };

    // ==========================
    // 🔹 Drawer: ações internas
    // ==========================
    const handleDrawerEdit = () => {
        if (!selectedPayment) return;
        handleOpenDrawer("edit", selectedPayment);
    };

    const handleDrawerDelete = (payment: Payment | PaymentListItem) => {
        setSelectedPayment(payment as PaymentDetails);
        setConfirmDelete(true);
    };

    const handleDrawerCreateNew = () => {
        setSelectedPayment(null);
        handleOpenDrawer("create");
    };

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
            const message =
                axiosErr.response?.data?.message ?? "Erro ao excluir pagamento.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Atualização de status
    // ==========================
    const handleUpdateStatus = async (paymentId: number, status: PaymentStatus) => {
        try {
            const res = await updatePaymentStatus.mutateAsync({ id: paymentId, status: status });
            addNotification(res.message, "success");
            refetch();
        } catch (err) {
            const axiosErr = err as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr.response?.data?.message ?? "Erro ao atualizar status.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Processamento de parcela
    // ==========================
    const handleProcessInstallment = async (paymentId: number, installmentId: number, paidAmount: number) => {
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
            const message =
                axiosErr.response?.data?.message ?? "Erro ao processar parcela.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Seleção de linhas
    // ==========================
    const handleSelectRow = (id: string | number, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id as number] : prev.filter((i) => i !== id)
        );
    };

    const handleSelectAll = (
        checked: boolean,
        currentPageIds: (string | number)[]
    ) => {
        setSelectedIds(checked ? (currentPageIds as number[]) : []);
    };

    // ==========================
    // 🔹 Exclusão em massa
    // ==========================
    const handleDeleteSelected = async () => {
        setConfirmDeleteSelected(false);
        setDeletingIds(selectedIds);

        for (const id of selectedIds) {
            try {
                const res = await deletePayment.mutateAsync(id);
                addNotification(res.message, "success");
            } catch {
                addNotification(`Erro ao excluir pagamento ${id}`, "error");
            }
        }

        setDeletingIds([]);
        setSelectedIds([]);
        refetch();
    };

    // ==========================
    // 🔹 Dados derivados
    // ==========================
    const payments = data?.data?.content ?? [];
    const total = data?.data?.totalElements ?? 0;

    // ==========================
    // 🔹 Retorno do controller
    // ==========================
    return {
        // estados base
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

        // dados de API
        payments,
        total,
        isLoading,
        isFetching,

        // mutações / helpers
        setPage,
        setLimit,
        setSearch,
        setDrawerOpen,
        setDrawerMode,
        setSelectedPayment,
        setConfirmDelete,
        setConfirmDeleteSelected,
        handleOpenDrawer,
        handleCloseDrawer,
        handleDelete,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        refetch,
        deletePayment,
        addNotification,

        // 🔹 Ações específicas para pagamentos
        handleUpdateStatus,
        handleProcessInstallment,

        // 🔹 Ações passadas ao Drawer
        handleDrawerEdit,
        handleDrawerDelete,
        handleDrawerCreateNew,
    };
}   