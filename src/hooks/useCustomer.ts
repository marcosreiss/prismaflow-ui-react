import { useEntity } from "@/hooks/useEntity";
import { customerService } from "@/services/customerService";
import type { Client } from "@/types/clientTypes";

export function useCustomer(detailId?: number | string | null) {
    return useEntity<Client>({
        service: customerService,
        queryKey: "customers",
        detailId: detailId ?? null,
    });
}