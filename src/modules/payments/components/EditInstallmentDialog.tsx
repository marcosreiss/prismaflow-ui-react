// components/EditInstallmentDialog.tsx
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { Pencil, Calendar } from "lucide-react";
import CurrencyInput from "@/components/imask/CurrencyInput";
import type { PaymentInstallment } from "../types/paymentTypes";

// ==============================
// 🔹 Form values
// ==============================
interface EditInstallmentFormValues {
    sequence: number;
    amount: number;
    dueDate: string; // ISO date string (YYYY-MM-DD)
}

// ==============================
// 🔹 Props
// ==============================
interface EditInstallmentDialogProps {
    open: boolean;
    installment: PaymentInstallment | null;
    onClose: () => void;
    onConfirm: (installmentId: number, data: {
        sequence?: number;
        amount?: number;
        dueDate?: string;
    }) => Promise<void>;
    loading?: boolean;
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function EditInstallmentDialog({
    open,
    installment,
    onClose,
    onConfirm,
    loading = false,
}: EditInstallmentDialogProps) {
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
    } = useForm<EditInstallmentFormValues>({
        defaultValues: {
            sequence: 1,
            amount: 0,
            dueDate: "",
        },
    });

    // ==============================
    // 🔹 Effect: Preencher form quando installment mudar
    // ==============================
    useEffect(() => {
        if (installment && open) {
            reset({
                sequence: installment.sequence,
                amount: installment.amount,
                dueDate: installment.dueDate
                    ? new Date(installment.dueDate).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [installment, open, reset]);

    // ==============================
    // 🔹 Handler: Submit
    // ==============================
    const onSubmit = async (data: EditInstallmentFormValues) => {
        if (!installment) return;

        // Validação: valor não pode ser zero
        if (data.amount <= 0) {
            setError("O valor da parcela deve ser maior que zero.");
            return;
        }

        // Validação: não pode editar se já foi paga
        if (installment.paidAmount > 0) {
            setError("Não é possível editar uma parcela que já possui pagamentos registrados.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Preparar dados para envio (apenas campos alterados)
            const updateData: {
                sequence?: number;
                amount?: number;
                dueDate?: string;
            } = {};

            if (data.sequence !== installment.sequence) {
                updateData.sequence = data.sequence;
            }

            if (data.amount !== installment.amount) {
                updateData.amount = data.amount;
            }

            const originalDueDate = installment.dueDate
                ? new Date(installment.dueDate).toISOString().split("T")[0]
                : "";

            if (data.dueDate !== originalDueDate) {
                // Converter para ISO string completo
                updateData.dueDate = data.dueDate
                    ? new Date(data.dueDate).toISOString()
                    : undefined;
            }

            // Verificar se há alterações
            if (Object.keys(updateData).length === 0) {
                setError("Nenhuma alteração foi feita.");
                setIsSubmitting(false);
                return;
            }

            await onConfirm(installment.id, updateData);

            // Resetar form e fechar
            reset();
            onClose();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar parcela.");
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
    // 🔹 Helpers: Formatação
    // ==============================
    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    // ==============================
    // 🔹 Render: Se não tem parcela
    // ==============================
    if (!installment) return null;

    // Verificar se parcela já foi paga (não pode editar)
    const hasPayments = installment.paidAmount > 0;

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
                    <Pencil size={24} />
                    <Typography variant="h6" fontWeight={600}>
                        Editar Parcela #{installment.sequence}
                    </Typography>
                </Box>
            </DialogTitle>

            {/* ========================================= */}
            {/* 🔹 Conteúdo */}
            {/* ========================================= */}
            <DialogContent dividers>
                <form onSubmit={handleSubmit(onSubmit)} id="edit-installment-form">
                    <Stack spacing={3}>
                        {/* Alerta se parcela já foi paga */}
                        {hasPayments && (
                            <Alert severity="warning">
                                <strong>Atenção:</strong> Esta parcela já possui pagamentos registrados ({formatCurrency(installment.paidAmount)}).
                                Não é recomendado editá-la.
                            </Alert>
                        )}

                        {/* Informações atuais */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Informações Atuais
                            </Typography>

                            <Stack spacing={1} sx={{ mt: 1.5 }}>
                                <InfoRow
                                    label="Número da parcela"
                                    value={`#${installment.sequence}`}
                                />
                                <InfoRow
                                    label="Valor"
                                    value={formatCurrency(installment.amount)}
                                />
                                <InfoRow
                                    label="Já pago"
                                    value={formatCurrency(installment.paidAmount)}
                                    valueColor={hasPayments ? "warning.main" : "text.secondary"}
                                />
                            </Stack>
                        </Box>

                        {/* Campos do formulário */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Novos Dados
                            </Typography>

                            <Stack spacing={2} sx={{ mt: 1.5 }}>
                                {/* Número da parcela (sequence) */}
                                <Controller
                                    name="sequence"
                                    control={control}
                                    rules={{
                                        required: "Informe o número da parcela",
                                        min: {
                                            value: 1,
                                            message: "O número deve ser maior que zero"
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Número da parcela"
                                            type="number"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message || "Ordem sequencial da parcela"}
                                            disabled={hasPayments}
                                            inputProps={{
                                                min: 1,
                                                step: 1,
                                            }}
                                        />
                                    )}
                                />

                                {/* Valor da parcela */}
                                <Controller
                                    name="amount"
                                    control={control}
                                    rules={{
                                        required: "Informe o valor da parcela",
                                        min: {
                                            value: 0.01,
                                            message: "O valor deve ser maior que zero"
                                        },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <CurrencyInput
                                            {...field}
                                            label="Valor da parcela"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                            disabled={hasPayments}
                                        />
                                    )}
                                />

                                {/* Data de vencimento */}
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            {...field}
                                            label="Data de vencimento"
                                            type="date"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message || "Data em que a parcela vence"}
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

                        {/* Alerta informativo */}
                        <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
                            <strong>Dica:</strong> Edite apenas parcelas que ainda não foram pagas para evitar inconsistências.
                        </Alert>

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
                    form="edit-installment-form"
                    variant="contained"
                    disabled={isSubmitting || loading || hasPayments}
                    startIcon={
                        (isSubmitting || loading) ? (
                            <CircularProgress size={18} color="inherit" />
                        ) : (
                            <Pencil size={18} />
                        )
                    }
                >
                    {isSubmitting || loading ? "Salvando..." : "Salvar alterações"}
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
}

function InfoRow({ label, value, valueColor }: InfoRowProps) {
    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary">
                {label}:
            </Typography>
            <Typography
                variant="body2"
                color={valueColor || "text.primary"}
            >
                {value}
            </Typography>
        </Box>
    );
}
