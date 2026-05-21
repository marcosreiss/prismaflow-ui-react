// src/modules/sales/components/salesForm/SaleSummary.tsx
import { useFormContext } from "react-hook-form";
import { useGetPrescriptionById } from "@/modules/clients/hooks/usePrescription";
import CurrencyInput from "@/components/imask/CurrencyInput";
import {
    Paper, Typography, Stack, Divider, Box, Collapse, IconButton, Tooltip,
} from "@mui/material";
import { Eye } from "lucide-react";
import { useState } from "react";
import type { SalePayload } from "@/modules/sales/types/salesTypes";
import PrescriptionPreview from "./PrescriptionPreview";

export default function SaleSummary() {
    const { watch, setValue } = useFormContext<SalePayload>();
    const [showRx, setShowRx] = useState(false);

    const productItems = watch("productItems") ?? [];
    const serviceItems = watch("serviceItems") ?? [];
    const prescriptionId = watch("prescriptionId");
    const discount = watch("discount") ?? 0;

    const subtotal =
        productItems.reduce((acc, item) => acc + (item.product?.salePrice ?? 0) * (item.quantity ?? 1), 0) +
        serviceItems.reduce((acc, item) => acc + (item.service?.price ?? 0), 0);

    const total = Math.max(0, subtotal - discount);

    const { data: prescriptionResponse } = useGetPrescriptionById(
        prescriptionId ?? undefined
    );
    const prescription = prescriptionResponse?.data ?? null;

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Resumo da Venda
            </Typography>

            <Stack spacing={1.5}>
                {/* Subtotal */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>
                </Stack>

                {/* Desconto */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.secondary">Desconto</Typography>
                    <CurrencyInput
                        size="small"
                        label=""
                        value={discount}
                        onChange={(val) => setValue("discount", val ?? 0, { shouldDirty: true, shouldValidate: true })}
                        sx={{ width: 120 }}
                        inputProps={{ min: 0, max: subtotal }}
                    />
                </Stack>

                {/* Valor do desconto */}
                {discount > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">Valor do desconto</Typography>
                        <Typography variant="body2" color="error.main">
                            -{discount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </Typography>
                    </Stack>
                )}

                <Divider sx={{ my: 1 }} />

                {/* Total */}
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>
                </Stack>

                {subtotal === 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Adicione produtos para ver o resumo
                        </Typography>
                    </Box>
                )}

                {/* Receita selecionada */}
                {prescription && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" fontWeight={600}>Receita</Typography>
                            <Tooltip title={showRx ? "Ocultar" : "Visualizar receita"}>
                                <IconButton size="small" onClick={() => setShowRx((prev) => !prev)}>
                                    <Eye size={16} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Collapse in={showRx} timeout="auto" unmountOnExit>
                            <PrescriptionPreview prescription={prescription} />
                        </Collapse>
                    </>
                )}
            </Stack>
        </Paper>
    );
}
