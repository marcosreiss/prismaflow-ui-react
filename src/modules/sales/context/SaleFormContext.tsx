// src/modules/sales/context/SaleFormContext.tsx
// Contexto global do fluxo de criação/edição de venda
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import { useSaleForm } from "../hooks/useSaleForm";
import { useStockValidation } from "./useStockValidation";
import { useSaleDraft } from "./useSaleDraft";
import { useNotification } from "@/context/NotificationContext";
import type { SalePayload, Sale } from "../types/salesTypes";
import { canSubmitSale } from "../utils/saleValidators";
import { useCreateSale, useUpdateSale } from "../hooks/useSales";
import type { Product } from "@/modules/products/types/productTypes";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import { buildSalePayload } from "../utils/salePayloadMapper";
import { mapSaleApiToFormData } from "../utils/mapSaleApiToFormData";
import type { ClientSelectItem } from "@/modules/clients/types/clientTypes";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { AxiosError } from "axios";

// tipo local para opção de receita
export type PrescriptionOption = Prescription & { label: string };

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
    handleSubmitSale: (data: SalePayload) => Promise<void>;
    loadDraft: () => void;
    // estado persistente do step de cliente
    selectedClient: ClientSelectItem | null;
    setSelectedClient: (client: ClientSelectItem | null) => void;
    selectedPrescription: PrescriptionOption | null;
    setSelectedPrescription: (prescription: PrescriptionOption | null) => void;
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

    // ======= Estado persistente do ClientStep =======
    const [selectedClient, setSelectedClient] = useState<ClientSelectItem | null>(
        existingSale?.client
            ? { id: existingSale.client.id, name: existingSale.client.name || "" }
            : null
    );
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionOption | null>(null);

    // ======= Hooks auxiliares =======
    const { validateStock } = useStockValidation();
    const { saveDraft, loadDraft, clearDraft } = useSaleDraft(resetForm);

    const createSale = useCreateSale();
    const updateSale = useUpdateSale();

    // ======= Hidratação inicial (modo edição) =======
    const hydratedRef = useRef(false);
    useEffect(() => {
        if (!isEditMode || !existingSale) return;
        if (!hydratedRef.current && existingSale?.id) {
            resetForm(mapSaleApiToFormData(existingSale));
            hydratedRef.current = true;
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
            methods.setValue("serviceItems", [...current, { serviceId: service.id, service }], {
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
        saveDraft(data);
    }, [methods, saveDraft]);

    const handleClearDraft = useCallback(() => {
        clearDraft();
    }, [clearDraft]);

    // ======= Submissão final =======
    const handleSubmitSale = useCallback(
        async (data: SalePayload) => {
            const finalValidation = canSubmitSale(data as Sale);
            if (!finalValidation.isValid) {
                finalValidation.errors.forEach((e) => addNotification(e, "warning"));
                return;
            }

            const allValid = await Promise.all(
                (data.productItems ?? []).map((p) =>
                    validateStock(p.productId ?? p.product?.id, p.quantity ?? 1)
                )
            );

            if (allValid.includes(false)) {
                addNotification("A venda contém produtos com estoque insuficiente.", "error");
                return;
            }

            const payload = buildSalePayload(data);

            try {
                if (isEditMode && existingSale?.id) {
                    console.log("Payload para atualização:", payload);
                    await updateSale.mutateAsync({ ...payload, id: existingSale.id });
                    addNotification("Venda atualizada com sucesso!", "success");
                } else {
                    await createSale.mutateAsync(payload);
                    addNotification("Venda criada com sucesso!", "success");
                }

                methods.reset();
                window.location.href = "/sales";
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: AxiosError | any) {
                console.log(error);
                addNotification(error.response.data.message || "Erro ao salvar venda. Tente novamente.", "error");
            }
        },
        [isEditMode, existingSale, addNotification, validateStock, createSale, updateSale, methods]
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
            selectedClient,
            setSelectedClient,
            selectedPrescription,
            setSelectedPrescription,
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
            selectedClient,
            selectedPrescription,
        ]
    );

    return (
        <SaleFormContext.Provider value={value}>
            <FormProvider {...methods}>{children}</FormProvider>
        </SaleFormContext.Provider>
    );
};
