/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ItemProduct } from "./itemProductTypes";
import type { ProtocolCreate } from "./protocolTypes";

export type Sale = {
  id: number;
  client?: any;
  productItems: ItemProduct[];
  clientName: string;
  serviceItems: Array<{
    service: any;
  }>;
  discount: number;
  notes: string;
  isActive: boolean;
  subtotal: number;
  total: number;
  protocol?: ProtocolCreate; // Usar o tipo de criação
  createdAt: string;
  updatedAt?: string;
};
