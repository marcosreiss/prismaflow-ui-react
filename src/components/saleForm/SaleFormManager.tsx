/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Box, Paper, Divider, Alert } from "@mui/material";
import { useNotification } from "@/context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { mapSaleToPayload, sanitizeSaleData } from "@/utils/sales/salePayloadMapper";
import { canSubmitSale } from "@/utils/sales/saleValidators";
import { getSummaryCalculations } from "@/utils/sales/calculations";

import { useSale } from "@/hooks/useSale";
import { useCustomer } from "@/hooks/useCustomer";
import { useProduct } from "@/hooks/useProduct";
import { useService } from "@/hooks/useService";
import { useSaleForm } from "@/hooks/useSaleForm";

import SaleFormHeader from "../../modules/sales/components/SaleFormHeader";
import StepperNavigation from "../../modules/sales/components/StepperNavigation";
import SaleSummary from "../../modules/sales/components/SaleSummary";
import SaleFormActions from "../../modules/sales/components/SaleFormActions";

// ⚠️ usando seus componentes atuais
import ClientStep from "./steps/ClientStep";
import ProductsStep from "./steps/ProductsStep";
import ReviewStep from "./steps/ReviewStep";

import type { Sale } from "@/types/saleTypes";
import ProtocolForm from "./protocol/ProtocolForm";

const steps = ["Cliente", "Produtos", "Protocolo", "Revisão"];

interface SaleFormManagerProps {
    mode: "create" | "edit";
    existingSale?: Sale | null;
}

export default function SaleFormManager({ mode, existingSale }: SaleFormManagerProps) {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const isEditMode = mode === "edit";

    // dados externos
    const { list: { data: customers, isLoading: isLoadingCustomers } } = useCustomer(null);
    const { list: { data: products, isLoading: isLoadingProducts } } = useProduct(null);
    const { list } = useService();
    const services = list.data;
    const isLoadingServices = list.isLoading;

    // API create/update
    const { create, creating, update, updating } = useSale(isEditMode ? existingSale?.id ?? null : null);
    const isLoading = creating || updating;

    // form
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

    // hidratar form no modo edição (somente quando a venda chega)
    useEffect(() => {
        if (!isEditMode || !existingSale) return;
        const current = methods.getValues();
        if (!current.client && existingSale) {
            // se você já tiver um mapper para API -> form, chame aqui.
            // Ex.: resetForm(mapSaleApiToFormData(existingSale));
            resetForm(existingSale as any);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, existingSale, resetForm]);

    // cálculos
    const summaryCalculations = getSummaryCalculations(watchedProductItems, watchedDiscount);

    // navegação
    const handleStepNext = () => handleNext();
    const handleStepChange = (newStep: number) => setActiveStep(newStep);

    // adicionar serviço (⚠️ necessário para o ProductsStep)
    const handleAddService = (service: any) => {
        const currentServices = methods.getValues("serviceItems") || [];
        methods.setValue(
            "serviceItems",
            [...currentServices, { service }],
            { shouldValidate: true, shouldDirty: true }
        );
    };

    const handleSaveDraft = () => {
        const data = methods.getValues();
        const sanitizedData = sanitizeSaleData(data);
        console.log("Rascunho salvo:", sanitizedData);
        addNotification("Rascunho salvo com sucesso!", "info");
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

            if (isEditMode && existingSale?.id) {
                await update({ id: existingSale.id, data: payload as any });
                addNotification("Venda atualizada com sucesso!", "success");
            } else {
                await create(payload as any);
                addNotification("Venda criada com sucesso!", "success");
            }

            navigate("/sales");
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                `Erro ao ${isEditMode ? "atualizar" : "criar"} a venda. Tente novamente.`;
            addNotification(errorMessage, "error");
        }
    };

    // render do step
    const renderStepContent = (step: number) => {
        const stepProps = { control, errors };

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
                return <ProtocolForm />; {/* ✅ removeu {...stepProps} */ }
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
                return <Alert severity="error">Etapa não encontrada.</Alert>;
        }
    };

    return (
        <FormProvider {...methods}>
            <Paper sx={{ p: 3, borderRadius: 2, maxWidth: 1200, mx: "auto" }}>
                <SaleFormHeader
                    isEditMode={isEditMode}
                    existingSale={existingSale}
                    onBack={() => navigate("/sales")}
                />

                <Divider sx={{ mb: 3 }} />

                <StepperNavigation
                    steps={steps}
                    activeStep={activeStep}
                    onStepChange={handleStepChange}
                />

                {errors.root && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errors.root.message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
                        <Box sx={{ flex: 2 }}>{renderStepContent(activeStep)}</Box>

                        {activeStep > 0 && (
                            <Box sx={{ flex: 1, minWidth: 300 }}>
                                <SaleSummary
                                    subtotal={summaryCalculations.subtotal}
                                    total={summaryCalculations.total}
                                />
                            </Box>
                        )}
                    </Box>

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
