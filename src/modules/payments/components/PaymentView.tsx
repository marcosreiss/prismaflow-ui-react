// components/PaymentView.tsx
import { Box, Stack, Typography, Chip, CircularProgress, Alert, Button } from "@mui/material";
import { useMemo } from "react";
import type { PaymentStatus } from "../types/paymentTypes";
import { PaymentMethodLabels, PaymentStatusLabels } from "../types/paymentTypes";
import { useGetPaymentById } from "../hooks/usePayments";
import { DollarSign } from "lucide-react";

// ==============================
// 🔹 Props
// ==============================
interface PaymentViewProps {
    paymentId: number | undefined;
    onPayInstallment?: (installmentId: number, paidAmount: number, paidAt?: string) => void; // ✅ ATUALIZADO
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function PaymentView({ paymentId, onPayInstallment }: PaymentViewProps) {
    // ==============================
    // 🔹 Buscar dados do pagamento
    // ==============================
    const {
        data: apiResponse,
        isLoading,
        error,
        isFetching
    } = useGetPaymentById(paymentId);

    const payment = apiResponse?.data;

    // ==============================
    // 🔹 Cálculos derivados (memoizados)
    // ==============================
    const pendingAmount = useMemo(() => {
        if (!payment) return 0;
        return Math.max(0, payment.total - payment.discount - payment.paidAmount);
    }, [payment]);

    const installmentStats = useMemo(() => {
        if (!payment || payment.method !== "INSTALLMENT" || !payment.installments) {
            return null;
        }

        const paidInstallments = payment.installments.filter(i => i.paidAt);
        const totalPaid = payment.installments.reduce((sum, i) => sum + i.paidAmount, 0);
        const totalPending = payment.installments.reduce((sum, i) =>
            sum + Math.max(0, i.amount - i.paidAmount), 0
        );

        return {
            totalInstallments: payment.installments.length,
            paidInstallments: paidInstallments.length,
            totalPaid,
            totalPending
        };
    }, [payment]);

    const hasInstallments = useMemo(() =>
        payment?.method === "INSTALLMENT" &&
        Array.isArray(payment?.installments) &&
        payment.installments.length > 0,
        [payment]);

    // ==============================
    // 🔹 Função auxiliar para cor do status
    // ==============================
    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case "CONFIRMED":
                return "success";
            case "PENDING":
                return "warning";
            case "CANCELED":
                return "error";
            default:
                return "default";
        }
    };

    // ==============================
    // 🔹 Handler para pagar parcela
    // ==============================
    const handlePayInstallment = (installmentId: number, amount: number) => {
        if (onPayInstallment) {
            onPayInstallment(installmentId, amount);
        }
    };

    // ==============================
    // 🔹 Render condicional (estados de carregamento/erro)
    // ==============================
    if (!paymentId) {
        return (
            <Alert severity="info" sx={{ mt: 2 }}>
                Selecione um pagamento para visualizar os detalhes
            </Alert>
        );
    }

    if (isLoading || isFetching) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                    Carregando detalhes do pagamento...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Erro ao carregar detalhes do pagamento: {error.response?.data?.message || error.message}
            </Alert>
        );
    }

    if (!payment) {
        return (
            <Alert severity="warning" sx={{ mt: 2 }}>
                Pagamento não encontrado
            </Alert>
        );
    }

    // ==============================
    // 🔹 Render principal
    // ==============================
    return (
        <Stack spacing={2}>
            {/* ========================================= */}
            {/* 🔹 Informações Básicas */}
            {/* ========================================= */}
            <Box component="section">
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Informações Básicas
                </Typography>
                <Stack spacing={1}>
                    <Row label="ID" value={payment.id} />
                    <Row label="Venda ID" value={payment.saleId} />
                    <Row label="Cliente" value={payment.clientName || "-"} />
                    <Row
                        label="Status"
                        value={
                            <Chip
                                label={PaymentStatusLabels[payment.status]}
                                color={getStatusColor(payment.status)}
                                size="small"
                            />
                        }
                    />
                    <Row
                        label="Método"
                        value={payment.method ? PaymentMethodLabels[payment.method] : "-"}
                    />
                </Stack>
            </Box>

            {/* ========================================= */}
            {/* 🔹 Valores */}
            {/* ========================================= */}
            <Box component="section">
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Valores
                </Typography>
                <Stack spacing={1}>
                    <Row label="Valor Total" value={formatCurrency(payment.total)} />
                    <Row label="Desconto" value={formatCurrency(payment.discount)} />
                    <Row label="Valor Pago" value={formatCurrency(payment.paidAmount)} />
                    <Row label="Valor Pendente" value={formatCurrency(pendingAmount)} />

                    {payment.method === "INSTALLMENT" && (
                        <>
                            <Row label="Entrada" value={formatCurrency(payment.downPayment)} />
                            <Row label="Número de Parcelas" value={payment.installmentsTotal} />
                            <Row label="Parcelas Pagas" value={`${payment.installmentsPaid} de ${payment.installmentsTotal}`} />
                        </>
                    )}
                </Stack>
            </Box>

            {/* ========================================= */}
            {/* 🔹 Datas */}
            {/* ========================================= */}
            <Box component="section">
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Datas
                </Typography>
                <Stack spacing={1}>
                    <Row label="Criado em" value={formatDate(payment.createdAt)} />
                    <Row label="Última atualização" value={formatDate(payment.updatedAt)} />
                    <Row label="Último pagamento" value={formatDate(payment.lastPaymentAt)} />

                    {payment.method === "INSTALLMENT" && payment.firstDueDate && (
                        <Row label="Primeiro vencimento" value={formatDate(payment.firstDueDate)} />
                    )}
                </Stack>
            </Box>

            {/* ========================================= */}
            {/* 🔹 Resumo do Parcelamento */}
            {/* ========================================= */}
            {hasInstallments && installmentStats && (
                <Box component="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Resumo do Parcelamento
                    </Typography>
                    <Stack spacing={1}>
                        <Row label="Total de Parcelas" value={installmentStats.totalInstallments} />
                        <Row
                            label="Parcelas Pagas"
                            value={`${installmentStats.paidInstallments} de ${installmentStats.totalInstallments}`}
                        />
                        <Row
                            label="Valor Total Pago"
                            value={formatCurrency(installmentStats.totalPaid)}
                        />
                        <Row
                            label="Valor Pendente"
                            value={formatCurrency(installmentStats.totalPending)}
                        />
                    </Stack>
                </Box>
            )}

            {/* ========================================= */}
            {/* 🔹 Detalhes das Parcelas (com ações) */}
            {/* ========================================= */}
            {hasInstallments && (
                <Box component="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Detalhes das Parcelas
                    </Typography>
                    <Stack spacing={1.5}>
                        {payment.installments.map((installment) => {
                            const isPaid = installment.paidAmount >= installment.amount;
                            const remainingAmount = installment.amount - installment.paidAmount;

                            return (
                                <Box
                                    key={installment.id}
                                    sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: isPaid ? 'success.light' : 'divider',
                                        borderRadius: 1,
                                        bgcolor: isPaid ? 'success.50' : 'background.paper'
                                    }}
                                >
                                    <Stack spacing={1}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" fontWeight={600}>
                                                Parcela {installment.sequence}
                                            </Typography>
                                            <Chip
                                                label={isPaid ? "Paga" : "Pendente"}
                                                color={isPaid ? "success" : "warning"}
                                                size="small"
                                            />
                                        </Box>

                                        <Row label="Valor" value={formatCurrency(installment.amount)} />
                                        <Row label="Pago" value={formatCurrency(installment.paidAmount)} />

                                        {!isPaid && (
                                            <Row label="Restante" value={formatCurrency(remainingAmount)} />
                                        )}

                                        {installment.dueDate && (
                                            <Row label="Vencimento" value={formatDate(installment.dueDate)} />
                                        )}

                                        {installment.paidAt && (
                                            <Row label="Data do Pagamento" value={formatDate(installment.paidAt)} />
                                        )}

                                        {/* ✅ BOTÃO PARA PAGAR PARCELA */}
                                        {!isPaid && onPayInstallment && (
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<DollarSign size={14} />}
                                                onClick={() => handlePayInstallment(installment.id, remainingAmount)}
                                                sx={{ mt: 1 }}
                                            >
                                                Pagar {formatCurrency(remainingAmount)}
                                            </Button>
                                        )}
                                    </Stack>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}

// ==============================
// 🔹 Componente Row (exibir label + valor)
// ==============================
function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | React.ReactNode | null | undefined;
}) {
    if (value == null || value === '' || (typeof value === 'number' && isNaN(value))) {
        return null;
    }

    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140 }}>
                {label}:
            </Typography>
            <Typography variant="body2" color="text.secondary" component="span">
                {value}
            </Typography>
        </Box>
    );
}

// ==============================
// 🔹 Helpers (formatação)
// ==============================
function formatCurrency(value: number | undefined | null): string {
    if (value == null || isNaN(value)) {
        return "R$ 0,00";
    }

    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "-";

    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch {
        return "-";
    }
}
