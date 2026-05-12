// src/modules/sales/components/salesForm/steps/ReviewStep.tsx
// Step 4: revisão completa dos dados da venda antes do submit
import { Box, Typography, Paper, Stack, Divider, Collapse, IconButton, Tooltip } from "@mui/material";
import { CheckCircle, Eye } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useGetClientById } from "@/modules/clients/hooks/useClient";
import { useGetPrescriptionById } from "@/modules/clients/hooks/usePrescription";
import type { SalePayload, SaleProductItem, SaleServiceItem } from "@/modules/sales/types/salesTypes";
import PrescriptionPreview from "@/modules/sales/components/salesForm/PrescriptionPreview";
import dayjs from "dayjs";


export default function ReviewStep() {
    const { watch } = useFormContext<SalePayload>();
    const [showRx, setShowRx] = useState(false);
    const [discount] = useState(0); // desconto vive localmente, alinhado com SaleSummary

    const clientId = watch("clientId");
    const saleDate = watch("saleDate");
    const prescriptionId = watch("prescriptionId");
    const productItems = watch("productItems") || [];
    const serviceItems = watch("serviceItems") || [];
    const protocol = watch("protocol");

    // Cálculo local — subtotal/total não existem mais no SalePayload
    const subtotal =
        productItems.reduce((acc, item: SaleProductItem) => {
            return acc + (item.product?.salePrice ?? 0) * (item.quantity ?? 1);
        }, 0) +
        serviceItems.reduce((acc, item: SaleServiceItem) => {
            return acc + (item.service?.price ?? 0);
        }, 0);

    const total = Math.max(0, subtotal - discount);

    const { data: clientResponse } = useGetClientById(clientId ?? undefined);
    const client = clientResponse?.data ?? null;

    const { data: prescriptionResponse } = useGetPrescriptionById(prescriptionId ?? undefined);
    const prescription = prescriptionResponse?.data ?? null;

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircle size={24} />
                Revisão Final
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Stack spacing={3}>
                    {/* DATA DA VENDA */}
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Data da Venda
                        </Typography>
                        <Typography variant="body2">
                            {dayjs(saleDate).format("DD/MM/YYYY")}
                        </Typography>
                    </Paper>

                    {/* CLIENTE */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {client?.name || "Não selecionado"}
                        </Typography>
                        {client?.phone01 && (
                            <Typography variant="body2" color="text.secondary">{client.phone01}</Typography>
                        )}
                    </Box>

                    {/* RECEITA */}
                    {prescription && (
                        <>
                            <Divider />
                            <Box>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="subtitle2" color="text.secondary">Receita</Typography>
                                    <Tooltip title={showRx ? "Ocultar" : "Visualizar receita"}>
                                        <IconButton size="small" onClick={() => setShowRx((prev) => !prev)}>
                                            <Eye size={16} />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {prescription.doctorName || "Médico não informado"} —{" "}
                                    {dayjs(prescription.prescriptionDate).format("DD/MM/YYYY")}
                                </Typography>
                                <Collapse in={showRx} timeout="auto" unmountOnExit>
                                    <Paper variant="outlined" sx={{ p: 2, mt: 1.5, borderRadius: 2 }}>
                                        <PrescriptionPreview prescription={prescription} />
                                    </Paper>
                                </Collapse>
                            </Box>
                        </>
                    )}

                    <Divider />

                    {/* PRODUTOS */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Produtos ({productItems.length})
                        </Typography>
                        {productItems.length === 0 && (
                            <Typography variant="body2" color="text.disabled">Nenhum produto adicionado</Typography>
                        )}
                        {productItems.map((item: SaleProductItem, index: number) => (
                            <Box key={item.id ?? index} sx={{ ml: 1, mt: 0.5 }}>
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

                    {/* SERVIÇOS */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                            Serviços ({serviceItems.length})
                        </Typography>
                        {serviceItems.length === 0 && (
                            <Typography variant="body2" color="text.disabled">Nenhum serviço adicionado</Typography>
                        )}
                        {serviceItems.map((item: SaleServiceItem, index: number) => (
                            <Typography key={item.id ?? index} variant="body2" color="text.secondary" sx={{ ml: 1, mt: 0.5 }}>
                                • {item.service?.name} —{" "}
                                {item.service?.price?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </Typography>
                        ))}
                    </Box>

                    {/* PROTOCOLO */}
                    {protocol && (
                        <>
                            <Divider />
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">Protocolo</Typography>
                                <Stack spacing={0.5} sx={{ ml: 1 }}>
                                    {protocol.book && (
                                        <Typography variant="body2">Livro: {protocol.book}</Typography>
                                    )}
                                    {protocol.page != null && (
                                        <Typography variant="body2">Página: {protocol.page}</Typography>
                                    )}
                                    {protocol.os && (
                                        <Typography variant="body2">OS: {protocol.os}</Typography>
                                    )}
                                </Stack>
                            </Box>
                        </>
                    )}

                    <Divider />

                    {/* RESUMO FINANCEIRO */}
                    <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="subtitle2" color="text.secondary">Subtotal</Typography>
                            <Typography variant="body1">
                                {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </Typography>
                        </Box>
                        {discount > 0 && (
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="subtitle2" color="text.secondary">Desconto</Typography>
                                <Typography variant="body1" color="error.main">
                                    -{discount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1, borderTop: 1, borderColor: "divider" }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" color="primary.main">
                                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}