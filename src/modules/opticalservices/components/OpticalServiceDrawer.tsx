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
import { useNotification } from "@/context/NotificationContext";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/apiResponse";
import {
    useCreateOpticalService,
    useUpdateOpticalService,
} from "../hooks/useOpticalService";
import type {
    OpticalService,
    CreateOpticalServicePayload,
    UpdateOpticalServicePayload,
} from "../types/opticalServiceTypes";

// ==========================
// 🔹 Tipagens e Props
// ==========================
type DrawerMode = "create" | "edit" | "view";

interface OpticalServiceDrawerProps {
    open: boolean;
    mode: DrawerMode;
    service?: OpticalService | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (service: OpticalService) => void;
    onCreated: (service: OpticalService) => void;
    onUpdated: (service: OpticalService) => void;
    onCreateNew: () => void;
}

// ==========================
// 🔹 Componente principal
// ==========================
export default function OpticalServiceDrawer({
    open,
    mode,
    service,
    onClose,
    onEdit,
    onDelete,
    onCreated,
    onUpdated,
    onCreateNew,
}: OpticalServiceDrawerProps) {
    // ==========================
    // 🔹 Formulário (React Hook Form)
    // ==========================
    const methods = useForm<{
        name: string;
        description: string;
        price: number;
        isActive: boolean;
    }>({
        defaultValues: { name: "", description: "", price: 0, isActive: true },
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
    const { mutateAsync: createService, isPending: creating } =
        useCreateOpticalService();
    const { mutateAsync: updateService, isPending: updating } =
        useUpdateOpticalService();

    // ==========================
    // 🔹 Efeitos
    // ==========================
    useEffect(() => {
        if ((isCreate || isEdit) && open) {
            inputRef.current?.focus();
        }
    }, [isCreate, isEdit, open]);

    useEffect(() => {
        if (!open) {
            methods.reset({ name: "", description: "", price: 0, isActive: true });
            return;
        }

        if ((isEdit || isView) && service) {
            methods.reset({
                name: service.name,
                description: service.description,
                price: service.price,
                isActive: service.isActive,
            });
        } else {
            methods.reset({ name: "", description: "", price: 0, isActive: true });
        }
    }, [open, isCreate, isEdit, isView, service, methods]);

    // ==========================
    // 🔹 Submissão do formulário
    // ==========================
    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            if (isCreate) {
                const res = await createService(
                    values as CreateOpticalServicePayload
                );
                if (res?.data) onCreated(res.data);
            } else if (isEdit && service) {
                const res = await updateService({
                    id: service.id,
                    data: values as UpdateOpticalServicePayload,
                });
                if (res?.data) onUpdated(res.data);
            }
        } catch (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr.response?.data?.message ?? "Erro ao salvar serviço ótico.";
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
                    width: { xs: "100%", sm: 500, md: 520 },
                    maxWidth: "100vw",
                    p: { xs: 2, sm: 3 },
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
                        ? "Adicionar serviço ótico"
                        : isEdit
                            ? "Editar serviço ótico"
                            : service?.name || "Serviço ótico"}
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
                {isView && service && (
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
                                onClick={() => onDelete(service)}
                            >
                                Remover
                            </Button>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {/* Detalhes do serviço ótico */}
                        <Stack spacing={1}>
                            <Row label="Nome" value={service.name} />
                            <Row label="Descrição" value={service.description} />
                            <Row
                                label="Preço"
                                value={`R$ ${service.price.toFixed(2).replace(".", ",")}`}
                            />
                            <Row label="Ativo" value={service.isActive ? "Sim" : "Não"} />
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        {/* Botão para adicionar novo */}
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                methods.reset({
                                    name: "",
                                    description: "",
                                    price: 0,
                                    isActive: true,
                                });
                                onCreateNew();
                            }}
                        >
                            Adicionar novo serviço
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
                                {/* Nome */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Nome do serviço
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        inputRef={inputRef}
                                        size="small"
                                        {...methods.register("name", { required: true })}
                                        placeholder="Ex: Ajuste de Armação"
                                    />
                                </Box>

                                {/* Descrição */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Descrição
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={2}
                                        size="small"
                                        {...methods.register("description", { required: true })}
                                        placeholder="Descreva o serviço..."
                                    />
                                </Box>

                                {/* Preço */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Preço (R$)
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        inputProps={{ step: "0.01", min: "0" }}
                                        size="small"
                                        {...methods.register("price", {
                                            required: true,
                                            valueAsNumber: true,
                                        })}
                                        placeholder="0.00"
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
function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
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
