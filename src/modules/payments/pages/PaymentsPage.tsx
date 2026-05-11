import { Paper, Button, Box } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import formatDateBR from "@/utils/format-date";
import PaymentDrawer from "../components/paymentDrawer";
import PaymentFilters from "../components/PaymentFilters";
import { usePaymentPageController } from "../hooks/usePaymentPageController";
import { PaymentMethodLabels } from "../types/paymentEnums";
import type { PaymentListItem } from "../types/paymentListTypes";
import { useCallback } from "react";
// import PFMaintenance from "@/components/feedback/PFMaintenance";

// ==============================
// Página principal de pagamentos
// ==============================
export default function PaymentsPage() {
    const controller = usePaymentPageController();

    const {
        // Dados e estados
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

        // Ações
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

        // Filtros
        handleFilterChange,

        // Drawer
        handleDrawerEdit,
        handleDrawerDelete,

        // Específicos
        handleUpdateStatus,
        handlePayInstallment,

        // Loading
        isDeleting,
        isAnyMutationPending,
    } = controller;

    // ==============================
    // Colunas da tabela
    // ==============================
    const columns: ColumnDef<PaymentListItem>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "saleId", label: "Venda ID", width: 100 },
        { key: "clientName", label: "Cliente" },
        {
            key: "methods",
            label: "Método",
            render: (row) => {
                if (!row.methods || row.methods.length === 0) return "-";
                if (row.methods.length === 1) {
                    return PaymentMethodLabels[row.methods[0].method];
                }
                return "Múltiplos métodos";
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
            key: "saleDate",
            label: "Data da Venda",
            render: (row) => formatDateBR(row.saleDate || row.sale?.saleDate || ""),
        },
    ];

    // ==============================
    // Render
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
            <PFTopToolbar
                title="Pagamentos"
                onSearch={useCallback(
                    (value: string) => handleFilterChange({ clientSearch: value }),
                    [handleFilterChange]
                )}
                onRefresh={() => refetch()}
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

            <Box sx={{ mb: 3, mt: 2 }}>
                <PaymentFilters
                    status={filters.status || ""}
                    method={filters.method || ""}
                    sortOrder={filters.sortOrder || "desc"}
                    dateRange={{
                        start: filters.startDate || "",
                        end: filters.endDate || "",
                    }}
                    clientSearch={filters.clientSearch || ""}
                    hasOverdueInstallments={filters.hasOverdueInstallments}
                    isPartiallyPaid={filters.isPartiallyPaid}
                    dueDaysAhead={filters.dueDaysAhead}
                    onStatusChange={(status) =>
                        handleFilterChange({ status: status || undefined })
                    }
                    onMethodChange={(method) =>
                        handleFilterChange({ method: method || undefined })
                    }
                    onSortOrderChange={(sortOrder) =>
                        handleFilterChange({ sortOrder })
                    }
                    onDateChange={(dateRange) =>
                        handleFilterChange({
                            startDate: dateRange.start || undefined,
                            endDate: dateRange.end || undefined,
                        })
                    }
                    onClientSearchChange={(clientSearch) =>
                        handleFilterChange({ clientSearch: clientSearch || undefined })
                    }
                    onOverdueChange={(checked) =>
                        handleFilterChange({
                            hasOverdueInstallments: checked ? true : undefined,
                        })
                    }
                    onPartiallyPaidChange={(checked) =>
                        handleFilterChange({
                            isPartiallyPaid: checked ? true : undefined,
                        })
                    }
                    onDueDaysChange={(days) =>
                        handleFilterChange({ dueDaysAhead: days })
                    }
                />
            </Box>

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
                onRowClick={(_, row) => handleOpenDrawer("view", row)}
                onEdit={(row) => handleOpenDrawer("edit", row)}
                onDelete={(row) => handleDrawerDelete(row)}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            <PaymentDrawer
                open={drawerOpen}
                mode={drawerMode}
                payment={selectedPayment}
                paymentId={selectedPayment?.id || null}
                onClose={handleCloseDrawer}
                onEdit={handleDrawerEdit}
                onDelete={handleDrawerDelete}
                onUpdateStatus={handleUpdateStatus}
                onPayInstallment={handlePayInstallment}
                onUpdated={() => refetch()}
            />

            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir pagamento"
                description={`Deseja realmente excluir o pagamento #${selectedPayment?.id}?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={isDeleting || isAnyMutationPending}
            />

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

    // return (
    //     <PFMaintenance
    //         title="Pagamentos em Manutenção"
    //         description="Os pagamentos estão em manutenção. Por favor, tente novamente mais tarde."
    //         backUrl="/"
    //     />
    // )
}
