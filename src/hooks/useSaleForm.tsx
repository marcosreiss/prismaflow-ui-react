import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import type { Product } from "@/types/productTypes";
import type { FrameDetails, FrameMaterialType } from "@/types/frameDetailsTypes";
import type { ItemProduct } from "@/types/itemProductTypes";

const defaultValues: Partial<Sale> = {
    client: undefined,
    productItems: [],
    serviceItems: [],
    discount: 0,
    notes: "",
    isActive: true,
    subtotal: 0,
    total: 0,
    protocol: {
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
    }
};

// Helper para criar FrameDetails temporário (sem id)
const createTemporaryFrameDetails = (): Omit<FrameDetails, 'id' | 'itemProduct'> => ({
    material: "ACETATE" as FrameMaterialType,
    reference: null,
    color: null
});

export const useSaleForm = () => {
    const methods = useForm<Sale>({ defaultValues: defaultValues as Sale });
    const { control, watch, setValue } = methods;

    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const watchedProductItems = watch("productItems") || [];
    const watchedDiscount = watch("discount");
    const watchedClient = watch("client");

    // Cálculos otimizados
    useEffect(() => {
        const calculatedSubtotal = watchedProductItems.reduce((acc, item) => {
            const price = item.product?.salePrice || 0;
            const quantity = item.quantity || 0;
            return acc + price * quantity;
        }, 0);

        const discountValue = watchedDiscount || 0;
        const calculatedTotal = Math.max(0, calculatedSubtotal - discountValue);

        setSubtotal(calculatedSubtotal);
        setTotal(calculatedTotal);
        setValue("subtotal", calculatedSubtotal);
        setValue("total", calculatedTotal);
    }, [watchedProductItems, watchedDiscount, setValue]);

    const handleAddProduct = (product: Product) => {
        const currentItems = watchedProductItems;

        // Criar item product temporário
        const newItem: Omit<ItemProduct, 'id' | 'sale'> = {
            product,
            quantity: 1,
            frameDetails: product.category === "FRAME" ? createTemporaryFrameDetails() as any : null,
        };

        setValue("productItems", [
            ...currentItems,
            newItem
        ], { shouldValidate: true });
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);
    const resetForm = () => {
        methods.reset(defaultValues);
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
        handleNext,
        handleBack,
        resetForm,
        watchedProductItems,
        watchedDiscount,
        watchedClient,
    };
};