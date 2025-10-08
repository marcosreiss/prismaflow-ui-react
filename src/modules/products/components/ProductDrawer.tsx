import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    TextField,
    CircularProgress,
    Stack,
    Autocomplete,
} from "@mui/material";
import { X, Pencil, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, FormProvider } from "react-hook-form";

import { useProductDrawerController } from "../hooks/useProductDrawerController";
import ProductView from "./ProductView";
import ProductCreateBrandModal from "./ProductCreateBrandModal";
import { ProductCategoryLabels } from "../types/productTypes";

import type { Product } from "../types/productTypes";
import type { Brand } from "@/modules/brands/types/brandTypes";
import CurrencyInput from "@/components/imask/CurrencyInput";
import PercentInput from "@/components/imask/PercentInput";

// ==============================
// 🔹 Tipagens
// ==============================
interface ProductDrawerProps {
    open: boolean;
    mode: "create" | "edit" | "view";
    product?: Product | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (product: Product) => void;
    onCreated: (product: Product) => void;
    onUpdated: (product: Product) => void;
    onCreateNew: () => void;
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function ProductDrawer({
    open,
    mode,
    product,
    onClose,
    onEdit,
    onDelete,
    onCreated,
    onUpdated,
    onCreateNew,
}: ProductDrawerProps) {
    // Controller
    const controller = useProductDrawerController({
        mode,
        product,
        onCreated,
        onUpdated,
        onEdit,
        onDelete,
        onCreateNew,
    });

    const {
        methods,
        handleSubmit,
        creating,
        updating,
        selectedBrand,
        openCreateBrandModal,
        brandOptions,
        handleBrandChange,
        handleOpenCreateBrandModal,
        handleCloseCreateBrandModal,
        handleBrandCreated,
    } = controller;

    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isView = mode === "view";

    // Foco no primeiro input ao abrir em modo create/edit
    useEffect(() => {
        if (open && (isCreate || isEdit)) {
            const firstInput = document.querySelector<HTMLInputElement>("input[name='name']");
            firstInput?.focus();
        }
    }, [open, isCreate, isEdit]);

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                PaperProps={{
                    sx: {
                        width: { xs: "100%", sm: 520 },
                        maxWidth: "100vw",
                        p: { xs: 2, sm: 3 },
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        {isCreate
                            ? "Adicionar produto"
                            : isEdit
                                ? "Editar produto"
                                : product?.name || "Produto"}
                    </Typography>

                    <IconButton onClick={onClose}>
                        <X size={20} />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Conteúdo principal */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 120px)",
                        pb: 3,
                    }}
                >
                    {/* ========================== */}
                    {/* 🔸 MODO VIEW */}
                    {/* ========================== */}
                    {isView && product && (
                        <Box>
                            {/* Ações */}
                            <Stack direction="row" spacing={1} mb={2}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Pencil size={14} />}
                                    onClick={onEdit}
                                >
                                    Editar
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    startIcon={<Trash2 size={14} />}
                                    onClick={() => onDelete(product)}
                                >
                                    Remover
                                </Button>
                            </Stack>

                            <Divider sx={{ mb: 2 }} />

                            {/* Dados do produto */}
                            <ProductView product={product} />

                            <Divider sx={{ my: 3 }} />

                            {/* Botão de adicionar novo produto */}
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={onCreateNew}
                            >
                                Adicionar novo produto
                            </Button>
                        </Box>
                    )}

                    {/* ========================== */}
                    {/* 🔸 MODO CREATE / EDIT */}
                    {/* ========================== */}
                    {(isCreate || isEdit) && (
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    {/* Identificação */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                            Identificação
                                        </Typography>

                                        <Stack spacing={2}>
                                            <Controller
                                                name="name"
                                                control={methods.control}
                                                rules={{ required: "Informe o nome do produto" }}
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Nome"
                                                        fullWidth
                                                        size="small"
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="description"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Descrição"
                                                        fullWidth
                                                        size="small"
                                                        multiline
                                                        minRows={2}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Preço e Cálculo */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                            Preço e Cálculo
                                        </Typography>

                                        <Stack spacing={2}>
                                            <Controller
                                                name="costPrice"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <CurrencyInput {...field} label="Preço de custo" fullWidth size="small" />
                                                )}
                                            />

                                            <Controller
                                                name="markupPercent"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <PercentInput {...field} label="Acréscimo (%)" fullWidth size="small" />
                                                )}
                                            />

                                            <Controller
                                                name="salePrice"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <CurrencyInput {...field} label="Preço de venda" fullWidth size="small" />
                                                )}
                                            />
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Estoque */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                            Estoque
                                        </Typography>

                                        <Stack direction="row" spacing={2}>
                                            <Controller
                                                name="stockQuantity"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <TextField
                                                        label="Quantidade em estoque"
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        value={typeof field.value === "number" ? field.value : 0}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                                                        }
                                                        inputProps={{ min: 0 }}
                                                    />
                                                )}
                                            />

                                            <Controller
                                                name="minimumStock"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <TextField
                                                        label="Estoque mínimo"
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        value={typeof field.value === "number" ? field.value : 0}
                                                        onChange={(e) =>
                                                            field.onChange(e.target.value === "" ? 0 : Number(e.target.value))
                                                        }
                                                        inputProps={{ min: 0 }}
                                                    />
                                                )}
                                            />
                                        </Stack>
                                    </Box>

                                    <Divider />

                                    {/* Categoria e Marca */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                            Categoria e Marca
                                        </Typography>

                                        <Stack spacing={2}>
                                            <Controller
                                                name="category"
                                                control={methods.control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        select
                                                        label="Categoria"
                                                        fullWidth
                                                        size="small"
                                                        SelectProps={{ native: true }}
                                                    >
                                                        {Object.entries(ProductCategoryLabels).map(([key, label]) => (
                                                            <option key={key} value={key}>
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />

                                            <Autocomplete
                                                size="small"
                                                options={brandOptions}
                                                getOptionLabel={(option: Brand) => option.name}
                                                value={selectedBrand}
                                                onChange={(_, newValue) => handleBrandChange(newValue)}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Marca" fullWidth size="small" />
                                                )}
                                                noOptionsText={
                                                    <Button
                                                        variant="text"
                                                        color="primary"
                                                        onClick={handleOpenCreateBrandModal}
                                                    >
                                                        Criar nova marca
                                                    </Button>
                                                }
                                            />

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={handleOpenCreateBrandModal}
                                            >
                                                + Nova marca
                                            </Button>
                                        </Stack>
                                    </Box>

                                    {/* Ações */}
                                    <Box pt={2}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            startIcon={
                                                creating || updating ? <CircularProgress size={18} /> : undefined
                                            }
                                            disabled={creating || updating}
                                        >
                                            {isCreate
                                                ? creating
                                                    ? "Criando..."
                                                    : "Criar produto"
                                                : updating
                                                    ? "Salvando..."
                                                    : "Salvar alterações"}
                                        </Button>
                                    </Box>
                                </Stack>
                            </form>
                        </FormProvider>
                    )}
                </Box>
            </Drawer>

            {/* Modal de criação de marca */}
            <ProductCreateBrandModal
                open={openCreateBrandModal}
                onClose={handleCloseCreateBrandModal}
                onCreated={handleBrandCreated}
            />
        </>
    );
}
