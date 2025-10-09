import { createContext, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import { useSaleForm } from "../hooks/useSaleForm";
import { useStockValidation } from "./useStockValidation";
import { useSaleDraft } from "./useSaleDraft";
import { useNotification } from "@/context/NotificationContext";
import type { CreateSalePayload, Sale } from "../types/salesTypes";
import { sanitizeSaleData, mapSaleToPayload } from "../utils/salePayloadMapper";
import { canSubmitSale } from "../utils/saleValidators";
import { useCreateSale, useUpdateSale } from "../hooks/useSales";
import type { Product } from "@/modules/products/types/productTypes";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";

interface SaleFormContextValue {
    mode: "create" | "edit";
    existingSale?: Sale | null;
    methods: ReturnType<typeof useSaleForm>["methods"];
    activeStep: number;
    setActiveStep: (step: number) => void;
    handleNext: () => void;
    handleBack: () => void;
    handleAddProduct: (product: Product & { quantity?: number }) => Promise<void>;
    handleRemoveProduct: (index: number) => void;
    handleAddService: (service: OpticalService) => void;
    handleRemoveService: (index: number) => void;
    handleSaveDraft: () => void;
    handleClearDraft: () => void;
    handleSubmitSale: (data: CreateSalePayload) => Promise<void>;
    loadDraft: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SaleFormContext = createContext<SaleFormContextValue | null>(null);

interface ProviderProps {
    mode: "create" | "edit";
    existingSale?: Sale | null;
    children: ReactNode;
}

export const SaleFormProvider = ({ mode, existingSale, children }: ProviderProps) => {
    const isEditMode = mode === "edit";
    const { addNotification } = useNotification();

    // ======= Form principal =======
    const {
        methods,
        activeStep,
        setActiveStep,
        handleAddProduct,
        handleRemoveProduct,
        handleNext,
        handleBack,
        resetForm,
    } = useSaleForm();

    // ======= Hooks auxiliares =======
    const { validateStock } = useStockValidation();
    const { saveDraft, loadDraft, clearDraft } = useSaleDraft(resetForm);

    const createSale = useCreateSale();
    const updateSale = useUpdateSale();

    // ======= Hidratação inicial (modo edição ou rascunho) =======
    useEffect(() => {
        if (isEditMode && existingSale) {
            resetForm(existingSale as unknown as CreateSalePayload);
        }
    }, [isEditMode, existingSale, resetForm]);

    // ======= Adicionar Produto (com validação de estoque) =======
    const handleValidatedAddProduct = useCallback(
        async (product: Product & { quantity?: number }) => {
            if (!product?.id) {
                addNotification("Produto inválido.", "error");
                return;
            }

            const ok = await validateStock(product.id, product.quantity ?? 1);
            if (!ok) return;

            await handleAddProduct(product);
        },
        [handleAddProduct, validateStock, addNotification]
    );

    // ======= Adicionar Serviço =======
    const handleAddService = useCallback(
        (service: OpticalService) => {
            const current = methods.getValues("serviceItems") || [];
            const exists = current.some((s) => s.serviceId === service.id);
            if (exists) {
                addNotification("Serviço já adicionado.", "warning");
                return;
            }

            methods.setValue("serviceItems", [...current, { serviceId: service.id, service: service }], {
                shouldValidate: true,
            });
        },
        [methods, addNotification]
    );

    // ======= Remover Serviço =======
    const handleRemoveService = useCallback(
        (index: number) => {
            const current = [...(methods.getValues("serviceItems") || [])];
            current.splice(index, 1);
            methods.setValue("serviceItems", current, { shouldValidate: true });
        },
        [methods]
    );

    // ======= Rascunho =======
    const handleSaveDraft = useCallback(() => {
        const data = methods.getValues();
        const sanitized = sanitizeSaleData(data);
        saveDraft(sanitized);
    }, [methods, saveDraft]);

    const handleClearDraft = useCallback(() => {
        clearDraft();
    }, [clearDraft]);

    // ======= Submissão final =======
    const handleSubmitSale = useCallback(
        async (data: CreateSalePayload) => {
            const finalValidation = canSubmitSale(data as Sale);
            if (!finalValidation.isValid) {
                finalValidation.errors.forEach((e) => addNotification(e, "warning"));
                return;
            }

            // revalidar estoque
            const allValid = await Promise.all(
                (data.productItems ?? []).map((p) =>
                    validateStock(p.productId ?? p.product?.id, p.quantity ?? 1)
                )
            );

            if (allValid.includes(false)) {
                addNotification("A venda contém produtos com estoque insuficiente.", "error");
                return;
            }

            const sanitizedData = sanitizeSaleData(data);
            const payload = mapSaleToPayload(sanitizedData);

            try {
                if (isEditMode && existingSale?.id) {
                    await updateSale.mutateAsync({ ...payload, id: existingSale.id });
                    addNotification("Venda atualizada com sucesso!", "success");
                } else {
                    await createSale.mutateAsync(payload);
                    addNotification("Venda criada com sucesso!", "success");
                }

                // ✅ Limpar formulário e redirecionar
                methods.reset();                  // limpa o formulário
                window.location.href = "/sales";  // redireciona (alternativa: navigate("/sales"))
            } catch (error) {
                console.log(error);
                addNotification("Erro ao salvar venda. Tente novamente.", "error");
            }
        },
        [
            isEditMode,
            existingSale,
            addNotification,
            validateStock,
            createSale,
            updateSale,
            methods, // precisa estar aqui para usar reset()
        ]
    );


    // ======= Valor do Contexto =======
    const value = useMemo(
        () => ({
            mode,
            existingSale,
            methods,
            activeStep,
            setActiveStep,
            handleNext,
            handleBack,
            handleAddProduct: handleValidatedAddProduct,
            handleRemoveProduct,
            handleAddService,
            handleRemoveService,
            handleSaveDraft,
            handleClearDraft,
            handleSubmitSale,
            loadDraft,
        }),
        [
            mode,
            existingSale,
            methods,
            activeStep,
            setActiveStep,
            handleNext,
            handleBack,
            handleValidatedAddProduct,
            handleRemoveProduct,
            handleAddService,
            handleRemoveService,
            handleSaveDraft,
            handleClearDraft,
            handleSubmitSale,
            loadDraft,
        ]
    );

    return (
        <SaleFormContext.Provider value={value}>
            <FormProvider {...methods}>{children}</FormProvider>
        </SaleFormContext.Provider>
    );
};
