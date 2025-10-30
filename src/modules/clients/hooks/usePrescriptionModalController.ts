import { useEffect, useRef, useMemo, useCallback } from "react";
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

/**
 * Converte data do formato YYYY-MM-DD para ISO string UTC
 * Evita problemas de timezone ao enviar para API
 */
const formatDateForAPI = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toISOString();
};

/**
 * Converte data ISO para formato YYYY-MM-DD para inputs do tipo date
 */
const formatDateForInput = (isoString: string | null): string => {
  if (!isoString) return "";
  return new Date(isoString).toISOString().split("T")[0];
};

// ==============================
// 🔹 Helpers - Valores padrão
// ==============================

/**
 * Gera valores default para o formulário
 * - Se prescription existe: preenche com dados existentes
 * - Se não existe: retorna campos vazios
 */
const getDefaultFormValues = (
  clientId: number | null,
  prescription?: Prescription | null
): CreatePrescriptionPayload => {
  const emptyValues: CreatePrescriptionPayload = {
    clientId: clientId ?? 0,
    prescriptionDate: "",
    doctorName: "",
    crm: "",

    // OD - Longe
    odSphericalFar: "",
    odCylindricalFar: "",
    odAxisFar: "",
    odDnpFar: "",

    // OD - Perto
    odSphericalNear: "",
    odCylindricalNear: "",
    odAxisNear: "",
    odDnpNear: "",

    // OE - Longe
    oeSphericalFar: "",
    oeCylindricalFar: "",
    oeAxisFar: "",
    oeDnpFar: "",

    // OE - Perto
    oeSphericalNear: "",
    oeCylindricalNear: "",
    oeAxisNear: "",
    oeDnpNear: "",

    // Películas
    odPellicleFar: "",
    odPellicleNear: "",
    oePellicleFar: "",
    oePellicleNear: "",

    // Gerais
    frameAndRef: "",
    lensType: "",
    notes: "",
    additionRight: "",
    additionLeft: "",
    opticalCenterRight: "",
    opticalCenterLeft: "",
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

    // OD - Longe
    odSphericalFar: prescription.odSphericalFar ?? "",
    odCylindricalFar: prescription.odCylindricalFar ?? "",
    odAxisFar: prescription.odAxisFar ?? "",
    odDnpFar: prescription.odDnpFar ?? "",

    // OD - Perto
    odSphericalNear: prescription.odSphericalNear ?? "",
    odCylindricalNear: prescription.odCylindricalNear ?? "",
    odAxisNear: prescription.odAxisNear ?? "",
    odDnpNear: prescription.odDnpNear ?? "",

    // OE - Longe
    oeSphericalFar: prescription.oeSphericalFar ?? "",
    oeCylindricalFar: prescription.oeCylindricalFar ?? "",
    oeAxisFar: prescription.oeAxisFar ?? "",
    oeDnpFar: prescription.oeDnpFar ?? "",

    // OE - Perto
    oeSphericalNear: prescription.oeSphericalNear ?? "",
    oeCylindricalNear: prescription.oeCylindricalNear ?? "",
    oeAxisNear: prescription.oeAxisNear ?? "",
    oeDnpNear: prescription.oeDnpNear ?? "",

    // Películas
    odPellicleFar: prescription.odPellicleFar ?? "",
    odPellicleNear: prescription.odPellicleNear ?? "",
    oePellicleFar: prescription.oePellicleFar ?? "",
    oePellicleNear: prescription.oePellicleNear ?? "",

    // Gerais
    frameAndRef: prescription.frameAndRef ?? "",
    lensType: prescription.lensType ?? "",
    notes: prescription.notes ?? "",
    additionRight: prescription.additionRight ?? "",
    additionLeft: prescription.additionLeft ?? "",
    opticalCenterRight: prescription.opticalCenterRight ?? "",
    opticalCenterLeft: prescription.opticalCenterLeft ?? "",
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
  // 🔹 Formulário
  // ==============================
  const methods = useForm<CreatePrescriptionPayload>({
    defaultValues: getDefaultFormValues(clientId, null),
  });

  const { reset } = methods;
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
  // 🔹 Preparação de payload
  // ==============================
  const preparePayloadForAPI = useCallback(
    (values: CreatePrescriptionPayload): CreatePrescriptionPayload => {
      const payload = { ...values };

      // Formata data para ISO UTC
      if (payload.prescriptionDate) {
        payload.prescriptionDate = formatDateForAPI(payload.prescriptionDate);
      }

      // Garante clientId correto na criação
      if (isCreate && clientId) {
        payload.clientId = clientId;
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
        // Validação de clientId
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
            addNotification("Receita criada com sucesso!", "success");
            onCreated(res.data);
          }
        } else if (isEdit && prescription) {
          const res = await updatePrescription({
            id: prescription.id,
            data: payload as UpdatePrescriptionPayload,
          });
          if (res?.data) {
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

        // Log apenas em desenvolvimento
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

  // Validação antecipada de clientId
  useEffect(() => {
    if (open && !clientId && (isCreate || isEdit)) {
      addNotification(
        "Cliente não identificado para esta receita.",
        "error"
      );
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

  // Gerenciamento do formulário (reset/preencher)
  useEffect(() => {
    if (!open) {
      // Limpa formulário ao fechar
      reset(getDefaultFormValues(clientId, null));
      return;
    }

    // Preenche com dados da receita em edit/view
    if ((isEdit || isView) && prescription) {
      reset(getDefaultFormValues(clientId, prescription));
    } else {
      // Limpa formulário em create
      reset(getDefaultFormValues(clientId, null));
    }
  }, [open, isEdit, isView, prescription, clientId, reset]);

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
  };
}
