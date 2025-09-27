import { useState } from "react";
import PFTopToolbar from "@/design-system/crud/PFTopToolbar";
import PFTable from "@/design-system/crud/PFTable";
import PFDrawerModal from "@/design-system/crud/PFDrawerModal";
import PFConfirmDialog from "@/design-system/crud/PFConfirmDialog";
import { useBrand } from "@/hooks/useBrand";
import { brandColumns, brandFields } from "../design-system/features/brands/brands.config";
import { Box, Typography } from "@mui/material";
import type { Brand } from "@/types/brandTypes";

export default function BrandsPage() {
    const {
        list: { data, total, isLoading, page, setPage, take, setSearch, refetch },
        detail,
        create,
        update,
        remove,
    } = useBrand();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerMode, setDrawerMode] = useState<"create" | "edit" | "view">("view");
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const selectedBrand: Brand | null = detail.data ?? null;

    return (
        <Box>
            {/* Toolbar */}
            <PFTopToolbar
                title="Marcas"
                onSearch={(val) => setSearch(val)}
                onRefresh={() => refetch()}
                onAdd={() => {
                    setDrawerMode("create");
                    setDrawerOpen(true);
                    setSelectedId(null);
                }}
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
                onPageSizeChange={() => { }}
                onView={(row) => {
                    setDrawerMode("view");
                    setSelectedId(row.id);
                    setDrawerOpen(true);
                }}
                onEdit={(row) => {
                    setDrawerMode("edit");
                    setSelectedId(row.id);
                    setDrawerOpen(true);
                }}
                onDelete={(row) => {
                    setSelectedId(row.id);
                    setConfirmOpen(true);
                }}
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
                onClose={() => setDrawerOpen(false)}
                onSubmit={async (values) => {
                    if (drawerMode === "create") {
                        await create(values);
                    } else if (drawerMode === "edit" && selectedId) {
                        await update({ id: selectedId, data: values });
                    }
                    setDrawerOpen(false);
                }}
                renderView={(brand) => (
                    <Box>
                        <Typography variant="body2">
                            <b>ID:</b> {brand.id}
                        </Typography>
                        <Typography variant="body2">
                            <b>Nome:</b> {brand.name}
                        </Typography>
                        <Typography variant="body2">
                            <b>Ativo:</b> {brand.isActive ? "Sim" : "Não"}
                        </Typography>
                    </Box>
                )}
            />

            {/* Confirm Dialog */}
            <PFConfirmDialog
                open={confirmOpen}
                title="Excluir Marca"
                description="Tem certeza que deseja excluir esta marca?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={async () => {
                    if (selectedId) await remove(selectedId);
                    setConfirmOpen(false);
                }}
            />
        </Box>
    );
}
