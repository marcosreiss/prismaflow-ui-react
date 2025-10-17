import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNotification } from "@/context/NotificationContext";
import {
    useCreatePayment,
    useUpdatePayment,
    useUpdatePaymentStatus,
    useProcessPaymentInstallment
} from "./usePayments";
import { useGetSales } from "@/modules/sales/hooks/useSales";
import type { Sale } from "@/modules/sales/types/salesTypes";
import type {
    Payment,
    PaymentDetails,
    CreatePaymentPayload,
    UpdatePaymentPayload,
    PaymentMethod,
    PaymentStatus,
} from "../types/paymentTypes";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";

// ==============================
// 🔹 Tipagens
// ==============================
export type PaymentDrawerMode = "create" | "edit" | "view";

interface UsePaymentDrawerControllerProps {
    mode: PaymentDrawerMode;
    payment?: PaymentDetails | null;
    onCreated: (payment: Payment) => void;
    onUpdated: (payment: Payment) => void;
    onEdit: () => void;
    onDelete: (payment: Payment) => void;
    onUpdateStatus: (paymentId: number, status: PaymentStatus) => void; // Mude string para PaymentStatus
    onProcessInstallment: (paymentId: number, installmentId: number, paidAmount: number) => void;
    onCreateNew: () => void;
}

// Valores usados no FORM
type PaymentFormValues = {
    saleId: number;
    method: PaymentMethod;
    status: PaymentStatus;
    total: number;
    discount: number;
    downPayment: number;
    installmentsTotal: number;
    firstDueDate: string;
};

