import { useEntity } from "@/hooks/useEntity";
import { serviceService } from "@/services/serviceService";
import type { Service } from "@/types/serviceTypes";

export function useService(detailId?: number | string | null) {
    return useEntity<Service>({
        service: serviceService,
        queryKey: "services",
        detailId: detailId ?? null,
    });
}