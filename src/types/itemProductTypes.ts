import type { FrameDetails } from "./frameDetailsTypes";
import type { Product } from "./productTypes";
import type { Sale } from "./saleTypes";

export type ItemProduct = {
    id: number;
    sale: Sale;
    product: Product;
    quantity: number;
    stockQuantity: number;
    frameDetails: FrameDetails | Omit<FrameDetails, "id" | "itemProduct"> | null; // ✅ aceita incompleto
};


export type FrameMaterialType = "ACETATE" | "METAL" | "TR90" | "TITANIUM" | "MIXED";