// ==============================
// 🔹 Hook principal
// ==============================
export function usePaymentDrawerController({
    mode,
    payment,
    onCreated,
    onUpdated,
    onEdit,
    onDelete,
    onUpdateStatus,
    onProcessInstallment,
    onCreateNew,
}: UsePaymentDrawerControllerProps) {
    const { addNotification } = useNotification();

    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [showInstallments, setShowInstallments] = useState(false);

    const { mutateAsync: createPayment, isPending: creating } = useCreatePayment();
    const { mutateAsync: updatePayment, isPending: updating } = useUpdatePayment();
    const { mutateAsync: updateStatus, isPending: updatingStatus } = useUpdatePaymentStatus();
    const { mutateAsync: processInstallment, isPending: processingInstallment } = useProcessPaymentInstallment();

    // ==========================
    // 🔹 Formulário
    // ==========================
    const methods = useForm<PaymentFormValues>({
        defaultValues: {
            saleId: 0,
            method: "MONEY" as PaymentMethod,
            status: "PENDING" as PaymentStatus,
            total: 0,
            discount: 0,
            downPayment: 0,
            installmentsTotal: 0,
            firstDueDate: new Date().toISOString().split('T')[0],
        },
    });

    const { watch, setValue, reset } = methods;

    // ==========================
    // 🔹 Vendas (autocomplete) - CORRIGIDO
    // ==========================
    const { data: saleData } = useGetSales(
        1,     // page
        100,   // limit
        undefined // clientId (opcional)
    );

    const saleOptions = useMemo(() => {
        // Baseado na estrutura do SalesResponse
        if (saleData?.data?.content) {
            return saleData.data.content;
        }
        return [];
    }, [saleData]);

    // ==========================
    // 🔹 Efeitos (carregar pagamento)
    // ==========================
    useEffect(() => {
        if ((mode === "edit" || mode === "view") && payment) {
            reset({
                saleId: payment.saleId,
                method: payment.method || "MONEY",
                status: payment.status,
                total: payment.total,
                discount: payment.discount,
                downPayment: payment.downPayment,
                installmentsTotal: payment.installmentsTotal || 0,
                firstDueDate: payment.firstDueDate || new Date().toISOString().split('T')[0],
            });

            // Encontrar a venda correspondente
            const sale = saleOptions.find((s: Sale) => s.id === payment.saleId);
            setSelectedSale(sale || null);

            // Mostrar campos de parcelamento se necessário
            setShowInstallments(payment.method === "INSTALLMENT");
        } else if (mode === "create") {
            reset({
                saleId: 0,
                method: "MONEY",
                status: "PENDING",
                total: 0,
                discount: 0,
                downPayment: 0,
                installmentsTotal: 0,
                firstDueDate: new Date().toISOString().split('T')[0],
            });
            setSelectedSale(null);
            setShowInstallments(false);
        }
    }, [mode, payment, reset, saleOptions]);

    // Watch form values
    const method = watch("method");
    const total = watch("total");
    const discount = watch("discount");
    const downPayment = watch("downPayment");

    // ==========================
    // 🔹 Cálculos automáticos
    // ==========================
    useEffect(() => {
        // Mostrar/ocultar campos de parcelamento
        setShowInstallments(method === "INSTALLMENT");

        if (method === "INSTALLMENT") {
            // Calcular valor total das parcelas (total - entrada - desconto)
            const installmentsValue = total - discount - downPayment;
            if (installmentsValue > 0) {
                setValue("installmentsTotal", installmentsValue);
            }
        } else {
            // Resetar campos de parcelamento para outros métodos
            setValue("downPayment", 0);
            setValue("installmentsTotal", 0);
        }
    }, [method, total, discount, downPayment, setValue]);


    // ==========================
    // 🔹 Submit
    // ==========================
    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            if (values.total <= 0) {
                addNotification("Valor total deve ser maior que zero.", "error");
                return;
            }

            if (!values.saleId) {
                addNotification("Selecione uma venda.", "error");
                return;
            }

            if (mode === "create") {
                // Payload para criação
                const payload: CreatePaymentPayload = {
                    saleId: values.saleId,
                    method: values.method,
                    status: "PENDING",
                    total: Math.max(0, values.total),
                    discount: Math.max(0, values.discount),
                    downPayment: Math.max(0, values.downPayment),
                    installmentsTotal: Math.max(0, values.installmentsTotal),
                    paidAmount: 0,
                    installmentsPaid: 0,
                    branchId: "br_01j9xyz72h",
                    tenantId: "ten_01j8b32v7x",
                    ...(values.method === "INSTALLMENT" && {
                        firstDueDate: values.firstDueDate ? new Date(values.firstDueDate).toISOString() : undefined,
                    }),
                };

                // Para métodos que não são INSTALLMENT, ajustar campos
                if (values.method !== "INSTALLMENT") {
                    payload.downPayment = 0;
                    payload.installmentsTotal = 0;
                    payload.firstDueDate = undefined;
                }

                const res = await createPayment(payload);
                if (res?.data) {
                    onCreated(res.data);
                    addNotification("Pagamento criado com sucesso!", "success");
                }
            } else if (mode === "edit" && payment) {
                // Payload para atualização - APENAS campos permitidos
                const updatePayload: UpdatePaymentPayload = {
                    method: values.method,
                    status: values.status,
                    total: Math.max(0, values.total),
                    discount: Math.max(0, values.discount),
                    // NÃO incluir: id, saleId, branchId, tenantId
                };

                // Apenas adicionar campos de parcelamento se for INSTALLMENT
                if (values.method === "INSTALLMENT") {
                    updatePayload.downPayment = Math.max(0, values.downPayment);
                    updatePayload.installmentsTotal = Math.max(0, values.installmentsTotal);
                    updatePayload.firstDueDate = values.firstDueDate ? new Date(values.firstDueDate).toISOString() : undefined;
                } else {
                    // Para outros métodos, garantir valores zerados
                    updatePayload.downPayment = 0;
                    updatePayload.installmentsTotal = 0;
                    updatePayload.firstDueDate = undefined;
                }

                // Remover campos que são 0
                if (updatePayload.discount === 0) delete updatePayload.discount;
                if (updatePayload.downPayment === 0) delete updatePayload.downPayment;
                if (updatePayload.installmentsTotal === 0) delete updatePayload.installmentsTotal;

                const res = await updatePayment({
                    id: payment.id,
                    data: updatePayload
                });
                if (res?.data) {
                    onUpdated(res.data);
                    addNotification("Pagamento atualizado com sucesso!", "success");
                }
            }
        } catch (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr.response?.data?.message ?? "Erro ao salvar pagamento.";
            addNotification(message, "error");
        }
    });

    // ==========================
    // 🔹 Handlers específicos para pagamentos
    // ==========================
    const handleSaleChange = (sale: Sale | null) => {
        setSelectedSale(sale);
        if (sale) {
            setValue("saleId", sale.id);
            // Se estiver criando, preencher o total com o valor da venda
            if (mode === "create") {
                setValue("total", sale.total);
            }
        } else {
            setValue("saleId", 0);
            if (mode === "create") {
                setValue("total", 0);
            }
        }
    };

    const handleMethodChange = (methodValue: PaymentMethod) => { // Mude string para PaymentMethod
        setShowInstallments(methodValue === "INSTALLMENT");
    };

    const handleStatusChange = async (statusValue: PaymentStatus) => {
        if (mode === "edit" && payment) {
            try {
                const res = await updateStatus({
                    id: payment.id,
                    status: statusValue
                });
                addNotification("Status do pagamento atualizado!", "success");

                // 🔄 ATUALIZAR O PAYMENT LOCAL COM OS NOVOS DADOS
                if (res?.data) {
                    const updatedPayment = {
                        ...payment,
                        ...res.data, // Usa os dados atualizados da resposta
                        status: statusValue
                    };
                    onUpdated(updatedPayment as Payment);
                }

            } catch (error) {
                const axiosErr = error as AxiosError<ApiResponse<null>>;
                const message =
                    axiosErr.response?.data?.message ?? "Erro ao atualizar status.";
                addNotification(message, "error");
            }
        }
    };

    const handleProcessInstallment = async (installmentId: number, paidAmount: number) => {
        if (!payment) return;

        try {
            await processInstallment({
                paymentId: payment.id,
                installmentId,
                paidAmount
            });
            addNotification("Parcela processada com sucesso!", "success");

            // Chamar callback para atualizar a UI
            onProcessInstallment(payment.id, installmentId, paidAmount);
        } catch (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr.response?.data?.message ?? "Erro ao processar parcela.";
            addNotification(message, "error");
        }
    };

    // ==========================
    // 🔹 Retorno
    // ==========================
    return {
        // form
        methods,
        handleSubmit,

        // estados
        creating,
        updating,
        updatingStatus,
        processingInstallment,
        selectedSale,
        showInstallments,

        // dados
        saleOptions,
        mode,
        payment,

        // callbacks vindos do drawer/pai
        onEdit,
        onDelete,
        onUpdateStatus,
        onProcessInstallment,
        onCreateNew,

        // handlers
        handleSaleChange,
        handleMethodChange,
        handleStatusChange,
        handleProcessInstallment,
    };
}