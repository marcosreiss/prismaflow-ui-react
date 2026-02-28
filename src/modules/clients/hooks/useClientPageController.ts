import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";

import { useGetClients, useDeleteClient } from "./useClient";
import type { Client } from "../types/clientTypes";

// ==============================
// 🔹 Hook principal
// ==============================
export function useClientPageController() {
  // ==========================
  // 🔹 Estados locais
  // ==========================
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [branchId, setBranchId] = useState<string>("");


  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
    "view"
  );
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const { addNotification } = useNotification();

  // ==========================
  // 🔹 Hooks de dados
  // ==========================
  const { data, isLoading, isFetching, refetch } = useGetClients({
    page: page + 1, // base-1
    limit,
    search,
    branchId: branchId || undefined,
  });

  const deleteClient = useDeleteClient();

  // ==========================
  // 🔹 Handlers de Drawer
  // ==========================
  const handleOpenDrawer = (
    mode: "create" | "edit" | "view",
    client?: Client | null
  ) => {
    setDrawerMode(mode);
    setSelectedClient(client ?? null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedClient(null);
  };

  // ==========================
  // 🔹 Exclusão individual
  // ==========================
  const handleDelete = async () => {
    if (!selectedClient) return;

    try {
      const res = await deleteClient.mutateAsync(selectedClient.id);
      addNotification(res.message, "success");
      setConfirmDelete(false);
      handleCloseDrawer();
      refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao excluir cliente.";
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
        const res = await deleteClient.mutateAsync(id);
        addNotification(res.message, "success");
      } catch {
        addNotification(`Erro ao excluir cliente ${id}`, "error");
      }
    }

    setDeletingIds([]);
    setSelectedIds([]);
    refetch();
  };

  // ==========================
  // 🔹 Dados derivados
  // ==========================
  const clients = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;

  // ==========================
  // 🔹 Retorno
  // ==========================
  return {
    // estados base
    page,
    limit,
    search,
    branchId,
    drawerOpen,
    drawerMode,
    selectedClient,
    confirmDelete,
    selectedIds,
    confirmDeleteSelected,
    deletingIds,

    // dados de API
    clients,
    total,
    isLoading,
    isFetching,

    // mutações / helpers
    setPage,
    setLimit,
    setSearch,
    setBranchId,
    setDrawerOpen,
    setDrawerMode,
    setSelectedClient,
    setConfirmDelete,
    setConfirmDeleteSelected,
    handleOpenDrawer,
    handleCloseDrawer,
    handleDelete,
    handleSelectRow,
    handleSelectAll,
    handleDeleteSelected,
    refetch,
    deleteClient,
    addNotification,
  };
}
