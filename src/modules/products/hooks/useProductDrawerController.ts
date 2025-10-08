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
import type { ApiResponse } from "@/types/apiResponse";

// ==============================
// 🔹 Tipagens
// ==============================
export type ProductDrawerMode = "create" | "edit" | "view";

interface UseProductDrawerControllerProps {
  mode: ProductDrawerMode;
  product?: Product | null;
  onCreated: (product: Product) => void;
  onUpdated: (product: Product) => void;
}

// ==============================
// 🔹 Hook principal
// ==============================
export function useProductDrawerController({
  mode,
  product,
  onCreated,
  onUpdated,
}: UseProductDrawerControllerProps) {
  // ==========================
  // 🔹 Contextos e estados locais
  // ==========================
  const { addNotification } = useNotification();

  const [openCreateBrandModal, setOpenCreateBrandModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // ==========================
  // 🔹 Hooks de mutação
  // ==========================
  const { mutateAsync: createProduct, isPending: creating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: updating } =
    useUpdateProduct();

  // ==========================
  // 🔹 Formulário (React Hook Form)
  // ==========================
  const methods = useForm<CreateProductPayload>({
    defaultValues: {
      name: "",
      description: "",
      costPrice: 0,
      markup: 1,
      salePrice: 0,
      stockQuantity: 0,
      minimumStock: 0,
      category: "FRAME" as ProductCategory,
      brandId: undefined,
    },
  });

  const { watch, setValue, reset } = methods;

  // ==========================
  // 🔹 Carregar marcas (para autocomplete)
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
  // 🔹 Efeitos reativos (edição e cálculo)
  // ==========================

  // Preenche dados do produto ao entrar em modo edit/view
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && product) {
      reset({
        name: product.name,
        description: product.description,
        costPrice: product.costPrice,
        markup: product.markup,
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
        markup: 1,
        salePrice: 0,
        stockQuantity: 0,
        minimumStock: 0,
        category: "FRAME",
        brandId: undefined,
      });
      setSelectedBrand(null);
    }
  }, [mode, product, reset]);

  // Cálculo automático: ao mudar costPrice / markup → recalcula salePrice
  const costPrice = watch("costPrice");
  const markup = watch("markup");
  const salePrice = watch("salePrice");

  // Atualiza salePrice quando costPrice ou markup mudam
  useEffect(() => {
    if (costPrice && markup && !isNaN(costPrice) && !isNaN(markup)) {
      const calculatedSalePrice = costPrice * markup;
      setValue("salePrice", Number(calculatedSalePrice.toFixed(2)), {
        shouldDirty: true,
      });
    }
  }, [costPrice, markup, setValue]);

  // Atualiza markup quando salePrice muda manualmente
  useEffect(() => {
    if (costPrice && salePrice && !isNaN(costPrice) && !isNaN(salePrice)) {
      const calculatedMarkup = salePrice / costPrice;
      if (calculatedMarkup && isFinite(calculatedMarkup)) {
        setValue("markup", Number(calculatedMarkup.toFixed(2)), {
          shouldDirty: true,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salePrice]);

  // Validação de preço de custo
  useEffect(() => {
    if (mode !== "view" && costPrice <= 0) {
      addNotification("Informe o preço de custo para o cálculo.", "error");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [costPrice]);

  // ==========================
  // 🔹 Handlers principais
  // ==========================
  const handleSubmit = methods.handleSubmit(async (values) => {
    try {
      if (mode === "create") {
        const res = await createProduct(values);
        if (res?.data) {
          onCreated(res.data);
          addNotification("Produto criado com sucesso!", "success");
        }
      } else if (mode === "edit" && product) {
        const res = await updateProduct({
          id: product.id,
          data: values as UpdateProductPayload,
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
  // 🔹 Handlers auxiliares
  // ==========================
  const handleOpenCreateBrandModal = () => setOpenCreateBrandModal(true);
  const handleCloseCreateBrandModal = () => setOpenCreateBrandModal(false);

  // Quando cria nova marca via modal
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
  // 🔹 Retorno do controller
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

    // dados externos
    brandOptions,

    // handlers
    handleBrandChange,
    handleOpenCreateBrandModal,
    handleCloseCreateBrandModal,
    handleBrandCreated,
  };
}
