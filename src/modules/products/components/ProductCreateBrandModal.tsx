import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import type { Brand, CreateBrandPayload } from "@/modules/brands/types/brandTypes";
import { useCreateBrand } from "@/modules/brands/hooks/useBrand";
import { useNotification } from "@/context/NotificationContext";

// ==============================
// 🔹 Tipagens
// ==============================
interface ProductCreateBrandModalProps {
    open: boolean;
    onClose: () => void;
    onCreated: (brand: Brand) => void;
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function ProductCreateBrandModal({
    open,
    onClose,
    onCreated,
}: ProductCreateBrandModalProps) {
    const { register, handleSubmit, reset, formState } = useForm<CreateBrandPayload>({
        defaultValues: { name: "", isActive: true },
    });

    const { addNotification } = useNotification();
    const { mutateAsync: createBrand, isPending } = useCreateBrand();

    // Resetar form ao abrir/fechar
    useEffect(() => {
        if (!open) reset({ name: "", isActive: true });
    }, [open, reset]);

    // ==============================
    // 🔹 Submissão
    // ==============================
    const onSubmit = handleSubmit(async (values) => {
        try {
            const res = await createBrand(values);
            if (res?.data) {
                addNotification("Marca criada com sucesso!", "success");
                onCreated(res.data);
                onClose();
            }
        } catch (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr.response?.data?.message ?? "Erro ao criar marca.";
            addNotification(message, "error");
        }
    });

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{ sx: { borderRadius: 3, p: 1.5 } }}
        >
            {/* Header */}
            <DialogTitle fontWeight="bold">Nova marca</DialogTitle>

            {/* Conteúdo */}
            <DialogContent>
                <form id="create-brand-form" onSubmit={onSubmit}>
                    <Stack spacing={2} mt={1.5}>
                        <TextField
                            label="Nome da marca"
                            fullWidth
                            size="small"
                            {...register("name", { required: "Informe o nome da marca" })}
                            error={!!formState.errors.name}
                            helperText={formState.errors.name?.message}
                            autoFocus
                        />
                    </Stack>
                </form>
            </DialogContent>

            {/* Ações */}
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={isPending}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    form="create-brand-form"
                    variant="contained"
                    disabled={isPending}
                    startIcon={isPending ? <CircularProgress size={18} /> : undefined}
                >
                    {isPending ? "Salvando..." : "Salvar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
