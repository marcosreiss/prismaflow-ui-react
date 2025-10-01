import { Box, Chip, Typography, Divider } from "@mui/material";
import { PaymentMethodLabels, PaymentStatusLabels } from "@/types/paymentTypes";
import type { Payment } from "@/types/paymentTypes";
import { usePaymentView } from "@/hooks/payment/usePaymentView";

export default function PaymentView({ payment }: { payment: Payment }) {
    const { money, getSaldo } = usePaymentView();
    const saldo = getSaldo(payment);

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6">Pagamento #{payment.id}</Typography>
                <Chip
                    size="small"
                    label={PaymentStatusLabels[payment.status]}
                    color={
                        payment.status === "CONFIRMED"
                            ? "success"
                            : payment.status === "CANCELED"
                                ? "default"
                                : "warning"
                    }
                    variant={payment.status === "PENDING" ? "outlined" : "filled"}
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "160px 1fr",
                    rowGap: 1.2,
                    columnGap: 2,
                }}
            >
                <Typography variant="body2" color="text.secondary">Venda</Typography>
                <Typography>{payment.sale?.id ?? "-"}</Typography>

                <Typography variant="body2" color="text.secondary">Método</Typography>
                <Typography>{PaymentMethodLabels[payment.method]}</Typography>

                <Typography variant="body2" color="text.secondary">Total</Typography>
                <Typography>{money(payment.total)}</Typography>

                <Typography variant="body2" color="text.secondary">Desconto</Typography>
                <Typography>{money(payment.discount)}</Typography>

                <Typography variant="body2" color="text.secondary">Entrada</Typography>
                <Typography>{money(payment.downPayment)}</Typography>

                <Typography variant="body2" color="text.secondary">Pago</Typography>
                <Typography>{money(payment.paidAmount)}</Typography>

                <Typography variant="body2" color="text.secondary">Saldo</Typography>
                <Typography>{money(saldo)}</Typography>

                <Typography variant="body2" color="text.secondary">Parcelas</Typography>
                <Typography>
                    {payment.installmentsTotal ?? 0} (pagas: {payment.installmentsPaid ?? 0})
                </Typography>

                <Typography variant="body2" color="text.secondary">1ª Parcela</Typography>
                <Typography>{payment.firstDueDate ?? "-"}</Typography>

                <Typography variant="body2" color="text.secondary">Último Pagamento</Typography>
                <Typography>{payment.lastPaymentAt ?? "-"}</Typography>

                <Typography variant="body2" color="text.secondary">Criado em</Typography>
                <Typography>{new Date(payment.createdAt).toLocaleString()}</Typography>

                <Typography variant="body2" color="text.secondary">Atualizado em</Typography>
                <Typography>{new Date(payment.updatedAt).toLocaleString()}</Typography>
            </Box>
        </Box>
    );
}
