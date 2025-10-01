import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { DeepPartial } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import type { Product } from "@/types/productTypes";
import type { ItemProduct } from "@/types/itemProductTypes";
import type { ProtocolCreate } from "@/types/protocolTypes";

const defaultValues: DeepPartial<Sale> = {
    client: undefined,
    productItems: [],
    serviceItems: [],
    discount: 0,
    notes: "",
    isActive: true,
    subtotal: 0,
    total: 0,
    protocol: undefined,
};

const createDefaultProtocol = (): ProtocolCreate => ({
    recordNumber: "",
    book: "",
    page: null,
    os: "",
    prescription: {
        doctorName: "",
        crm: "",
        odSpherical: "",
        odCylindrical: "",
        odAxis: "",
        odDnp: "",
        oeSpherical: "",
        oeCylindrical: "",
        oeAxis: "",
        oeDnp: "",
        addition: "",
        opticalCenter: "",
    }
});

export const useSaleForm = () => {
    const methods = useForm<Sale>({
        defaultValues: defaultValues as Sale
    });
    const { control, watch, setValue, reset } = methods;

    const [activeStep, setActiveStep] = useState(0);

    const watchedProductItems = watch("productItems") || [];
    const watchedDiscount = watch("discount") || 0;
    const watchedClient = watch("client");

    const subtotal = watch("subtotal") || 0;
    const total = watch("total") || 0;

    // Efeito para calcular subtotal e total - COM TIPOS CORRETOS
    useEffect(() => {
        const calculatedSubtotal = watchedProductItems.reduce((acc: number, item: ItemProduct) => {
            const price = item.product?.salePrice || 0;
            const quantity = item.quantity || 0;
            return acc + (price * quantity);
        }, 0);

        const discountValue = watchedDiscount || 0;
        const calculatedTotal = Math.max(0, calculatedSubtotal - discountValue);

        setValue("subtotal", calculatedSubtotal);
        setValue("total", calculatedTotal);

    }, [watchedProductItems, watchedDiscount, setValue]);

    const handleAddProduct = (product: Product) => {
        const currentItems = [...watchedProductItems];

        // Verificar se o produto já existe na lista - COM TIPO CORRETO
        const existingProductIndex = currentItems.findIndex(
            (item: ItemProduct) => item.product.id === product.id
        );

        if (existingProductIndex !== -1) {
            // Produto já existe - incrementar quantidade
            const updatedItems = [...currentItems];
            updatedItems[existingProductIndex] = {
                ...updatedItems[existingProductIndex],
                quantity: updatedItems[existingProductIndex].quantity + 1
            };

            setValue("productItems", updatedItems, { shouldValidate: true });
        } else {
            // Produto novo - adicionar à lista
            const frameDetails = product.category === "FRAME" ? {
                material: "ACETATE" as const,
                reference: null,
                color: null,
            } : null;

            const newItem: Omit<ItemProduct, "id" | "sale"> = {
                product,
                quantity: 1,
                stockQuantity: product.stockQuantity || 0,
                frameDetails,
            };

            setValue("productItems", [
                ...currentItems,
                newItem as ItemProduct
            ], { shouldValidate: true });

            const saleHasLens = [...currentItems, newItem as ItemProduct].some(
                (item: ItemProduct) => item.product.category === 'LENS'
            );
            const protocolExists = !!watch("protocol");

            if (saleHasLens && !protocolExists) {
                setValue("protocol", createDefaultProtocol());
            }
        }
    };

    const handleRemoveProduct = (index: number) => {
        const currentItems = [...watchedProductItems];
        currentItems.splice(index, 1);

        setValue("productItems", currentItems, { shouldValidate: true });

        const saleStillHasLens = currentItems.some((item: ItemProduct) =>
            item.product.category === 'LENS'
        );

        if (!saleStillHasLens) {
            setValue("protocol", undefined);
        }
    };

    const handleNext = () => {
        console.log("Próximo passo - Atual:", activeStep);
        setActiveStep((prev) => {
            const nextStep = prev + 1;
            console.log("Indo para passo:", nextStep);
            return nextStep;
        });
    };

    const handleBack = () => {
        console.log("Voltando passo - Atual:", activeStep);
        setActiveStep((prev) => {
            const prevStep = prev - 1;
            console.log("Voltando para passo:", prevStep);
            return prevStep;
        });
    };

    const resetForm = (sale?: Sale) => {
        reset(sale || defaultValues as Sale);
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
        reset,
        watchedProductItems,
        watchedDiscount,
        watchedClient,
    };
};