import { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import CurrencyInput from "@/components/imask/CurrencyInput";
import {
    Paper,
    Typography,
    Stack,
    Divider,
} from "@mui/material";

export default function SaleSummary() {
    // Acessa os métodos do formulário principal
    const { watch, setValue, control } = useFormContext<Sale>();

    // Estados locais apenas para exibir os valores calculados na tela
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    // 'watch' observa os campos do formulário em tempo real
    const watchedProductItems = watch("productItems") || [];
    const watchedDiscount = watch("discount");

    // Este 'useEffect' é executado toda vez que a lista de itens ou o desconto mudam
    useEffect(() => {
        // 1. Calcula o subtotal somando o valor de cada item
        const calculatedSubtotal = watchedProductItems.reduce((acc, item) => {
            // O 'any' aqui é um atalho para o TypeScript, já que o tipo aninhado é complexo
            const price = (item as any).product?.salePrice || 0;
            const quantity = (item as any).quantity || 0;
            return acc + price * quantity;
        }, 0);

        // 2. Calcula o total final
        const calculatedTotal = calculatedSubtotal - (watchedDiscount || 0);

        // 3. Atualiza os estados locais para exibição imediata na tela
        setSubtotal(calculatedSubtotal);
        setTotal(calculatedTotal);

        // 4. Atualiza os valores no estado GERAL do formulário (para o submit)
        setValue("subtotal", calculatedSubtotal);
        setValue("total", calculatedTotal);

    }, [watchedProductItems, watchedDiscount, setValue]);

    return (
        <Paper variant="outlined" sx={{ p: 2, position: "sticky", top: 80 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Resumo da Venda
            </Typography>
            <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body1">
                        {subtotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>
                </Stack>

                {/* Campo de Desconto agora vive aqui, no resumo */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" color="text.secondary">Desconto (R$)</Typography>
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
                            />
                        )}
                    />
                </Stack>

                <Divider sx={{ my: 1 }} />

                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">
                        {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}