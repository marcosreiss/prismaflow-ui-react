/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from "react-hook-form";
// 1. Importar Divider
import { Box, Typography, TextField, Paper, Divider } from "@mui/material";
import { FileText, ShoppingCart, Wrench } from "lucide-react";
import ProductSelector from "../ProductSelector";
import SaleItemsTable from "../SaleItemsTable";
import ServicesTable from "../serviceTable";
import type { Product } from "@/types/productTypes";
import type { Service } from "@/types/serviceTypes";
import ServiceSelector from "../serviceSelector";

interface ProductsStepProps {
    control: any;
    errors: any;
    products: Product[];
    services: Service[];
    isLoadingProducts: boolean;
    isLoadingServices: boolean;
    onAddProduct: (product: Product) => void;
    onAddService: (service: Service) => void;
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

            {/* Seção de Produtos - Mais Visível */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCart size={24} color="#1976d2" /> {/* Ícone com cor */}
                    <Typography variant="h6">
                        Produtos
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} /> {/* Divisória */}

                <ProductSelector
                    products={products}
                    isLoading={isLoadingProducts}
                    onAddProduct={onAddProduct}
                    disabled={isLoading}
                />

                {/* Subtítulo para a tabela */}
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                    Itens Adicionados
                </Typography>
                <SaleItemsTable />
            </Paper>

            {/* Seção de Serviços - Mais Visível */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Wrench size={24} color="#1976d2" /> {/* Ícone com cor */}
                    <Typography variant="h6">
                        Serviços
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} /> {/* Divisória */}

                <ServiceSelector
                    services={services}
                    isLoading={isLoadingServices}
                    onAddService={onAddService}
                    disabled={isLoading}
                />

                {/* Subtítulo para a tabela */}
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3, mb: 1 }}>
                    Serviços Adicionados
                </Typography>
                <ServicesTable />
            </Paper>

            {/* Observações - Mais Visível */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileText size={24} color="#1976d2" /> {/* Ícone com cor */}
                    <Typography variant="h6">
                        Observações
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} /> {/* Divisória */}

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