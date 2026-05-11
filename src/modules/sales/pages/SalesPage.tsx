import { Paper, Button } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import { useSalesPageController } from "../hooks/useSalesPageController";
import type { Sale } from "../types/salesTypes";
import formatDateBR from "@/utils/format-date";

// import PFMaintenance from "@/components/feedback/PFMaintenance";


// ==============================
// 🔹 Página principal de vendas
// ==============================
export default function SalesPage() {
    // Controller
    const controller = useSalesPageController();

    const {
        // dados e estados
        sales,
        total,
        isLoading,
        isFetching,
        page,
        limit,
        selectedSale,
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
        handleDelete,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        refetch,
        deleteSale,

        // navegação
        handleCreateNew,
        handleView,
        handleEdit,
        setSelectedSale,
    } = controller;


    // ==============================
    // 🔹 Colunas da tabela
    // ==============================
    const columns: ColumnDef<Sale>[] = [
        { key: "id", label: "ID", width: 80 },
        {
            key: "client",
            label: "Cliente",
            render: (row) => row.client?.name ?? "-",
        },
        {
            key: "total",
            label: "Total",
            render: (row) =>
                row.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
        },
        {
            key: "saleDate",
            label: "Data",
            render: (row) => formatDateBR(row.saleDate),
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
                title="Vendas"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={handleCreateNew}
                addLabel="Nova venda"
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
                            Excluir selecionadas ({selectedIds.length})
                        </Button>
                    )
                }
            />

            {/* Tabela */}
            <PFTable
                columns={columns}
                rows={sales}
                total={total}
                page={page}
                pageSize={limit}
                loading={isLoading || isFetching}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                getRowId={(row) => row.id}
                onRowClick={(_, row) => handleView(row)}
                onEdit={(row) => handleEdit(row)}
                onDelete={(row) => {
                    setSelectedSale(row);
                    setConfirmDelete(true);
                }}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            {/* Confirmação de exclusão individual */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir venda"
                description={`Deseja realmente excluir a venda #${selectedSale?.id}?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deleteSale.isPending}
            />

            {/* Confirmação de exclusão em massa */}
            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir vendas selecionadas"
                description={`Deseja realmente excluir ${selectedIds.length} venda${selectedIds.length > 1 ? "s" : ""
                    } selecionada${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={deleteSale.isPending}
            />
        </Paper>
    );

    // return (
    //     <PFMaintenance
    //         title="Vendas em Manutenção"
    //         description="As vendas estão em manutenção. Por favor, tente novamente mais tarde."
    //         backUrl="/"
    //     />
    // )
}
