import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { DeepPartial } from "react-hook-form";
import type { Sale } from "@/types/saleTypes"; // Seus tipos importados
import type { Product } from "@/types/productTypes";
import type { ItemProduct } from "@/types/itemProductTypes";
import type { ProtocolCreate } from "@/types/protocolTypes"; // Supondo o tipo para criação

// defaultValues deve corresponder ao tipo Sale.
// É melhor iniciar o protocol como `undefined` para que ele seja criado dinamicamente.
const defaultValues: DeepPartial<Sale> = {
    client: undefined,
    productItems: [],
    serviceItems: [],
    discount: 0,
    notes: "",
    isActive: true,
    subtotal: 0,
    total: 0,
    protocol: undefined, // ✅ Inicia como indefinido
};

// Helper para criar um objeto de protocolo padrão
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
    const methods = useForm<Sale>({ defaultValues: defaultValues as Sale });
    const { control, watch, setValue, reset } = methods;

    const [activeStep, setActiveStep] = useState(0);

    const watchedProductItems = watch("productItems") || [];
    const watchedDiscount = watch("discount");
    const watchedClient = watch("client");

    const subtotal = watch("subtotal");
    const total = watch("total");

    // Efeito para calcular subtotal e total - Nenhuma alteração aqui, está correto.
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

        // A criação do frameDetails para o item está correta e de acordo com seus tipos
        const frameDetails = product.category === "FRAME" ? {
            material: "ACETATE" as const, // `as const` é um pouco mais seguro que `as Type`
            reference: null,
            color: null,
        } : null;

        // O novo item não contém o protocolo, como definido no seu tipo ItemProduct
        const newItem: Omit<ItemProduct, "id" | "sale"> = {
            product,
            quantity: 1,
            frameDetails,
        };

        // Adiciona o novo item à lista
        setValue("productItems", [
            ...currentItems,
            newItem as ItemProduct
        ], { shouldValidate: true });

        // ✅ LÓGICA CORRIGIDA PARA O PROTOCOLO
        // Se o produto for uma lente E o protocolo da venda ainda não existir, crie-o.
        const saleHasLens = [...currentItems, newItem].some(item => item.product.category === 'LENS');
        const protocolExists = !!watch("protocol");

        if (saleHasLens && !protocolExists) {
            setValue("protocol", createDefaultProtocol());
        }
    };

    // Opcional: Lógica para remover o protocolo se a última lente for removida
    const handleRemoveProduct = (index: number) => {
        const currentItems = [...watchedProductItems];
        currentItems.splice(index, 1);

        setValue("productItems", currentItems, { shouldValidate: true });

        // Verifica se ainda existe alguma lente na venda após a remoção
        const saleStillHasLens = currentItems.some(item => item.product.category === 'LENS');

        if (!saleStillHasLens) {
            setValue("protocol", undefined); // Limpa o protocolo
        }
    };


    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const resetForm = () => {
        reset(defaultValues as Sale);
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
        handleRemoveProduct, // Exponha a função de remover, se necessário
        handleNext,
        handleBack,
        resetForm,
        watchedProductItems,
        watchedDiscount,
        watchedClient,
    };
};