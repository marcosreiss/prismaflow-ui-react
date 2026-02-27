// src/modules/expenses/hooks/useExpensePageController.ts

import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";
import { useGetExpenses, useDeleteExpense } from "./useExpense";
import type { Expense } from "../types/expenseTypes";

export function useExpensePageController() {
  // ==========================
  // 🔹 Estados locais
  // ==========================
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
    "view",
  );
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const { addNotification } = useNotification();

  // ==========================
  // 🔹 Hooks de dados
  // ==========================
  const { data, isLoading, isFetching, refetch } = useGetExpenses({
    page: page + 1,
    limit,
    search,
    status,
  });

  const deleteExpense = useDeleteExpense();

  // ==========================
  // 🔹 Handlers de Drawer
  // ==========================
  const handleOpenDrawer = (
    mode: "create" | "edit" | "view",
    expense?: Expense | null,
  ) => {
    setDrawerMode(mode);
    setSelectedExpense(expense ?? null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedExpense(null);
  };

  // ==========================
  // 🔹 Exclusão individual
  // ==========================
  const handleDelete = async () => {
    if (!selectedExpense) return;

    try {
      const res = await deleteExpense.mutateAsync(selectedExpense.id);
      addNotification(res.message, "success");
      setConfirmDelete(false);
      handleCloseDrawer();
      refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao excluir despesa.";
      addNotification(message, "error");
    }
  };

  // ==========================
  // 🔹 Seleção de linhas
  // ==========================
  const handleSelectRow = (id: string | number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id as number] : prev.filter((i) => i !== id),
    );
  };

  const handleSelectAll = (
    checked: boolean,
    currentPageIds: (string | number)[],
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
        const res = await deleteExpense.mutateAsync(id);
        addNotification(res.message, "success");
      } catch {
        addNotification(`Erro ao excluir despesa ${id}`, "error");
      }
    }

    setDeletingIds([]);
    setSelectedIds([]);
    refetch();
  };

  // ==========================
  // 🔹 Dados derivados
  // ==========================
  const expenses = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;

  // ==========================
  // 🔹 Retorno do controller
  // ==========================
  return {
    page,
    limit,
    search,
    status,
    drawerOpen,
    drawerMode,
    selectedExpense,
    confirmDelete,
    selectedIds,
    confirmDeleteSelected,
    deletingIds,

    expenses,
    total,
    isLoading,
    isFetching,

    setPage,
    setLimit,
    setSearch,
    setStatus,
    setDrawerOpen,
    setDrawerMode,
    setSelectedExpense,
    setConfirmDelete,
    setConfirmDeleteSelected,
    handleOpenDrawer,
    handleCloseDrawer,
    handleDelete,
    handleSelectRow,
    handleSelectAll,
    handleDeleteSelected,
    refetch,
    deleteExpense,
    addNotification,
  };
}
