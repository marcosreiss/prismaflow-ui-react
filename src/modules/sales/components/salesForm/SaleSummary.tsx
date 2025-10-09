import { useFormContext, Controller } from "react-hook-form";
import CurrencyInput from "@/components/imask/CurrencyInput";
import {
    Paper,
    Typography,
    Stack,
    Divider,
    Box,
} from "@mui/material";
import type { SalePayload } from "@/modules/sales/types/salesTypes";

/**
 * 🔹 Resumo financeiro da venda (subtotal, desconto e total)
 */
export default function SaleSummary() {
    const { control, watch } = useFormContext<SalePayload>();

    const subtotal = watch("subtotal") ?? 0;
    const total = watch("total") ?? 0;
    const discountValue = subtotal - total;

    return (
        <Paper variant="outlined" sx={{ p: 2, position: "sticky", top: 80 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Resumo da Venda
            </Typography>

            <Stack spacing={1.5}>
                {/* Subtotal */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                        Subtotal
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {subtotal.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </Typography>
                </Stack>

                {/* Desconto */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.secondary">
                        Desconto
                    </Typography>
                    <Controller
                        name="discount"
                        control={control}
                        render={({ field }) => (
                            <CurrencyInput
                                size="small"
                                label=""
                                value={typeof field.value === "number" ? field.value : 0}
                                onChange={(val) => field.onChange(val)}
                                sx={{ width: 120 }}
                                inputProps={{
                                    min: 0,
                                    max: subtotal,
                                }}
                            />
                        )}
                    />
                </Stack>

                {/* Valor do Desconto */}
                {discountValue > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                            Valor do desconto
                        </Typography>
                        <Typography variant="body2" color="error.main">
                            -{discountValue.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </Typography>
                    </Stack>
                )}

                <Divider sx={{ my: 1 }} />

                {/* Total */}
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </Typography>
                </Stack>

                {/* Informação sobre itens */}
                {subtotal === 0 && (
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary" textAlign="center">
                            Adicione produtos para ver o resumo
                        </Typography>
                    </Box>
                )}
            </Stack>
        </Paper>
    );
}
