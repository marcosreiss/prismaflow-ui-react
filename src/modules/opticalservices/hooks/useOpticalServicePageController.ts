import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/apiResponse";
import { useNotification } from "@/context/NotificationContext";
import {
  useGetOpticalServices,
  useDeleteOpticalService,
} from "./useOpticalService";
import type { OpticalService } from "../types/opticalServiceTypes";

export function useOpticalServicePageController() {
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
  const [selectedService, setSelectedService] = useState<OpticalService | null>(
    null
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 🆕 Seleção e exclusão em massa
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const { addNotification } = useNotification();

  // ==========================
  // 🔹 Hooks de dados
  // ==========================
  const { data, isLoading, isFetching, refetch } = useGetOpticalServices({
    page: page + 1, // API é base-1
    limit,
    search,
  });

  const deleteService = useDeleteOpticalService();

  // ==========================
  // 🔹 Handlers de Drawer
  // ==========================
  const handleOpenDrawer = (
    mode: "create" | "edit" | "view",
    service?: OpticalService | null
  ) => {
    setDrawerMode(mode);
    setSelectedService(service ?? null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedService(null);
  };

  // ==========================
  // 🔹 Exclusão individual
  // ==========================
  const handleDelete = async () => {
    if (!selectedService) return;

    try {
      const res = await deleteService.mutateAsync(selectedService.id);
      addNotification(res.message, "success");
      setConfirmDelete(false);
      handleCloseDrawer();
      refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao excluir serviço ótico.";
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
        const res = await deleteService.mutateAsync(id);
        addNotification(res.message, "success");
      } catch {
        addNotification(`Erro ao excluir serviço ${id}`, "error");
      }
    }

    setDeletingIds([]);
    setSelectedIds([]);
    refetch();
  };

  // ==========================
  // 🔹 Dados derivados
  // ==========================
  const services = data?.data?.content ?? [];
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
    selectedService,
    confirmDelete,
    selectedIds,
    confirmDeleteSelected,
    deletingIds,

    // dados de API
    services,
    total,
    isLoading,
    isFetching,

    // mutações / helpers
    setPage,
    setLimit,
    setSearch,
    setDrawerOpen,
    setDrawerMode,
    setSelectedService,
    setConfirmDelete,
    setConfirmDeleteSelected,
    handleOpenDrawer,
    handleCloseDrawer,
    handleDelete,
    handleSelectRow,
    handleSelectAll,
    handleDeleteSelected,
    refetch,
    deleteService,
    addNotification,
  };
}
