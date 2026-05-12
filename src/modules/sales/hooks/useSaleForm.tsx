// src/modules/sales/hooks/useSaleForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { DeepPartial } from "react-hook-form";
import type { Product } from "@/modules/products/types/productTypes";
import type {
    Protocol,
    SaleProductItem,
    SalePayload,
    SaleServiceItem,
} from "@/modules/sales/types/salesTypes";


const defaultValues: DeepPartial<SalePayload> = {
    clientId: 0,
    saleDate: new Date().toISOString().split('T')[0],
    prescriptionId: null,
    productItems: [],
    serviceItems: [],
    notes: "",
    protocol: null,
};


const createDefaultProtocol = (): Protocol => ({
    book: "",
    page: null,
    os: "",
});


export const useSaleForm = () => {
    const methods = useForm<SalePayload>({
        defaultValues: defaultValues as SalePayload,
    });

    const { setValue, reset, getValues, watch } = methods;
    const [activeStep, setActiveStep] = useState(0);

    // 🔹 adicionar produto
    const handleAddProduct = (product: Product & { quantity?: number }) => {
        const currentItems = [...(getValues("productItems") ?? [])];
        const quantity = product.quantity ?? 1;

        const frameDetails =
            product.category === "FRAME"
                ? { material: "ACETATE" as const, reference: null, color: null }
                : null;

        const newItem: Omit<
            SaleProductItem,
            "id" | "saleId" | "tenantId" | "branchId" | "createdAt" | "updatedAt"
        > = {
            product,
            quantity,
            frameDetails,
            productId: product.id,
        };

        setValue("productItems", [...currentItems, newItem as SaleProductItem], {
            shouldValidate: true,
        });

        if (product.category === "LENS" && !getValues("protocol")) {
            setValue("protocol", createDefaultProtocol());
        }
    };

    // 🔹 remover produto
    const handleRemoveProduct = (index: number) => {
        const currentItems = [...(getValues("productItems") ?? [])];
        currentItems.splice(index, 1);
        setValue("productItems", currentItems, { shouldValidate: true });

        const stillHasLens = currentItems.some(
            (item: SaleProductItem) => item.product?.category === "LENS"
        );
        if (!stillHasLens) {
            setValue("protocol", null);
        }
    };

    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

    const resetForm = (sale?: SalePayload) => {
        reset(sale || (defaultValues as SalePayload));
        setActiveStep(0);
    };

    // 🔹 helper para calcular subtotal/total/discount fora do form state
    const computeFinancials = (discountOverride?: number) => {
        const productItems = getValues("productItems") ?? [];
        const serviceItems = getValues("serviceItems") ?? [];

        const subtotal =
            productItems.reduce((acc, item: SaleProductItem) => {
                return acc + (item.product?.salePrice ?? 0) * (item.quantity ?? 1);
            }, 0) +
            serviceItems.reduce((acc, item: SaleServiceItem) => {
                return acc + (item.service?.price ?? 0);
            }, 0);

        const discount = discountOverride ?? 0;
        const total = Math.max(0, subtotal - discount);

        return { subtotal, discount, total };
    };

    return {
        methods,
        activeStep,
        setActiveStep,
        handleAddProduct,
        handleRemoveProduct,
        handleNext,
        handleBack,
        resetForm,
        computeFinancials,
        watch,
    };
};