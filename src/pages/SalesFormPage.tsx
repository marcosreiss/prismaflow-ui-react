/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import { useSale } from "@/hooks/useSale";
import { useCustomer } from "@/hooks/useCustomer";
import { useProduct } from "@/hooks/useProduct";
import { useNotification } from "@/context/NotificationContext";
import { useSaleForm } from "@/hooks/useSaleForm";
import { mapSaleToPayload, sanitizeSaleData } from "@/utils/sales/salePayloadMapper";
import { canSubmitSale } from "@/utils/sales/saleValidators";
import { getSummaryCalculations } from "@/utils/sales/calculations";

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
    CircularProgress,
    IconButton,
} from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useService } from "@/hooks/useService";
import { useEffect } from "react";
import ProtocolForm from "@/components/saleForm/protocol/ProtocolForm";
import SaleFormActions from "@/components/saleForm/ui/SaleFormActions";
import SaleSummary from "@/components/saleForm/ui/SaleSummary";
import ClientStep from "@/components/saleForm/steps/ClientStep";
import ProductsStep from "@/components/saleForm/steps/ProductsStep";
import ReviewStep from "@/components/saleForm/steps/ReviewStep";

const steps = ['Cliente', 'Produtos', 'Protocolo', 'Revisão'];

interface SaleFormProps {
    mode?: 'create' | 'edit';
}

