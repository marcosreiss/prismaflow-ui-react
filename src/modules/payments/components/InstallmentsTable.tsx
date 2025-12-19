// components/InstallmentsTable.tsx
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Box,
    Typography,
} from "@mui/material";
import { DollarSign, Pencil, AlertCircle } from "lucide-react";
import type { PaymentInstallment } from "../types/paymentTypes";

// ==============================
// 🔹 Props
// ==============================
interface InstallmentsTableProps {
    installments: PaymentInstallment[];
    onPay?: (installmentId: number, remainingAmount: number) => void;
    onEdit?: (installment: PaymentInstallment) => void;
    loading?: boolean;
    readOnly?: boolean;
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function InstallmentsTable({
    installments,
    onPay,
    onEdit,
    loading = false,
    readOnly = false,
}: InstallmentsTableProps) {
    // ==============================
    // 🔹 Helper: Calcular status da parcela
    // ==============================
    const getInstallmentStatus = (installment: PaymentInstallment) => {
        const isPaid = installment.paidAmount >= installment.amount;
        const isPartiallyPaid = installment.paidAmount > 0 && installment.paidAmount < installment.amount;

        // Verificar se está vencida (apenas se não estiver totalmente paga)
        const isOverdue = !isPaid && installment.dueDate
            ? new Date(installment.dueDate) < new Date()
            : false;

        return { isPaid, isPartiallyPaid, isOverdue };
    };

    // ==============================
    // 🔹 Helper: Calcular valor restante
    // ==============================
    const getRemainingAmount = (installment: PaymentInstallment) => {
        return Math.max(0, installment.amount - installment.paidAmount);
    };

    // ==============================
    // 🔹 Helper: Formatar moeda
    // ==============================
    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    // ==============================
    // 🔹 Helper: Formatar data
    // ==============================
    const formatDate = (dateString: string | null) => {
        if (!dateString) return "-";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "-";
            return date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return "-";
        }
    };

    // ==============================
    // 🔹 Render: Estado vazio
    // ==============================
    if (!installments || installments.length === 0) {
        return (
            <Box
                sx={{
                    p: 4,
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper"
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Nenhuma parcela encontrada
                </Typography>
            </Box>
        );
    }

    // ==============================
    // 🔹 Render: Tabela
    // ==============================
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
            }}
        >
            <Table size="small">
                {/* ========================================= */}
                {/* 🔹 Cabeçalho */}
                {/* ========================================= */}
                <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell sx={{ fontWeight: 600, width: 80 }}>
                            #
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Valor
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Pago
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Restante
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Vencimento
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                            Status
                        </TableCell>
                        {!readOnly && (
                            <TableCell sx={{ fontWeight: 600, width: 120 }} align="right">
                                Ações
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>

                {/* ========================================= */}
                {/* 🔹 Corpo da tabela */}
                {/* ========================================= */}
                <TableBody>
                    {installments.map((installment) => {
                        const { isPaid, isPartiallyPaid, isOverdue } = getInstallmentStatus(installment);
                        const remainingAmount = getRemainingAmount(installment);

                        return (
                            <TableRow
                                key={installment.id}
                                sx={{
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                    // Destacar parcelas vencidas
                                    ...(isOverdue && {
                                        bgcolor: "error.50",
                                    }),
                                    // Destacar parcelas pagas
                                    ...(isPaid && {
                                        bgcolor: "success.50",
                                    }),
                                }}
                            >
                                {/* Sequência */}
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {installment.sequence}
                                    </Typography>
                                </TableCell>

                                {/* Valor */}
                                <TableCell>
                                    <Typography variant="body2">
                                        {formatCurrency(installment.amount)}
                                    </Typography>
                                </TableCell>

                                {/* Valor Pago */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        color={isPartiallyPaid ? "warning.main" : "text.primary"}
                                        fontWeight={isPartiallyPaid ? 600 : 400}
                                    >
                                        {formatCurrency(installment.paidAmount)}
                                    </Typography>
                                </TableCell>

                                {/* Valor Restante */}
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        color={remainingAmount > 0 ? "error.main" : "success.main"}
                                        fontWeight={remainingAmount > 0 ? 600 : 400}
                                    >
                                        {formatCurrency(remainingAmount)}
                                    </Typography>
                                </TableCell>

                                {/* Data de Vencimento */}
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <Typography variant="body2">
                                            {formatDate(installment.dueDate)}
                                        </Typography>
                                        {isOverdue && (
                                            <Tooltip title="Parcela vencida">
                                                <AlertCircle size={14} color="#d32f2f" />
                                            </Tooltip>
                                        )}
                                    </Box>
                                </TableCell>

                                {/* Status */}
                                <TableCell>
                                    {isPaid ? (
                                        <Chip
                                            label="Paga"
                                            color="success"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    ) : isPartiallyPaid ? (
                                        <Chip
                                            label="Parcial"
                                            color="warning"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    ) : isOverdue ? (
                                        <Chip
                                            label="Vencida"
                                            color="error"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    ) : (
                                        <Chip
                                            label="Pendente"
                                            color="default"
                                            size="small"
                                            sx={{ fontWeight: 500 }}
                                        />
                                    )}
                                </TableCell>

                                {/* Ações */}
                                {!readOnly && (
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", gap: 0.5, justifyContent: "flex-end" }}>
                                            {/* Botão Pagar - apenas para parcelas não totalmente pagas */}
                                            {!isPaid && onPay && (
                                                <Tooltip title={`Pagar ${formatCurrency(remainingAmount)}`}>
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => onPay(installment.id, remainingAmount)}
                                                        disabled={loading}
                                                    >
                                                        <DollarSign size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            {/* Botão Editar */}
                                            {onEdit && (
                                                <Tooltip title="Editar parcela">
                                                    <IconButton
                                                        size="small"
                                                        color="default"
                                                        onClick={() => onEdit(installment)}
                                                        disabled={loading}
                                                    >
                                                        <Pencil size={16} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
