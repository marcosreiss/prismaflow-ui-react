import { Paper, Button } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";

import PaymentDrawer from "./components/PaymentDrawer";
import { usePaymentPageController } from "./hooks/usePaymentPageController";
import type { Payment, PaymentDetails, PaymentListItem } from "./types/paymentTypes";

// ==============================
// 🔹 Página principal de pagamentos
// ==============================
export default function PaymentsPage() {
    // Controller
    const controller = usePaymentPageController();

    const {
        // dados e estados
        payments,
        total,
        isLoading,
        isFetching,
        page,
        limit,
        drawerOpen,
        drawerMode,
        selectedPayment,
        confirmDelete,
        selectedIds,
        confirmDeleteSelected,
        deletingIds,

        // ações e mutações
        setPage,
        setLimit,
        setSearch,
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

        // 🔹 Novos handlers para Drawer
        handleDrawerEdit,
        handleDrawerDelete,
        handleDrawerCreateNew,

        // 🔹 Handlers específicos para payments
        handleUpdateStatus,
        handleProcessInstallment,
    } = controller;

    // ==============================
    // 🔹 Colunas da tabela
    // ==============================
    const columns: ColumnDef<PaymentListItem>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "saleId", label: "Venda ID", width: 100 },
        { key: "clientName", label: "Cliente" },
        {
            key: "method",
            label: "Método",
            render: (row) => {
                const methodLabels: Record<string, string> = {
                    PIX: "Pix",
                    MONEY: "Dinheiro",
                    DEBIT: "Cartão de débito",
                    CREDIT: "Cartão de crédito",
                    INSTALLMENT: "Parcelado",
                };
                return row.method ? methodLabels[row.method] : "-";
            },
        },
        {
            key: "total",
            label: "Valor Total",
            render: (row) =>
                row.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
        },
        {
            key: "status",
            label: "Status",
            render: (row) => {
                const statusLabels: Record<string, string> = {
                    PENDING: "Pendente",
                    CONFIRMED: "Confirmado",
                    CANCELED: "Cancelado",
                };
                return statusLabels[row.status];
            },
        },
        {
            key: "createdAt",
            label: "Data",
            render: (row) =>
                new Date(row.createdAt).toLocaleDateString("pt-BR"),
        },
    ];

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                borderColor: "grey.200",
                backgroundColor: "background.paper",
                p: 3,
            }}
        >
            {/* Top Toolbar */}
            <PFTopToolbar
                title="Pagamentos"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={() => handleOpenDrawer("create")}
                addLabel="Novo pagamento"
                actionsExtra={
                    selectedIds.length > 0 && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setConfirmDeleteSelected(true)}
                            sx={{
                                whiteSpace: "nowrap",
                                fontWeight: 500,
                                textTransform: "none",
                                borderWidth: 1.5,
                                "&:hover": { borderWidth: 1.5 },
                            }}
                        >
                            Excluir selecionados ({selectedIds.length})
                        </Button>
                    )
                }
            />

            {/* Tabela */}
            <PFTable
                columns={columns}
                rows={payments}
                total={total}
                page={page}
                pageSize={limit}
                loading={isLoading || isFetching}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                getRowId={(row) => row.id}
                onRowClick={(_, row) => handleOpenDrawer("view", row as unknown as Payment)}
                onEdit={(row) => handleOpenDrawer("edit", row as unknown as Payment)}
                onDelete={(row) => {
                    controller.setSelectedPayment(row as unknown as PaymentDetails);
                    setConfirmDelete(true);
                }}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            {/* Drawer de pagamento */}
            <PaymentDrawer
                open={drawerOpen}
                mode={drawerMode}
                payment={selectedPayment} // ← Este deve ser atualizado pelo controller
                onClose={handleCloseDrawer}
                onEdit={handleDrawerEdit}
                onDelete={handleDrawerDelete}
                onUpdateStatus={handleUpdateStatus}
                onProcessInstallment={handleProcessInstallment}
                onCreateNew={handleDrawerCreateNew}
                onCreated={(payment) => {
                    addNotification("Pagamento criado com sucesso!", "success");
                    handleOpenDrawer("view", payment);
                    refetch();
                }}
                onUpdated={(payment) => {
                    addNotification("Pagamento atualizado com sucesso!", "success");
                    // 🔄 ATUALIZAR O SELECTEDPAYMENT NO CONTROLLER
                    controller.setSelectedPayment(payment as PaymentDetails);
                    refetch();
                }}
            />

            {/* Confirmação de exclusão individual */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir pagamento"
                description={`Deseja realmente excluir o pagamento #${selectedPayment?.id}?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deletePayment.isPending}
            />

            {/* Confirmação de exclusão em massa */}
            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir pagamentos selecionados"
                description={`Deseja realmente excluir ${selectedIds.length} pagamento${selectedIds.length > 1 ? "s" : ""
                    } selecionado${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={deletePayment.isPending}
            />
        </Paper>
    );
}