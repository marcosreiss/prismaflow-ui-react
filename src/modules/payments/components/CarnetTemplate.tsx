import { Box, Typography, Divider, Paper } from "@mui/material";
import { forwardRef } from "react";
import formatDateBR from "@/utils/format-date";
import type { PaymentDetails } from "../types";
import type { PaymentInstallmentItem } from "../types";

// ==============================
// Props
// ==============================
interface CarnetTemplateProps {
    payment: PaymentDetails;
}

// ==============================
// Componente do Carnê (para impressão)
// ==============================
export const CarnetTemplate = forwardRef<HTMLDivElement, CarnetTemplateProps>(
    ({ payment }, ref) => {
        // Achata todas as parcelas de todos os métodos INSTALLMENT
        const installments: PaymentInstallmentItem[] = payment.methods
            .filter((m) => m.method === "INSTALLMENT")
            .flatMap((m) => m.installmentItems);

        const clientName = payment.clientName ?? "Cliente";
        const saleId = payment.saleId;
        const totalAmount = payment.total;

        const formatCurrency = (value: number) =>
            value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

        const formatDate = (dateString: string | null) => {
            return formatDateBR(dateString);
        };

        return (
            <Box
                ref={ref}
                sx={{
                    width: "210mm",
                    minHeight: "297mm",
                    backgroundColor: "white",
                    padding: "10mm",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10pt",
                    color: "#000",
                    "@media print": { padding: 0, margin: 0 },
                }}
            >
                {/* Cabeçalho */}
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        CARNÊ DE PAGAMENTO
                    </Typography>
                    <Typography variant="body2">
                        Venda #{saleId} | Cliente: {clientName}
                    </Typography>
                    <Typography variant="body2">
                        Valor Total: {formatCurrency(totalAmount)} | Parcelas: {installments.length}x
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3, borderWidth: 2 }} />

                {/* Parcelas */}
                {installments.map((installment, index) => (
                    <Box key={installment.id} sx={{ pageBreakInside: "avoid", mb: 4 }}>
                        {/* 1ª VIA - CLIENTE */}
                        <Paper elevation={0} sx={{ border: "2px solid #000", p: 2, mb: 0.5 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    1ª VIA - CLIENTE
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    PARCELA {installment.sequence}/{installments.length}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Cliente:</Typography>
                                    <Typography variant="body2" fontWeight="bold">{clientName}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Venda:</Typography>
                                    <Typography variant="body2" fontWeight="bold">#{saleId}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Vencimento:</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="error">
                                        {formatDate(installment.dueDate)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Valor:</Typography>
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                        {formatCurrency(installment.amount)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #ccc" }}>
                                <Typography variant="caption" color="text.secondary">
                                    Data do Pagamento: ___/___/_____ | Assinatura: _____________________
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Linha de corte */}
                        <Box sx={{ borderTop: "2px dashed #999", my: 0.5, position: "relative" }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    position: "absolute",
                                    top: "-10px",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "white",
                                    px: 1,
                                    color: "#999",
                                }}
                            >
                                ✂ CORTE AQUI
                            </Typography>
                        </Box>

                        {/* 2ª VIA - LOJA */}
                        <Paper
                            elevation={0}
                            sx={{ border: "2px solid #000", p: 2, backgroundColor: "#f9f9f9" }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    2ª VIA - LOJA/CONTROLE
                                </Typography>
                                <Typography variant="body2" fontWeight="bold">
                                    PARCELA {installment.sequence}/{installments.length}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 1 }} />

                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Cliente:</Typography>
                                    <Typography variant="body2" fontWeight="bold">{clientName}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Venda:</Typography>
                                    <Typography variant="body2" fontWeight="bold">#{saleId}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Vencimento:</Typography>
                                    <Typography variant="body2" fontWeight="bold" color="error">
                                        {formatDate(installment.dueDate)}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Valor:</Typography>
                                    <Typography variant="h6" fontWeight="bold" color="primary">
                                        {formatCurrency(installment.amount)}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #ccc" }}>
                                <Typography variant="caption" color="text.secondary">
                                    Data do Pagamento: ___/___/_____ | Assinatura: _____________________
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Quebra de página a cada 2 parcelas */}
                        {(index + 1) % 2 === 0 && index !== installments.length - 1 && (
                            <Box sx={{ pageBreakAfter: "always" }} />
                        )}
                    </Box>
                ))}

                {/* Rodapé */}
                <Box sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid #ccc" }}>
                    <Typography variant="caption" color="text.secondary">
                        Emitido em {new Date().toLocaleDateString("pt-BR")} às{" "}
                        {new Date().toLocaleTimeString("pt-BR")}
                    </Typography>
                </Box>
            </Box>
        );
    }
);

CarnetTemplate.displayName = "CarnetTemplate";
