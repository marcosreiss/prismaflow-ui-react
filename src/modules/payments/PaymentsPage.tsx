import { Paper, Button, Box } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";

import { usePaymentPageController } from "./hooks/usePaymentPageController";
import type { PaymentListItem, PaymentFromListItem } from "./types/paymentTypes";
import PaymentFilters from "./components/PaymentFilters";
import PaymentDrawer from "./components/paymentDrawer";

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
        filters,

        // ações e mutações
        setPage,
        setLimit,
        setConfirmDelete,
        setConfirmDeleteSelected,
        handleOpenDrawer,
        handleCloseDrawer,
        handleDelete,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        refetch,

        // handlers de filtro
        handleFilterChange,

        // 🔹 Handlers para Drawer
        handleDrawerEdit,
        handleDrawerDelete,
        handleDrawerCreateNew,

        // 🔹 Handlers específicos para payments
        handleUpdateStatus,
        handleProcessInstallment,

        // 🔹 Estados de loading
        isDeleting,
        isAnyMutationPending,
    } = controller;

    // ==============================
    // 🔹 Função para converter PaymentListItem para Payment
    // ==============================
    const convertToPayment = (item: PaymentListItem): PaymentFromListItem => {
        return {
            ...item,
            discount: item.discount ?? 0,
            downPayment: item.downPayment ?? 0,
            installmentsTotal: item.installmentsTotal ?? null,
            paidAmount: item.paidAmount ?? 0,
            installmentsPaid: item.installmentsPaid ?? 0,
            lastPaymentAt: item.lastPaymentAt ?? null,
            firstDueDate: item.firstDueDate ?? null,
            isActive: item.isActive ?? true,
            branchId: item.branchId ?? "",
            tenantId: item.tenantId ?? "",
            installments: item.installments ?? [],
        };
    };

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
                onSearch={(value) => handleFilterChange({ clientSearch: value })}
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

            {/* 🔄 ÁREA DE FILTROS */}
            <Box sx={{ mb: 3, mt: 2 }}>
                <PaymentFilters
                    status={filters.status || ''}
                    method={filters.method || ''}
                    dateRange={{
                        start: filters.startDate || '',
                        end: filters.endDate || ''
                    }}
                    clientSearch={filters.clientSearch || ''} // 🆕 NOVO
                    onStatusChange={(status) => handleFilterChange({ status: status || undefined })}
                    onMethodChange={(method) => handleFilterChange({ method: method || undefined })}
                    onDateChange={(dateRange) => handleFilterChange({
                        startDate: dateRange.start || undefined,
                        endDate: dateRange.end || undefined
                    })}
                    onClientSearchChange={(clientSearch) => handleFilterChange({
                        clientSearch: clientSearch || undefined
                    })} // 🆕 NOVO
                />
            </Box>

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
                onRowClick={(_, row) => handleOpenDrawer("view", convertToPayment(row))}
                onEdit={(row) => handleOpenDrawer("edit", convertToPayment(row))}
                onDelete={(row) => handleDrawerDelete(convertToPayment(row))}
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
                payment={selectedPayment}
                paymentId={selectedPayment?.id || null}
                onClose={handleCloseDrawer}
                onEdit={handleDrawerEdit}
                onDelete={handleDrawerDelete}
                onUpdateStatus={handleUpdateStatus}
                onProcessInstallment={handleProcessInstallment}
                onCreateNew={handleDrawerCreateNew}
                onCreated={() => {
                    refetch();
                }}
                onUpdated={() => {
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
                loading={isDeleting || isAnyMutationPending}
            />

            {/* Confirmação de exclusão em massa */}
            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir pagamentos selecionados"
                description={`Deseja realmente excluir ${selectedIds.length} pagamento${selectedIds.length > 1 ? "s" : ""} selecionado${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={isDeleting || isAnyMutationPending}
            />
        </Paper>
    );
}