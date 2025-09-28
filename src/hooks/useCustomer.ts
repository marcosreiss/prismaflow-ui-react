import { useEntity } from "@/hooks/useEntity";
import { customerService } from "@/services/customerService";
import type { Customer } from "@/types/customerTypes";

export function useCustomer(detailId?: number | string | null) {
    return useEntity<Customer>({
        service: customerService,
        queryKey: "customers",
        detailId: detailId ?? null,
    });
}