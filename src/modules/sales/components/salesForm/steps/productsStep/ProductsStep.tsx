// Seu arquivo ProductsStep.tsx

import { Controller, useFormContext } from "react-hook-form";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Divider,
    useTheme,
} from "@mui/material";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/modules/products/types/productTypes";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import ProductSelector from "./ProductSelector";
import SaleProductTable from "./SaleProductTable";
import SaleServiceSelector from "./SaleServiceSelector";
import SaleServiceTable from "./SaleServiceTable";
import type { SalePayload } from "@/modules/sales/types/salesTypes";

// Manter useRef e useEffect
import { useRef, useEffect } from "react";

interface ProductsStepProps {
    products: Product[];
    services: OpticalService[];
    isLoadingProducts: boolean;
    isLoadingServices: boolean;
    isLoading: boolean;
}

/**
 * 🔹 Etapa de seleção de produtos, serviços e observações
 */
export default function ProductsStep({
    products,
    services,
    isLoadingProducts,
    isLoadingServices,
    isLoading,
}: ProductsStepProps) {
    const { control } = useFormContext<SalePayload>();
    const theme = useTheme();

    // Manter a referência
    const productInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (productInputRef.current) {
                productInputRef.current.focus({ preventScroll: true });

                const elementRect = productInputRef.current.getBoundingClientRect();
                const isElementInView = (
                    elementRect.top >= 0 &&
                    elementRect.left >= 0 &&
                    elementRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    elementRect.right <= (window.innerWidth || document.documentElement.clientWidth)
                );

                if (!isElementInView) {
                    productInputRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            pt: 3,
            pb: 2,
            minHeight: '80vh'
        }}>
            {/* Produtos - PRIMEIRO CARD */}
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    borderRadius: 2,
                    borderColor: theme.palette.divider,
                    bgcolor: theme.palette.background.paper,
                    borderWidth: 2,
                }}
                id="product-selector-section"
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShoppingCart
                        size={22}
                        color={theme.palette.primary.main}
                        strokeWidth={2}
                    />
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                        Produtos
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />

                <ProductSelector
                    ref={productInputRef}
                    products={products}
                    isLoading={isLoadingProducts}
                    disabled={isLoading}
                />

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 3, mb: 1 }}
                >
                    Itens adicionados
                </Typography>
                <SaleProductTable />
            </Paper>

            {/* Serviços */}
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    borderRadius: 2,
                    borderColor: theme.palette.divider,
                    bgcolor: theme.palette.background.paper,
                }}
            >
                <SaleServiceSelector
                    services={services}
                    isLoading={isLoadingServices}
                    disabled={isLoading}
                />
                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 3, mb: 1 }}
                >
                    Serviços adicionados
                </Typography>
                <SaleServiceTable />
            </Paper>

            {/* Observações */}
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    borderRadius: 2,
                    borderColor: theme.palette.divider,
                    bgcolor: theme.palette.background.paper,
                }}
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