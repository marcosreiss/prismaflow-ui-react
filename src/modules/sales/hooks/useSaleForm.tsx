import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
    const methods = useForm<SalePayload>({
        defaultValues: defaultValues as SalePayload,
    });

    const { control, setValue, reset, getValues } = methods;
    const [activeStep, setActiveStep] = useState(0);

    // ✅ valores observados
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const productItems = useWatch({ control, name: "productItems" }) ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const serviceItems = useWatch({ control, name: "serviceItems" }) ?? [];
    const discount = useWatch({ control, name: "discount" }) ?? 0;

    // ✅ cálculo automático — simples e sem warnings
    useEffect(() => {
        const productSubtotal = productItems.reduce((acc, item: SaleProductItem) => {
            const price = item.product?.salePrice ?? 0;
            const quantity = item.quantity ?? 0;
            return acc + price * quantity;
        }, 0);

        const serviceSubtotal = serviceItems.reduce((acc, item: SaleServiceItem) => {
            const price = item.service?.price ?? 0;
            return acc + price;
        }, 0);

        const subtotal = productSubtotal + serviceSubtotal;
        const total = Math.max(0, subtotal - discount);

        setValue("subtotal", subtotal, { shouldDirty: false });
        setValue("total", total, { shouldDirty: false });
    }, [productItems, serviceItems, discount, setValue]);

    // 🔹 adicionar produto
    const handleAddProduct = (product: Product & { quantity?: number }) => {
        const currentItems = [...productItems];
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
        const currentItems = [...productItems];
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

    return {
        methods,
        activeStep,
        setActiveStep,
        handleAddProduct,
        handleRemoveProduct,
        handleNext,
        handleBack,
        resetForm,
    };
};
