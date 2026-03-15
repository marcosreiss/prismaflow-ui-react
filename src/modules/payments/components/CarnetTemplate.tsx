import { Box, Divider, Paper, Typography } from "@mui/material";
import { forwardRef } from "react";
import formatDateBR from "@/utils/format-date";
import type { PaymentDetails } from "../types";
import type { PaymentInstallmentItem } from "../types";

const PAGE_PADDING_MM = 10;
const SECTION_HEIGHT_MM = (297 - PAGE_PADDING_MM * 2) / 4;

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
                    padding: `${PAGE_PADDING_MM}mm`,
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10pt",
                    color: "#000",
                    "@media print": { padding: 0, margin: 0 },
                }}
            >
                <Box
                    sx={{
                        height: `${SECTION_HEIGHT_MM}mm`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: coverLogoSrc ? "space-between" : "center",
                        border: "2px solid #000",
                        borderRadius: 0,
                        p: 2.25,
                        color: "#000",
                        backgroundColor: "#fff",
                        pageBreakInside: "avoid",
                    }}
                >
                    <Box>
                        <Typography variant="overline" sx={{ letterSpacing: "0.28em", fontSize: "0.68rem" }}>
                            CARNÊ DE PAGAMENTO
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ mt: 1, maxWidth: "70%", lineHeight: 1.1 }}>
                            Plano de parcelas da venda #{saleId}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            Cliente: {clientName}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            alignSelf: "center",
                            width: "100%",
                            maxWidth: 210,
                            aspectRatio: "16 / 9",
                            overflow: "hidden",
                            backgroundColor: "#fff",
                            border: coverLogoSrc ? "1px solid #d1d5db" : "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 0,
                            my: coverLogoSrc ? 1.5 : 0,
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
                            gap: 1,
                        }}
                    >
                        <CoverStat label="Valor total" value={formatCurrency(totalAmount)} />
                        <CoverStat label="Parcelas" value={`${installments.length}x`} />
                        <CoverStat label="Emitido em" value={new Date().toLocaleDateString("pt-BR")} />
                    </Box>
                </Box>

                {installments.map((installment, index) => (
                    <Box key={installment.id} sx={{ pageBreakInside: "avoid" }}>
                        <Paper elevation={0} sx={{ border: "2px solid #000", overflow: "hidden" }}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr",
                                    height: `${SECTION_HEIGHT_MM}mm`,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 1.1,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "0.74rem" }}>
                                            1a VIA - CLIENTE
                                        </Typography>
                                        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "0.74rem" }}>
                                            PARCELA {installment.sequence}/{installments.length}
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 0.5 }} />

                                    <Box sx={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 0.35 }}>
                                        <DetailItem label="Cliente" value={clientName} />
                                        <DetailItem label="Venda" value={`#${saleId}`} />
                                        <DetailItem label="Vencimento" value={formatDate(installment.dueDate)} emphasis />
                                        <DetailItem label="Valor" value={formatCurrency(installment.amount)} highlight />
                                    </Box>

                                    <Box sx={{ mt: 1, pt: 0.6, borderTop: "1px solid #ccc" }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.64rem" }}>
                                            Data do Pagamento: ___/___/_____ | Assinatura: _____________________
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        p: 0.9,
                                        backgroundColor: "#f8fafc",
                                        borderLeft: "2px dashed #999",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" sx={{ fontSize: "0.62rem", lineHeight: 1 }}>
                                            2a VIA - LOJA
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            display="block"
                                            mb={0.5}
                                            sx={{ fontSize: "0.58rem", lineHeight: 1 }}
                                        >
                                            Controle interno
                                        </Typography>

                                        <StackedItem label="Parcela" value={`${installment.sequence}/${installments.length}`} />
                                        <StackedItem label="Cliente" value={clientName} />
                                        <StackedItem label="Venda" value={`#${saleId}`} />
                                        <StackedItem label="Vencimento" value={formatDate(installment.dueDate)} />
                                        <StackedItem label="Valor" value={formatCurrency(installment.amount)} highlight />
                                    </Box>

                                    <Box sx={{ pt: 0.6, mt: 0.5, borderTop: "1px solid #d1d5db" }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.58rem", lineHeight: 1 }}>
                                            Recebido por: __________________
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        {(index === 2 || (index > 2 && (index - 2) % 4 === 0)) && index !== installments.length - 1 && (
                            <Box sx={{ pageBreakAfter: "always" }} />
                        )}
                    </Box>
                ))}
            </Box>
        );
    }
);

function CoverStat({ label, value }: { label: string; value: string }) {
    return (
        <Box
            sx={{
                p: 0.9,
                border: "1px solid #d1d5db",
            }}
        >
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.62rem", lineHeight: 1 }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={700}>
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
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem", lineHeight: 1 }}>
                {label}:
            </Typography>
            <Typography
                variant="caption"
                fontWeight="bold"
                color={emphasis ? "error" : highlight ? "primary" : "text.primary"}
                sx={{ fontSize: highlight ? "0.84rem" : "0.72rem", lineHeight: 1.15 }}
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
        <Box sx={{ mb: 0.35 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.54rem", lineHeight: 1 }}>
                {label}
            </Typography>
            <Typography
                variant="caption"
                fontWeight={highlight ? 700 : 600}
                color={highlight ? "primary" : "text.primary"}
                sx={{ fontSize: highlight ? "0.66rem" : "0.6rem", lineHeight: 1.05 }}
            >
                {value}
            </Typography>
        </Box>
    );
}

CarnetTemplate.displayName = "CarnetTemplate";
