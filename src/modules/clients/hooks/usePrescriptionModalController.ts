import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";
import { useNotification } from "@/context/NotificationContext";
import type { ApiResponse } from "@/types/apiResponse";

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
    defaultValues: {
      clientId: clientId ?? 0,
      doctorName: "",
      crm: "",
      prescriptionDate: "",
      odSpherical: "",
      odCylindrical: "",
      odAxis: "",
      odDnp: "",
      oeSpherical: "",
      oeCylindrical: "",
      oeAxis: "",
      oeDnp: "",
      additionRight: "",
      additionLeft: "",
      opticalCenterRight: "",
      opticalCenterLeft: "",
      isActive: true,
    },
  });

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
  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  // ==============================
  // 🔹 Efeitos
  // ==============================

  // foco inicial
  useEffect(() => {
    if ((isCreate || isEdit) && open) {
      inputRef.current?.focus();
    }
  }, [open, isCreate, isEdit]);

  // preencher ou limpar form
  useEffect(() => {
    if (!open) {
      methods.reset();
      return;
    }

    if ((isEdit || isView) && prescription) {
      methods.reset({
        clientId: prescription.clientId,
        prescriptionDate: prescription.prescriptionDate
          ? new Date(prescription.prescriptionDate).toISOString().split("T")[0]
          : "",
        doctorName: prescription.doctorName ?? "",
        crm: prescription.crm ?? "",
        odSpherical: prescription.odSpherical ?? "",
        odCylindrical: prescription.odCylindrical ?? "",
        odAxis: prescription.odAxis ?? "",
        odDnp: prescription.odDnp ?? "",
        oeSpherical: prescription.oeSpherical ?? "",
        oeCylindrical: prescription.oeCylindrical ?? "",
        oeAxis: prescription.oeAxis ?? "",
        oeDnp: prescription.oeDnp ?? "",
        additionRight: prescription.additionRight ?? "",
        additionLeft: prescription.additionLeft ?? "",
        opticalCenterRight: prescription.opticalCenterRight ?? "",
        opticalCenterLeft: prescription.opticalCenterLeft ?? "",
        isActive: prescription.isActive ?? true,
      });
    } else {
      methods.reset({
        clientId: clientId ?? 0,
        prescriptionDate: "",
        doctorName: "",
        crm: "",
        odSpherical: "",
        odCylindrical: "",
        odAxis: "",
        odDnp: "",
        oeSpherical: "",
        oeCylindrical: "",
        oeAxis: "",
        oeDnp: "",
        additionRight: "",
        additionLeft: "",
        opticalCenterRight: "",
        opticalCenterLeft: "",
        isActive: true,
      });
    }
  }, [open, isCreate, isEdit, isView, prescription, clientId, methods]);

  // ==============================
  // 🔹 Submissão do formulário
  // ==============================
  // ==============================
  // 🔹 Submissão do formulário (VERSÃO CORRIGIDA)
  // ==============================
  const handleSubmit = methods.handleSubmit(async (values) => {
    try {
      if (!clientId) {
        addNotification("Cliente não identificado para esta receita.", "error");
        return;
      }

      // AQUI ESTÁ A CORREÇÃO:
      // 1. Criamos uma cópia dos dados do formulário para poder modificá-la.
      const dataToSend = { ...values };

      // 2. Verificamos se a data foi preenchida e a convertemos para o formato ISO.
      if (dataToSend.prescriptionDate) {
        // NOTA: Usamos T12:00:00 para evitar problemas de fuso horário (timezone)
        // que poderiam fazer a data ser salva como o dia anterior.
        // Esta é uma forma segura de lidar com datas sem hora específica.
        dataToSend.prescriptionDate = new Date(`${dataToSend.prescriptionDate}T12:00:00.000Z`).toISOString();
      }

      // 3. Usamos o objeto 'dataToSend' com a data corrigida nas chamadas da API.
      if (isCreate) {
        const res = await createPrescription({
          ...dataToSend,
          clientId,
        } as CreatePrescriptionPayload);

        if (res?.data) onCreated(res.data);
      } else if (isEdit && prescription) {
        const res = await updatePrescription({
          id: prescription.id,
          data: dataToSend as UpdatePrescriptionPayload,
        });

        if (res?.data) onUpdated(res.data);
      }
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao salvar receita.";
      addNotification(message, "error");
    }
  });

  // ==============================
  // 🔹 Retorno do controller
  // ==============================
  return {
    methods,
    inputRef,
    handleSubmit,
    creating,
    updating,
    isCreate,
    isEdit,
    isView,
  };
}
