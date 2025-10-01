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

type DrawerMode = "edit" | "view";

// Tipagem alinhada ao react-hook-form
export type FieldDef<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
    component: (props: ControllerRenderProps<T, FieldPath<T>>) => React.ReactNode;
};

type PaymentDrawerProps<T extends FieldValues> = {
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
    updating?: boolean;
};

export default function PaymentDrawer<T extends FieldValues>({
    open,
    mode,
    title,
    data,
    fields = [],
    onClose,
    onSubmit,
    renderView,
    ModalPropsOverride,
    updating,
}: PaymentDrawerProps<T>) {
    const isView = mode === "view";
    const isEdit = mode === "edit";

    const methods = useForm<T>({
        defaultValues: {} as DefaultValues<T>,
    });

    const [savingInternal, setSavingInternal] = useState(false);
    const saving = updating !== undefined ? updating : savingInternal;

    const showLoading = open && !data; // só carrega quando abre sem data

    // Resetar valores ao abrir/alterar dados
    useEffect(() => {
        if (!open) return;
        if (data) {
            methods.reset(data as DefaultValues<T>);
        } else {
            methods.reset({} as DefaultValues<T>);
        }
    }, [open, data, methods]);

    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            setSavingInternal(true);
            await onSubmit?.(values);
            onClose();
        } catch (err) {
            console.error("Erro no submit:", err);
        } finally {
            if (updating === undefined) {
                setSavingInternal(false);
            }
        }
    });

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            SlideProps={{
                onExited: () => {
                    methods.reset({} as DefaultValues<T>);
                    ModalPropsOverride?.onExited?.();
                },
            }}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 480, md: 560 },
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
                    {title}
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{
                        width: { xs: 40, sm: 36 },
                        height: { xs: 40, sm: 36 },
                    }}
                >
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Conteúdo */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: { xs: "calc(100vh - 120px)", sm: "none" },
                    pb: { xs: 6, sm: 3 },
                }}
            >
                {showLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Skeleton variant="text" width="50%" height={32} />
                        <Skeleton variant="rectangular" height={72} />
                        <Skeleton variant="rectangular" height={72} />
                    </Box>
                ) : isView && data && renderView ? (
                    <Paper
                        sx={{ p: 2, borderRadius: 2, bgcolor: "grey.50" }}
                        elevation={0}
                    >
                        {renderView(data)}
                    </Paper>
                ) : (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {fields.map((field) => (
                                    <Controller
                                        key={String(field.name)}
                                        name={field.name}
                                        control={methods.control}
                                        render={({ field: controlProps }) => (
                                            <Box>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={500}
                                                    mb={0.5}
                                                >
                                                    {field.label}
                                                </Typography>
                                                {field.component(controlProps)}
                                            </Box>
                                        )}
                                    />
                                ))}
                            </Box>

                            {/* Footer */}
                            {isEdit && (
                                <Box
                                    sx={{
                                        mt: 3,
                                        display: "flex",
                                        justifyContent: { xs: "stretch", sm: "flex-end" },
                                    }}
                                >
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={saving}
                                        startIcon={saving ? <CircularProgress size={18} /> : undefined}
                                        fullWidth
                                        sx={{
                                            width: { xs: "100%", sm: "auto" },
                                        }}
                                    >
                                        {saving ? "Salvando..." : "Salvar"}
                                    </Button>
                                </Box>
                            )}
                        </form>
                    </FormProvider>
                )}
            </Box>
        </Drawer>
    );
}
