import { Controller } from "react-hook-form";
import {
    Box,
    Typography,
    TextField,
    Paper,
    Divider,
} from "@mui/material";
import { FileText, ShoppingCart, Wrench } from "lucide-react";
import type { Product } from "@/modules/products/types/productTypes";
import type { Control, FieldErrors } from "react-hook-form";
import ProductSelector from "./ProductSelector";
import ServiceSelector from "@/modules/sales/components/steps/productsStep/serviceSelector";
import ServicesTable from "@/modules/sales/components/steps/productsStep/serviceTable";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import SaleItemsTable from "./SaleItemsTable";
import type { CreateSalePayload } from "../../../types/salesTypes";

interface ProductsStepProps {
    control: Control<CreateSalePayload>;
    errors: FieldErrors<CreateSalePayload>;
    products: Product[];
    services: OpticalService[];
    isLoadingProducts: boolean;
    isLoadingServices: boolean;
    onAddProduct: (product: Product) => void;
    onAddService: (service: OpticalService) => void;
    isLoading: boolean;
}

export default function ProductsStep({
    control,
    products,
    services,
    isLoadingProducts,
    isLoadingServices,
    onAddProduct,
    onAddService,
    isLoading,
}: ProductsStepProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Produtos */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ShoppingCart size={24} color="#1976d2" />
                    <Typography variant="h6">Produtos</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />

                <ProductSelector
                    products={products}
                    isLoading={isLoadingProducts}
                    onAddProduct={onAddProduct}
                    disabled={isLoading}
                />

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 3, mb: 1 }}
                >
                    Itens adicionados
                </Typography>
                <SaleItemsTable />
            </Paper>

            {/* Serviços */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Wrench size={24} color="#1976d2" />
                    <Typography variant="h6">Serviços</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />

                <ServiceSelector
                    services={services}
                    isLoading={isLoadingServices}
                    onAddService={onAddService}
                    disabled={isLoading}
                />

                <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 3, mb: 1 }}
                >
                    Serviços adicionados
                </Typography>
                <ServicesTable />
            </Paper>

            {/* Observações */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FileText size={24} color="#1976d2" />
                    <Typography variant="h6">Observações</Typography>
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
                        />
                    )}
                />
            </Paper>
        </Box>
    );
}
