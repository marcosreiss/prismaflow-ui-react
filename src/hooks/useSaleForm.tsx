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
    const { control, watch, setValue, reset } = methods; // ✅ reset já está aqui

    const [activeStep, setActiveStep] = useState(0);

    const watchedProductItems = watch("productItems") || [];
    const watchedDiscount = watch("discount");
    const watchedClient = watch("client");

    const subtotal = watch("subtotal");
    const total = watch("total");

    // Efeito para calcular subtotal e total
    useEffect(() => {
        const calculatedSubtotal = watchedProductItems.reduce((acc, item) => {
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
        const currentItems = watchedProductItems;

        const frameDetails = product.category === "FRAME" ? {
            material: "ACETATE" as const,
            reference: null,
            color: null,
        } : null;

        const newItem: Omit<ItemProduct, "id" | "sale"> = {
            product,
            quantity: 1,
            frameDetails,
            stockQuantity: 0
        };

        setValue("productItems", [
            ...currentItems,
            newItem as ItemProduct
        ], { shouldValidate: true });

        const saleHasLens = [...currentItems, newItem].some(item => item.product.category === 'LENS');
        const protocolExists = !!watch("protocol");

        if (saleHasLens && !protocolExists) {
            setValue("protocol", createDefaultProtocol());
        }
    };

    const handleRemoveProduct = (index: number) => {
        const currentItems = [...watchedProductItems];
        currentItems.splice(index, 1);

        setValue("productItems", currentItems, { shouldValidate: true });

        const saleStillHasLens = currentItems.some(item => item.product.category === 'LENS');

        if (!saleStillHasLens) {
            setValue("protocol", undefined);
        }
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    // ✅ CORREÇÃO: Adicionar resetForm ao retorno
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
        resetForm, // ✅ AGORA ESTÁ SENDO RETORNADO
        reset, // ✅ TAMBÉM RETORNE O reset DIRETO SE PRECISAR
        watchedProductItems,
        watchedDiscount,
        watchedClient,
    };
};