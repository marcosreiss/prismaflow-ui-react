import { useNotification } from "@/context/NotificationContext";
import { useGetProductStock } from "@/modules/products/hooks/useProduct";

export const useStockValidation = () => {
  const { addNotification } = useNotification();

  const validateStock = async (productId: number, quantity: number) => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { data } = useGetProductStock(productId);
      if (
        data?.data?.data?.stockQuantity &&
        data?.data?.data?.stockQuantity < quantity
      ) {
        addNotification(
          `Estoque insuficiente. Restam ${data?.data?.data?.stockQuantity} unidades.`,
          "warning"
        );
        return false;
      }
      return true;
    } catch (err) {
      console.log(err);
      addNotification("Erro ao validar estoque do produto.", "error");
      return false;
    }
  };

  return { validateStock };
};
