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
} from "@mui/material";
import { X, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import type { Brand, CreateBrandPayload, UpdateBrandPayload } from "./brandTypes";
import { useCreateBrand, useUpdateBrand } from "./useBrand";
import { useNotification } from "@/context/NotificationContext";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/apiResponse";

// ==========================
// 🔹 Tipagens e Props
// ==========================
type DrawerMode = "create" | "edit" | "view";

interface BrandDrawerProps {
    open: boolean;
    mode: DrawerMode;
    brand?: Brand | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (brand: Brand) => void;
    onCreated: (brand: Brand) => void;
    onUpdated: (brand: Brand) => void;
    onCreateNew: () => void;
}

// ==========================
// 🔹 Componente principal
// ==========================
export default function BrandDrawer({
    open,
    mode,
    brand,
    onClose,
    onEdit,
    onDelete,
    onCreated,
    onUpdated,
    onCreateNew
}: BrandDrawerProps) {
    // ==========================
    // 🔹 Formulário (React Hook Form)
    // ==========================
    const methods = useForm<{ name: string; isActive: boolean }>({
        defaultValues: { name: "", isActive: true },
    });
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { addNotification } = useNotification();

    // ==========================
    // 🔹 Estados derivados
    // ==========================
    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isView = mode === "view";

    // ==========================
    // 🔹 Hooks de mutação
    // ==========================
    const { mutateAsync: createBrand, isPending: creating } = useCreateBrand();
    const { mutateAsync: updateBrand, isPending: updating } = useUpdateBrand();

    // ==========================
    // 🔹 Efeitos
    // ==========================

    // foca no input sempre que abre em modo create/edit
    useEffect(() => {
        if ((isCreate || isEdit) && open) {
            inputRef.current?.focus();
        }
    }, [isCreate, isEdit, open]);

    // Resetar form sempre que abrir ou trocar modo
    useEffect(() => {
        if (!open) {
            methods.reset({ name: "" });
            return;
        }

        if ((isEdit || isView) && brand) {
            methods.reset({ name: brand.name });
        } else {
            methods.reset({ name: "" });
        }
    }, [open, isCreate, isEdit, isView, brand, methods]);

    // ==========================
    // 🔹 Submissão do formulário
    // ==========================
    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            if (isCreate) {
                const res = await createBrand(values as CreateBrandPayload);
                if (res?.data) onCreated(res.data);
            } else if (isEdit && brand) {
                const res = await updateBrand({
                    id: brand.id,
                    data: values as UpdateBrandPayload,
                });
                if (res?.data) onUpdated(res.data);
            }
        } catch (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr.response?.data?.message ?? "Erro ao salvar marca.";
            addNotification(message, "error");
        }
    });

    // ==========================
    // 🔹 Render
    // ==========================
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 480, md: 520 },
                    maxWidth: "100vw",
                    p: { xs: 2, sm: 3 },
                },
            }}
        >
            {/* ========================== */}
            {/* 🔹 Header */}
            {/* ========================== */}
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
                        ? "Adicionar marca"
                        : isEdit
                            ? "Editar marca"
                            : brand?.name || "Marca"}
                </Typography>

                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* ========================== */}
            {/* 🔹 Conteúdo principal */}
            {/* ========================== */}
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
                {isView && brand && (
                    <Box>
                        {/* Ações do modo view */}
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
                                onClick={() => onDelete(brand)}
                            >
                                Remover
                            </Button>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {/* Detalhes da marca */}
                        <Stack spacing={1}>
                            <Row label="Nome" value={brand.name} />
                            <Row label="Ativo" value={brand.isActive ? "Sim" : "Não"} />
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        {/* Botão para adicionar nova marca */}
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                methods.reset({ name: "", isActive: true });
                                onCreateNew(); // 🔹 dispara o callback do pai
                            }}
                        >
                            Adicionar nova marca
                        </Button>
                    </Box>
                )}

                {/* ========================== */}
                {/* 🔸 MODO CREATE / EDIT */}
                {/* ========================== */}
                {(isCreate || isEdit) && (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                {/* Campo: Nome da marca */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Nome da marca
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        inputRef={inputRef}
                                        size="small"
                                        {...methods.register("name", { required: true })}
                                        placeholder="Ex: Ray-Ban"
                                    />
                                </Box>

                                {/* Botão de ação */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={creating || updating}
                                    startIcon={
                                        creating || updating ? (
                                            <CircularProgress size={18} />
                                        ) : undefined
                                    }
                                >
                                    {isCreate
                                        ? creating
                                            ? "Criando..."
                                            : "Criar"
                                        : updating
                                            ? "Salvando..."
                                            : "Salvar"}
                                </Button>
                            </Stack>
                        </form>
                    </FormProvider>
                )}
            </Box>
        </Drawer>
    );
}

// ==========================
// 🔹 Subcomponente auxiliar
// ==========================
function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (!value && value !== 0) return null;

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
                {label}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {value}
            </Typography>
        </Box>
    );
}
