import { Paper, Button } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import type { Brand } from "./types/brandTypes";
import { useBrandPageController } from "./hooks/useBrandPageController";
import BrandDrawer from "./components/BrandDrawer";

export default function BrandsPage() {
    // ==========================
    // 🔹 Controller da página
    // ==========================
    const controller = useBrandPageController();

    const {
        // dados e estados
        brands,
        total,
        isLoading,
        isFetching,
        page,
        limit,
        drawerOpen,
        drawerMode,
        selectedBrand,
        confirmDelete,
        selectedIds,
        confirmDeleteSelected,
        deletingIds,

        // mutações e ações
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
        deleteBrand,
        addNotification,
    } = controller;

    // ==========================
    // 🔹 Colunas da tabela
    // ==========================
    const columns: ColumnDef<Brand>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "name", label: "Nome" },
        {
            key: "createdBy",
            label: "Criado por",
            render: (row) => row.createdBy?.name ?? "-",
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
                title="Marcas"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={() => handleOpenDrawer("create")}
                addLabel="Nova marca"
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
                rows={brands}
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
                    controller.setSelectedBrand(row);
                    setConfirmDelete(true);
                }}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            {/* Drawer de marca */}
            <BrandDrawer
                open={drawerOpen}
                mode={drawerMode}
                brand={selectedBrand}
                onClose={handleCloseDrawer}
                onEdit={() => handleOpenDrawer("edit", selectedBrand)}
                onDelete={(brand) => {
                    controller.setSelectedBrand(brand);
                    setConfirmDelete(true);
                }}
                onCreated={(brand) => {
                    addNotification("Marca criada com sucesso!", "success");
                    handleOpenDrawer("view", brand);
                    refetch();
                }}
                onUpdated={(brand) => {
                    addNotification("Marca atualizada com sucesso!", "success");
                    handleOpenDrawer("view", brand);
                    refetch();
                }}
                onCreateNew={() => {
                    controller.setSelectedBrand(null);
                    controller.setDrawerMode("create");
                }}
            />

            {/* Confirmação de exclusão individual */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir marca"
                description={`Deseja realmente excluir a marca "${selectedBrand?.name}"?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deleteBrand.isPending}
            />

            {/* Confirmação de exclusão em massa */}
            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir marcas selecionadas"
                description={`Deseja realmente excluir ${selectedIds.length} marca${selectedIds.length > 1 ? "s" : ""
                    } selecionada${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={deleteBrand.isPending}
            />
        </Paper>
    );
}
