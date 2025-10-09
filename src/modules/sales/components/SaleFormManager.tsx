import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { Box, Paper, Divider, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useNotification } from "@/context/NotificationContext";
import { mapSaleToPayload, sanitizeSaleData } from "@/modules/sales/utils/salePayloadMapper";
import { canSubmitSale } from "@/modules/sales/utils/saleValidators";
import { getSummaryCalculations } from "@/modules/sales/utils/calculations";

// ⚙️ Hooks no padrão separado por operação

import { useCreateSale, useUpdateSale } from "../hooks/useSales";

import { useSaleForm } from "@/modules/sales/hooks/useSaleForm";

import SaleFormHeader from "./SaleFormHeader";
import StepperNavigation from "./StepperNavigation";
import SaleSummary from "./SaleSummary";
import SaleFormActions from "./SaleFormActions";

// Steps

import type { Sale, CreateSalePayload } from "../types/salesTypes";
import { useGetOpticalServices } from "@/modules/opticalservices/hooks/useOpticalService";
import { useGetProducts } from "@/modules/products/hooks/useProduct";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import ClientStep from "./ClientStep";
import ProductsStep from "./productsStep/ProductsStep";
import ProtocolStep from "./ProtocolStep";
import ReviewStep from "./ReviewStep";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";

const steps = ["Cliente", "Produtos", "Protocolo", "Revisão"];

interface SaleFormManagerProps {
    mode: "create" | "edit";
    existingSale?: Sale | null; // quando edição, virá do detalhe fora deste componente
}

export default function SaleFormManager({ mode, existingSale }: SaleFormManagerProps) {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const isEditMode = mode === "edit";

    // Dados de apoio para seleção de itens
    const {
        data: productsResponse,
        isLoading: isLoadingProducts,
    } = useGetProducts({
        page: 1,
        limit: 1000, // pode ajustar se quiser paginação
    });

    const {
        data: servicesResponse,
        isLoading: isLoadingServices,
    } = useGetOpticalServices({
        page: 1,
        limit: 1000,
    });

    const products = productsResponse?.data!.content || [];
    const services = servicesResponse?.data!.content || [];


    // Mutations separadas
    const createSale = useCreateSale();
    const updateSale = useUpdateSale();
    const isSubmitting = createSale.isPending || updateSale.isPending;

    // Form Controller (estado global do formulário desta tela)
    const {
        methods,
        control,
        activeStep,
        setActiveStep,
        handleAddProduct,
        handleNext,
        handleBack,
        resetForm,
    } = useSaleForm();

    const {
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
        getValues,
    } = methods;

    // watchers (para review/summary)
    const watchedProductItems = watch("productItems") ?? [];
    const watchedServiceItems = watch("serviceItems") ?? [];
    const watchedDiscount = watch("discount") ?? 0;
    const watchedClientId = watch("clientId") ?? null;
    const watchedProtocol = watch("protocol") ?? undefined;

    // Hidratar o formulário no modo edição
    useEffect(() => {
        if (!isEditMode || !existingSale) return;
        // Aqui é o lugar para um mapper dedicado API -> form se você tiver (recomendado)
        resetForm(existingSale as unknown as CreateSalePayload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditMode, existingSale]);

    // Cálculos do resumo
    const summaryCalculations = getSummaryCalculations(watchedProductItems, watchedDiscount);

    // Navegação entre steps
    const handleStepNext = () => handleNext();
    const handleStepChange = (newStep: number) => setActiveStep(newStep);

    // Adicionar serviço (mantendo padrão de itens no form)
    const handleAddService = (service: OpticalService) => {
        const current = getValues("serviceItems") || [];
        setValue(
            "serviceItems",
            [
                ...current,
                {
                    serviceId: service.id,
                    service, // opcional, apenas para exibição no form
                    id: 0,
                    saleId: 0,
                },
            ],
            { shouldValidate: true, shouldDirty: true }
        );
    };


    // Rascunho
    const handleSaveDraft = () => {
        // const data = getValues();
        // const sanitizedData = sanitizeSaleData(data);
        // Você pode persistir num storage/localDraftsService aqui
        // console.log("Rascunho salvo:", sanitizedData);
        addNotification("Rascunho salvo com sucesso!", "info");
    };

    // Submit
    const onSubmit = async (data: CreateSalePayload) => {
        const finalValidation = canSubmitSale(data as Sale);
        if (!finalValidation.isValid) {
            finalValidation.errors.forEach((e) => addNotification(e, "warning"));
            return;
        }

        try {
            const sanitizedData = sanitizeSaleData(data);
            const payload = mapSaleToPayload(sanitizedData);

            if (isEditMode && existingSale?.id) {
                await updateSale.mutateAsync({
                    ...payload,
                    id: existingSale.id,
                });
                addNotification("Venda atualizada com sucesso!", "success");
            } else {
                await createSale.mutateAsync(payload);
                addNotification("Venda criada com sucesso!", "success");
            }

            navigate("/sales");
        } catch (err: unknown) {
            const error = err as AxiosError<ApiResponse<null>>;
            console.log(err );
            
            const errorMessage =
                error.response?.data?.message ??
                `Erro ao ${isEditMode ? "atualizar" : "criar"} a venda. Tente novamente.`;
            addNotification(errorMessage, "error");
        }
    };

    // Render dos steps
    const renderStepContent = (step: number) => {
        const stepProps = { control, errors };

        switch (step) {
            case 0:
                // ClientStep usa useSelectClients internamente (padrão do projeto)
                return <ClientStep {...stepProps} />;

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
                        isLoading={isSubmitting}
                    />
                );

            case 2:
                return <ProtocolStep />;

            case 3:
                return (
                    <ReviewStep
                        clientId={watchedClientId ?? undefined}
                        productItems={watchedProductItems}
                        serviceItems={watchedServiceItems}
                        protocol={watchedProtocol}
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
                        {errors.root.message as string}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4 }}>
                        {/* Coluna principal */}
                        <Box sx={{ flex: 2 }}>{renderStepContent(activeStep)}</Box>

                        {/* Lateral: resumo */}
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
                        isLoading={isSubmitting}
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
