import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";
import { useNotification } from "@/context/NotificationContext";
import type { ApiResponse } from "@/utils/apiResponse";

import {
  useCreatePrescription,
  useUpdatePrescription,
} from "./usePrescription";

import type {
  Prescription,
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
} from "../types/prescriptionTypes";

import {
  savePrescriptionDraft,
  loadPrescriptionDraft,
  clearPrescriptionDraft,
  hasPrescriptionDraft,
} from "@/utils/draftStorage";

// ==============================
// 🔹 Tipagem e modos
// ==============================
export type PrescriptionMode = "create" | "edit" | "view";

type UsePrescriptionModalControllerProps = {
  open: boolean;
  mode: PrescriptionMode;
  clientId: number | null;
  prescription?: Prescription | null;
  onCreated: (prescription: Prescription) => void;
  onUpdated: (prescription: Prescription) => void;
};

// ==============================
// 🔹 Helpers - Formatação
// ==============================

const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day))
  ).toISOString();
};

const formatDateForInput = (isoString: string | null): string => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
};

// ==============================
// 🔹 Helpers - Valores padrão
// ==============================

const getDefaultFormValues = (
  clientId: number | null,
  prescription?: Prescription | null
): CreatePrescriptionPayload => {
  const hasFarData = Boolean(
    prescription?.odSphericalFar ||
      prescription?.odCylindricalFar ||
      prescription?.odAxisFar ||
      prescription?.odDnpFar ||
      prescription?.oeSphericalFar ||
      prescription?.oeCylindricalFar ||
      prescription?.oeAxisFar ||
      prescription?.oeDnpFar
  );
  const hasNearData = Boolean(
    prescription?.odSphericalNear ||
      prescription?.odCylindricalNear ||
      prescription?.odAxisNear ||
      prescription?.odDnpNear ||
      prescription?.oeSphericalNear ||
      prescription?.oeCylindricalNear ||
      prescription?.oeAxisNear ||
      prescription?.oeDnpNear
  );

  const emptyValues: CreatePrescriptionPayload = {
    clientId: clientId ?? 0,
    prescriptionDate: "",
    doctorName: "",
    crm: "",
    odSphericalFar: "",
    odCylindricalFar: "",
    odAxisFar: "",
    odDnpFar: "",
    odSphericalNear: "",
    odCylindricalNear: "",
    odAxisNear: "",
    odDnpNear: "",
    oeSphericalFar: "",
    oeCylindricalFar: "",
    oeAxisFar: "",
    oeDnpFar: "",
    oeSphericalNear: "",
    oeCylindricalNear: "",
    oeAxisNear: "",
    oeDnpNear: "",
    odPellicleFar: "",
    odPellicleNear: "",
    oePellicleFar: "",
    oePellicleNear: "",
    frameAndRef: "",
    lensType: "",
    notes: "",
    additionRight: "",
    additionLeft: "",
    opticalCenterRight: "",
    opticalCenterLeft: "",
    monofocalVisionType: "far",
    isActive: true,
  };

  if (!prescription) {
    return emptyValues;
  }

  return {
    clientId: prescription.clientId,
    prescriptionDate: formatDateForInput(prescription.prescriptionDate),
    doctorName: prescription.doctorName ?? "",
    crm: prescription.crm ?? "",
    odSphericalFar: prescription.odSphericalFar ?? "",
    odCylindricalFar: prescription.odCylindricalFar ?? "",
    odAxisFar: prescription.odAxisFar ?? "",
    odDnpFar: prescription.odDnpFar ?? "",
    odSphericalNear: prescription.odSphericalNear ?? "",
    odCylindricalNear: prescription.odCylindricalNear ?? "",
    odAxisNear: prescription.odAxisNear ?? "",
    odDnpNear: prescription.odDnpNear ?? "",
    oeSphericalFar: prescription.oeSphericalFar ?? "",
    oeCylindricalFar: prescription.oeCylindricalFar ?? "",
    oeAxisFar: prescription.oeAxisFar ?? "",
    oeDnpFar: prescription.oeDnpFar ?? "",
    oeSphericalNear: prescription.oeSphericalNear ?? "",
    oeCylindricalNear: prescription.oeCylindricalNear ?? "",
    oeAxisNear: prescription.oeAxisNear ?? "",
    oeDnpNear: prescription.oeDnpNear ?? "",
    odPellicleFar: prescription.odPellicleFar ?? "",
    odPellicleNear: prescription.odPellicleNear ?? "",
    oePellicleFar: prescription.oePellicleFar ?? "",
    oePellicleNear: prescription.oePellicleNear ?? "",
    frameAndRef: prescription.frameAndRef ?? "",
    lensType: prescription.lensType ?? "",
    notes: prescription.notes ?? "",
    additionRight: prescription.additionRight ?? "",
    additionLeft: prescription.additionLeft ?? "",
    opticalCenterRight: prescription.opticalCenterRight ?? "",
    opticalCenterLeft: prescription.opticalCenterLeft ?? "",
    monofocalVisionType:
      prescription.lensType === "monofocal"
        ? hasNearData && !hasFarData
          ? "near"
          : "far"
        : "",
    isActive: prescription.isActive ?? true,
  };
};

