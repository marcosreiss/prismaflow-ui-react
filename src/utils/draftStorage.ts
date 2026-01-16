import type { CreatePrescriptionPayload } from "@/modules/clients/types/prescriptionTypes";

const DRAFT_PREFIX = "pf.prescription.draft";

interface DraftData {
  data: CreatePrescriptionPayload;
  timestamp: number;
}

export function savePrescriptionDraft(
  clientId: number | null,
  data: CreatePrescriptionPayload
): void {
  try {
    const key = `${DRAFT_PREFIX}.${clientId ?? "new"}`;
    const payload: DraftData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (error) {
    console.error("Erro ao salvar rascunho:", error);
  }
}

export function loadPrescriptionDraft(
  clientId: number | null
): CreatePrescriptionPayload | null {
  try {
    const key = `${DRAFT_PREFIX}.${clientId ?? "new"}`;
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed: DraftData = JSON.parse(stored);
    return parsed.data;
  } catch (error) {
    console.error("Erro ao carregar rascunho:", error);
    return null;
  }
}

export function clearPrescriptionDraft(clientId: number | null): void {
  try {
    const key = `${DRAFT_PREFIX}.${clientId ?? "new"}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Erro ao limpar rascunho:", error);
  }
}

export function hasPrescriptionDraft(clientId: number | null): boolean {
  try {
    const key = `${DRAFT_PREFIX}.${clientId ?? "new"}`;
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}
