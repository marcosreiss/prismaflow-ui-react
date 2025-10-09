import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { DeepPartial } from "react-hook-form";
import type { Product } from "@/modules/products/types/productTypes";
import type { Protocol, SaleProductItem } from "@/modules/sales/types/salesTypes";
import type { CreateSalePayload } from "@/modules/sales/types/salesTypes";

const defaultValues: DeepPartial<CreateSalePayload> = {
    clientId: 0,
    prescriptionId: null,
    productItems: [],
    serviceItems: [],
    discount: 0,
    notes: "",
    subtotal: 0,
    total: 0,
    protocol: null,
};

const createDefaultProtocol = (): Protocol => ({
    recordNumber: "",
    book: "",
    page: null,
    os: "",
});

export const useSaleForm = () => {
    const methods = useForm<CreateSalePayload>({
        defaultValues: defaultValues as CreateSalePayload,
    });

    const { control, watch, setValue, reset } = methods;

    const [activeStep, setActiveStep] = useState(0);

    // ==============================
    // 🔹 Watchers
    // ==============================
    const rawProductItems = watch("productItems");
    const watchedProductItems = useMemo(() => rawProductItems || [], [rawProductItems]);

    const watchedServiceItems = watch("serviceItems") || [];
    const watchedDiscount = watch("discount") || 0;
    const watchedClientId = watch("clientId");
    const watchedProtocol = watch("protocol");

    const subtotal = watch("subtotal") || 0;
    const total = watch("total") || 0;

    // ==============================
    // 🔹 Cálculo automático de subtotal e total
    // ==============================
    useEffect(() => {
        const calculatedSubtotal = watchedProductItems.reduce((acc: number, item: SaleProductItem) => {
            const price = item.product?.salePrice || 0;
            const quantity = item.quantity || 0;
            return acc + price * quantity;
        }, 0);

        const discountValue = watchedDiscount || 0;
        const calculatedTotal = Math.max(0, calculatedSubtotal - discountValue);

        setValue("subtotal", calculatedSubtotal);
        setValue("total", calculatedTotal);
    }, [watchedProductItems, watchedDiscount, setValue]);

    // ==============================
    // 🔹 Adicionar produto à venda
    // ==============================
    const handleAddProduct = (product: Product & { quantity?: number }) => {
        const currentItems = [...watchedProductItems];
        const quantity = product.quantity ?? 1;

        const frameDetails = product.category === "FRAME"
            ? { material: "ACETATE" as const, reference: null, color: null }
            : null;

        const newItem: Omit<SaleProductItem, "id" | "saleId" | "tenantId" | "branchId" | "createdAt" | "updatedAt"> = {
            product,
            quantity,
            frameDetails,
            productId: product.id, // 👈 aqui deve ser o id real do produto
        };

        setValue("productItems", [...currentItems, newItem as SaleProductItem], {
            shouldValidate: true,
        });

        // protocolo opcional para lentes
        if (product.category === "LENS" && !watch("protocol")) {
            setValue("protocol", createDefaultProtocol());
        }
        console.log("[handleAddProduct] Produto adicionado:", product);
    };


    // ==============================
    // 🔹 Remover produto da venda
    // ==============================
    const handleRemoveProduct = (index: number) => {
        const currentItems = [...watchedProductItems];
        currentItems.splice(index, 1);

        setValue("productItems", currentItems, { shouldValidate: true });

        // Se não há mais lentes, remove protocolo
        const stillHasLens = currentItems.some(
            (item: SaleProductItem) => item.product?.category === "LENS"
        );
        if (!stillHasLens) {
            setValue("protocol", null);
        }
    };

    // ==============================
    // 🔹 Navegação entre passos
    // ==============================
    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

    // ==============================
    // 🔹 Resetar formulário
    // ==============================
    const resetForm = (sale?: CreateSalePayload) => {
        reset(sale || (defaultValues as CreateSalePayload));
        setActiveStep(0);
    };

    return {
        methods,
        control,
        subtotal,
        total,
        activeStep,
        setActiveStep,
        handleAddProduct,
        handleRemoveProduct,
        handleNext,
        handleBack,
        resetForm,
        watchedProductItems,
        watchedServiceItems,
        watchedDiscount,
        watchedClientId,
        watchedProtocol,
    };
};
