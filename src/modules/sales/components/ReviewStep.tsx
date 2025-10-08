import {
    Box,
    Typography,
    Paper,
    Stack,
    Divider,
} from "@mui/material";
import { CheckCircle } from "lucide-react";
import type {
    ClientSummary,
    PrescriptionSummary,
    SaleProductItem,
    SaleServiceItem,
    CreateProtocolPayload,
} from "@/modules/sales/types/salesTypes";

interface ReviewStepProps {
    client?: ClientSummary | null;
    prescription?: PrescriptionSummary | null;
    productItems: SaleProductItem[];
    serviceItems: SaleServiceItem[];
    protocol?: CreateProtocolPayload | null;
    subtotal: number;
    discount: number;
    total: number;
}

export default function ReviewStep({
    client,
    prescription,
    productItems,
    serviceItems,
    protocol,
    subtotal,
    discount,
    total,
}: ReviewStepProps) {
    return (
        <Box>
            <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
                <CheckCircle size={24} />
                Revisão Final
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={3}>

                    {/* =======================
              🔹 CLIENTE E RECEITA
          ======================= */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Cliente
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {client?.name || "Não selecionado"}
                        </Typography>
                        {client?.phone01 && (
                            <Typography variant="body2" color="text.secondary">
                                {client.phone01}
                            </Typography>
                        )}

                        {prescription && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Receita
                                </Typography>
                                <Typography variant="body2">
                                    {prescription.doctorName
                                        ? `${prescription.doctorName} - `
                                        : ""}
                                    {new Date(prescription.prescriptionDate).toLocaleDateString("pt-BR")}
                                </Typography>
                            </Box>
                        )}
                    </Box>

                    <Divider />

                    {/* =======================
              🔹 PRODUTOS
          ======================= */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Produtos ({productItems.length})
                        </Typography>

                        {productItems.length === 0 && (
                            <Typography variant="body2" color="text.disabled">
                                Nenhum produto adicionado
                            </Typography>
                        )}

                        {productItems.map((item) => (
                            <Box key={item.id} sx={{ ml: 1, mt: 0.5 }}>
                                <Typography variant="body2" fontWeight="medium">
                                    • {item.product?.name || "Produto sem nome"} x {item.quantity}
                                </Typography>
                                {item.frameDetails && (
                                    <Typography variant="caption" color="text.secondary">
                                        Armação: {item.frameDetails.reference || "—"} |{" "}
                                        {item.frameDetails.color || "—"} |{" "}
                                        {item.frameDetails.material}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>

                    <Divider />

                    {/* =======================
              🔹 SERVIÇOS
          ======================= */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Serviços ({serviceItems.length})
                        </Typography>

                        {serviceItems.length === 0 && (
                            <Typography variant="body2" color="text.disabled">
                                Nenhum serviço adicionado
                            </Typography>
                        )}

                        {serviceItems.map((item) => (
                            <Typography
                                key={item.id}
                                variant="body2"
                                color="text.secondary"
                                sx={{ ml: 1, mt: 0.5 }}
                            >
                                • {item.service?.name} —{" "}
                                {item.service?.price?.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Typography>
                        ))}
                    </Box>

                    <Divider />

                    {/* =======================
              🔹 PROTOCOLO
          ======================= */}
                    {protocol && (
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Protocolo
                            </Typography>
                            <Stack spacing={0.5} sx={{ ml: 1 }}>
                                {protocol.recordNumber && (
                                    <Typography variant="body2">
                                        Nº Registro: {protocol.recordNumber}
                                    </Typography>
                                )}
                                {protocol.book && (
                                    <Typography variant="body2">Livro: {protocol.book}</Typography>
                                )}
                                {protocol.page != null && (
                                    <Typography variant="body2">Página: {protocol.page}</Typography>
                                )}
                                {protocol.os && (
                                    <Typography variant="body2">OS: {protocol.os}</Typography>
                                )}
                                <Typography variant="body2" color={protocol.isActive ? "success.main" : "error.main"}>
                                    {protocol.isActive ? "Ativo" : "Inativo"}
                                </Typography>
                            </Stack>
                        </Box>
                    )}

                    <Divider />

                    {/* =======================
              🔹 RESUMO FINANCEIRO
          ======================= */}
                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Subtotal
                            </Typography>
                            <Typography variant="body1">
                                {subtotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Desconto
                            </Typography>
                            <Typography variant="body1" color="error.main">
                                -{(discount || 0).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                pt: 1,
                                borderTop: 1,
                                borderColor: "divider",
                            }}
                        >
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" color="primary.main">
                                {total.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
