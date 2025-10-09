import { useNotification } from "@/context/NotificationContext";
import type { SalePayload } from "../types/salesTypes";

const STORAGE_KEY = "saleFormDraft";

export const useSaleDraft = (resetForm: (data?: SalePayload) => void) => {
  const { addNotification } = useNotification();

  const saveDraft = (data: SalePayload) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    addNotification("Rascunho salvo com sucesso!", "info");
  };

  const loadDraft = () => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (!draft) return null;
    const parsed = JSON.parse(draft);
    resetForm(parsed);
    addNotification("Rascunho carregado!", "success");
    return parsed;
  };

  const clearDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    resetForm();
    addNotification("Rascunho apagado.", "warning");
  };

  return { saveDraft, loadDraft, clearDraft };
};
