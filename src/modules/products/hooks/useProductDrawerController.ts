import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNotification } from "@/context/NotificationContext";
import { useCreateProduct, useUpdateProduct } from "./useProduct";
import { useGetBrands } from "@/modules/brands/hooks/useBrand";
import type { Brand } from "@/modules/brands/types/brandTypes";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
  ProductCategory,
} from "../types/productTypes";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";

// ==============================
// 🔹 Tipagens
// ==============================
export type ProductDrawerMode = "create" | "edit" | "view";

interface UseProductDrawerControllerProps {
  mode: ProductDrawerMode;
  product?: Product | null;
  onCreated: (product: Product) => void;
  onUpdated: (product: Product) => void;
  onEdit: () => void;
  onDelete: (product: Product) => void;
  onCreateNew: () => void;
}

// Valores usados no FORM (UI). markupPercent em %.
type ProductFormValues = {
  name: string;
  description: string;
  costPrice: number;
  markupPercent: number;
  salePrice: number;
  stockQuantity: number;
  minimumStock: number;
  category: ProductCategory;
  brandId?: number | null;
};

// ==============================
// 🔹 Hook principal
// ==============================
export function useProductDrawerController({
  mode,
  product,
  onCreated,
  onUpdated,
  onEdit,
  onDelete,
  onCreateNew,
}: UseProductDrawerControllerProps) {
  const { addNotification } = useNotification();

  const [openCreateBrandModal, setOpenCreateBrandModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const { mutateAsync: createProduct, isPending: creating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();

  // ==========================
  // 🔹 Formulário (markup em %)
  // ==========================
  const methods = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      description: "",
      costPrice: 0,
      markupPercent: 0,
      salePrice: 0,
      stockQuantity: 0,
      minimumStock: 0,
      category: "FRAME" as ProductCategory,
      brandId: undefined,
    },
  });

  const { watch, setValue, reset } = methods;

  // ==========================
  // 🔹 Marcas (autocomplete)
  // ==========================
  const { data: brandData, refetch: refetchBrands } = useGetBrands({
    page: 1,
    limit: 100,
  });

  const brandOptions = useMemo(
    () => brandData?.data?.content ?? [],
    [brandData]
  );

  // ==========================
  // 🔹 Efeitos (carregar produto e cálculos)
  // ==========================
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && product) {
      reset({
        name: product.name,
        description: product.description,
        costPrice: product.costPrice,
        markupPercent: Number(((product.markup ?? 1) - 1) * 100),
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        minimumStock: product.minimumStock,
        category: product.category,
        brandId: product.brand?.id ?? undefined,
      });
      setSelectedBrand(product.brand ?? null);
    } else if (mode === "create") {
      reset({
        name: "",
        description: "",
        costPrice: 0,
        markupPercent: 0,
        salePrice: 0,
        stockQuantity: 0,
        minimumStock: 0,
        category: "FRAME",
        brandId: undefined,
      });
      setSelectedBrand(null);
    }
  }, [mode, product, reset]);

  const costPrice = watch("costPrice");
  const markupPercent = watch("markupPercent");
  const salePrice = watch("salePrice");

  const round2 = (n: number) => Number(n.toFixed(2));

  // costPrice/markup% -> salePrice
  useEffect(() => {
    if (mode === "view") return;
    if (typeof costPrice !== "number" || typeof markupPercent !== "number")
      return;
    if (costPrice <= 0) return;
    const computed = round2(costPrice * (1 + markupPercent / 100));
    if (Math.abs((salePrice ?? 0) - computed) > 0.01) {
      setValue("salePrice", computed, { shouldDirty: true });
    }
  }, [costPrice, markupPercent]); // eslint-disable-line react-hooks/exhaustive-deps

  // salePrice -> markup%
  useEffect(() => {
    if (mode === "view") return;
    if (typeof costPrice !== "number" || typeof salePrice !== "number") return;
    if (costPrice <= 0) {
      return;
    }
    const computedPercent = round2((salePrice / costPrice - 1) * 100);
    if (Math.abs((markupPercent ?? 0) - computedPercent) > 0.01) {
      setValue("markupPercent", computedPercent, { shouldDirty: true });
    }
  }, [salePrice]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==========================
  // 🔹 Submit
  // ==========================
  const handleSubmit = methods.handleSubmit(async (values) => {
    try {
      if (values.costPrice <= 0) {
        addNotification("Preço de custo deve ser maior que zero.", "error");
        return;
      }

      const payload = {
        name: values.name,
        description: values.description,
        costPrice: values.costPrice,
        markup: Number((1 + values.markupPercent / 100).toFixed(4)),
        salePrice: values.salePrice,
        stockQuantity: values.stockQuantity,
        minimumStock: values.minimumStock,
        category: values.category,
        brandId: values.brandId ?? undefined,
      };

      if (mode === "create") {
        const res = await createProduct(payload as CreateProductPayload);
        if (res?.data) {
          onCreated(res.data);
          addNotification("Produto criado com sucesso!", "success");
        }
      } else if (mode === "edit" && product) {
        const res = await updateProduct({
          id: product.id,
          data: payload as UpdateProductPayload,
        });
        if (res?.data) {
          onUpdated(res.data);
          addNotification("Produto atualizado com sucesso!", "success");
        }
      }
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao salvar produto.";
      addNotification(message, "error");
    }
  });

  // ==========================
  // 🔹 Marcas (modal)
  // ==========================
  const handleOpenCreateBrandModal = () => setOpenCreateBrandModal(true);
  const handleCloseCreateBrandModal = () => setOpenCreateBrandModal(false);

  const handleBrandCreated = (brand: Brand) => {
    refetchBrands();
    setSelectedBrand(brand);
    setValue("brandId", brand.id);
    setOpenCreateBrandModal(false);
  };

  const handleBrandChange = (brand: Brand | null) => {
    setSelectedBrand(brand);
    setValue("brandId", brand?.id ?? undefined);
  };

  // ==========================
  // 🔹 Retorno
  // ==========================
  return {
    // form
    methods,
    handleSubmit,

    // estados
    creating,
    updating,
    selectedBrand,
    openCreateBrandModal,

    // dados
    brandOptions,
    mode,
    product,

    // callbacks vindos do drawer/pai
    onEdit,
    onDelete,
    onCreateNew,

    // handlers
    handleBrandChange,
    handleOpenCreateBrandModal,
    handleCloseCreateBrandModal,
    handleBrandCreated,
  };
}
