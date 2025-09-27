import { useEntity } from "@/hooks/useEntity";
import { brandService } from "@/services/brandService";
import type { Brand } from "@/types/brandTypes";

export function useBrand() {
  return useEntity<Brand>({ service: brandService, queryKey: "brands" });
}
