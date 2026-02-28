import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";
import { useGetSales, useDeleteSale } from "./useSales";
import type { Sale } from "../types/salesTypes";
import { useNavigate } from "react-router-dom";

/**
 * 🧭 Hook de controle da página de Vendas
 * - Mesma estrutura do useProductPageController
 * - Sem Drawer: usa navegação via rotas
 */
export function useSalesPageController() {
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  // ==========================
  // 🔹 Estados locais
  // ==========================
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // ==========================
  // 🔹 Hooks de dados (React Query)
  // ==========================
  const { data, isLoading, isFetching, refetch } = useGetSales(
    page + 1,
    limit,
    undefined, 
    search,
  );

  const deleteSale = useDeleteSale();

  // ==========================
  // 🔹 Navegação
  // ==========================
  const handleCreateNew = () => navigate("/sales/new");
  const handleView = (sale: Sale) => navigate(`/sales/${sale.id}`);
  const handleEdit = (sale: Sale) => navigate(`/sales/edit/${sale.id}`);

  // ==========================
  // 🔹 Exclusão individual
  // ==========================
  const handleDelete = async () => {
    if (!selectedSale) return;
    try {
      const res = await deleteSale.mutateAsync(selectedSale.id);
      addNotification(res.message, "success");
      setConfirmDelete(false);
      refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao excluir venda.";
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
        const res = await deleteSale.mutateAsync(id);
        addNotification(res.message, "success");
      } catch {
        addNotification(`Erro ao excluir venda ${id}`, "error");
      }
    }

    setDeletingIds([]);
    setSelectedIds([]);
    refetch();
  };

  // ==========================
  // 🔹 Dados derivados
  // ==========================
  const sales = data?.data?.content ?? [];
  const total = data?.data?.totalElements ?? 0;

  // ==========================
  // 🔹 Retorno do controller
  // ==========================
  return {
    // estados base
    page,
    limit,
    search,
    selectedSale,
    confirmDelete,
    selectedIds,
    confirmDeleteSelected,
    deletingIds,

    // dados de API
    sales,
    total,
    isLoading,
    isFetching,

    // mutações / helpers
    setPage,
    setLimit,
    setSearch,
    setSelectedSale,
    setConfirmDelete,
    setConfirmDeleteSelected,
    handleDelete,
    handleSelectRow,
    handleSelectAll,
    handleDeleteSelected,
    refetch,
    deleteSale,
    addNotification,

    // navegação
    handleCreateNew,
    handleView,
    handleEdit,
  };
}
