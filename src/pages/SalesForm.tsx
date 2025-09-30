import { useNavigate } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import { useSale } from "@/hooks/useSale";
import { useCustomer } from "@/hooks/useCustomer";
import { useProduct } from "@/hooks/useProduct";
import { useNotification } from "@/context/NotificationContext";
import { useSaleForm } from "@/hooks/useSaleForm";
import { mapSaleToPayload, sanitizeSaleData } from "@/utils/sales/salePayloadMapper";
import { validateSaleForm, canSubmitSale } from "@/utils/sales/saleValidators";
import { getSummaryCalculations } from "@/utils/sales/calculations";
import SaleSummary from "@/components/sale/SaleSummary";
import SaleFormActions from "@/components/sale/SaleFormActions";
import ClientStep from "@/components/sale/steps/ClientStep";
import ProductsStep from "@/components/sale/steps/ProductsStep";
import ProtocolForm from "@/components/sale/protocol/ProtocolForm"; // Usando ProtocolForm diretamente
import ReviewStep from "@/components/sale/steps/ReviewStep";
import {
    Paper,
    Box,
    Typography,
    Button,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Alert,
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
        activeStep,
        setActiveStep,
        handleAddProduct,
        handleNext,
        handleBack,
        watchedProductItems,
        watchedDiscount,
        watchedClient,
    } = useSaleForm();

    const { handleSubmit, formState: { errors } } = methods;

    // Cálculos do resumo usando o novo utilitário
    const summaryCalculations = getSummaryCalculations(watchedProductItems, watchedDiscount);

    const handleStepNext = () => {
        const validation = validateSaleForm(methods.getValues(), activeStep);
        if (!validation.isValid) {
            validation.errors.forEach(error => addNotification(error, "warning"));
            return;
        }
        handleNext();
    };

    const handleSaveDraft = () => {
        const data = methods.getValues();
        const sanitizedData = sanitizeSaleData(data);

        // Aqui você implementaria a lógica de salvar rascunho
        console.log("Salvando rascunho:", sanitizedData);
        addNotification("Rascunho salvo com sucesso!", "info");
    };

    const handleStepChange = (newStep: number) => {
        // Valida se pode mudar para a etapa
        if (newStep < activeStep) {
            setActiveStep(newStep);
            return;
        }

        const validation = validateSaleForm(methods.getValues(), activeStep);
        if (!validation.isValid) {
            validation.errors.forEach(error => addNotification(error, "warning"));
            return;
        }
        setActiveStep(newStep);
    };

    const onSubmit = async (data: Sale) => {
        console.log("=== 🔍 DEBUG COMPLETO DA VENDA ===");

        // Debug dos dados do formulário
        console.log("1. CLIENTE:", data.client);
        console.log("2. PRODUTOS:", data.productItems?.map(p => ({
            nome: p.product?.name,
            categoria: p.product?.category,
            quantidade: p.quantity,
            temFrameDetails: !!p.frameDetails
        })));
        console.log("3. PROTOCOLO COMPLETO:", data.protocol);
        console.log("4. DADOS FINANCEIROS:", {
            subtotal: data.subtotal,
            discount: data.discount,
            total: data.total
        });

        const finalValidation = canSubmitSale(data);
        if (!finalValidation.isValid) {
            console.log("5. ERROS DE VALIDAÇÃO:", finalValidation.errors);
            finalValidation.errors.forEach(error => addNotification(error, "warning"));
            return;
        }

        try {
            const sanitizedData = sanitizeSaleData(data);
            const payload = mapSaleToPayload(sanitizedData);

            console.log("6. PAYLOAD FINAL PARA API:", payload);
            console.log("=== FIM DEBUG ===");

            await create(payload as any);
            addNotification("Venda criada com sucesso!", "success");
            navigate("/sales");

        } catch (error: any) {
            console.error("7. ERRO NA API:", error);
            console.error("8. RESPONSE DATA:", error.response?.data);
            console.error("9. RESPONSE STATUS:", error.response?.status);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.error
                || "Erro ao criar a venda. Tente novamente.";

            addNotification(errorMessage, "error");
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
                return <ProtocolForm />; // Usando ProtocolForm diretamente

            case 3:
                return (
                    <ReviewStep
                        client={watchedClient}
                        productItems={watchedProductItems}
                        subtotal={summaryCalculations.subtotal}
                        discount={summaryCalculations.discount}
                        total={summaryCalculations.total}
                    />
                );

            default:
                return (
                    <Alert severity="error">
                        Etapa não encontrada. Por favor, recarregue a página.
                    </Alert>
                );
        }
    };

    return (
        <FormProvider {...methods}>
            <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 1200, mx: 'auto' }}>
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

                {/* Stepper com clique nas etapas */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label, index) => (
                        <Step key={label} onClick={() => handleStepChange(index)} sx={{ cursor: 'pointer' }}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Alertas de validação */}
                {errors.root && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.root.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
                        {/* Coluna Principal */}
                        <Box sx={{ flex: 2 }}>
                            {renderStepContent(activeStep)}
                        </Box>

                        {/* Coluna Lateral - Resumo */}
                        {activeStep > 0 && (
                            <Box sx={{ flex: 1, minWidth: 300 }}>
                                <SaleSummary
                                    subtotal={summaryCalculations.subtotal}
                                    total={summaryCalculations.total}
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