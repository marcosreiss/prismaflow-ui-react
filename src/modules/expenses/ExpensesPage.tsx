// src/modules/expenses/ExpensesPage.tsx

import { Paper, Button, MenuItem, TextField } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import type { Expense } from "./types/expenseTypes";
import { ExpenseStatusLabels, PaymentMethodLabels } from "./types/expenseTypes";
import { useExpensePageController } from "./hooks/useExpensePageController";
import ExpenseDrawer from "./components/ExpenseDrawer";

export default function ExpensesPage() {
    // ==========================
    // 🔹 Controller da página
    // ==========================
    const controller = useExpensePageController();

    const {
        expenses,
        total,
        isLoading,
        isFetching,
        page,
        limit,
        status,
        drawerOpen,
        drawerMode,
        selectedExpense,
        confirmDelete,
        selectedIds,
        confirmDeleteSelected,
        deletingIds,

        setPage,
        setLimit,
        setSearch,
        setStatus,
        setConfirmDelete,
        setConfirmDeleteSelected,
        handleOpenDrawer,
        handleCloseDrawer,
        handleDelete,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        refetch,
        deleteExpense,
        addNotification,
    } = controller;

    // ==========================
    // 🔹 Colunas da tabela
    // ==========================
    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const columns: ColumnDef<Expense>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "description", label: "Descrição" },
        {
            key: "amount",
            label: "Valor",
            render: (row) => formatCurrency(row.amount),
        },
        {
            key: "dueDate",
            label: "Vencimento",
            render: (row) => row.dueDate?.slice(0, 10) ?? "-",
        },
        {
            key: "status",
            label: "Status",
            render: (row) => ExpenseStatusLabels[row.status],
        },
        {
            key: "paymentMethod",
            label: "Pagamento",
            render: (row) =>
                row.paymentMethod ? PaymentMethodLabels[row.paymentMethod] : "-",
        },
    ];

    // ==========================
    // 🔹 Render
    // ==========================
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
                title="Despesas"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={() => handleOpenDrawer("create")}
                addLabel="Nova despesa"
                actionsExtra={
                    <>
                        {/* Filtro de status */}
                        <TextField
                            select
                            size="small"
                            value={status ?? ""}
                            onChange={(e) => setStatus(e.target.value || undefined)}
                            sx={{ minWidth: 150 }}
                            label="Status"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {Object.entries(ExpenseStatusLabels).map(([value, label]) => (
                                <MenuItem key={value} value={value}>
                                    {label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Exclusão em massa */}
                        {selectedIds.length > 0 && (
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
                        )}
                    </>
                }
            />

            {/* Tabela */}
            <PFTable
                columns={columns}
                rows={expenses}
                total={total}
                page={page}
                pageSize={limit}
                loading={isLoading || isFetching}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                getRowId={(row) => row.id}
                onRowClick={(_, row) => handleOpenDrawer("view", row)}
                onEdit={(row) => handleOpenDrawer("edit", row)}
                onDelete={(row) => {
                    controller.setSelectedExpense(row);
                    setConfirmDelete(true);
                }}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            {/* Drawer */}
            <ExpenseDrawer
                open={drawerOpen}
                mode={drawerMode}
                expense={selectedExpense}
                onClose={handleCloseDrawer}
                onEdit={() => handleOpenDrawer("edit", selectedExpense)}
                onDelete={(expense) => {
                    controller.setSelectedExpense(expense);
                    setConfirmDelete(true);
                }}
                onCreated={(expense) => {
                    addNotification("Despesa criada com sucesso!", "success");
                    handleOpenDrawer("view", expense);
                    refetch();
                }}
                onUpdated={(expense) => {
                    addNotification("Despesa atualizada com sucesso!", "success");
                    handleOpenDrawer("view", expense);
                    refetch();
                }}
                onCreateNew={() => {
                    controller.setSelectedExpense(null);
                    controller.setDrawerMode("create");
                }}
            />

            {/* Confirmação exclusão individual */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir despesa"
                description={`Deseja realmente excluir a despesa "${selectedExpense?.description}"?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deleteExpense.isPending}
            />

            {/* Confirmação exclusão em massa */}
            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir despesas selecionadas"
                description={`Deseja realmente excluir ${selectedIds.length} despesa${selectedIds.length > 1 ? "s" : ""} selecionada${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={deleteExpense.isPending}
            />
        </Paper>
    );
}
