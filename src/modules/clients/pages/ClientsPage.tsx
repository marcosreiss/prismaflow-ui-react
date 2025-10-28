import { Button, FormControl, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PFConfirmDialog from "@/components/crud/PFConfirmDialog";
import ClientDrawer from "../components/ClientDrawer";
import { useClientPageController } from "../hooks/useClientPageController";
import type { Client } from "../types/clientTypes";
import { useSelectBranches } from "@/modules/branch/useBranch";

// ==============================
// 🔹 Página principal de Clientes
// ==============================
export default function ClientsPage() {
    // Controller
    const controller = useClientPageController();
    const {
        // dados e estados
        clients,
        total,
        isLoading,
        isFetching,
        page,
        limit,
        branchId, // 🆕
        drawerOpen,
        drawerMode,
        selectedClient,
        confirmDelete,
        selectedIds,
        confirmDeleteSelected,
        deletingIds,

        // ações e mutações
        setPage,
        setLimit,
        setSearch,
        setBranchId, // 🆕
        setConfirmDelete,
        setConfirmDeleteSelected,
        handleOpenDrawer,
        handleCloseDrawer,
        handleDelete,
        handleSelectRow,
        handleSelectAll,
        handleDeleteSelected,
        refetch,
        deleteClient,
        addNotification,
    } = controller;

    // 🆕 Hook para buscar filiais
    const { data: branchesData } = useSelectBranches();
    const branches = branchesData?.data || [];

    // ==============================
    // 🔹 Colunas da tabela
    // ==============================
    const columns: ColumnDef<Client>[] = [
        { key: "id", label: "ID", width: 80 },
        { key: "name", label: "Nome" },
        {
            key: "cpf",
            label: "CPF",
            render: (row) => row.cpf ?? "-",
        },
        {
            key: "email",
            label: "E-mail",
            render: (row) => row.email ?? "-",
        },
        {
            key: "phone01",
            label: "Telefone",
            render: (row) => row.phone01 ?? "-",
        },
        {
            key: "city",
            label: "Cidade",
            render: (row) => row.city ?? "-",
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
                title="Clientes"
                onSearch={(value) => setSearch(value)}
                onRefresh={() => refetch()}
                onAdd={() => handleOpenDrawer("create")}
                addLabel="Novo cliente"
                filters={ // 🆕 Filtro de filiais
                    <FormControl size="small" sx={{ minWidth: 180, }}>
                        <InputLabel>Filial</InputLabel>
                        <Select
                            value={branchId}
                            label="Filial"
                            onChange={(e) => setBranchId(e.target.value)}
                            sx={{borderRadius: 2}}
                        >
                            <MenuItem value="">Todas as filiais</MenuItem>
                            {branches.map((branch) => (
                                <MenuItem key={branch.id} value={branch.id}>
                                    {branch.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
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
                rows={clients}
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
                    controller.setSelectedClient(row);
                    setConfirmDelete(true);
                }}
                selectable
                selectedRows={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                isRowDisabled={(row) => deletingIds.includes(row.id)}
            />

            {/* Drawer de Cliente */}
            <ClientDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                mode={drawerMode}
                client={selectedClient}
                onEdit={() => handleOpenDrawer("edit", selectedClient)}
                onDelete={(client) => {
                    controller.setSelectedClient(client);
                    setConfirmDelete(true);
                }}
                onCreated={(client) => {
                    addNotification("Cliente criado com sucesso!", "success");
                    handleOpenDrawer("view", client);
                    refetch();
                }}
                onUpdated={(client) => {
                    addNotification("Cliente atualizado com sucesso!", "success");
                    handleOpenDrawer("view", client);
                    refetch();
                }}
                onCreateNew={() => {
                    controller.setSelectedClient(null);
                    controller.setDrawerMode("create");
                }}
            />

            {/* Confirmação de exclusão individual */}
            <PFConfirmDialog
                open={confirmDelete}
                title="Excluir cliente"
                description={`Deseja realmente excluir o cliente "${selectedClient?.name}"?`}
                onCancel={() => setConfirmDelete(false)}
                onConfirm={handleDelete}
                loading={deleteClient.isPending}
            />

            {/* Confirmação de exclusão em massa */}
            <PFConfirmDialog
                open={confirmDeleteSelected}
                title="Excluir clientes selecionados"
                description={`Deseja realmente excluir ${selectedIds.length} cliente${selectedIds.length > 1 ? "s" : ""
                    } selecionado${selectedIds.length > 1 ? "s" : ""}?`}
                onCancel={() => setConfirmDeleteSelected(false)}
                onConfirm={handleDeleteSelected}
                loading={deleteClient.isPending}
            />
        </Paper>
    );
}
