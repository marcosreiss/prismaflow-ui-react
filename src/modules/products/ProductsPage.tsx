import { Paper, Button } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";

import ProductDrawer from "./components/ProductDrawer";
import { useProductPageController } from "./hooks/useProductPageController";
import type { Product } from "./types/productTypes";

// ==============================
// 🔹 Página principal de produtos
// ==============================
export default function ProductsPage() {
    // Controller
    const controller = useProductPageController();

    const {
        // dados e estados
        products,
        total,
        isLoading,
        isFetching,
        page,
        limit,
        drawerOpen,
        drawerMode,
        selectedProduct,
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
        deleteProduct,
        addNotification,

        // 🔹 Novos handlers para Drawer
        handleDrawerEdit,
        handleDrawerDelete,
        handleDrawerCreateNew,
    } = controller;

    // ==============================
    // 🔹 Colunas da tabela
    // ==============================
    const columns: ColumnDef<Product>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "name", label: "Nome" },
        { key: "category", label: "Categoria" },
        {
            key: "salePrice",
            label: "Preço de venda",
            render: (row) =>
                row.salePrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
        },
        {
            key: "stockQuantity",
            label: "Estoque",
            align: "right",
            render: (row) => `${row.stockQuantity}`,
        },
        {
            key: "brand",
            label: "Marca",
            render: (row) => row.brand?.name ?? "-",
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
                title="Produtos"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={() => handleOpenDrawer("create")}
                addLabel="Novo produto"
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
                rows={products}
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
                    controller.setSelectedProduct(row);
                    setConfirmDelete(true);
                }}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            {/* Drawer de produto */}
            <ProductDrawer
                open={drawerOpen}
                mode={drawerMode}
                product={selectedProduct}
                onClose={handleCloseDrawer}
                onEdit={handleDrawerEdit}
                onDelete={handleDrawerDelete}
                onCreateNew={handleDrawerCreateNew}
                onCreated={(product) => {
                    addNotification("Produto criado com sucesso!", "success");
                    handleOpenDrawer("view", product);
                    refetch();
                }}
                onUpdated={(product) => {
                    addNotification("Produto atualizado com sucesso!", "success");
                    handleOpenDrawer("view", product);
                    refetch();
                }}
            />

            {/* Confirmação de exclusão individual */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir produto"
                description={`Deseja realmente excluir o produto "${selectedProduct?.name}"?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deleteProduct.isPending}
            />

            {/* Confirmação de exclusão em massa */}
            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir produtos selecionados"
                description={`Deseja realmente excluir ${selectedIds.length} produto${selectedIds.length > 1 ? "s" : ""
                    } selecionado${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={deleteProduct.isPending}
            />
        </Paper>
    );
}
