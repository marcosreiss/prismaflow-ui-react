import { useEffect, useRef } from "react";
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
      });
    } else {
      methods.reset({
        clientId: clientId ?? 0,
        doctorName: "",
        crm: "",
        prescriptionDate: "",

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
      });
    }
  }, [open, isCreate, isEdit, isView, prescription, clientId, methods]);

  // ==============================
  // 🔹 Submissão do formulário
  // ==============================
  const handleSubmit = methods.handleSubmit(async (values) => {
    try {
      if (!clientId) {
        addNotification("Cliente não identificado para esta receita.", "error");
        return;
      }

      const dataToSend = { ...values };

      if (dataToSend.prescriptionDate) {
        dataToSend.prescriptionDate = new Date(
          `${dataToSend.prescriptionDate}T12:00:00.000Z`
        ).toISOString();
      }

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
