import { useState, useEffect } from "react";
import PFTopToolbar from "@/design-system/crud/PFTopToolbar";
import PFTable from "@/design-system/crud/PFTable";
import PFDrawerModal from "@/design-system/crud/PFDrawerModal";
import PFConfirmDialog from "@/design-system/crud/PFConfirmDialog";
import { useBrand } from "@/hooks/useBrand";
import { brandColumns, brandFields } from "../design-system/features/brands/brands.config";
import { Box, Typography, Chip, Divider } from "@mui/material";
import type { Brand } from "@/types/brandTypes";
import { useNotification } from "@/context/NotificationContext";

export default function BrandsPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const {
        list: { data, total, isLoading, isFetching, page, setPage, size, setSize, setSearch, refetch, error: listError },
        detail,
        create,
        update,
        remove,
        creating,
        updating,
        removing,
    } = useBrand(selectedId);

    const { addNotification } = useNotification();

    const selectedBrand: Brand | null =
        drawerMode === "create"
            ? null
            : (detail.isLoading || ((detail.data as Brand | undefined)?.id !== selectedId))
                ? null
                : ((detail.data as Brand | undefined) ?? null);

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
        setDrawerOpen(false);
    };

    const handleAskDelete = (row: Brand) => {
        setSelectedId(row.id);
        setConfirmOpen(true);
    };

    const handleCreate = async (values: Partial<Brand>) => {
        try {
            const res = await create(values);
            addNotification(res?.message || "Registro criado com sucesso.", "success");
            handleCloseDrawer();
        } catch (e) {
            console.error(e);
            addNotification("Erro ao criar registro. Tente novamente.", "error");
        }
    };

    const handleUpdate = async (id: number, values: Partial<Brand>) => {
        try {
            const res = await update({ id, data: values });
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
            const res = await remove(selectedId);
            addNotification(res?.message || "Registro excluído com sucesso.", "success");
            setSelectedId(null); // 👈 limpa o id depois do sucesso
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

    useEffect(() => {
        if (listError) addNotification("Erro ao carregar a lista de marcas.", "error");
    }, [listError, addNotification]);

    useEffect(() => {
        if (selectedId && detail.error) {
            addNotification("Erro ao carregar detalhes da marca.", "error");
        }
    }, [selectedId, detail.error, addNotification]);

    return (
        <Box>
            <PFTopToolbar
                title="Marcas"
                onSearch={(val) => setSearch(val)}
                onRefresh={() => refetch()}
                onAdd={handleOpenCreate}
            />

            <PFTable<Brand>
                columns={brandColumns}
                rows={data}
                loading={isLoading || isFetching} // 👈 cobre inicial + paginação/pesquisa
                total={total}
                page={page}
                pageSize={size}
                onPageChange={setPage}
                onPageSizeChange={setSize}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleAskDelete}
            />

            <PFDrawerModal<Brand>
                key={`${drawerMode}-${selectedId ?? "new"}`}
                open={drawerOpen}
                mode={drawerMode}
                title={drawerMode === "create" ? "Nova Marca" : drawerMode === "edit" ? "Editar Marca" : "Detalhes da Marca"}
                data={selectedBrand}
                fields={brandFields}
                onClose={handleCloseDrawer}
                onSubmit={handleSubmit}
                creating={creating}
                updating={updating}
                renderView={(brand) => (
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                {brand.name}
                            </Typography>
                            <Chip
                                size="small"
                                label={brand.isActive ? "Ativa" : "Inativa"}
                                color={brand.isActive ? "success" : "default"}
                                variant={brand.isActive ? "filled" : "outlined"}
                            />
                        </Box>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 1.25 }}>
                            <Typography color="text.secondary">ID</Typography>
                            <Typography>{brand.id}</Typography>

                            <Typography color="text.secondary">Nome</Typography>
                            <Typography>{brand.name}</Typography>

                            <Typography color="text.secondary">Status</Typography>
                            <Typography>{brand.isActive ? "Sim" : "Não"}</Typography>
                        </Box>
                    </Box>
                )}
                ModalPropsOverride={{
                    onExited: () => setSelectedId(null),
                }}
            />


            <PFConfirmDialog
                open={confirmOpen}
                title="Excluir Marca"
                description="Tem certeza que deseja excluir esta marca?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={removing} // 👈 agora usa estado do hook
            />
        </Box>
    );
}
