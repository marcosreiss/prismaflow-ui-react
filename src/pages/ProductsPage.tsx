import { useState, useEffect } from "react";
import PFTopToolbar from "@/design-system/crud/PFTopToolbar";
import PFTable from "@/design-system/crud/PFTable";
import PFDrawerModal from "@/design-system/crud/PFDrawerModal";
import PFConfirmDialog from "@/design-system/crud/PFConfirmDialog";
import { useProduct } from "@/hooks/useProduct";
import { useBrand } from "@/hooks/useBrand";
import {
    Box,
    Typography,
    Chip,
    Divider,
    Paper,
    Autocomplete,
    TextField,
} from "@mui/material";
import type { Product } from "@/types/productTypes";
import type { Brand } from "@/types/brandTypes";
import { useNotification } from "@/context/NotificationContext";
import { productColumns, productFields } from "@/design-system/features/product/product.config";

export default function ProductsPage() {
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
    } = useProduct(selectedId);

    const { addNotification } = useNotification();

    // Para autocomplete de marcas
    const {
        list: { data: brandOptions = [] },
    } = useBrand();

    const selectedProduct: Product | null =
        drawerMode === "create"
            ? null
            : detail.isLoading || (detail.data as Product | undefined)?.id !== selectedId
                ? null
                : (detail.data as Product | undefined) ?? null;

    const handleOpenCreate = () => {
        setDrawerMode("create");
        setSelectedId(null);
        setDrawerOpen(true);
    };
    const handleOpenView = (row: Product) => {
        setDrawerMode("view");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };
    const handleOpenEdit = (row: Product) => {
        setDrawerMode("edit");
        setSelectedId(row.id);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const handleAskDelete = (row: Product) => {
        setSelectedId(row.id);
        setConfirmOpen(true);
    };

    const handleCreate = async (values: Partial<Product>) => {
        try {
            const res = await create(values);
            addNotification(res?.message || "Produto criado com sucesso.", "success");
            handleCloseDrawer();
        } catch (e) {
            console.error(e);
            addNotification("Erro ao criar produto. Tente novamente.", "error");
        }
    };

    const handleUpdate = async (id: number, values: Partial<Product>) => {
        try {
            const res = await update({ id, data: values });
            addNotification(res?.message || "Produto atualizado com sucesso.", "success");
            handleCloseDrawer();
        } catch (e) {
            console.error(e);
            addNotification("Erro ao atualizar produto. Tente novamente.", "error");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedId) return;
        try {
            const res = await remove(selectedId);
            addNotification(res?.message || "Produto excluído com sucesso.", "success");
            setSelectedId(null);
        } catch (e) {
            console.error(e);
            addNotification("Erro ao excluir produto. Tente novamente.", "error");
        } finally {
            setConfirmOpen(false);
        }
    };

    const handleSubmit = async (values: Partial<Product>) => {
        if (drawerMode === "create") return handleCreate(values);
        if (drawerMode === "edit" && selectedId) return handleUpdate(selectedId, values);
    };

    useEffect(() => {
        if (listError) addNotification("Erro ao carregar a lista de produtos.", "error");
    }, [listError, addNotification]);

    useEffect(() => {
        if (selectedId && detail.error) {
            addNotification("Erro ao carregar detalhes do produto.", "error");
        }
    }, [selectedId, detail.error, addNotification]);

    return (
        <Paper
            sx={{
                borderRadius: 2,
                borderColor: "grey.200",
                backgroundColor: "background.paper",
                p: 3,
            }}
        >
            <PFTopToolbar
                title="Produtos"
                addLabel="Adicionar novo produto"
                onSearch={(val) => setSearch(val)}
                onRefresh={() => refetch()}
                onAdd={handleOpenCreate}
            />

            <PFTable<Product>
                columns={productColumns}
                rows={data}
                loading={isLoading || isFetching}
                total={total}
                page={page}
                pageSize={size}
                onPageChange={setPage}
                onPageSizeChange={setSize}
                onView={handleOpenView}
                onEdit={handleOpenEdit}
                onDelete={handleAskDelete}
            />

            <PFDrawerModal<Product>
                key={`${drawerMode}-${selectedId ?? "new"}`}
                open={drawerOpen}
                mode={drawerMode}
                title={
                    drawerMode === "create"
                        ? "Novo Produto"
                        : drawerMode === "edit"
                            ? "Editar Produto"
                            : "Detalhes do Produto"
                }
                data={selectedProduct}
                fields={productFields.map((field) =>
                    field.name === "brand"
                        ? {
                            ...field,
                            component: ({ value, onChange }) => (
                                <Autocomplete
                                    size="small"
                                    options={brandOptions}
                                    getOptionLabel={(option: Brand) => option.name}
                                    value={
                                        brandOptions.find((b) => b.id === (value as Brand | null)?.id) ||
                                        null
                                    }
                                    onChange={(_, newValue) => {
                                        onChange(newValue ? { id: newValue.id } : null);
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Marca" fullWidth />
                                    )}
                                />
                            ),
                        }
                        : field
                )}
                onClose={handleCloseDrawer}
                onSubmit={handleSubmit}
                creating={creating}
                updating={updating}
                renderView={(product) => (
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <Typography variant="h6">{product.name}</Typography>
                            <Chip
                                size="small"
                                label={product.isActive ? "Ativo" : "Inativo"}
                                color={product.isActive ? "success" : "default"}
                                variant={product.isActive ? "filled" : "outlined"}
                            />
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "140px 1fr",
                                rowGap: 1.5,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                ID
                            </Typography>
                            <Typography variant="body1">{product.id}</Typography>

                            <Typography variant="body2" color="text.secondary">
                                Nome
                            </Typography>
                            <Typography variant="body1">{product.name}</Typography>

                            <Typography variant="body2" color="text.secondary">
                                Categoria
                            </Typography>
                            <Typography variant="body1">{product.category}</Typography>

                            <Typography variant="body2" color="text.secondary">
                                Marca
                            </Typography>
                            <Typography variant="body1">{product.brand?.name ?? "-"}</Typography>

                            <Typography variant="body2" color="text.secondary">
                                Preço Venda
                            </Typography>
                            <Typography variant="body1">{product.salePrice}</Typography>

                            <Typography variant="body2" color="text.secondary">
                                Estoque
                            </Typography>
                            <Typography variant="body1">{product.stockQuantity}</Typography>
                        </Box>
                    </Box>
                )}
                ModalPropsOverride={{
                    onExited: () => setSelectedId(null),
                }}
            />

            <PFConfirmDialog
                open={confirmOpen}
                title="Excluir Produto"
                description="Tem certeza que deseja excluir este produto?"
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                loading={removing}
            />
        </Paper>
    );
}
