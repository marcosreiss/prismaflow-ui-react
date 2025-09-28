import { useEffect, useState } from "react";
import PFTopToolbar from "@/design-system/crud/PFTopToolbar";
import PFTable from "@/design-system/crud/PFTable";
import PFDrawerModal from "@/design-system/crud/PFDrawerModal";
import PFConfirmDialog from "@/design-system/crud/PFConfirmDialog";
import { useBrand } from "@/hooks/useBrand";
import { brandColumns, brandFields } from "../design-system/features/brands/brands.config";
import { Box, Typography } from "@mui/material";
import type { Brand } from "@/types/brandTypes";
import { useNotification } from "@/context/NotificationContext";

export default function BrandsPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // 🔗 conecta o ID selecionado ao hook para buscar detalhes
    const {
        list: { data, total, isLoading, page, setPage, take, setTake, setSearch, refetch, error: listError },
        detail,
        create,
        update,
        remove,
    } = useBrand(selectedId);

    const selectedBrand: Brand | null = (detail.data as Brand | undefined) ?? null;

    const { addNotification } = useNotification();

    // ─────────────────────────────────────────────────────────────
    // Handlers de abertura/fechamento
    // ─────────────────────────────────────────────────────────────
    const handleOpenCreate = () => {
        setDrawerMode("create");
        setSelectedId(null);
        setDrawerOpen(true);
    };

    const handleOpenView = (row: Brand) => {
        setDrawerMode("view");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };

    const handleOpenEdit = (row: Brand) => {
        setDrawerMode("edit");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setSelectedId(null);
    };

    const handleAskDelete = (row: Brand) => {
        setSelectedId(row.id);
        setConfirmOpen(true);
    };

    // ─────────────────────────────────────────────────────────────
    // Handlers de mutações (com notifications)
    // ─────────────────────────────────────────────────────────────
    const handleCreate = async (values: Partial<Brand>) => {
        try {
            const res = await create(values); // ApiResponse<Brand>
            addNotification(res?.message || "Registro criado com sucesso.", "success");
            handleCloseDrawer();
        } catch (e) {
            console.error(e);
            addNotification("Erro ao criar registro. Tente novamente.", "error");
        }
    };

    const handleUpdate = async (id: number, values: Partial<Brand>) => {
        try {
            const res = await update({ id, data: values }); // ApiResponse<Brand>
            addNotification(res?.message || "Registro atualizado com sucesso.", "success");
            handleCloseDrawer();
        } catch (e) {
            console.error(e);
            addNotification("Erro ao atualizar registro. Tente novamente.", "error");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedId) return;
        try {
            const res = await remove(selectedId); // ApiResponse<null>
            addNotification(res?.message || "Registro excluído com sucesso.", "success");
        } catch (e) {
            console.error(e);
            addNotification("Erro ao excluir registro. Tente novamente.", "error");
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleSubmit = async (values: Partial<Brand>) => {
        if (drawerMode === "create") return handleCreate(values);
        if (drawerMode === "edit" && selectedId) return handleUpdate(selectedId, values);
    };

    // ─────────────────────────────────────────────────────────────
    // Feedbacks de erro de listagem/detalhe (fetch)
    // ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (listError) {
            addNotification("Erro ao carregar a lista de marcas.", "error");
        }
    }, [listError, addNotification]);

    useEffect(() => {
        if (detail.error) {
            addNotification("Erro ao carregar detalhes da marca.", "error");
        }
    }, [detail.error, addNotification]);

    return (
        <Box>
            {/* Toolbar */}
            <PFTopToolbar
                title="Marcas"
                onSearch={(val) => setSearch(val)}
                onRefresh={() => refetch()}
                onAdd={handleOpenCreate}
            />

            {/* Tabela */}
            <PFTable<Brand>
                columns={brandColumns}
                rows={data}
                loading={isLoading}
                total={total}
                page={page}
                pageSize={take}
                onPageChange={setPage}
                onPageSizeChange={setTake}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleAskDelete}
            />

            {/* Drawer Modal */}
            <PFDrawerModal<Brand>
                open={drawerOpen}
                mode={drawerMode}
                title={
                    drawerMode === "create"
                        ? "Nova Marca"
                        : drawerMode === "edit"
                            ? "Editar Marca"
                            : "Detalhes da Marca"
                }
                data={selectedBrand}
                fields={brandFields}
                onClose={handleCloseDrawer}
                onSubmit={handleSubmit}
                renderView={(brand) => (
                    <Box>
                        <Typography variant="body2"><b>ID:</b> {brand.id}</Typography>
                        <Typography variant="body2"><b>Nome:</b> {brand.name}</Typography>
                        <Typography variant="body2"><b>Ativo:</b> {brand.isActive ? "Sim" : "Não"}</Typography>
                    </Box>
                )}
            />

            {/* Confirm Dialog */}
            <PFConfirmDialog
                open={confirmOpen}
                title="Excluir Marca"
                description="Tem certeza que deseja excluir esta marca?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </Box>
    );
}
