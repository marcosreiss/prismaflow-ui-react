import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import type { DeepPartial } from "react-hook-form";
import type { Product } from "@/modules/products/types/productTypes";
import type { Protocol, SaleProductItem } from "@/modules/sales/types/salesTypes";
import type { SalePayload } from "@/modules/sales/types/salesTypes";

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

    const { watch, setValue, reset } = methods;
    const [activeStep, setActiveStep] = useState(0);

    // 🔹 Itens e desconto
    const productItems = useMemo(() => watch("productItems") || [], [watch]);
    const discount = watch("discount") || 0;

    // 🔹 Cálculo automático de subtotal e total
    useEffect(() => {
        const subtotal = productItems.reduce((acc: number, item: SaleProductItem) => {
            const price = item.product?.salePrice || 0;
            const quantity = item.quantity || 0;
            return acc + price * quantity;
        }, 0);

        const total = Math.max(0, subtotal - discount);
        setValue("subtotal", subtotal);
        setValue("total", total);
    }, [productItems, discount, setValue]);

    // 🔹 Adicionar produto à venda
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

        // cria protocolo padrão apenas se houver lente e não existir ainda
        if (product.category === "LENS" && !watch("protocol")) {
            setValue("protocol", createDefaultProtocol());
        }
    };

    // 🔹 Remover produto da venda
    const handleRemoveProduct = (index: number) => {
        const currentItems = [...productItems];
        currentItems.splice(index, 1);
        setValue("productItems", currentItems, { shouldValidate: true });

        // remove protocolo se não houver mais lentes
        const stillHasLens = currentItems.some(
            (item: SaleProductItem) => item.product?.category === "LENS"
        );
        if (!stillHasLens) {
            setValue("protocol", null);
        }
    };

    // 🔹 Navegação entre passos
    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

    // 🔹 Resetar formulário
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
