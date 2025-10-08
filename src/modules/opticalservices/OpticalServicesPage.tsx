import { Paper, Button } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import type { OpticalService } from "./types/opticalServiceTypes";
import { useOpticalServicePageController } from "./hooks/useOpticalServicePageController";
import OpticalServiceDrawer from "./components/OpticalServiceDrawer";

export default function OpticalServicesPage() {
    // ==========================
    // 🔹 Controller da página
    // ==========================
    const controller = useOpticalServicePageController();

    const {
        // dados e estados
        services,
        total,
        isLoading,
        isFetching,
        page,
        limit,
        drawerOpen,
        drawerMode,
        selectedService,
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
        deleteService,
        addNotification,
    } = controller;

    // ==========================
    // 🔹 Colunas da tabela
    // ==========================
    const columns: ColumnDef<OpticalService>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "name", label: "Serviço" },
        {
            key: "price",
            label: "Preço (R$)",
            render: (row) => row.price?.toFixed(2).replace(".", ",") ?? "-",
        },
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
            {/* ========================== */}
            {/* 🔹 Top Toolbar */}
            {/* ========================== */}
            <PFTopToolbar
                title="Serviços Óticos"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={() => handleOpenDrawer("create")}
                addLabel="Novo serviço"
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

            {/* ========================== */}
            {/* 🔹 Tabela */}
            {/* ========================== */}
            <PFTable
                columns={columns}
                rows={services}
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
                    controller.setSelectedService(row);
                    setConfirmDelete(true);
                }}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            {/* ========================== */}
            {/* 🔹 Drawer */}
            {/* ========================== */}
            <OpticalServiceDrawer
                open={drawerOpen}
                mode={drawerMode}
                service={selectedService}
                onClose={handleCloseDrawer}
                onEdit={() => handleOpenDrawer("edit", selectedService)}
                onDelete={(service) => {
                    controller.setSelectedService(service);
                    setConfirmDelete(true);
                }}
                onCreated={(service) => {
                    addNotification("Serviço criado com sucesso!", "success");
                    handleOpenDrawer("view", service);
                    refetch();
                }}
                onUpdated={(service) => {
                    addNotification("Serviço atualizado com sucesso!", "success");
                    handleOpenDrawer("view", service);
                    refetch();
                }}
                onCreateNew={() => {
                    controller.setSelectedService(null);
                    controller.setDrawerMode("create");
                }}
            />

            {/* ========================== */}
            {/* 🔹 Confirmações de exclusão */}
            {/* ========================== */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir serviço"
                description={`Deseja realmente excluir o serviço "${selectedService?.name}"?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deleteService.isPending}
            />

            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir serviços selecionados"
                description={`Deseja realmente excluir ${selectedIds.length} serviço${selectedIds.length > 1 ? "s" : ""
                    } selecionado${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={deleteService.isPending}
            />
        </Paper>
    );
}
