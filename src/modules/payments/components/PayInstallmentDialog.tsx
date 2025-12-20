// components/PayInstallmentDialog.tsx
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
import type { PaymentInstallment } from "../types/paymentTypes";

// ==============================
// 🔹 Form values
// ==============================
interface PayInstallmentFormValues {
    paidAmount: number;
    paidAt: string; // ISO date string
}

// ==============================
// 🔹 Props
// ==============================
interface PayInstallmentDialogProps {
    open: boolean;
    installment: PaymentInstallment | null;
    onClose: () => void;
    onConfirm: (installmentId: number, paidAmount: number, paidAt?: string) => Promise<void>;
    loading?: boolean;
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function PayInstallmentDialog({
    open,
    installment,
    onClose,
    onConfirm,
    loading = false,
}: PayInstallmentDialogProps) {
    // ==============================
    // 🔹 Estados
    // ==============================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ==============================
    // 🔹 Form setup
    // ==============================
    const {
        control,
        handleSubmit,
        reset,
        watch, // ✅ Removido 'errors' do formState
    } = useForm<PayInstallmentFormValues>({
        defaultValues: {
            paidAmount: 0,
            paidAt: new Date().toISOString().split("T")[0], // Data de hoje no formato YYYY-MM-DD
        },
    });

    // ==============================
    // 🔹 Calcular valores
    // ==============================
    const remainingAmount = installment
        ? Math.max(0, installment.amount - installment.paidAmount)
        : 0;

    const paidAmountValue = watch("paidAmount");
    const isPartialPayment = paidAmountValue < remainingAmount;
    const willCompletePay = paidAmountValue >= remainingAmount;

    // ==============================
    // 🔹 Handler: Submit
    // ==============================
    const onSubmit = async (data: PayInstallmentFormValues) => {
        if (!installment) return;

        // Validação: valor não pode ser zero
        if (data.paidAmount <= 0) {
            setError("O valor pago deve ser maior que zero.");
            return;
        }

        // Validação: valor não pode exceder o restante
        if (data.paidAmount > remainingAmount) {
            setError(`O valor pago não pode ser maior que o valor restante (${formatCurrency(remainingAmount)}).`);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Converter data para ISO string se fornecida
            const paidAt = data.paidAt ? new Date(data.paidAt).toISOString() : undefined;

            await onConfirm(installment.id, data.paidAmount, paidAt);

            // Resetar form e fechar
            reset();
            onClose();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Erro ao processar pagamento da parcela.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ==============================
    // 🔹 Handler: Fechar dialog
    // ==============================
    const handleClose = () => {
        if (!isSubmitting) {
            reset();
            setError(null);
            onClose();
        }
    };

    // ==============================
    // 🔹 Handler: Pagar valor total
    // ==============================
    const handlePayFull = () => {
        reset({
            paidAmount: remainingAmount,
            paidAt: new Date().toISOString().split("T")[0],
        });
    };

    // ==============================
    // 🔹 Helpers: Formatação
    // ==============================
    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("pt-BR");
        } catch {
            return "-";
        }
    };

    // ==============================
    // 🔹 Render: Se não tem parcela
    // ==============================
    if (!installment) return null;

    // ==============================
    // 🔹 Render: Dialog
    // ==============================
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                }
            }}
        >
            {/* ========================================= */}
            {/* 🔹 Título */}
            {/* ========================================= */}
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DollarSign size={24} />
                    <Typography variant="h6" fontWeight={600}>
                        Pagar Parcela #{installment.sequence}
                    </Typography>
                </Box>
            </DialogTitle>

            {/* ========================================= */}
            {/* 🔹 Conteúdo */}
            {/* ========================================= */}
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

                        {/* Campos do formulário */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Dados do Pagamento
                            </Typography>

                            <Stack spacing={2} sx={{ mt: 1.5 }}>
                                {/* Valor a pagar */}
                                <Controller
                                    name="paidAmount"
                                    control={control}
                                    rules={{
                                        required: "Informe o valor a pagar",
                                        min: {
                                            value: 0.01,
                                            message: "O valor deve ser maior que zero"
                                        },
                                        max: {
                                            value: remainingAmount,
                                            message: `O valor não pode ser maior que ${formatCurrency(remainingAmount)}`
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <CurrencyInput
                                            {...field}
                                            label="Valor a pagar"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            autoFocus
                                        />
                                    )}
                                />

                                {/* Botão para preencher valor total */}
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={handlePayFull}
                                    disabled={isSubmitting}
                                    sx={{ alignSelf: "flex-start" }}
                                >
                                    Pagar valor total ({formatCurrency(remainingAmount)})
                                </Button>

                                {/* Data do pagamento */}
                                <Controller
                                    name="paidAt"
                                    control={control}
                                    rules={{
                                        required: "Informe a data do pagamento"
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Data do pagamento"
                                            type="date"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message || "Data em que o pagamento foi realizado"}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <Calendar size={16} style={{ marginRight: 8, opacity: 0.6 }} />
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Box>

                        {/* Alertas informativos */}
                        {paidAmountValue > 0 && (
                            <Box>
                                {isPartialPayment && (
                                    <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
                                        <strong>Pagamento parcial:</strong> Restará {formatCurrency(remainingAmount - paidAmountValue)} após este pagamento.
                                    </Alert>
                                )}

                                {willCompletePay && (
                                    <Alert severity="success" sx={{ fontSize: "0.875rem" }}>
                                        <strong>Pagamento completo:</strong> Esta parcela será quitada totalmente.
                                    </Alert>
                                )}
                            </Box>
                        )}

                        {/* Erro */}
                        {error && (
                            <Alert severity="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        )}
                    </Stack>
                </form>
            </DialogContent>

            {/* ========================================= */}
            {/* 🔹 Ações */}
            {/* ========================================= */}
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
                        (isSubmitting || loading) ? (
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
// 🔹 Componente auxiliar: InfoRow
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
