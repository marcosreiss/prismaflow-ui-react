import { useState } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useNotification } from "@/context/NotificationContext";
import { useGetProducts, useDeleteProduct } from "./useProduct";
import type { Product } from "../types/productTypes";

// ==============================
// 🔹 Hook principal
// ==============================
export function useProductPageController() {
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteSelected, setConfirmDeleteSelected] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const { addNotification } = useNotification();

  // ==========================
  // 🔹 Hooks de dados
  // ==========================
  const { data, isLoading, isFetching, refetch } = useGetProducts({
    page: page + 1,
    limit,
    search,
  });

  const deleteProduct = useDeleteProduct();

  // ==========================
  // 🔹 Drawer handlers
  // ==========================
  const handleOpenDrawer = (
    mode: "create" | "edit" | "view",
    product?: Product | null
  ) => {
    setDrawerMode(mode);
    setSelectedProduct(product ?? null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedProduct(null);
  };

  // ==========================
  // 🔹 Drawer: ações internas
  // ==========================
  const handleDrawerEdit = () => {
    if (!selectedProduct) return;
    handleOpenDrawer("edit", selectedProduct);
  };

  const handleDrawerDelete = (product: Product) => {
    setSelectedProduct(product);
    setConfirmDelete(true);
  };

  const handleDrawerCreateNew = () => {
    setSelectedProduct(null);
    handleOpenDrawer("create");
  };

  // ==========================
  // 🔹 Exclusão individual
  // ==========================
  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const res = await deleteProduct.mutateAsync(selectedProduct.id);
      addNotification(res.message, "success");
      setConfirmDelete(false);
      handleCloseDrawer();
      refetch();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao excluir produto.";
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
        const res = await deleteProduct.mutateAsync(id);
        addNotification(res.message, "success");
      } catch {
        addNotification(`Erro ao excluir produto ${id}`, "error");
      }
    }

    setDeletingIds([]);
    setSelectedIds([]);
    refetch();
  };

  // ==========================
  // 🔹 Dados derivados
  // ==========================
  const products = data?.data?.content ?? [];
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
    selectedProduct,
    confirmDelete,
    selectedIds,
    confirmDeleteSelected,
    deletingIds,

    // dados de API
    products,
    total,
    isLoading,
    isFetching,

    // mutações / helpers
    setPage,
    setLimit,
    setSearch,
    setDrawerOpen,
    setDrawerMode,
    setSelectedProduct,
    setConfirmDelete,
    setConfirmDeleteSelected,
    handleOpenDrawer,
    handleCloseDrawer,
    handleDelete,
    handleSelectRow,
    handleSelectAll,
    handleDeleteSelected,
    refetch,
    deleteProduct,
    addNotification,

    // 🔹 Ações passadas ao Drawer
    handleDrawerEdit,
    handleDrawerDelete,
    handleDrawerCreateNew,
  };
}
