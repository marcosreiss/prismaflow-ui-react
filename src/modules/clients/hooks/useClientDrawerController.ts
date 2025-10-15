import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";

import { useCreateClient, useUpdateClient } from "./useClient";
import { useNotification } from "@/context/NotificationContext";
import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "../types/clientTypes";
import type { Gender } from "../types/clientTypes"; // ✅ novo tipo
import { cleanPayload } from "@/utils/cleanPayload";

// ==========================
// 🔹 Tipagem local
// ==========================
type DrawerMode = "create" | "edit" | "view";

interface UseClientDrawerControllerProps {
  mode: DrawerMode;
  client?: Client | null;
  open: boolean;
  onCreated: (client: Client) => void;
  onUpdated: (client: Client) => void;
}

// ==========================
// 🔹 Hook principal
// ==========================
export function useClientDrawerController({
  mode,
  client,
  open,
  onCreated,
  onUpdated,
}: UseClientDrawerControllerProps) {
  const { addNotification } = useNotification();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isCreate = mode === "create";
  const isEdit = mode === "edit";
  const isView = mode === "view";

  // ==========================
  // 🔹 Formulário
  // ==========================
  const methods = useForm<CreateClientPayload>({
    defaultValues: {
      name: "",
      nickname: "",
      cpf: "",
      rg: "",
      bornDate: "",
      gender: "OTHER" as Gender, // ✅ valor padrão
      fatherName: "",
      motherName: "",
      spouse: "",
      email: "",
      company: "",
      occupation: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      uf: "",
      cep: "",
      complement: "",
      isBlacklisted: false,
      obs: "",
      phone01: "",
      phone02: "",
      phone03: "",
      reference01: "",
      reference02: "",
      reference03: "",
    },
  });

  const { reset, handleSubmit } = methods;

  // ==========================
  // 🔹 Hooks de mutação
  // ==========================
  const { mutateAsync: createClient, isPending: creating } = useCreateClient();
  const { mutateAsync: updateClient, isPending: updating } = useUpdateClient();

  // ==========================
  // 🔹 Efeitos
  // ==========================

  // foco automático no input nome
  useEffect(() => {
    if ((isCreate || isEdit) && open) {
      inputRef.current?.focus();
    }
  }, [isCreate, isEdit, open]);

  // reset de formulário ao abrir / trocar modo
  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    if ((isEdit || isView) && client) {
      reset({
        name: client.name,
        nickname: client.nickname ?? "",
        cpf: client.cpf ?? "",
        rg: client.rg ?? "",
        bornDate: client.bornDate ?? "",
        gender: (client.gender as Gender) ?? "OTHER", // ✅ novo campo
        fatherName: client.fatherName ?? "",
        motherName: client.motherName ?? "",
        spouse: client.spouse ?? "",
        email: client.email ?? "",
        company: client.company ?? "",
        occupation: client.occupation ?? "",
        street: client.street ?? "",
        number: client.number ?? "",
        neighborhood: client.neighborhood ?? "",
        city: client.city ?? "",
        uf: client.uf ?? "",
        cep: client.cep ?? "",
        complement: client.complement ?? "",
        isBlacklisted: client.isBlacklisted ?? false,
        obs: client.obs ?? "",
        phone01: client.phone01 ?? "",
        phone02: client.phone02 ?? "",
        phone03: client.phone03 ?? "",
        reference01: client.reference01 ?? "",
        reference02: client.reference02 ?? "",
        reference03: client.reference03 ?? "",
      });
    } else {
      reset({
        name: "",
        nickname: "",
        cpf: "",
        rg: "",
        bornDate: "",
        gender: "OTHER" as Gender, // ✅ padrão também no reset inicial
        fatherName: "",
        motherName: "",
        spouse: "",
        email: "",
        company: "",
        occupation: "",
        street: "",
        number: "",
        neighborhood: "",
        city: "",
        uf: "",
        cep: "",
        complement: "",
        isBlacklisted: false,
        obs: "",
        phone01: "",
        phone02: "",
        phone03: "",
        reference01: "",
        reference02: "",
        reference03: "",
      });
    }
  }, [open, isEdit, isView, client, reset]);

  // ==========================
  // 🔹 Submissão
  // ==========================
  const onSubmit = handleSubmit(async (values) => {
    try {
      // 🔹 remove campos vazios
      const cleaned = cleanPayload(values);

      if (isCreate) {
        const res = await createClient(cleaned as CreateClientPayload);
        if (res?.data) onCreated(res.data);
      } else if (isEdit && client) {
        const res = await updateClient({
          id: client.id,
          data: cleaned as UpdateClientPayload,
        });
        if (res?.data) onUpdated(res.data);
      }
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao salvar cliente.";
      addNotification(message, "error");
    }
  });

  // ==========================
  // 🔹 Retorno
  // ==========================
  return {
    methods,
    inputRef,
    onSubmit,
    isCreate,
    isEdit,
    isView,
    creating,
    updating,
  };
}
