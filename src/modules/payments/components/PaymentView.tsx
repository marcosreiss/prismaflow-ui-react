import {
    Box,
    Stack,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Button,
    Divider,
} from "@mui/material";
import { useMemo, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { useGetPaymentById } from "../hooks/usePayments";
import { PaymentMethodLabels, PaymentStatusLabels } from "../types/paymentEnums";
import { CarnetTemplate } from "./CarnetTemplate";
import CarnetPrintDialog from "./CarnetPrintDialog";
import InstallmentsTable from "./InstallmentsTable";
import PayInstallmentDialog from "./PayInstallmentDialog";
import EditInstallmentDialog from "./EditInstallmentDialog";
import type { PaymentStatus } from "../types/paymentEnums";
import type { PaymentInstallmentItem, PaymentMethodItem } from "../types/paymentEntities";
import type { PaymentDetails } from "../types";
import formatDateBR from "@/utils/format-date";

// ==============================
// Props
// ==============================
interface PaymentViewProps {
    paymentId: number | undefined;
    initialPayment?: PaymentDetails | null;
    onPayInstallment?: (installmentId: number, paidAmount: number, paidAt?: string) => void;
    onEditInstallment?: (
        installmentId: number,
        data: { sequence?: number; amount?: number; dueDate?: string }
    ) => Promise<void>;
}

// ==============================
// Componente principal
// ==============================
export default function PaymentView({
    paymentId,
    initialPayment,
    onPayInstallment,
    onEditInstallment,
}: PaymentViewProps) {
    const [payDialogOpen, setPayDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedInstallment, setSelectedInstallment] =
        useState<PaymentInstallmentItem | null>(null);
    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [carnetCoverLogoSrc, setCarnetCoverLogoSrc] = useState<string | null>(null);

    const carnetRef = useRef<HTMLDivElement>(null);

    const { data: apiResponse, isLoading, error, isFetching } = useGetPaymentById(paymentId);
    const payment = useMemo(() => {
        const fetchedPayment = apiResponse?.data;

        if (!fetchedPayment) {
            return initialPayment ?? undefined;
        }

        return {
            ...fetchedPayment,
            clientName:
                fetchedPayment.clientName ||
                fetchedPayment.sale?.clientName ||
                fetchedPayment.sale?.client?.name ||
                initialPayment?.clientName ||
                initialPayment?.sale?.clientName ||
                initialPayment?.sale?.client?.name ||
                "Cliente não informado",
        };
    }, [apiResponse?.data, initialPayment]);

    const handlePrint = useReactToPrint({
        contentRef: carnetRef,
        documentTitle: `Carne-Pagamento-${payment?.saleId ?? paymentId}`,
        pageStyle: `
            @page { size: A4; margin: 0; }
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
        `,
    });

    const handleOpenPrintDialog = () => {
        setPrintDialogOpen(true);
    };

    const handleClosePrintDialog = () => {
        setPrintDialogOpen(false);
    };

    const handleConfirmCarnetPrint = (logoSrc: string | null) => {
        setCarnetCoverLogoSrc(logoSrc);
        setPrintDialogOpen(false);
        window.setTimeout(() => {
            handlePrint();
        }, 50);
    };

    // Valor pendente total do pagamento
    const pendingAmount = useMemo(() => {
        if (!payment) return 0;
        return Math.max(0, payment.total - payment.discount - payment.paidAmount);
    }, [payment]);

    // Métodos que possuem parcelas
    const installmentMethods = useMemo(
        () => payment?.methods.filter(
            (m) => m.method === "INSTALLMENT" && m.installmentItems.length > 0
        ) ?? [],
        [payment]
    );

    const hasInstallments = installmentMethods.length > 0;

    // Resumo por método de parcelamento
    const installmentStatsByMethod = useMemo(() => {
        return installmentMethods.map((m) => {
            const paid = m.installmentItems.filter((i) => i.paidAt !== null).length;
            const totalPaid = m.installmentItems.reduce((acc, i) => acc + i.paidAmount, 0);
            const totalPending = m.installmentItems.reduce(
                (acc, i) => acc + Math.max(0, i.amount - i.paidAmount),
                0
            );
            return {
                methodId: m.id,
                total: m.installmentItems.length,
                paid,
                totalPaid,
                totalPending,
            };
        });
    }, [installmentMethods]);

    // Achata todas as parcelas de todos os métodos para busca por id
    const allInstallmentItems = useMemo(
        () => payment?.methods.flatMap((m) => m.installmentItems) ?? [],
        [payment]
    );

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case "CONFIRMED": return "success";
            case "PENDING": return "warning";
            case "CANCELED": return "error";
            default: return "default";
        }
    };

    // Handlers: pagar parcela
    const handleOpenPayDialog = (installmentId: number) => {
        const installment = allInstallmentItems.find((i) => i.id === installmentId);
        if (installment) {
            setSelectedInstallment(installment);
            setPayDialogOpen(true);
        }
    };

    const handleConfirmPay = async (
        installmentId: number,
        paidAmount: number,
        paidAt?: string
    ) => {
        if (onPayInstallment) {
            await onPayInstallment(installmentId, paidAmount, paidAt);
        }
        setPayDialogOpen(false);
        setSelectedInstallment(null);
    };

    const handleClosePayDialog = () => {
        setPayDialogOpen(false);
        setSelectedInstallment(null);
    };

    // Handlers: editar parcela
    const handleOpenEditDialog = (installment: PaymentInstallmentItem) => {
        setSelectedInstallment(installment);
        setEditDialogOpen(true);
    };

    const handleConfirmEdit = async (
        installmentId: number,
        data: { sequence?: number; amount?: number; dueDate?: string }
    ) => {
        if (onEditInstallment) {
            await onEditInstallment(installmentId, data);
        }
        setEditDialogOpen(false);
        setSelectedInstallment(null);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedInstallment(null);
    };

    // Estados de carregamento e erro
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
                Erro ao carregar detalhes do pagamento:{" "}
                {error.response?.data?.message ?? error.message}
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

    return (
        <>
            <Stack spacing={3}>
                {/* Informações Básicas */}
                <Box component="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Informações Básicas
                    </Typography>
                    <Stack spacing={1}>
                        <Row label="ID" value={payment.id} />
                        <Row label="Venda ID" value={payment.saleId} />
                        <Row label="Cliente" value={payment.clientName ?? "-"} />
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
                    </Stack>
                </Box>

                <Divider />

                {/* Métodos de Pagamento */}
                <Box component="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Métodos de Pagamento
                    </Typography>
                    <Stack spacing={1.5}>
                        {payment.methods.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                Nenhum método configurado
                            </Typography>
                        )}
                        {payment.methods.map((m: PaymentMethodItem) => (
                            <Box
                                key={m.id}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    gap: 1,
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight={600}>
                                        {PaymentMethodLabels[m.method]}
                                        {m.method === "INSTALLMENT" && m.installments
                                            ? ` — ${m.installments}x`
                                            : ""}
                                    </Typography>
                                    {/* Data do pagamento — apenas para métodos à vista já pagos */}
                                    {m.paidAt && (
                                        <Typography variant="caption" color="text.secondary">
                                            Pago em {formatDateBR(m.paidAt)}
                                        </Typography>
                                    )}
                                </Box>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" color="text.secondary">
                                        {formatCurrency(m.amount)}
                                    </Typography>
                                    <Chip
                                        label={m.isPaid ? "Pago" : "Pendente"}
                                        color={m.isPaid ? "success" : "default"}
                                        size="small"
                                    />
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                </Box>

                <Divider />

                {/* Valores */}
                <Box component="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Valores
                    </Typography>
                    <Stack spacing={1}>
                        <Row label="Valor Total" value={formatCurrency(payment.total)} />
                        <Row label="Desconto" value={formatCurrency(payment.discount)} />
                        <Row label="Valor Pago" value={formatCurrency(payment.paidAmount)} />
                        <Row label="Valor Pendente" value={formatCurrency(pendingAmount)} />
                        <Row
                            label="Parcelas Pagas"
                            value={`${payment.installmentsPaid}`}
                        />
                    </Stack>
                </Box>

                <Divider />

                {/* Datas */}
                <Box component="section">
                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                        Datas
                    </Typography>
                    <Stack spacing={1}>
                        <Row
                            label="Data da venda"
                            value={formatDateBR(payment.saleDate ?? payment.sale?.saleDate)}
                        />
                        <Row label="Último pagamento" value={formatDateBR(payment.lastPaymentAt)} />
                    </Stack>
                </Box>

                {/* Resumo e tabela por método de parcelamento */}
                {hasInstallments && installmentMethods.map((m, index) => (
                    <Box key={m.id} component="section">
                        <Divider sx={{ mb: 2 }} />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600}>
                                Carnê — {m.installments}x de{" "}
                                {formatCurrency(m.amount / (m.installments ?? 1))}
                            </Typography>

                            {/* Botão de impressão apenas no primeiro método */}
                            {index === 0 && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Printer size={16} />}
                                    onClick={handleOpenPrintDialog}
                                >
                                    Imprimir Carnê
                                </Button>
                            )}
                        </Box>

                        {/* Resumo do método */}
                        <Stack spacing={1} mb={2}>
                            <Row
                                label="Total de Parcelas"
                                value={installmentStatsByMethod[index].total}
                            />
                            <Row
                                label="Parcelas Pagas"
                                value={`${installmentStatsByMethod[index].paid} de ${installmentStatsByMethod[index].total}`}
                            />
                            <Row
                                label="Valor Total Pago"
                                value={formatCurrency(installmentStatsByMethod[index].totalPaid)}
                            />
                            <Row
                                label="Valor Pendente"
                                value={formatCurrency(installmentStatsByMethod[index].totalPending)}
                            />
                        </Stack>

                        {/* Tabela de parcelas do método */}
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                            Detalhes das Parcelas
                        </Typography>
                        <InstallmentsTable
                            installments={m.installmentItems}
                            onPay={handleOpenPayDialog}
                            onEdit={handleOpenEditDialog}
                            loading={isFetching}
                        />
                    </Box>
                ))}
            </Stack>

            <PayInstallmentDialog
                open={payDialogOpen}
                installment={selectedInstallment}
                onClose={handleClosePayDialog}
                onConfirm={handleConfirmPay}
                loading={isFetching}
            />

            <EditInstallmentDialog
                open={editDialogOpen}
                installment={selectedInstallment}
                onClose={handleCloseEditDialog}
                onConfirm={handleConfirmEdit}
                loading={isFetching}
            />

            <CarnetPrintDialog
                open={printDialogOpen}
                onClose={handleClosePrintDialog}
                onConfirm={handleConfirmCarnetPrint}
            />

            {/* Template do carnê — oculto, usado apenas para impressão */}
            <Box sx={{ display: "none" }}>
                <CarnetTemplate
                    ref={carnetRef}
                    payment={payment}
                    coverLogoSrc={carnetCoverLogoSrc}
                />
            </Box>
        </>
    );
}

// ==============================
// Componente Row
// ==============================
function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | React.ReactNode | null | undefined;
}) {
    if (value == null || value === "" || (typeof value === "number" && isNaN(value))) {
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
// Helpers
// ==============================
function formatCurrency(value: number | undefined | null): string {
    if (value == null || isNaN(value)) return "R$ 0,00";
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
