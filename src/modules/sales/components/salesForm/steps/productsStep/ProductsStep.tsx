import { Controller, useFormContext } from "react-hook-form";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Divider,
    useTheme,
} from "@mui/material";
import { FileText, ShoppingCart, Wrench } from "lucide-react";
import type { Product } from "@/modules/products/types/productTypes";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import ProductSelector from "./ProductSelector";
import SaleProductTable from "./SaleProductTable";
import SaleServiceSelector from "./SaleServiceSelector";
import SaleServiceTable from "./SaleServiceTable";
import type { SalePayload } from "@/modules/sales/types/salesTypes";

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

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Produtos */}
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    borderRadius: 2,
                    borderColor: theme.palette.divider,
                    bgcolor: theme.palette.background.paper,
                }}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Wrench
                        size={22}
                        color={theme.palette.primary.main}
                        strokeWidth={2}
                    />
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                        Serviços
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />

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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FileText
                        size={22}
                        color={theme.palette.primary.main}
                        strokeWidth={2}
                    />
                    <Typography variant="h6" color="text.primary" fontWeight={600}>
                        Observações
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />

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
