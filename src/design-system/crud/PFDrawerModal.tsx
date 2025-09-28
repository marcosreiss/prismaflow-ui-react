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
    renderView?: (data: T) => ReactNode;
    ModalPropsOverride?: {
        onExited?: () => void;
    };
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
    ModalPropsOverride,
}: PFDrawerModalProps<T>) {
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isCreate = mode === "create";

    const methods = useForm<T>({
        defaultValues: {} as DefaultValues<T>,
    });

    const [saving, setSaving] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    // ♻️ Ciclo de vida do modal
    useEffect(() => {
        if (!open) return;

        if (isCreate) {
            setDetailLoading(false);
            methods.reset({} as DefaultValues<T>);
            return;
        }

        if (!data) {
            setDetailLoading(true);
            methods.reset({} as DefaultValues<T>);
        } else {
            setDetailLoading(false);
            methods.reset(data as DefaultValues<T>);
        }
    }, [open, isCreate, isView, isEdit, data, methods]);

    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            setSaving(true);
            await onSubmit?.(values);
            if (isCreate) {
                methods.reset({} as DefaultValues<T>);
            }
            onClose();
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
            onClose={onClose}
            ModalProps={{
                keepMounted: true,
            }}
            SlideProps={{
                onExited: () => {
                    methods.reset({} as DefaultValues<T>);
                    ModalPropsOverride?.onExited?.();
                },
            }}
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
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Skeleton variant="text" width="50%" height={32} />
                        <Skeleton variant="rectangular" height={72} />
                        <Skeleton variant="rectangular" height={72} />
                    </Box>
                ) : isView && data && renderView ? (
                    <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }} elevation={0}>
                        {renderView(data)}
                    </Paper>
                ) : (
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
