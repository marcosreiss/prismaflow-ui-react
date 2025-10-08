import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    TextField,
    Stack,
    CircularProgress,
    Autocomplete,
} from "@mui/material";
import { X } from "lucide-react";
import { Controller, FormProvider } from "react-hook-form";
import { useEffect } from "react";

import { ProductCategoryLabels } from "../types/productTypes";
import { useProductDrawerController } from "../hooks/useProductDrawerController";
import ProductCreateBrandModal from "./ProductCreateBrandModal";

import type { Product } from "../types/productTypes";
import type { Brand } from "@/modules/brands/types/brandTypes";
import CurrencyInput from "@/components/imask/CurrencyInput";
import PercentInput from "@/components/imask/PercentInput";

// ==============================
// 🔹 Tipagens
// ==============================
interface ProductDrawerProps {
    open: boolean;
    mode: ProductDrawerMode;
    product?: Product | null;
    onClose: () => void;
    onCreated: (product: Product) => void;
    onUpdated: (product: Product) => void;
}

type ProductDrawerMode = "create" | "edit" | "view";

// ==============================
// 🔹 Componente principal
// ==============================
export default function ProductDrawer({
    open,
    mode,
    product,
    onClose,
    onCreated,
    onUpdated,
}: ProductDrawerProps) {
    // Controller
    const controller = useProductDrawerController({
        mode,
        product,
        onCreated,
        onUpdated,
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

                {/* Conteúdo */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: "auto",
                        maxHeight: "calc(100vh - 120px)",
                        pb: 3,
                    }}
                >
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {/* ======================== */}
                                {/* 🔸 Identificação */}
                                {/* ======================== */}
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
                                                    disabled={isView}
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
                                                    disabled={isView}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>

                                <Divider />

                                {/* ======================== */}
                                {/* 🔸 Preço e Cálculo */}
                                {/* ======================== */}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                        Preço e Cálculo
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Controller
                                            name="costPrice"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CurrencyInput
                                                    {...field}
                                                    label="Preço de custo"
                                                    fullWidth
                                                    size="small"
                                                    disabled={isView}
                                                />
                                            )}
                                        />

                                        <Controller
                                            name="markup"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <PercentInput
                                                    {...field}
                                                    label="Markup"
                                                    fullWidth
                                                    size="small"
                                                    disabled={isView}
                                                />
                                            )}
                                        />

                                        <Controller
                                            name="salePrice"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CurrencyInput
                                                    {...field}
                                                    label="Preço de venda"
                                                    fullWidth
                                                    size="small"
                                                    disabled={isView}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>

                                <Divider />

                                {/* ======================== */}
                                {/* 🔸 Estoque */}
                                {/* ======================== */}
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
                                                    {...field}
                                                    type="number"
                                                    label="Quantidade em estoque"
                                                    fullWidth
                                                    size="small"
                                                    disabled={isView}
                                                />
                                            )}
                                        />

                                        <Controller
                                            name="minimumStock"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    label="Estoque mínimo"
                                                    fullWidth
                                                    size="small"
                                                    disabled={isView}
                                                />
                                            )}
                                        />
                                    </Stack>
                                </Box>

                                <Divider />

                                {/* ======================== */}
                                {/* 🔸 Categoria e Marca */}
                                {/* ======================== */}
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
                                                    disabled={isView}
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
                                            disabled={isView}
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
                                            disabled={isView}
                                        >
                                            + Nova marca
                                        </Button>
                                    </Stack>
                                </Box>

                                {/* ======================== */}
                                {/* 🔸 Ações */}
                                {/* ======================== */}
                                {(isCreate || isEdit) && (
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
                                )}
                            </Stack>
                        </form>
                    </FormProvider>
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
