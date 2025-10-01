// hooks/useSaleDetails.ts
import { useQuery } from "@tanstack/react-query";
import { saleService } from "@/services/saleService";
import type { SaleApi } from "@/types/saleTypes";

export function useSaleDetails(id: number | null) {
    return useQuery({
        queryKey: ["sale", id],
        queryFn: async () => {
            if (!id) return null;
            const data = await saleService.getById(id);
            return data as unknown as SaleApi; // Cast via unknown
        },
        enabled: !!id,
    });
}