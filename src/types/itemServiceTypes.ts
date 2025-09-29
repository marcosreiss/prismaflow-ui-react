import type { OpticalService } from "./opticalServiceTypes";
import type { Sale } from "./saleTypes";

export type ItemService = {
    id: number;
    sale: Sale;
    service: OpticalService;
};