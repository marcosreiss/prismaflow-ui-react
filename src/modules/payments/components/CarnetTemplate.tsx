import { Box, Divider, Paper, Typography } from "@mui/material";
import { forwardRef } from "react";
import formatDateBR from "@/utils/format-date";
import type { PaymentDetails } from "../types";
import type { PaymentInstallmentItem } from "../types";

interface CarnetTemplateProps {
    payment: PaymentDetails;
    coverLogoSrc?: string | null;
}

export const CarnetTemplate = forwardRef<HTMLDivElement, CarnetTemplateProps>(
    ({ payment, coverLogoSrc }, ref) => {
        const installments: PaymentInstallmentItem[] = payment.methods
            .filter((m) => m.method === "INSTALLMENT")
            .flatMap((m) => m.installmentItems);

        const clientName = payment.clientName ?? "Cliente";
        const saleId = payment.saleId;
        const totalAmount = payment.total;

        const formatCurrency = (value: number) =>
            value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

        const formatDate = (dateString: string | null) => formatDateBR(dateString);

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
                <Box
                    sx={{
                        minHeight: "277mm",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        background:
                            "linear-gradient(160deg, #0f172a 0%, #1d4ed8 45%, #dbeafe 100%)",
                        color: "#fff",
                        borderRadius: 3,
                        p: 5,
                    }}
                >
                    <Box>
                        <Typography variant="overline" sx={{ letterSpacing: "0.3em", opacity: 0.9 }}>
                            CARNÊ DE PAGAMENTO
                        </Typography>
                        <Typography variant="h3" fontWeight={800} sx={{ mt: 2, maxWidth: "70%" }}>
                            Plano de parcelas da venda #{saleId}
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 2, opacity: 0.92 }}>
                            Cliente: {clientName}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            alignSelf: "center",
                            width: "100%",
                            maxWidth: 360,
                            aspectRatio: "4 / 3",
                            borderRadius: 3,
                            overflow: "hidden",
                            backgroundColor: "rgba(255,255,255,0.14)",
                            border: "1px solid rgba(255,255,255,0.24)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: coverLogoSrc ? 0 : 3,
                        }}
                    >
                        {coverLogoSrc ? (
                            <Box
                                component="img"
                                src={coverLogoSrc}
                                alt="Logo da ótica"
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                                Imprimir sem logo
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 2,
                        }}
                    >
                        <CoverStat label="Valor total" value={formatCurrency(totalAmount)} />
                        <CoverStat label="Parcelas" value={`${installments.length}x`} />
                        <CoverStat label="Emitido em" value={new Date().toLocaleDateString("pt-BR")} />
                    </Box>
                </Box>

                <Box sx={{ pageBreakAfter: "always" }} />

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

                {installments.map((installment, index) => (
                    <Box key={installment.id} sx={{ pageBreakInside: "avoid", mb: 2.5 }}>
                        <Paper elevation={0} sx={{ border: "2px solid #000", overflow: "hidden" }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr",
                                    minHeight: 180,
                                }}
                            >
                                <Box sx={{ p: 2.25 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            1a VIA - CLIENTE
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            PARCELA {installment.sequence}/{installments.length}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 1.25 }}>
                                        <DetailItem label="Cliente" value={clientName} />
                                        <DetailItem label="Venda" value={`#${saleId}`} />
                                        <DetailItem label="Vencimento" value={formatDate(installment.dueDate)} emphasis />
                                        <DetailItem label="Valor" value={formatCurrency(installment.amount)} highlight />
                                    </Box>

                                    <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #ccc" }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Data do Pagamento: ___/___/_____ | Assinatura: _____________________
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: "#f8fafc",
                                        borderLeft: "2px dashed #999",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            2a VIA - LOJA
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                                            Controle interno
                                        </Typography>

                                        <StackedItem label="Parcela" value={`${installment.sequence}/${installments.length}`} />
                                        <StackedItem label="Cliente" value={clientName} />
                                        <StackedItem label="Venda" value={`#${saleId}`} />
                                        <StackedItem label="Vencimento" value={formatDate(installment.dueDate)} />
                                        <StackedItem label="Valor" value={formatCurrency(installment.amount)} highlight />
                                    </Box>

                                    <Box sx={{ pt: 1.5, borderTop: "1px solid #d1d5db" }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Recebido por: __________________
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        {(index + 1) % 4 === 0 && index !== installments.length - 1 && (
                            <Box sx={{ pageBreakAfter: "always" }} />
                        )}
                    </Box>
                ))}

                <Box sx={{ textAlign: "center", mt: 4, pt: 2, borderTop: "1px solid #ccc" }}>
                    <Typography variant="caption" color="text.secondary">
                        Emitido em {new Date().toLocaleDateString("pt-BR")} as{" "}
                        {new Date().toLocaleTimeString("pt-BR")}
                    </Typography>
                </Box>
            </Box>
        );
    }
);

function CoverStat({ label, value }: { label: string; value: string }) {
    return (
        <Box
            sx={{
                borderRadius: 2,
                p: 2,
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
            }}
        >
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
                {label}
            </Typography>
            <Typography variant="body1" fontWeight={700}>
                {value}
            </Typography>
        </Box>
    );
}

function DetailItem({
    label,
    value,
    emphasis = false,
    highlight = false,
}: {
    label: string;
    value: string;
    emphasis?: boolean;
    highlight?: boolean;
}) {
    return (
        <Box>
            <Typography variant="caption" color="text.secondary">
                {label}:
            </Typography>
            <Typography
                variant={highlight ? "h6" : "body2"}
                fontWeight="bold"
                color={emphasis ? "error" : highlight ? "primary" : "text.primary"}
            >
                {value}
            </Typography>
        </Box>
    );
}

function StackedItem({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" display="block">
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={highlight ? 700 : 600} color={highlight ? "primary" : "text.primary"}>
                {value}
            </Typography>
        </Box>
    );
}

CarnetTemplate.displayName = "CarnetTemplate";
