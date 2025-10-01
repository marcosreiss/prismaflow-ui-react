import { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Chip, Paper, Typography, Divider } from "@mui/material";

import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFTable from "@/components/crud/PFTable";
import PFDrawerModal from "@/components/crud/PFDrawerModal";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";

import { useNotification } from "@/context/NotificationContext";
import { paymentColumns, paymentFields } from "@/config/payment.config";
import { usePayment } from "@/hooks/usePayment";

import type { Payment } from "@/types/paymentTypes";
import { PaymentMethodLabels, PaymentStatusLabels } from "@/types/paymentTypes";

export default function PaymentsPage() {
    const TITLE = "Pagamento";
    const ADD_LABEL = "Adicionar novo pagamento";

    // -------------------------
    // Estados
    // -------------------------
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { addNotification } = useNotification();

    // -------------------------
    // Hook de pagamentos
    // -------------------------
    const {
        list: {
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
            error: listError,
        },
        detail,
        create,
        update,
        remove,
        creating,
        updating,
        removing,
    } = usePayment(selectedId);

    // -------------------------
    // Selecionado (detalhes)
    // -------------------------
    const selectedItem: Payment | null =
        drawerMode === "create"
            ? null
            : detail.isLoading || (detail.data as Payment | undefined)?.id !== selectedId
                ? null
                : ((detail.data as Payment | undefined) ?? null);

    // -------------------------
    // Ações Drawer
    // -------------------------
    const openDrawer = useCallback((mode: "view" | "edit" | "create", id?: number) => {
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
    }, [data, addNotification]);

    const closeDrawer = () => setDrawerOpen(false);

    // -------------------------
    // Ações Delete
    // -------------------------
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
    }, [selectedId, data, remove, addNotification]);

    // -------------------------
    // Submit
    // -------------------------
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
            addNotification(`Erro ao ${drawerMode === "create" ? "criar" : "atualizar"} ${TITLE.toLowerCase()}.`, "error");
        }
    };

    // -------------------------
    // Notificação de erro listagem
    // -------------------------
    useEffect(() => {
        if (listError) {
            addNotification(`Erro ao carregar lista de ${TITLE.toLowerCase()}.`, "error");
        }
    }, [listError, addNotification]);

    // -------------------------
    // Configs tabelas/forms
    // -------------------------
    const columns = useMemo(() => paymentColumns, []);
    const fields = useMemo(() => paymentFields, []);

    // -------------------------
    // View Detalhes
    // -------------------------
    const renderView = (p: Payment) => {
        const saldo =
            (p.total ?? 0) - (p.discount ?? 0) - (p.downPayment ?? 0) - (p.paidAmount ?? 0);

        const money = (val: number) =>
            val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

        return (
            <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6">Pagamento #{p.id}</Typography>
                    <Chip
                        size="small"
                        label={PaymentStatusLabels[p.status]}
                        color={p.status === "CONFIRMED" ? "success" : p.status === "CANCELED" ? "default" : "warning"}
                        variant={p.status === "PENDING" ? "outlined" : "filled"}
                    />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "160px 1fr",
                        rowGap: 1.2,
                        columnGap: 2,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">Venda</Typography>
                    <Typography variant="body1">{p.sale?.id ?? "-"}</Typography>

                    <Typography variant="body2" color="text.secondary">Método</Typography>
                    <Typography variant="body1">{PaymentMethodLabels[p.method]}</Typography>

                    <Typography variant="body2" color="text.secondary">Total</Typography>
                    <Typography variant="body1">{money(p.total)}</Typography>

                    <Typography variant="body2" color="text.secondary">Desconto</Typography>
                    <Typography variant="body1">{money(p.discount)}</Typography>

                    <Typography variant="body2" color="text.secondary">Entrada</Typography>
                    <Typography variant="body1">{money(p.downPayment)}</Typography>

                    <Typography variant="body2" color="text.secondary">Pago</Typography>
                    <Typography variant="body1">{money(p.paidAmount)}</Typography>

                    <Typography variant="body2" color="text.secondary">Saldo</Typography>
                    <Typography variant="body1">{money(saldo)}</Typography>

                    <Typography variant="body2" color="text.secondary">Parcelas</Typography>
                    <Typography variant="body1">
                        {p.installmentsTotal ?? 0} (pagas: {p.installmentsPaid ?? 0})
                    </Typography>

                    <Typography variant="body2" color="text.secondary">1ª Parcela</Typography>
                    <Typography variant="body1">{p.firstDueDate ?? "-"}</Typography>

                    <Typography variant="body2" color="text.secondary">Último Pagamento</Typography>
                    <Typography variant="body1">{p.lastPaymentAt ?? "-"}</Typography>

                    <Typography variant="body2" color="text.secondary">Criado em</Typography>
                    <Typography variant="body1">{new Date(p.createdAt).toLocaleString()}</Typography>

                    <Typography variant="body2" color="text.secondary">Atualizado em</Typography>
                    <Typography variant="body1">{new Date(p.updatedAt).toLocaleString()}</Typography>
                </Box>
            </Box>
        );
    };

    // -------------------------
    // Render
    // -------------------------
    return (
        <Paper sx={{ borderRadius: 2, borderColor: "grey.200", backgroundColor: "background.paper", p: 3 }}>
            <PFTopToolbar
                title={TITLE}
                addLabel={ADD_LABEL}
                onSearch={setSearch}
                onRefresh={refetch}
            />

            <PFTable<Payment>
                columns={columns}
                rows={data}
                loading={isLoading || isFetching}
                total={total}
                page={page}
                pageSize={size}
                onPageChange={setPage}
                onPageSizeChange={setSize}
                onView={(row) => openDrawer("view", row.id)}
                onEdit={(row) => openDrawer("edit", row.id)}
                onDelete={handleAskDelete}
            />

            <PFDrawerModal<Payment>
                key={`${drawerMode}-${selectedId ?? "new"}`}
                open={drawerOpen}
                mode={drawerMode}
                title={
                    drawerMode === "create"
                        ? `Novo ${TITLE}`
                        : drawerMode === "edit"
                            ? `Editar ${TITLE}`
                            : `Detalhes do ${TITLE}`
                }
                data={selectedItem}
                fields={fields}
                onClose={closeDrawer}
                onSubmit={handleSubmit}
                creating={creating}
                updating={updating}
                renderView={renderView}
                ModalPropsOverride={{ onExited: () => setSelectedId(null) }}
            />

            <PFConfirmDialog
                open={confirmOpen}
                title={`Excluir ${TITLE}`}
                description={`Tem certeza que deseja excluir este ${TITLE.toLowerCase()}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={removing}
            />
        </Paper>
    );
}
