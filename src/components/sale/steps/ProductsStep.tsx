import { Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import {
    Box,
    Typography,
    TextField,
} from "@mui/material";
import { Package, FileText } from "lucide-react";
import ProductSelector from "@/components/sale/ProductSelector";
import SaleItemsTable from "@/components/sale/SaleItemsTable";

interface ProductsStepProps {
    control: any;
    products: any[];
    isLoadingProducts: boolean;
    onAddProduct: (product: any) => void;
    creating: boolean;
}

export default function ProductsStep({
    control,
    products,
    isLoadingProducts,
    onAddProduct,
    creating
}: ProductsStepProps) {
    return (
        <Box>
            <ProductSelector
                products={products}
                isLoading={isLoadingProducts}
                onAddProduct={onAddProduct}
                disabled={creating}
            />

            <Box sx={{ mt: 3 }}>
                <SaleItemsTable />
            </Box>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileText size={24} />
                    Observações
                </Typography>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            multiline
                            rows={3}
                            fullWidth
                            placeholder="Adicione observações sobre a venda..."
                        />
                    )}
                />
            </Box>
        </Box>
    );
}