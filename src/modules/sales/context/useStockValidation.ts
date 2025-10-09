import { useNotification } from "@/context/NotificationContext";
import type { ProductResponse } from "@/modules/products/types/productTypes";
import baseApi from "@/utils/axios";

/**
 * Hook para validação de estoque sem usar hook interno.
 */
export const useStockValidation = () => {
  const { addNotification } = useNotification();

  const validateStock = async (productId: number, quantity: number) => {
    try {
      const { data } = await baseApi.get<ProductResponse>(`/api/products/${productId}/stock`);
      
      const stockAvailable = data?.data?.stockQuantity ?? 0;

      if (stockAvailable < quantity) {
        addNotification(
          `Estoque insuficiente. Restam apenas ${stockAvailable} unidade(s).`,
          "warning"
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      addNotification("Erro ao validar estoque do produto.", "error");
      return false;
    }
  };

  return { validateStock };
};
