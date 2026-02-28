import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";
import { useGetBrands, useDeleteBrand } from "./useBrand";
import type { Brand } from "../types/brandTypes";

export function useBrandPageController() {
  // ==========================
  // 🔹 Estados locais
  // ==========================
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">(
    "view"
  );
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // 🆕 Seleção e exclusão em massa
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const { addNotification } = useNotification();

  // ==========================
  // 🔹 Hooks de dados
  // ==========================
  const { data, isLoading, isFetching, refetch } = useGetBrands({
    page: page + 1, // API é base-1
    limit,
    search,
  });

  const deleteBrand = useDeleteBrand();

  // ==========================
  // 🔹 Handlers de Drawer
  // ==========================
  const handleOpenDrawer = (
    mode: "create" | "edit" | "view",
    brand?: Brand | null
  ) => {
    setDrawerMode(mode);
    setSelectedBrand(brand ?? null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedBrand(null);
  };

  // ==========================
  // 🔹 Exclusão individual
  // ==========================
  const handleDelete = async () => {
    if (!selectedBrand) return;

    try {
      const res = await deleteBrand.mutateAsync(selectedBrand.id);
      addNotification(res.message, "success");
      setConfirmDelete(false);
      handleCloseDrawer();
      refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao excluir marca.";
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
        const res = await deleteBrand.mutateAsync(id);
        addNotification(res.message, "success");
      } catch {
        addNotification(`Erro ao excluir marca ${id}`, "error");
      }
    }

    setDeletingIds([]);
    setSelectedIds([]);
    refetch();
  };

  // ==========================
  // 🔹 Dados derivados
  // ==========================
  const brands = data?.data?.content ?? [];
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
    selectedBrand,
    confirmDelete,
    selectedIds,
    confirmDeleteSelected,
    deletingIds,

    // dados de API
    brands,
    total,
    isLoading,
    isFetching,

    // mutações / helpers
    setPage,
    setLimit,
    setSearch,
    setDrawerOpen,
    setDrawerMode,
    setSelectedBrand,
    setConfirmDelete,
    setConfirmDeleteSelected,
    handleOpenDrawer,
    handleCloseDrawer,
    handleDelete,
    handleSelectRow,
    handleSelectAll,
    handleDeleteSelected,
    refetch,
    deleteBrand,
    addNotification,
  };
}
