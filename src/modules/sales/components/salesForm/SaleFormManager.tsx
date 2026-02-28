// Orquestra os steps do formulário de venda com layout fixo
import { Box, Paper, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";

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
    const { methods, activeStep, handleSubmitSale } = useSaleFormContext();
    const { handleSubmit, formState: { errors, isSubmitting } } = methods;

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0: return <ClientStep />;
            case 1: return <ProductsStep isLoading={isSubmitting} />;
            case 2: return <ProtocolStep />;
            case 3: return <ReviewStep />;
            default: return <Alert severity="error">Etapa não encontrada.</Alert>;
        }
    };

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                maxWidth: 1200,
                mx: "auto",
                // container de altura fixa — ocupa a viewport descontando o header da aplicação
                height: "calc(100vh - 80px)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* região fixa: header + stepper */}
            <Box sx={{ flexShrink: 0 }}>
                <SaleFormHeader onBack={() => navigate("/sales")} />
                <Divider sx={{ mb: 3 }} />
                <StepperNavigation steps={steps} />

                {errors.root && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.root.message as string}
                    </Alert>
                )}
            </Box>

            <form
                onSubmit={handleSubmit(handleSubmitSale)}
                style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}
            >
                {/* região scrollável: step content + resumo lateral */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        gap: 4,
                    }}
                >
                    {/* conteúdo do step — scroll interno */}
                    <Box
                        sx={{
                            flex: 2,
                            overflowY: "auto",
                            pr: 1,
                            // scrollbar discreta
                            "&::-webkit-scrollbar": { width: 6 },
                            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                            "&::-webkit-scrollbar-thumb": {
                                bgcolor: "divider",
                                borderRadius: 3,
                            },
                        }}
                    >
                        {renderStepContent(activeStep)}
                    </Box>

                    {/* resumo lateral — scroll próprio se necessário */}
                    {activeStep > 0 && (
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: 300,
                                overflowY: "auto",
                                "&::-webkit-scrollbar": { width: 6 },
                                "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                                "&::-webkit-scrollbar-thumb": {
                                    bgcolor: "divider",
                                    borderRadius: 3,
                                },
                            }}
                        >
                            <SaleSummary />
                        </Box>
                    )}
                </Box>

                {/* região fixa: botões de ação */}
                <Box sx={{ flexShrink: 0, borderTop: 1, borderColor: "divider", pt: 2, mt: 2 }}>
                    <SaleFormActions />
                </Box>
            </form>
        </Paper>
    );
}
