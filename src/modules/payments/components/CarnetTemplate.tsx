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
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        border: "2px solid #000",
                        borderRadius: 0,
                        p: 3,
                        mb: 2.5,
                        color: "#000",
                        backgroundColor: "#fff",
                        pageBreakInside: "avoid",
                    }}
                >
                    <Box>
                        <Typography variant="overline" sx={{ letterSpacing: "0.3em" }}>
                            CARNÊ DE PAGAMENTO
                        </Typography>
                        <Typography variant="h4" fontWeight={800} sx={{ mt: 1.5, maxWidth: "70%" }}>
                            Plano de parcelas da venda #{saleId}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1.5 }}>
                            Cliente: {clientName}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            alignSelf: "center",
                            width: "100%",
                            maxWidth: 420,
                            aspectRatio: "16 / 9",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            border: coverLogoSrc ? "1px solid #d1d5db" : "1px dashed #d1d5db",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 0,
                            my: 2.5,
                        }}
                    >
                        {coverLogoSrc ? (
                            <Box
                                component="img"
                                src={coverLogoSrc}
                                alt="Logo da ótica"
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : null}
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

                {installments.map((installment, index) => (
                    <Box key={installment.id} sx={{ pageBreakInside: "avoid", mb: 1.5 }}>
                        <Paper elevation={0} sx={{ border: "2px solid #000", overflow: "hidden" }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr",
                                    minHeight: 124,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1.75,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            1a VIA - CLIENTE
                                        </Typography>
                                        <Typography variant="body2" fontWeight="bold">
                                            PARCELA {installment.sequence}/{installments.length}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <Box sx={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 0.75 }}>
                                        <DetailItem label="Cliente" value={clientName} />
                                        <DetailItem label="Venda" value={`#${saleId}`} />
                                        <DetailItem label="Vencimento" value={formatDate(installment.dueDate)} emphasis />
                                        <DetailItem label="Valor" value={formatCurrency(installment.amount)} highlight />
                                    </Box>

                                    <Box sx={{ mt: 2, pt: 1.25, borderTop: "1px solid #ccc" }}>
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
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "0.72rem" }}>
                                            2a VIA - LOJA
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            mb={1}
                                            sx={{ fontSize: "0.68rem" }}
                                        >
                                            Controle interno
                                        </Typography>

                                        <StackedItem label="Parcela" value={`${installment.sequence}/${installments.length}`} />
                                        <StackedItem label="Cliente" value={clientName} />
                                        <StackedItem label="Venda" value={`#${saleId}`} />
                                        <StackedItem label="Vencimento" value={formatDate(installment.dueDate)} />
                                        <StackedItem label="Valor" value={formatCurrency(installment.amount)} highlight />
                                    </Box>

                                    <Box sx={{ pt: 1.25, mt: 1, borderTop: "1px solid #d1d5db" }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.68rem" }}>
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
                p: 1.5,
                border: "1px solid #d1d5db",
            }}
        >
            <Typography variant="caption" color="text.secondary">
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
                variant={highlight ? "body1" : "body2"}
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
            <Typography
                variant="caption"
                fontWeight={highlight ? 700 : 600}
                color={highlight ? "primary" : "text.primary"}
                sx={{ fontSize: "0.72rem" }}
            >
                {value}
            </Typography>
        </Box>
    );
}

CarnetTemplate.displayName = "CarnetTemplate";
