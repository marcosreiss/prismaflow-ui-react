import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    Chip,
    Paper,
} from "@mui/material";
import { X } from "lucide-react";
import type { Payment } from "@/types/paymentTypes";
import { PaymentMethodLabels, PaymentStatusLabels } from "@/types/paymentTypes";

type PaymentViewDrawerProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    data?: Payment | null;
};

export default function PaymentViewDrawer({
    open,
    onClose,
    title = "Detalhes do Pagamento",
    data,
}: PaymentViewDrawerProps) {
    if (!data) return null;

    const money = (val?: number) =>
        (val ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
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
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Conteúdo */}
            <Paper
                sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "grey.50",
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
                elevation={0}
            >
                {/* Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Pagamento #{data.id}
                    </Typography>
                    <Chip
                        label={PaymentStatusLabels[data.status]}
                        color={
                            data.status === "CONFIRMED"
                                ? "success"
                                : data.status === "CANCELED"
                                    ? "default"
                                    : "warning"
                        }
                        variant={data.status === "PENDING" ? "outlined" : "filled"}
                        size="small"
                    />
                </Box>

                <Divider />

                {/* Campos em grid */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "150px 1fr",
                        rowGap: 1.5,
                        columnGap: 2,
                    }}
                >
                    <Typography color="text.secondary">Cliente</Typography>
                    <Typography>{data.clientName}</Typography>

                    <Typography color="text.secondary">Método</Typography>
                    <Typography>{PaymentMethodLabels[data.method]}</Typography>

                    <Typography color="text.secondary">Status</Typography>
                    <Typography>{PaymentStatusLabels[data.status]}</Typography>

                    <Typography color="text.secondary">Valor Total</Typography>
                    <Typography>{money(data.total)}</Typography>

                    <Typography color="text.secondary">Desconto</Typography>
                    <Typography>{money(data.discount)}</Typography>

                    <Typography color="text.secondary">Entrada</Typography>
                    <Typography>{money(data.downPayment)}</Typography>

                    <Typography color="text.secondary">Total Pago</Typography>
                    <Typography>{money(data.paidAmount)}</Typography>

                    <Typography color="text.secondary">Parcelas</Typography>
                    <Typography>
                        {data.installmentsTotal ?? 0} (pagas: {data.installmentsPaid ?? 0})
                    </Typography>

                    <Typography color="text.secondary">1ª Parcela</Typography>
                    <Typography>{data.firstDueDate ?? "-"}</Typography>

                    <Typography color="text.secondary">Último Pagamento</Typography>
                    <Typography>{data.lastPaymentAt ?? "-"}</Typography>

                    <Typography color="text.secondary">Criado em</Typography>
                    <Typography>
                        {new Date(data.createdAt).toLocaleString("pt-BR")}
                    </Typography>

                    <Typography color="text.secondary">Atualizado em</Typography>
                    <Typography>
                        {new Date(data.updatedAt).toLocaleString("pt-BR")}
                    </Typography>
                </Box>
            </Paper>
        </Drawer>
    );
}
