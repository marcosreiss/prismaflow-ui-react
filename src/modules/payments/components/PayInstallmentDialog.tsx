import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
    CircularProgress,
    Stack,
    Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { DollarSign, Calendar } from "lucide-react";
import CurrencyInput from "@/components/imask/CurrencyInput";
import type { PaymentInstallmentItem } from "../types/paymentEntities";

// ==============================
// Tipagens
// ==============================
interface PayInstallmentFormValues {
    paidAmount: number;
    // Data em que o pagamento foi de fato realizado — pode ser retroativa
    paidAt: string;
}

interface PayInstallmentDialogProps {
    open: boolean;
    installment: PaymentInstallmentItem | null;
    onClose: () => void;
    onConfirm: (installmentId: number, paidAmount: number, paidAt?: string) => Promise<void>;
    loading?: boolean;
}

// ==============================
// Componente principal
// ==============================
export default function PayInstallmentDialog({
    open,
    installment,
    onClose,
    onConfirm,
    loading = false,
}: PayInstallmentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { control, handleSubmit, reset, watch } = useForm<PayInstallmentFormValues>({
        defaultValues: {
            paidAmount: 0,
            paidAt: new Date().toISOString().split("T")[0],
        },
    });

    const remainingAmount = installment
        ? Math.max(0, installment.amount - installment.paidAmount)
        : 0;

    const paidAmountValue = watch("paidAmount");
    const isPartialPayment = paidAmountValue > 0 && paidAmountValue < remainingAmount;
    const willCompletePay = paidAmountValue >= remainingAmount;

    const onSubmit = async (data: PayInstallmentFormValues) => {
        if (!installment) return;

        if (data.paidAmount <= 0) {
            setError("O valor pago deve ser maior que zero.");
            return;
        }

        if (data.paidAmount > remainingAmount) {
            setError(
                `O valor pago não pode ser maior que o valor restante (${formatCurrency(remainingAmount)}).`
            );
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // paidAt é convertido para ISO — o backend usa quando fornecido,
            // caso contrário preenche automaticamente com a data atual
            const paidAt = data.paidAt
                ? new Date(data.paidAt).toISOString()
                : undefined;

            await onConfirm(installment.id, data.paidAmount, paidAt);
            reset();
            onClose();
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Erro ao processar pagamento da parcela.";
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        reset();
        setError(null);
        onClose();
    };

    // Preenche o formulário com o valor restante para quitação total
    const handlePayFull = () => {
        reset({
            paidAmount: remainingAmount,
            paidAt: new Date().toISOString().split("T")[0],
        });
    };

    if (!installment) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DollarSign size={24} />
                    <Typography variant="h6" fontWeight={600}>
                        Pagar Parcela #{installment.sequence}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <form onSubmit={handleSubmit(onSubmit)} id="pay-installment-form">
                    <Stack spacing={3}>
                        {/* Informações da parcela */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Informações da Parcela
                            </Typography>

                            <Stack spacing={1} sx={{ mt: 1.5 }}>
                                <InfoRow
                                    label="Valor total"
                                    value={formatCurrency(installment.amount)}
                                />
                                <InfoRow
                                    label="Já pago"
                                    value={formatCurrency(installment.paidAmount)}
                                    valueColor={installment.paidAmount > 0 ? "success.main" : undefined}
                                />
                                <InfoRow
                                    label="Valor restante"
                                    value={formatCurrency(remainingAmount)}
                                    valueColor="error.main"
                                    bold
                                />
                                {installment.dueDate && (
                                    <InfoRow
                                        label="Vencimento"
                                        value={formatDate(installment.dueDate)}
                                    />
                                )}
                            </Stack>
                        </Box>

                        <Divider />

                        {/* Formulário */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Dados do Pagamento
                            </Typography>

                            <Stack spacing={2} sx={{ mt: 1.5 }}>
                                <Controller
                                    name="paidAmount"
                                    control={control}
                                    rules={{
                                        required: "Informe o valor a pagar",
                                        min: {
                                            value: 0.01,
                                            message: "O valor deve ser maior que zero",
                                        },
                                        max: {
                                            value: remainingAmount,
                                            message: `O valor não pode ser maior que ${formatCurrency(remainingAmount)}`,
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <CurrencyInput
                                            value={field.value ?? 0}
                                            onChange={field.onChange}
                                            label="Valor a pagar"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            autoFocus
                                        />
                                    )}
                                />

                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handlePayFull}
                                    disabled={isSubmitting}
                                    sx={{ alignSelf: "flex-start" }}
                                >
                                    Pagar valor total ({formatCurrency(remainingAmount)})
                                </Button>

                                {/* Campo de data — permite registrar pagamentos retroativos */}
                                <Controller
                                    name="paidAt"
                                    control={control}
                                    rules={{ required: "Informe a data do pagamento" }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Data do pagamento"
                                            type="date"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={
                                                fieldState.error?.message ||
                                                "Informe a data em que o pagamento foi realizado"
                                            }
                                            InputLabelProps={{ shrink: true }}
                                            InputProps={{
                                                startAdornment: (
                                                    <Calendar
                                                        size={16}
                                                        style={{ marginRight: 8, opacity: 0.6 }}
                                                    />
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Box>

                        {paidAmountValue > 0 && (
                            <Box>
                                {isPartialPayment && (
                                    <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
                                        <strong>Pagamento parcial:</strong> Restará{" "}
                                        {formatCurrency(remainingAmount - paidAmountValue)} após
                                        este pagamento.
                                    </Alert>
                                )}
                                {willCompletePay && (
                                    <Alert severity="success" sx={{ fontSize: "0.875rem" }}>
                                        <strong>Pagamento completo:</strong> Esta parcela será
                                        quitada totalmente.
                                    </Alert>
                                )}
                            </Box>
                        )}

                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}
                    </Stack>
                </form>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={handleClose}
                    disabled={isSubmitting || loading}
                    color="inherit"
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    form="pay-installment-form"
                    variant="contained"
                    disabled={isSubmitting || loading}
                    startIcon={
                        isSubmitting || loading ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : (
                            <DollarSign size={18} />
                        )
                    }
                >
                    {isSubmitting || loading ? "Processando..." : "Confirmar pagamento"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ==============================
// Componente auxiliar
// ==============================
interface InfoRowProps {
    label: string;
    value: string;
    valueColor?: string;
    bold?: boolean;
}

function InfoRow({ label, value, valueColor, bold = false }: InfoRowProps) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
                {label}:
            </Typography>
            <Typography
                variant="body2"
                fontWeight={bold ? 600 : 400}
                color={valueColor || "text.primary"}
            >
                {value}
            </Typography>
        </Box>
    );
}

// ==============================
// Helpers
// ==============================
function formatCurrency(value: number): string {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatDate(dateString: string | null): string {
    if (!dateString) return "-";
    try {
        return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
        return "-";
    }
}
