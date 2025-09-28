import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    CircularProgress,
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
    onSubmit?: (values: Partial<T>) => Promise<void> | void; // permite async
    renderView?: (data: T) => ReactNode;
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

    const [loading, setLoading] = useState(false);

    // 🔄 Recarrega dados quando "data" muda (ex.: editar ou visualizar)
    useEffect(() => {
        if (data) {
            methods.reset(data as DefaultValues<T>);
        }
    }, [data, methods]);

    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            setLoading(true);
            await onSubmit?.(values); // aguarda mutation
            onClose(); // fecha só após sucesso
        } catch (err) {
            console.error("Erro no submit:", err);
        } finally {
            setLoading(false);
        }
    });

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: "100%", sm: 480, md: 560 }, p: 3 },
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
                <IconButton onClick={onClose} disabled={loading}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Conteúdo */}
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                {isView && data && renderView ? (
                    renderView(data)
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

                            {/* Footer */}
                            <Box
                                sx={{
                                    mt: 3,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 1,
                                }}
                            >
                                <Button onClick={onClose} color="inherit" disabled={loading}>
                                    Cancelar
                                </Button>
                                {(isCreate || isEdit) && (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={18} /> : undefined}
                                    >
                                        {loading
                                            ? isCreate
                                                ? "Criando..."
                                                : "Salvando..."
                                            : isCreate
                                                ? "Criar"
                                                : "Salvar"}
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
