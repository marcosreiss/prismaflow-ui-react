import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNotification } from "@/context/NotificationContext";
import { useConfigurePayment, useUpdatePaymentStatus } from "./usePayments";

import type { PaymentFormValues } from "../types/paymentFormTypes";
import type {
  ConfigurePaymentPayload,
  PaymentMethodPayload,
} from "../types/paymentPayloads";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import type { Payment, PaymentDetails, PaymentStatus } from "../types";

// ==============================
// Tipagens
// ==============================
export type PaymentDrawerMode = "edit" | "view";

interface UsePaymentDrawerControllerProps {
  mode: PaymentDrawerMode;
  payment?: PaymentDetails | null;
  onUpdated: (payment: Payment) => void;
  onEdit: () => void;
  onDelete: (payment: Payment) => void;
  onUpdateStatus: (
    paymentId: number,
    status: PaymentStatus,
    reason?: string,
  ) => void;
  onPayInstallment: (
    installmentId: number,
    paidAmount: number,
    paidAt?: string,
  ) => void;
}

// ==============================
// Hook principal
// ==============================
export function usePaymentDrawerController({
  mode,
  payment,
  onUpdated,
  onEdit,
  onDelete,
  onUpdateStatus,
  onPayInstallment,
}: UsePaymentDrawerControllerProps) {
  const { addNotification } = useNotification();

  const { mutateAsync: configurePayment, isPending: configuring } =
    useConfigurePayment();
  const { mutateAsync: updateStatus } = useUpdatePaymentStatus();

  // ==========================
  // Formulário
  // ==========================
  const methods = useForm<PaymentFormValues>({
    defaultValues: {
      saleId: 0,
      total: 0,
      discount: 0,
      status: "PENDING",
      methods: [],
    },
  });

  const { reset, handleSubmit } = methods;

  // ==========================
  // Carregar dados no formulário ao abrir
  // ==========================
  useEffect(() => {
    if ((mode === "edit" || mode === "view") && payment) {
      reset({
        saleId: payment.saleId,
        total: payment.total,
        discount: payment.discount,
        status: payment.status,
        methods: payment.methods.map((m) => ({
          _key: crypto.randomUUID(),
          method: m.method,
          amount: m.amount,
          // paidAt é preservado para exibição — não editável após isPaid = true
          paidAt: m.paidAt ?? undefined,
          installments: m.installments,
          firstDueDate: m.firstDueDate
            ? m.firstDueDate.split("T")[0]
            : undefined,
        })),
      });
    }
  }, [mode, payment, reset]);

  // ==========================
  // Submit — configura methods[] via PUT /payments/:id
  // Só disponível no modo edit
  // ==========================
  const onSubmit = handleSubmit(async (values) => {
    if (!payment) return;

    try {
      if (values.total <= 0) {
        addNotification("Valor total deve ser maior que zero.", "error");
        return;
      }

      const methodsSum = values.methods.reduce((acc, m) => acc + m.amount, 0);
      const diff = Math.abs(methodsSum - values.total);

      if (diff > 0.01) {
        addNotification(
          `A soma dos métodos (R$ ${methodsSum.toFixed(2)}) não corresponde ao total (R$ ${values.total.toFixed(2)}).`,
          "error",
        );
        return;
      }

      // Métodos à vista exigem paidAt — validação antes de montar o payload
      const missingPaidAt = values.methods.some(
        (m) => m.method !== "INSTALLMENT" && !m.paidAt,
      );

      if (missingPaidAt) {
        addNotification(
          "Informe a data de pagamento para todos os métodos à vista.",
          "error",
        );
        return;
      }

      const missingFirstDueDate = values.methods.some(
        (m) => m.method === "INSTALLMENT" && !m.firstDueDate,
      );

      if (missingFirstDueDate) {
        addNotification(
          "Informe a primeira data de vencimento para o método de parcelamento.",
          "error",
        );
        return;
      }

      const payload: ConfigurePaymentPayload = {
        total: values.total,
        methods: values.methods.map(
          (m): PaymentMethodPayload => ({
            method: m.method,
            amount: m.amount,
            ...(m.method !== "INSTALLMENT" && {
              paidAt: new Date(m.paidAt!).toISOString(),
            }),
            ...(m.method === "INSTALLMENT" && {
              installments: m.installments,
              firstDueDate: m.firstDueDate
                ? new Date(m.firstDueDate).toISOString()
                : undefined,
            }),
          }),
        ),
      };

      const res = await configurePayment({ id: payment.id, data: payload });
      if (res?.data) {
        onUpdated(res.data);
        addNotification("Pagamento configurado com sucesso!", "success");
      }
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao configurar pagamento.";
      addNotification(message, "error");
    }
  });

  // ==========================
  // Handlers
  // ==========================

  // Troca de status — exclusiva do modo view
  const handleStatusChange = async (
    statusValue: PaymentStatus,
    reason?: string,
  ) => {
    if (mode !== "view" || !payment) return;

    try {
      const res = await updateStatus({
        id: payment.id,
        status: statusValue,
        reason,
      });
      if (res?.data) {
        addNotification("Status do pagamento atualizado!", "success");
        onUpdateStatus(payment.id, statusValue, reason);
      }
    } catch (error) {
      const axiosErr = error as AxiosError<ApiResponse<null>>;
      const message =
        axiosErr.response?.data?.message ?? "Erro ao atualizar status.";
      addNotification(message, "error");
    }
  };

  // Apenas repassa para o callback da página — a mutation vive no page controller
  const handlePayInstallment = (
    installmentId: number,
    paidAmount: number,
    paidAt?: string,
  ) => {
    onPayInstallment(installmentId, paidAmount, paidAt);
  };

  // ==========================
  // Retorno
  // ==========================
  return {
    // form
    methods,
    handleSubmit: onSubmit,

    // estados
    configuring,

    // dados
    mode,
    payment,

    // callbacks repassados para o JSX
    onEdit,
    onDelete,
    onUpdateStatus,
    onPayInstallment,

    // handlers
    handleStatusChange,
    handlePayInstallment,
  };
}
