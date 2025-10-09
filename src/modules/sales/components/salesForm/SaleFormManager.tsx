import { Box, Paper, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";
import { useGetOpticalServices } from "@/modules/opticalservices/hooks/useOpticalService";
import { useGetProducts } from "@/modules/products/hooks/useProduct";

import SaleFormHeader from "./SaleFormHeader";
import StepperNavigation from "./steps/StepperNavigation";
import SaleSummary from "./SaleSummary";
import SaleFormActions from "./SaleFormActions";
import ClientStep from "./steps/ClientStep";
import ProductsStep from "./steps/productsStep/ProductsStep";
import ProtocolStep from "./steps/ProtocolStep";
import ReviewStep from "./steps/ReviewStep";

const steps = ["Cliente", "Produtos", "Protocolo", "Revisão"];

export default function SaleFormManager() {
    const navigate = useNavigate();
    const {
        methods,
        activeStep,
        handleSubmitSale,
    } = useSaleFormContext();

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
    } = methods;

    // Dados de apoio para seleção de produtos e serviços
    const {
        data: productsResponse,
        isLoading: isLoadingProducts,
    } = useGetProducts({ page: 1, limit: 1000 });

    const {
        data: servicesResponse,
        isLoading: isLoadingServices,
    } = useGetOpticalServices({ page: 1, limit: 1000 });

    const products = productsResponse?.data?.content || [];
    const services = servicesResponse?.data?.content || [];

    // Renderização dos steps
    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return <ClientStep />;
            case 1:
                return (
                    <ProductsStep
                        products={products}
                        services={services}
                        isLoadingProducts={isLoadingProducts}
                        isLoadingServices={isLoadingServices}
                        isLoading={isSubmitting}
                    />
                );
            case 2:
                return <ProtocolStep />;
            case 3:
                return <ReviewStep />;
            default:
                return <Alert severity="error">Etapa não encontrada.</Alert>;
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 1200, mx: "auto" }}>
            <SaleFormHeader
                onBack={() => navigate("/sales")}
            />

            <Divider sx={{ mb: 3 }} />

            <StepperNavigation steps={steps} />

            {errors.root && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.root.message as string}
                </Alert>
            )}

            <form onSubmit={handleSubmit(handleSubmitSale)}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
                    {/* Coluna principal */}
                    <Box sx={{ flex: 2 }}>{renderStepContent(activeStep)}</Box>

                    {/* Lateral: resumo */}
                    {activeStep > 0 && (
                        <Box sx={{ flex: 1, minWidth: 300 }}>
                            <SaleSummary />
                        </Box>
                    )}
                </Box>

                <SaleFormActions />
            </form>
        </Paper>
    );
}
