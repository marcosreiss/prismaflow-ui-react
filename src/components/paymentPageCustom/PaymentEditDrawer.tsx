import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    CircularProgress,
    TextField,
} from "@mui/material";
import { X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import type { Payment } from "@/types/paymentTypes";
import { PaymentMethodLabels, PaymentStatusLabels } from "@/types/paymentTypes";
import MenuItem from "@mui/material/MenuItem";
import CurrencyInput from "../imask/CurrencyInput";

type PaymentEditDrawerProps = {
    open: boolean;
    title?: string;
    data?: Payment | null;
    updating?: boolean;
    onClose: () => void;
    onSubmit: (values: Partial<Payment>) => Promise<void> | void;
};

export default function PaymentEditDrawer({
    open,
    title = "Editar Pagamento",
    data,
    updating,
    onClose,
    onSubmit,
}: PaymentEditDrawerProps) {
    const { control, handleSubmit, watch, setValue, reset } = useForm<Partial<Payment>>({
        defaultValues: data ?? {
            method: "PIX",
            status: "PENDING",
            total: 0,
            discount: 0,
            downPayment: 0,
            paidAmount: 0,
        },
    });

    // assistir campos
    const total = watch("total") || 0;
    const discount = watch("discount") || 0;
    const downPayment = watch("downPayment") || 0;
    const paidAmount = watch("paidAmount") || 0;

    // regra: desconto abate do total
    const netTotal = total - discount;

    // regra: entrada soma no pago
    const effectivePaid = paidAmount + downPayment;

    // refletir regras dentro do form
    useEffect(() => {
        // atualiza total líquido
        setValue("total", netTotal);
        // atualiza pago com entrada
        setValue("paidAmount", effectivePaid);
    }, [netTotal, effectivePaid, setValue]);

    // resetar form ao abrir
    useEffect(() => {
        if (open && data) reset(data);
    }, [open, data, reset]);

    const submitHandler = handleSubmit(async (values) => {
        await onSubmit(values);
        onClose();
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
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <form onSubmit={submitHandler}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {/* Método */}
                    <Controller
                        name="method"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select fullWidth size="small" label="Método de Pagamento">
                                {Object.entries(PaymentMethodLabels).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* Status */}
                    <Controller
                        name="status"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select fullWidth size="small" label="Status">
                                {Object.entries(PaymentStatusLabels).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* Total (calculado com desconto aplicado) */}
                    <Controller
                        name="total"
                        control={control}
                        render={({ field }) => (
                            <CurrencyInput
                                {...field}
                                label="Valor Total"
                                fullWidth
                                size="small"
                                disabled
                                value={field.value ?? 0}
                                onChange={(v) => field.onChange(v)}
                            />
                        )}
                    />

                    {/* Desconto */}
                    <Controller
                        name="discount"
                        control={control}
                        render={({ field }) => (
                            <CurrencyInput
                                {...field}
                                label="Desconto"
                                fullWidth
                                size="small"
                                value={field.value ?? 0}
                                onChange={(v) => field.onChange(v)}
                            />
                        )}
                    />

                    {/* Entrada */}
                    <Controller
                        name="downPayment"
                        control={control}
                        render={({ field }) => (
                            <CurrencyInput
                                {...field}
                                label="Entrada"
                                fullWidth
                                size="small"
                                value={field.value ?? 0}
                                onChange={(v) => field.onChange(v)}
                            />
                        )}
                    />

                    {/* Pago (com entrada somada) */}
                    <Controller
                        name="paidAmount"
                        control={control}
                        render={({ field }) => (
                            <CurrencyInput
                                {...field}
                                label="Total Pago"
                                fullWidth
                                size="small"
                                disabled
                                value={field.value ?? 0}
                                onChange={(v) => field.onChange(v)}
                            />
                        )}
                    />
                </Box>

                {/* Footer */}
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={updating}
                        startIcon={updating ? <CircularProgress size={18} /> : undefined}
                    >
                        {updating ? "Salvando..." : "Salvar"}
                    </Button>
                </Box>
            </form>
        </Drawer>
    );
}
