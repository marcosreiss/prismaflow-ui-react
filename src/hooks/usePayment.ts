// usePayment.ts
import { useEntity } from "@/hooks/useEntity";
import { paymentService } from "@/services/paymentService";
import type { Payment, PaymentStatusBySale } from "@/types/paymentTypes";
import type { ApiResponse } from "@/types/apiResponse";
import { useQuery } from "@tanstack/react-query";

// CRUD padrão (id opcional para detalhe), exatamente como useProduct
export function usePayment(detailId?: number | string | null) {
  return useEntity<Payment>({
    service: paymentService,
    queryKey: "payments",
    detailId: detailId ?? null,
  });
}

// 🔹 Hook extra para a rota /api/payments/status/:id
export function usePaymentStatusBySaleId(saleId?: number | null) {
  const query = useQuery<ApiResponse<PaymentStatusBySale>>({
    queryKey: ["payments", "status", saleId],
    queryFn: () => paymentService.getStatusBySaleId(saleId as number),
    enabled: !!saleId,
    placeholderData: (prev) => prev,
  });

  return {
    data: query.data?.data,          // { saleId, paymentId, status }
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
}
