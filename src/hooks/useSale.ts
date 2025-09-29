import { useEntity } from "@/hooks/useEntity";
import { saleService } from "@/services/saleService";
import type { Sale } from "@/types/saleTypes";

export function useSale(detailId?: number | string | null) {
    return useEntity<Sale>({
        service: saleService,
        queryKey: "sales",
        detailId: detailId ?? null,
    });
}