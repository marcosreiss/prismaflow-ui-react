// Step 2: adição de produtos, serviços e observações
import { useRef, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, Typography, TextField, Paper, Divider, useTheme } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import type { SalePayload } from "@/modules/sales/types/salesTypes";
import ProductSelector from "./ProductSelector";
import SaleProductTable from "./SaleProductTable";
import SaleServiceSelector from "./SaleServiceSelector";
import SaleServiceTable from "./SaleServiceTable";

interface ProductsStepProps {
    isLoading: boolean;
}

export default function ProductsStep({ isLoading }: ProductsStepProps) {
    const { control } = useFormContext<SalePayload>();
    const theme = useTheme();
    const productInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!productInputRef.current) return;
            productInputRef.current.focus({ preventScroll: true });
            const rect = productInputRef.current.getBoundingClientRect();
            const inView = rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
            if (!inView) productInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 3, pb: 2, minHeight: "80vh" }}>
            {/* Produtos */}
            <Paper
                variant="outlined"
                id="product-selector-section"
                sx={{ p: 3, borderRadius: 2, borderColor: theme.palette.divider, bgcolor: theme.palette.background.paper, borderWidth: 2 }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShoppingCart size={22} color={theme.palette.primary.main} strokeWidth={2} />
                    <Typography variant="h6" color="text.primary" fontWeight={600}>Produtos</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <ProductSelector ref={productInputRef} disabled={isLoading} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                    Itens adicionados
                </Typography>
                <SaleProductTable />
            </Paper>

            {/* Serviços */}
            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2, borderColor: theme.palette.divider, bgcolor: theme.palette.background.paper }}
            >
                <SaleServiceSelector disabled={isLoading} />
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                    Serviços adicionados
                </Typography>
                <SaleServiceTable />
            </Paper>

            {/* Observações */}
            <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 2, borderColor: theme.palette.divider, bgcolor: theme.palette.background.paper }}
            >
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Observações"
                            multiline
                            rows={3}
                            fullWidth
                            variant="outlined"
                            placeholder="Adicione observações sobre a venda..."
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                />
            </Paper>
        </Box>
    );
}
