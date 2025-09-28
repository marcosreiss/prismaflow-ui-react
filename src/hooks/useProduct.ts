import { useEntity } from "@/hooks/useEntity";
import { productService } from "@/services/productService";
import type { Product } from "@/types/productTypes";

export function useProduct(detailId?: number | string | null) {
  return useEntity<Product>({
    service: productService,
    queryKey: "products",
    detailId: detailId ?? null,
  });
}
