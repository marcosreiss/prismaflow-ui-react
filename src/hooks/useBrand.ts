// src/hooks/useBrand.ts
import { useEntity } from "@/hooks/useEntity";
import { brandService } from "@/services/brandService";
import type { Brand } from "@/types/brandTypes";

export function useBrand(detailId?: number | string | null) {
  return useEntity<Brand>({
    service: brandService,
    queryKey: "brands",
    detailId: detailId ?? null,
  });
}