export default function SaleFormPage({ mode = 'create' }: SaleFormProps) {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addNotification } = useNotification();

    // ✅ CORREÇÃO: Declare isEditMode apenas uma vez
    const isEditMode = mode === 'edit' || !!id;

    // console.log("🎯 DETECÇÃO DE MODO:", { mode, id, isEditMode });

    // Hooks externos
    const { list: { data: customers, isLoading: isLoadingCustomers } } = useCustomer(null);
    const { list: { data: products, isLoading: isLoadingProducts } } = useProduct(null);

    // Hook de vendas - condicional baseado no modo
    const {
        create,
        creating,
        update,
        updating,
        detail: { data: existingSale, isLoading: isLoadingSale }
    } = useSale(isEditMode && id ? id : null);

    const isLoading = creating || updating;

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
        resetForm,
    } = useSaleForm();

    const { handleSubmit, formState: { errors } } = methods;


    useEffect(() => {
        // console.log("🎯 INICIALIZANDO FORMULÁRIO - Modo:", isEditMode ? "EDIÇÃO" : "CRIAÇÃO");

        if (isEditMode && existingSale && !isLoadingSale) {
            // Modo edição: preencher com dados existentes
            const currentData = methods.getValues();
            if (!currentData.client && existingSale.client) {
                // ✅ CORREÇÃO: Definir a variável formData
                const formData: Sale = {
                    id: existingSale.id,
                    clientName: existingSale.clientName || existingSale.client?.name || '',
                    discount: existingSale.discount || 0,
                    notes: existingSale.notes || '',
                    isActive: existingSale.isActive !== false,
                    subtotal: existingSale.subtotal || 0,
                    total: existingSale.total || 0,
                    createdAt: existingSale.createdAt,
                    updatedAt: existingSale.updatedAt,
                    client: existingSale.client || undefined,
                    productItems: ((existingSale as any).products || []).map((productApi: any) => {
                        const item: any = {
                            id: productApi.id,
                            product: {
                                id: productApi.productId || productApi.id,
                                name: productApi.name,
                                salePrice: productApi.unitPrice || productApi.price || 0,
                                category: productApi.category,
                                stockQuantity: productApi.stockQuantity || 0,
                            },
                            quantity: productApi.quantity || 1,
                        };

                        if (productApi.frameDetailsResponse) {
                            item.frameDetails = {
                                id: productApi.frameDetailsResponse.id,
                                material: productApi.frameDetailsResponse.frameMaterialType,
                                reference: productApi.frameDetailsResponse.reference,
                                color: productApi.frameDetailsResponse.color,
                            };
                        }

                        return item;
                    }),
                    serviceItems: ((existingSale as any).services || []).map((serviceApi: any) => ({
                        id: serviceApi.id,
                        service: {
                            id: serviceApi.opticalServiceId || serviceApi.serviceId || serviceApi.id,
                            description: serviceApi.description,
                            price: serviceApi.price || 0,
                        }
                    })),
                    protocol: existingSale.protocol || undefined,
                };

                resetForm(formData);
            }
        }
        // Modo criação: NÃO fazer nada automaticamente
    }, [isEditMode, existingSale, isLoadingSale, resetForm, methods]);

    // Cálculos do resumo
    const summaryCalculations = getSummaryCalculations(watchedProductItems, watchedDiscount);

    const handleStepNext = () => {
        // ✅ TEMPORARIAMENTE: Validação mínima para teste
        handleNext();

        // ❌ COMENTE TEMPORARIAMENTE a validação complexa:
        // const validation = validateSaleForm(methods.getValues(), activeStep);
        // if (!validation.isValid) {
        //     validation.errors.forEach(error => addNotification(error, "warning"));
        //     return;
        // }
        // handleNext();
    };

    const handleSaveDraft = () => {
        const data = methods.getValues();
        const sanitizedData = sanitizeSaleData(data);

        console.log("Salvando rascunho:", sanitizedData);
        addNotification("Rascunho salvo com sucesso!", "info");
    };

    const handleStepChange = (newStep: number) => {
        if (newStep < activeStep) {
            setActiveStep(newStep);
            return;
        }

        setActiveStep(newStep);

        // ❌ COMENTE TEMPORARIAMENTE:
        // const validation = validateSaleForm(methods.getValues(), activeStep);
        // if (!validation.isValid) {
        //     validation.errors.forEach(error => addNotification(error, "warning"));
        //     return;
        // }
        // setActiveStep(newStep);
    };

    // Hook de serviços
    const { list } = useService();
    const services = list.data;
    const isLoadingServices = list.isLoading;

    const handleAddService = (service: any) => {
        const currentServices = methods.getValues("serviceItems") || [];
        methods.setValue("serviceItems", [
            ...currentServices,
            { service }
        ], { shouldValidate: true });
    };

    const onSubmit = async (data: Sale) => {

        const finalValidation = canSubmitSale(data);
        if (!finalValidation.isValid) {
            finalValidation.errors.forEach(error => addNotification(error, "warning"));
            return;
        }

        try {
            const sanitizedData = sanitizeSaleData(data);
            const payload = mapSaleToPayload(sanitizedData, isEditMode);


            if (isEditMode && id) {
                await update({ id, data: payload as any });
                addNotification("Venda atualizada com sucesso!", "success");
            } else {
                await create(payload as any);
                addNotification("Venda criada com sucesso!", "success");
            }

            navigate("/sales");

        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                `Erro ao ${isEditMode ? 'atualizar' : 'criar'} a venda. Tente novamente.`;
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
                        services={services || []}
                        isLoadingProducts={isLoadingProducts}
                        isLoadingServices={isLoadingServices}
                        onAddProduct={handleAddProduct}
                        onAddService={handleAddService}
                        isLoading={isLoading}
                    />
                );

            case 2:
                return <ProtocolForm />;

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

    // Loading durante a busca dos dados
    if (isEditMode && isLoadingSale) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>
                    Carregando dados da venda...
                </Typography>
            </Box>
        );
    }

    // Verificar se está no modo edição mas não tem dados
    if (isEditMode && !existingSale && !isLoadingSale) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Venda não encontrada ou erro ao carregar dados.
                </Alert>
                <Button
                    variant="contained"
                    onClick={() => navigate("/sales")}
                >
                    Voltar para Lista
                </Button>
            </Box>
        );
    }

    return (
        <FormProvider {...methods}>
            <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 1200, mx: 'auto' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <IconButton
                            onClick={() => navigate("/sales")}
                            sx={{ width: { xs: 40, sm: 36 }, height: { xs: 40, sm: 36 } }}
                        >
                            <ArrowLeft size={20} />
                        </IconButton>
                    </Box>
                    <Typography variant="h5" fontWeight="bold">
                        {isEditMode ? 'Editar Venda' : 'Nova Venda'}
                        {isEditMode && existingSale && (
                            <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                (ID: {existingSale.id})
                            </Typography>
                        )}
                    </Typography>

                    {/* Indicador de modo */}
                    {isEditMode && (
                        <Box sx={{ ml: 'auto' }}>
                            <Typography
                                variant="body2"
                                color={existingSale ? "success.main" : "text.secondary"}
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    bgcolor: existingSale ? "success.light" : "grey.100",
                                    borderRadius: 1,
                                    fontWeight: 'medium'
                                }}
                            >
                                {existingSale ? '✅ Dados carregados' : '⏳ Carregando...'}
                            </Typography>
                        </Box>
                    )}
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

                {/* Indicador de dados carregados */}
                {isEditMode && existingSale && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Editando venda de <strong>{existingSale.client?.name || 'Cliente'}</strong> -
                        Total: R$ {existingSale.total?.toFixed(2) || '0,00'}
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
                        isLoading={isLoading}
                        hasProducts={watchedProductItems.length > 0}
                        isEditMode={isEditMode}
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