// ==============================
// 🔹 Controller principal
// ==============================
export function usePrescriptionModalController({
  open,
  mode,
  clientId,
  prescription,
  onCreated,
  onUpdated,
}: UsePrescriptionModalControllerProps) {
  // ==============================
  // 🔹 Estado de mudanças
  // ==============================
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // ==============================
  // 🔹 Formulário
  // ==============================
  const methods = useForm<CreatePrescriptionPayload>({
    defaultValues: getDefaultFormValues(clientId, null),
  });

  const { reset, watch } = methods;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { addNotification } = useNotification();

  // ==============================
  // 🔹 Mutations
  // ==============================
  const { mutateAsync: createPrescription, isPending: creating } =
    useCreatePrescription();
  const { mutateAsync: updatePrescription, isPending: updating } =
    useUpdatePrescription();

  // ==============================
  // 🔹 Estados derivados
  // ==============================
  const isCreate = useMemo(() => mode === "create", [mode]);
  const isEdit = useMemo(() => mode === "edit", [mode]);
  const isView = useMemo(() => mode === "view", [mode]);

  // ==============================
  // 🔹 Funções de Draft
  // ==============================
  const saveDraft = useCallback(() => {
    const currentValues = methods.getValues();
    savePrescriptionDraft(clientId, currentValues);
    setHasUnsavedChanges(false);
    addNotification("Rascunho salvo com sucesso!", "success");
  }, [clientId, methods, addNotification]);

  const clearDraft = useCallback(() => {
    clearPrescriptionDraft(clientId);
    reset(getDefaultFormValues(clientId, null));
    setHasUnsavedChanges(false);
    setIsDirty(false);
    addNotification("Rascunho removido!", "info");
  }, [clientId, reset, addNotification]);

  const loadDraft = useCallback(() => {
    const draft = loadPrescriptionDraft(clientId);
    if (draft) {
      reset(draft);
      setHasUnsavedChanges(true);
      addNotification("Rascunho carregado!", "info");
    }
  }, [clientId, reset, addNotification]);

  // ==============================
  // 🔹 Preparação de payload
  // ==============================
  const preparePayloadForAPI = useCallback(
    (values: CreatePrescriptionPayload): CreatePrescriptionPayload => {
      const { monofocalVisionType, ...payload } = { ...values };

      if (payload.prescriptionDate) {
        payload.prescriptionDate = formatDateForAPI(payload.prescriptionDate);
      }

      if (isCreate && clientId) {
        payload.clientId = clientId;
      }

      if (payload.lensType !== "bifocal") {
        payload.odPellicleFar = "";
        payload.odPellicleNear = "";
        payload.oePellicleFar = "";
        payload.oePellicleNear = "";
      }

      if (payload.lensType === "monofocal") {
        payload.additionRight = "";
        payload.additionLeft = "";

        if (monofocalVisionType === "near") {
          payload.odSphericalFar = "";
          payload.odCylindricalFar = "";
          payload.odAxisFar = "";
          payload.odDnpFar = "";
          payload.oeSphericalFar = "";
          payload.oeCylindricalFar = "";
          payload.oeAxisFar = "";
          payload.oeDnpFar = "";
        } else {
          payload.odSphericalNear = "";
          payload.odCylindricalNear = "";
          payload.odAxisNear = "";
          payload.odDnpNear = "";
          payload.oeSphericalNear = "";
          payload.oeCylindricalNear = "";
          payload.oeAxisNear = "";
          payload.oeDnpNear = "";
        }
      }

      return payload;
    },
    [isCreate, clientId]
  );

  // ==============================
  // 🔹 Submissão do formulário
  // ==============================
  const handleSubmit = useCallback(
    async (values: CreatePrescriptionPayload) => {
      try {
        if (!clientId) {
          addNotification(
            "Cliente não identificado para esta receita.",
            "error"
          );
          return;
        }

        const payload = preparePayloadForAPI(values);

        if (isCreate) {
          const res = await createPrescription(payload);
          if (res?.data) {
            clearPrescriptionDraft(clientId);
            setHasUnsavedChanges(false);
            addNotification("Receita criada com sucesso!", "success");
            onCreated(res.data);
          }
        } else if (isEdit && prescription) {
          const res = await updatePrescription({
            id: prescription.id,
            data: payload as UpdatePrescriptionPayload,
          });
          if (res?.data) {
            clearPrescriptionDraft(clientId);
            setHasUnsavedChanges(false);
            addNotification("Receita atualizada com sucesso!", "success");
            onUpdated(res.data);
          }
        }
      } catch (error) {
        const axiosErr = error as AxiosError<ApiResponse<null>>;

        const defaultMessage = isCreate
          ? "Erro ao criar receita."
          : "Erro ao atualizar receita.";

        const message = axiosErr.response?.data?.message ?? defaultMessage;

        addNotification(message, "error");

        if (process.env.NODE_ENV === "development") {
          console.error("Prescription error:", {
            error,
            payload: preparePayloadForAPI(values),
            mode,
          });
        }
      }
    },
    [
      clientId,
      isCreate,
      isEdit,
      prescription,
      preparePayloadForAPI,
      createPrescription,
      updatePrescription,
      addNotification,
      onCreated,
      onUpdated,
      mode,
    ]
  );

  // ==============================
  // 🔹 Efeitos
  // ==============================

  // Monitorar mudanças no formulário
  useEffect(() => {
    if (!open || isView) return;

    const subscription = watch(() => {
      setIsDirty(true);
      setHasUnsavedChanges(true);
    });

    return () => subscription.unsubscribe();
  }, [watch, open, isView]);

  // Validação antecipada de clientId
  useEffect(() => {
    if (open && !clientId && (isCreate || isEdit)) {
      addNotification("Cliente não identificado para esta receita.", "error");
    }
  }, [open, clientId, isCreate, isEdit, addNotification]);

  // Foco no primeiro campo ao abrir
  useEffect(() => {
    if ((isCreate || isEdit) && open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open, isCreate, isEdit]);

  // Gerenciamento do formulário (reset/preencher/carregar draft)
  useEffect(() => {
    if (!open) {
      reset(getDefaultFormValues(clientId, null));
      setHasUnsavedChanges(false);
      setIsDirty(false);
      return;
    }

    if ((isEdit || isView) && prescription) {
      reset(getDefaultFormValues(clientId, prescription));
      setHasUnsavedChanges(false);
      setIsDirty(false);
    } else if (isCreate) {
      // Tentar carregar rascunho salvo
      const draft = loadPrescriptionDraft(clientId);
      if (draft) {
        reset(draft);
        setHasUnsavedChanges(true);
      } else {
        reset(getDefaultFormValues(clientId, null));
        setHasUnsavedChanges(false);
      }
      setIsDirty(false);
    }
  }, [open, isEdit, isView, isCreate, prescription, clientId, reset]);

  // ==============================
  // 🔹 Retorno do controller
  // ==============================
  return {
    methods,
    inputRef,
    handleSubmit: methods.handleSubmit(handleSubmit),
    creating,
    updating,
    isCreate,
    isEdit,
    isView,
    saveDraft,
    clearDraft,
    loadDraft,
    hasDraft: hasPrescriptionDraft(clientId),
    hasUnsavedChanges,
    isDirty,
  };
}
