import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    CircularProgress,
    Skeleton,
    Paper,
} from "@mui/material";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import {
    type FieldValues,
    type FieldPath,
    type ControllerRenderProps,
    useForm,
    type DefaultValues,
    FormProvider,
    Controller,
} from "react-hook-form";
import { useEffect, useState } from "react";

type DrawerMode = "create" | "edit" | "view";

export type FieldDef<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
    component: (controlProps: ControllerRenderProps<T, FieldPath<T>>) => ReactNode;
};

type PFDrawerModalProps<T extends FieldValues> = {
    open: boolean;
    mode: DrawerMode;
    title: string;
    data?: T | null;
    fields?: FieldDef<T>[];
    onClose: () => void;
    onSubmit?: (values: Partial<T>) => Promise<void> | void;
    renderView?: (data: T) => ReactNode; // 👉 Página define como renderizar detalhes
};

export default function PFDrawerModal<T extends FieldValues>({
    open,
    mode,
    title,
    data,
    fields = [],
    onClose,
    onSubmit,
    renderView,
}: PFDrawerModalProps<T>) {
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isCreate = mode === "create";

    const methods = useForm<T>({
        defaultValues: (data ?? {}) as DefaultValues<T>,
    });

    const [saving, setSaving] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        if (isView || isEdit) {
            if (!data) {
                setDetailLoading(true);
                methods.reset({} as DefaultValues<T>); // limpa até vir os novos dados
            } else {
                setDetailLoading(false);
                methods.reset(data as DefaultValues<T>);
            }
        } else if (isCreate) {
            setDetailLoading(false);
            methods.reset({} as DefaultValues<T>);
        }
    }, [open, isView, isEdit, isCreate, data, methods]);


    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            setSaving(true);
            await onSubmit?.(values);
            methods.reset({} as DefaultValues<T>);
            onClose(); // ✅ fecha após sucesso
        } catch (err) {
            console.error("Erro no submit:", err);
        } finally {
            setSaving(false);
        }
    });

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={() => {
                methods.reset({} as DefaultValues<T>);
                onClose();
            }}
            ModalProps={{ keepMounted: true }}
            PaperProps={{ sx: { width: { xs: "100%", sm: 480, md: 560 }, p: 3 } }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Conteúdo */}
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                {detailLoading ? (
                    // Skeleton genérico
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Skeleton variant="text" width="50%" height={32} />
                        <Skeleton variant="rectangular" height={72} />
                        <Skeleton variant="rectangular" height={72} />
                    </Box>
                ) : isView && data && renderView ? (
                    // 👉 View genérica controlada pela página
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }} elevation={0}>
                        {renderView(data)}
                    </Paper>
                ) : (
                    // Formulário create/edit
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {fields.map((field) => (
                                    <Controller
                                        key={field.name}
                                        name={field.name}
                                        control={methods.control}
                                        render={({ field: controlProps }) => (
                                            <Box>
                                                <Typography variant="body2" fontWeight={500} mb={0.5}>
                                                    {field.label}
                                                </Typography>
                                                {field.component(controlProps)}
                                            </Box>
                                        )}
                                    />
                                ))}
                            </Box>

                            {/* Footer */}
                            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                                {(isCreate || isEdit) && (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving}
                                        startIcon={saving ? <CircularProgress size={18} /> : undefined}
                                    >
                                        {saving ? (isCreate ? "Criando..." : "Salvando...") : isCreate ? "Criar" : "Salvar"}
                                    </Button>
                                )}
                            </Box>
                        </form>
                    </FormProvider>
                )}
            </Box>
        </Drawer>
    );
}
