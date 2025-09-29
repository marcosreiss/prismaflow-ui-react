import { useNavigate } from "react-router-dom";
import { FormProvider } from "react-hook-form"; // IMPORTANTE: Adicionar esta importação
import type { Sale } from "@/types/saleTypes";
import { useSale } from "@/hooks/useSale";
import { useCustomer } from "@/hooks/useCustomer";
import { useProduct } from "@/hooks/useProduct";
import { useNotification } from "@/context/NotificationContext";
import { useSaleForm } from "@/hooks/useSaleForm";
import { mapSaleToPayload, validateSaleForm } from "@/utils/salePayloadMapper";
import SaleSummary from "@/components/sale/SaleSummary";
import ProtocolForm from "@/components/sale/protocol/ProtocolForm";
import ClientStep from "@/components/sale/steps/ClientStep";
import ProductsStep from "@/components/sale/steps/ProductsStep";
import ReviewStep from "@/components/sale/steps/ReviewStep";
import SaleFormActions from "@/components/sale/SaleFormActions";
import {
    Paper,
    Box,
    Typography,
    Button,
    Divider,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";

const steps = ['Cliente', 'Produtos', 'Protocolo', 'Revisão'];

export default function SaleForm() {
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    // Hooks externos
    const { list: { data: customers, isLoading: isLoadingCustomers } } = useCustomer(null);
    const { list: { data: products, isLoading: isLoadingProducts } } = useProduct(null);
    const { create, creating } = useSale(null);

    // Hook customizado do formulário
    const {
        methods,
        control,
        subtotal,
        total,
        activeStep,
        handleAddProduct,
        handleNext,
        handleBack,
        watchedProductItems,
        watchedDiscount,
        watchedClient,
    } = useSaleForm();

    const { handleSubmit, formState: { errors } } = methods;

    const handleStepNext = () => {
        const validationError = validateSaleForm(methods.getValues(), activeStep);
        if (validationError) {
            addNotification(validationError, "warning");
            return;
        }
        handleNext();
    };

    const handleSaveDraft = () => {
        // Implementar lógica de salvar rascunho
        addNotification("Rascunho salvo com sucesso!", "info");
    };

    const onSubmit = async (data: Sale) => {
        const validationError = validateSaleForm(data, activeStep);
        if (validationError) {
            addNotification(validationError, "warning");
            return;
        }

        try {
            const payload = mapSaleToPayload(data);
            console.log("Payload enviado:", payload);

            await create(payload as any);
            addNotification("Venda criada com sucesso!", "success");
            navigate("/sales");

        } catch (error) {
            console.error("Erro ao criar venda:", error);
            addNotification("Erro ao criar a venda. Tente novamente.", "error");
        }
    };

    const renderStepContent = (step: number) => {
        const stepProps = {
            control,
            errors,
        };

        switch (step) {
            case 0:
                return (
                    <ClientStep
                        {...stepProps}
                        customers={customers || []}
                        isLoadingCustomers={isLoadingCustomers}
                    />
                );

            case 1:
                return (
                    <ProductsStep
                        {...stepProps}
                        products={products || []}
                        isLoadingProducts={isLoadingProducts}
                        onAddProduct={handleAddProduct}
                        creating={creating}
                    />
                );

            case 2:
                return <ProtocolForm />;

            case 3:
                return (
                    <ReviewStep
                        client={watchedClient}
                        productItems={watchedProductItems}
                        subtotal={subtotal}
                        discount={watchedDiscount}
                        total={total}
                    />
                );

            default:
                return null;
        }
    };

    return (
        // ENVOLVER TODO O COMPONENTE COM FormProvider
        <FormProvider {...methods}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Button
                        startIcon={<ArrowLeft size={20} />}
                        onClick={() => navigate("/sales")}
                        sx={{ minWidth: 'auto', px: 1 }}
                    >
                        Voltar
                    </Button>
                    <Typography variant="h5" fontWeight="bold">
                        Nova Venda
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {/* Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
                        {/* Coluna Principal */}
                        <Box sx={{ flex: 2 }}>
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Coluna Lateral - Resumo */}
                        {activeStep > 0 && (
                            <Box sx={{ flex: 1 }}>
                                <SaleSummary
                                    subtotal={subtotal}
                                    total={total}
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Actions */}
                    <SaleFormActions
                        activeStep={activeStep}
                        totalSteps={steps.length}
                        creating={creating}
                        hasProducts={watchedProductItems.length > 0}
                        onBack={handleBack}
                        onNext={handleStepNext}
                        onSaveDraft={handleSaveDraft}
                        onSubmit={handleSubmit(onSubmit)}
                    />
                </form>
            </Paper>
        </FormProvider>
    );
}