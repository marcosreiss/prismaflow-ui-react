// hooks/usePaymentsPage.ts
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNotification } from "@/context/NotificationContext";
import { paymentColumns, paymentFields } from "@/config/payment.config";
import type { Payment } from "@/types/paymentTypes";
import { usePayment } from "./usePayment";

export function usePaymentsPage(TITLE: string) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { addNotification } = useNotification();

  const {
    list: { data, total, isLoading, isFetching, page, setPage, size, setSize, setSearch, refetch, error: listError },
    detail,
    create,
    update,
    remove,
    creating,
    updating,
    removing,
  } = usePayment(selectedId);

  // Item selecionado
  const selectedItem: Payment | null =
    drawerMode === "create"
      ? null
      : detail.isLoading || (detail.data as Payment | undefined)?.id !== selectedId
      ? null
      : ((detail.data as Payment | undefined) ?? null);

  // Ações Drawer
  const openDrawer = useCallback(
    (mode: "view" | "edit" | "create", id?: number) => {
      if (mode === "edit" && id) {
        const row = data.find((p) => p.id === id);
        if (row?.status !== "PENDING") {
          addNotification("Só é permitido editar pagamentos com status PENDENTE.", "warning");
          return;
        }
      }
      setDrawerMode(mode);
      setSelectedId(id ?? null);
      setDrawerOpen(true);
    },
    [data, addNotification]
  );

  const closeDrawer = () => setDrawerOpen(false);

  // Delete
  const handleAskDelete = useCallback((row: Payment) => {
    setSelectedId(row.id);
    setConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedId) return;
    const row = data.find((p) => p.id === selectedId);

    if (row?.status === "CONFIRMED") {
      addNotification("Não é permitido deletar pagamentos CONFIRMADOS.", "warning");
      setConfirmOpen(false);
      return;
    }

    try {
      const res = await remove(selectedId);
      addNotification(res?.message || `${TITLE} excluído com sucesso.`, "success");
      setSelectedId(null);
    } catch {
      addNotification(`Erro ao excluir ${TITLE.toLowerCase()}.`, "error");
    } finally {
      setConfirmOpen(false);
    }
  }, [selectedId, data, remove, addNotification, TITLE]);

  // Submit
  const handleSubmit = async (values: Partial<Payment>) => {
    try {
      if (drawerMode === "create") {
        const res = await create(values);
        addNotification(res?.message || `${TITLE} criado com sucesso.`, "success");
      } else if (drawerMode === "edit" && selectedId) {
        const res = await update({ id: selectedId, data: values });
        addNotification(res?.message || `${TITLE} atualizado com sucesso.`, "success");
      }
      closeDrawer();
    } catch {
      addNotification(
        `Erro ao ${drawerMode === "create" ? "criar" : "atualizar"} ${TITLE.toLowerCase()}.`,
        "error"
      );
    }
  };

  // Notificação de erro de listagem
  useEffect(() => {
    if (listError) {
      addNotification(`Erro ao carregar lista de ${TITLE.toLowerCase()}.`, "error");
    }
  }, [listError, addNotification, TITLE]);

  const columns = useMemo(() => paymentColumns, []);
  const fields = useMemo(() => paymentFields, []);

  return {
    // estados
    drawerOpen,
    drawerMode,
    selectedId,
    confirmOpen,
    selectedItem,
    columns,
    fields,

    // actions
    openDrawer,
    closeDrawer,
    handleAskDelete,
    handleDeleteConfirm,
    handleSubmit,

    // data/hook
    data,
    total,
    isLoading,
    isFetching,
    page,
    setPage,
    size,
    setSize,
    setSearch,
    refetch,
    creating,
    updating,
    removing,
    setConfirmOpen,
    setSelectedId,
  };
}
