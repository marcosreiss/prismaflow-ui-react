import type { ItemProduct } from "./itemProductTypes";

// Replicando o Enum de materiais do backend
export type FrameMaterialType = "ACETATE" | "METAL" | "TITANIUM" | "TR90" | "OTHER";


export type FrameDetails = {
    id: number;
    itemProduct: ItemProduct;
    material: FrameMaterialType;
    reference: string | null;
    color: string | null;
};

// Objeto opcional para mapear os tipos para rótulos na UI
export const FrameMaterialTypeLabels: Record<FrameMaterialType, string> = {
    ACETATE: "Acetato",
    METAL: "Metal",
    TITANIUM: "Titânio",
    TR90: "TR-90",
    OTHER: "Outro",
};
