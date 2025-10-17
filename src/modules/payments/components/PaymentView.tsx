import { Box, Stack, Typography, Chip } from "@mui/material";
import type { PaymentDetails } from "../types/paymentTypes";
import { PaymentMethodLabels, PaymentStatusLabels } from "../types/paymentTypes";

interface PaymentViewProps {
    payment: PaymentDetails;
    onProcessInstallment?: (installmentId: number, paidAmount: number) => void;
}

export default function PaymentView({ payment }: PaymentViewProps) {
    const getStatusColor = (status: string) => {
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

    return (
        <Stack spacing={2}>
            {/* Informações Básicas */}
            <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Informações Básicas
                </Typography>
                <Stack spacing={1}>
                    <Row label="ID" value={payment.id} />
                    <Row label="Venda ID" value={payment.saleId} />
                    <Row label="Cliente" value={payment.sale?.clientName || "-"} />
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

            {/* Valores */}
            <Box>
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                    Valores
                </Typography>
                <Stack spacing={1}>
                    <Row label="Valor Total" value={formatCurrency(payment.total)} />
                    <Row label="Desconto" value={formatCurrency(payment.discount)} />
                    <Row label="Valor Pago" value={formatCurrency(payment.paidAmount)} />
                    <Row label="Valor Pendente" value={formatCurrency(payment.total - payment.discount - payment.paidAmount)} />

                    {payment.method === "INSTALLMENT" && (
                        <>
                            <Row label="Entrada" value={formatCurrency(payment.downPayment)} />
                            <Row label="Total Parcelado" value={formatCurrency(payment.installmentsTotal || 0)} />
                            <Row label="Parcelas Pagas" value={`${payment.installmentsPaid}`} />
                        </>
                    )}
                </Stack>
            </Box>

            {/* Datas */}
            <Box>
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

            {/* Informações de Parcelamento */}
            {payment.method === "INSTALLMENT" && payment.installments && payment.installments.length > 0 && (
                <Box>
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Resumo do Parcelamento
                    </Typography>
                    <Stack spacing={1}>
                        <Row label="Total de Parcelas" value={payment.installments.length} />
                        <Row
                            label="Parcelas Pagas"
                            value={`${payment.installments.filter(i => i.paidAt).length} de ${payment.installments.length}`}
                        />
                        <Row
                            label="Valor Total Pago"
                            value={formatCurrency(payment.installments.reduce((sum, i) => sum + i.paidAmount, 0))}
                        />
                        <Row
                            label="Valor Pendente"
                            value={formatCurrency(payment.installments.reduce((sum, i) => sum + (i.amount - i.paidAmount), 0))}
                        />
                    </Stack>
                </Box>
            )}
        </Stack>
    );
}

// ==========================
// 🔹 Subcomponente auxiliar
// ==========================
function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | React.ReactNode | null | undefined;
}) {
    if (!value && value !== 0) return null;

    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Typography variant="body2" fontWeight={600} sx={{ minWidth: 140 }}>
                {label}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {value}
            </Typography>
        </Box>
    );
}

// ==========================
// 🔹 Helpers
// ==========================
function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatDate(dateString: string | null) {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}