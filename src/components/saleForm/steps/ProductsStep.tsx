import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Box, Typography, TextField, Paper, Divider } from "@mui/material";
import { FileText, ShoppingCart, Wrench } from "lucide-react";
import ProductSelector from "../ProductSelector";
import SaleItemsTable from "../OldSaleItemsTable";
import ServicesTable from "../serviceTable";
import type { Product } from "@/modules/products/types/productTypes";
import ServiceSelector from "../../../modules/sales/components/productsStep/serviceSelector";
import type { OpticalService } from "@/types/opticalServiceTypes";
import type { Sale } from "@/types/saleTypes";

interface ProductsStepProps {
  control: Control<Sale>;
  errors: FieldErrors<Sale>;
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
    isLoading
}: ProductsStepProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCart size={24} color="#1976d2" /> 
                    <Typography variant="h6">
                        Produtos
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} /> 

                <ProductSelector
                    products={products}
                    isLoading={isLoadingProducts}
                    onAddProduct={onAddProduct}
                    disabled={isLoading}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                    Itens Adicionados
                </Typography>
                <SaleItemsTable />
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Wrench size={24} color="#1976d2" /> 
                    <Typography variant="h6">
                        Serviços
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} /> 

                <ServiceSelector
                    services={services}
                    isLoading={isLoadingServices}
                    onAddService={onAddService}
                    disabled={isLoading}
                />

                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                    Serviços Adicionados
                </Typography>
                <ServicesTable />
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileText size={24} color="#1976d2" /> {/* Ícone com cor */}
                    <Typography variant="h6">
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