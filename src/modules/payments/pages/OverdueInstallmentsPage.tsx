// pages/OverdueInstallmentsPage.tsx
import {
    Paper,
    Box,
    Typography,
    Alert,
    Stack,
    Chip,
    Card,
    CardContent,
} from "@mui/material";
import { AlertCircle, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { useState } from "react";
import PFTable, { type ColumnDef } from "@/components/crud/PFTable";
import PFTopToolbar from "@/components/crud/PFTopToolbar";
import PayInstallmentDialog from "../components/PayInstallmentDialog";
import type {
    PaymentInstallment,
    InstallmentListItem,
} from "../types/paymentTypes";
import { useGetOverdueInstallments, usePayInstallment } from "../hooks/usePayments";

// ==============================
// 🔹 Página de Parcelas Vencidas
// ==============================
export default function OverdueInstallmentsPage() {
    // ==============================
    // 🔹 Estados
    // ==============================
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [payDialogOpen, setPayDialogOpen] = useState(false);
    const [selectedInstallment, setSelectedInstallment] = useState<PaymentInstallment | null>(null);

    // ==============================
    // 🔹 Queries e Mutations
    // ==============================
    const {
        data: apiResponse,
        isLoading,
        isFetching,
        error,
        refetch
    } = useGetOverdueInstallments({ page, limit });

    const { mutateAsync: payInstallment, isPending: isPaying } = usePayInstallment();

    // ==============================
    // 🔹 Dados da API
    // ==============================
    const overdueData = apiResponse?.data;
    const installments = overdueData?.content || [];
    const stats = overdueData?.stats;
    const total = overdueData?.totalElements || 0;

    // ==============================
    // 🔹 Handlers para pagar parcela
    // ==============================
    const handleOpenPayDialog = (installmentId: number) => {
        const installment = installments.find((i: InstallmentListItem) => i.id === installmentId);
        if (installment) {
            setSelectedInstallment(installment as PaymentInstallment);
            setPayDialogOpen(true);
        }
    };

    const handleConfirmPay = async (installmentId: number, paidAmount: number, paidAt?: string) => {
        try {
            await payInstallment({
                id: installmentId,
                data: { paidAmount, paidAt }
            });
            setPayDialogOpen(false);
            setSelectedInstallment(null);
            refetch();
        } catch (error) {
            console.error("Erro ao pagar parcela:", error);
        }
    };

    const handleClosePayDialog = () => {
        setPayDialogOpen(false);
        setSelectedInstallment(null);
    };

    // ==============================
    // 🔹 Colunas da tabela
    // ==============================
    const columns: ColumnDef<InstallmentListItem>[] = [
        {
            key: "sequence",
            label: "Parcela",
            width: 80,
            render: (row) => `#${row.sequence}`,
        },
        {
            key: "clientName",
            label: "Cliente",
            render: (row) => row.clientName || row.payment?.sale?.client?.name || "-",
        },
        {
            key: "clientPhone",
            label: "Telefone",
            render: (row) => row.clientPhone || row.payment?.sale?.client?.phone01 || "-",
        },
        {
            key: "amount",
            label: "Valor",
            render: (row) => formatCurrency(row.amount),
        },
        {
            key: "paidAmount",
            label: "Pago",
            render: (row) => formatCurrency(row.paidAmount),
        },
        {
            key: "remainingAmount",
            label: "Restante",
            render: (row) => formatCurrency(row.remainingAmount || (row.amount - row.paidAmount)),
        },
        {
            key: "dueDate",
            label: "Vencimento",
            render: (row) => formatDate(row.dueDate),
        },
        {
            key: "daysOverdue",
            label: "Dias Venc.",
            width: 100,
            render: (row) => {
                const days = row.daysOverdue || calculateDaysOverdue(row.dueDate);
                return (
                    <Chip
                        label={`${days} dias`}
                        color="error"
                        size="small"
                        icon={<AlertCircle size={14} />}
                    />
                );
            },
        },
    ];

    // ==============================
    // 🔹 Calcular dias de atraso
    // ==============================
    const calculateDaysOverdue = (dueDate: string | null): number => {
        if (!dueDate) return 0;
        const due = new Date(dueDate);
        const today = new Date();
        const diff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, diff);
    };

    // ==============================
    // 🔹 Helpers de formatação
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
    // 🔹 Render: Estado de erro
    // ==============================
    if (error) {
        return (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Alert severity="error">
                    Erro ao carregar parcelas vencidas: {error.message}
                </Alert>
            </Paper>
        );
    }

    // ==============================
    // 🔹 Render principal
    // ==============================
    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 2,
                    borderColor: "grey.200",
                    backgroundColor: "background.paper",
                    p: 3,
                }}
            >
                {/* ========================================= */}
                {/* 🔹 Top Toolbar */}
                {/* ========================================= */}
                <PFTopToolbar
                    title="Parcelas Vencidas"
                    onRefresh={() => refetch()}
                />

                {/* ========================================= */}
                {/* 🔹 Cards de Estatísticas */}
                {/* ========================================= */}
                {stats && (
                    <Box
                        sx={{
                            mb: 3,
                            mt: 2,
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        {/* Total de Parcelas Vencidas */}
                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StatsCard
                                title="Total Vencidas"
                                value={stats.totalOverdue}
                                icon={<AlertCircle size={24} />}
                                color="error"
                            />
                        </Box>

                        {/* Valor Total em Atraso */}
                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StatsCard
                                title="Valor Total"
                                value={formatCurrency(stats.totalAmount)}
                                icon={<DollarSign size={24} />}
                                color="warning"
                            />
                        </Box>

                        {/* Média de Dias em Atraso */}
                        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                            <StatsCard
                                title="Média de Atraso"
                                value={`${Math.round(stats.averageDaysOverdue)} dias`}
                                icon={<Calendar size={24} />}
                                color="info"
                            />
                        </Box>
                    </Box>
                )}

                {/* ========================================= */}
                {/* 🔹 Alerta Informativo */}
                {/* ========================================= */}
                {installments.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 3 }} icon={<AlertCircle />}>
                        <Typography variant="body2" fontWeight={600}>
                            Atenção: {installments.length} parcela{installments.length > 1 ? 's' : ''} vencida{installments.length > 1 ? 's' : ''}
                        </Typography>
                        <Typography variant="body2">
                            Entre em contato com os clientes para regularizar os pagamentos em atraso.
                        </Typography>
                    </Alert>
                )}

                {/* ========================================= */}
                {/* 🔹 Tabela de Parcelas Vencidas */}
                {/* ========================================= */}
                {installments.length > 0 ? (
                    <PFTable
                        columns={columns}
                        rows={installments}
                        total={total}
                        page={page}
                        pageSize={limit}
                        loading={isLoading || isFetching}
                        onPageChange={(newPage) => setPage(newPage)}
                        onPageSizeChange={(newLimit) => setLimit(newLimit)}
                        getRowId={(row) => row.id}
                        onRowClick={(_, row) => handleOpenPayDialog(row.id)}
                    />
                ) : (
                    <Alert severity="success" icon={<TrendingUp />}>
                        <Typography variant="body1" fontWeight={600}>
                            Parabéns! Não há parcelas vencidas no momento.
                        </Typography>
                        <Typography variant="body2">
                            Todos os pagamentos estão em dia.
                        </Typography>
                    </Alert>
                )}
            </Paper>

            {/* ========================================= */}
            {/* 🔹 Dialog: Pagar Parcela */}
            {/* ========================================= */}
            <PayInstallmentDialog
                open={payDialogOpen}
                installment={selectedInstallment}
                onClose={handleClosePayDialog}
                onConfirm={handleConfirmPay}
                loading={isPaying}
            />
        </>
    );
}

// ==============================
// 🔹 Componente: Card de Estatísticas
// ==============================
interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: "error" | "warning" | "info" | "success";
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: `${color}.light`,
                bgcolor: `${color}.50`,
                height: '100%',
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            bgcolor: `${color}.main`,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                            {value}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}
