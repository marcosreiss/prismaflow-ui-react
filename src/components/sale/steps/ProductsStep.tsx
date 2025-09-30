import { Controller } from "react-hook-form";
import { Box, Typography, TextField } from "@mui/material";
import { FileText } from "lucide-react";
import ProductSelector from "../ProductSelector";
import SaleItemsTable from "../SaleItemsTable";
import ServiceSelector from "@/components/sale/serviceSelector";
import ServicesTable from "../serviceTable";

interface ProductsStepProps {
    control: any;
    errors: any;
    products: any[];
    services: any[];
    isLoadingProducts: boolean;
    isLoadingServices: boolean;
    onAddProduct: (product: any) => void;
    onAddService: (service: any) => void;
    creating: boolean;
}

export default function ProductsStep({
    control,
    products,
    services,
    isLoadingProducts,
    isLoadingServices,
    onAddProduct,
    onAddService,
    creating
}: ProductsStepProps) {
    return (
        <Box>
            {/* Seção de Produtos */}
            <Box sx={{ mb: 4 }}>
                <ProductSelector
                    products={products}
                    isLoading={isLoadingProducts}
                    onAddProduct={onAddProduct}
                    disabled={creating}
                />

                <Box sx={{ mt: 2 }}>
                    <SaleItemsTable />
                </Box>
            </Box>

            {/* Seção de Serviços */}
            <Box sx={{ mb: 4 }}>
                <ServiceSelector
                    services={services}
                    isLoading={isLoadingServices}
                    onAddService={onAddService}
                    disabled={creating}
                />

                <Box sx={{ mt: 2 }}>
                    <ServicesTable />
                </Box>
            </Box>

            {/* Observações */}
            <Box>
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