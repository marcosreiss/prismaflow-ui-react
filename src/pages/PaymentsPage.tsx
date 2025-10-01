// src/pages/PaymentsPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
    const title = "Pagamento";
    const addLabel = "Adicionar novo pagamento";

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const { addNotification } = useNotification();

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

    const selectedItem: Payment | null =
        drawerMode === "create"
            ? null
            : detail.isLoading || (detail.data as Payment | undefined)?.id !== selectedId
                ? null
                : ((detail.data as Payment | undefined) ?? null);

    // ---- Ações de abrir ----
    const handleOpenView = (row: Payment) => {
        setDrawerMode("view");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };
    const handleOpenEdit = (row: Payment) => {
        if (row.status !== "PENDING") {
            addNotification("Só é permitido editar pagamentos com status PENDENTE.", "warning");
            return;
        }
        setDrawerMode("edit");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };
    const handleCloseDrawer = () => setDrawerOpen(false);

    // ---- Exclusão ----
    const handleAskDelete = (row: Payment) => {
        setSelectedId(row.id);
        setConfirmOpen(true);
    };
    const handleDeleteConfirm = async () => {
        if (!selectedId) return;
        const row = data.find((p) => p.id === selectedId);
        if (row?.status === "CONFIRMED") {
            addNotification("Não é permitido deletar pagamentos CONFIRMADOS.", "warning");
            setConfirmOpen(false);
            return;
        }
        try {
            const res = await remove(selectedId);
            addNotification(res?.message || `${title} excluído com sucesso.`, "success");
            setSelectedId(null);
        } catch {
            addNotification(`Erro ao excluir ${title.toLowerCase()}.`, "error");
        } finally {
            setConfirmOpen(false);
        }
    };

    // ---- Submit ----
    const handleCreate = async (values: Partial<Payment>) => {
        try {
            const res = await create(values);
            addNotification(res?.message || `${title} criado com sucesso.`, "success");
            handleCloseDrawer();
        } catch {
            addNotification(`Erro ao criar ${title.toLowerCase()}.`, "error");
        }
    };
    const handleUpdate = async (id: number, values: Partial<Payment>) => {
        try {
            const res = await update({ id, data: values });
            addNotification(res?.message || `${title} atualizado com sucesso.`, "success");
            handleCloseDrawer();
        } catch {
            addNotification(`Erro ao atualizar ${title.toLowerCase()}.`, "error");
        }
    };
    const handleSubmit = async (values: Partial<Payment>) => {
        if (drawerMode === "create") return handleCreate(values);
        if (drawerMode === "edit" && selectedId) return handleUpdate(selectedId, values);
    };

    useEffect(() => {
        if (listError) addNotification(`Erro ao carregar lista de ${title.toLowerCase()}.`, "error");
    }, [listError, addNotification, title]);

    // -------------------------
    // USANDO paymentColumns
    // -------------------------
    const columns = useMemo(() => paymentColumns, []);

    // -------------------------
    // USANDO paymentFields (com overrides pontuais)
    // -------------------------


    const fields = useMemo(() => paymentFields, []);

    // -------------------------
    // Detalhes (renderView)
    // -------------------------
    const renderView = (p: Payment) => {
        const saldo =
            (p.total ?? 0) - (p.discount ?? 0) - (p.downPayment ?? 0) - (p.paidAmount ?? 0);

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
                    <Typography variant="body1">
                        {p.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">Desconto</Typography>
                    <Typography variant="body1">
                        {p.discount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">Entrada</Typography>
                    <Typography variant="body1">
                        {p.downPayment.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">Pago</Typography>
                    <Typography variant="body1">
                        {p.paidAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">Saldo</Typography>
                    <Typography variant="body1">
                        {saldo.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>

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

    return (
        <Paper sx={{ borderRadius: 2, borderColor: "grey.200", backgroundColor: "background.paper", p: 3 }}>
            <PFTopToolbar
                title={title}
                addLabel={addLabel}
                onSearch={(val) => setSearch(val)}
                onRefresh={() => refetch()}
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
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleAskDelete}
            />

            <PFDrawerModal<Payment>
                key={`${drawerMode}-${selectedId ?? "new"}`}
                open={drawerOpen}
                mode={drawerMode}
                title={
                    drawerMode === "create"
                        ? `Novo ${title}`
                        : drawerMode === "edit"
                            ? `Editar ${title}`
                            : `Detalhes do ${title}`
                }
                data={selectedItem}
                fields={fields}
                onClose={() => setDrawerOpen(false)}
                onSubmit={handleSubmit}
                creating={creating}
                updating={updating}
                renderView={renderView}
                ModalPropsOverride={{ onExited: () => setSelectedId(null) }}
            />

            <PFConfirmDialog
                open={confirmOpen}
                title={`Excluir ${title}`}
                description={`Tem certeza que deseja excluir este ${title.toLowerCase()}?`}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={removing}
            />
        </Paper>
    );
}
