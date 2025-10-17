import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    TextField,
    CircularProgress,
    Stack,
    Autocomplete,
    MenuItem,
} from "@mui/material";
import { X, Pencil, Trash2, CreditCard, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, FormProvider } from "react-hook-form";

import { usePaymentDrawerController } from "../hooks/usePaymentDrawerController";
import PaymentView from "./PaymentView";
import { PaymentMethodLabels, PaymentStatusLabels } from "../types/paymentTypes";

import type { Payment, PaymentDetails, PaymentStatus, PaymentMethod } from "../types/paymentTypes";
import type { Sale } from "@/modules/sales/types/salesTypes";
import CurrencyInput from "@/components/imask/CurrencyInput";

// ==============================
// 🔹 Tipagens
// ==============================
interface PaymentDrawerProps {
    open: boolean;
    mode: "create" | "edit" | "view";
    payment?: PaymentDetails | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (payment: Payment) => void;
    onUpdateStatus: (paymentId: number, status: PaymentStatus) => void;
    onProcessInstallment: (paymentId: number, installmentId: number, paidAmount: number) => void;
    onCreated: (payment: Payment) => void;
    onUpdated: (payment: Payment) => void;
    onCreateNew: () => void;
}

// ==============================
// 🔹 Componente principal
// ==============================
export default function PaymentDrawer({
    open,
    mode,
    payment,
    onClose,
    onEdit,
    onDelete,
    onUpdateStatus,
    onProcessInstallment,
    onCreated,
    onUpdated,
    onCreateNew,
}: PaymentDrawerProps) {
    // Controller
    const controller = usePaymentDrawerController({
        mode,
        payment,
        onCreated,
        onUpdated,
        onEdit,
        onDelete,
        onUpdateStatus,
        onProcessInstallment,
        onCreateNew,
    });

    const {
        methods,
        handleSubmit,
        creating,
        updating,
        saleOptions,
        selectedSale,
        handleSaleChange,
        showInstallments,
        handleMethodChange,
        handleStatusChange,
    } = controller;

    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isView = mode === "view";

    // Estado local para o payment atualizado
    const [currentPayment, setCurrentPayment] = useState<PaymentDetails | null>(payment || null);

    // Atualizar currentPayment quando o payment prop mudar
    useEffect(() => {
        setCurrentPayment(payment || null);
    }, [payment]);

    // Foco no primeiro input ao abrir em modo create/edit
    useEffect(() => {
        if (open && (isCreate || isEdit)) {
            const firstInput = document.querySelector<HTMLInputElement>("input[name='total']");
            firstInput?.focus();
        }
    }, [open, isCreate, isEdit]);

    // Função para atualizar status com refresh imediato
    const handleUpdateStatusWithRefresh = async (paymentId: number, status: PaymentStatus) => {
        try {
            await onUpdateStatus(paymentId, status);

            // 🔄 ATUALIZAR LOCALMENTE IMEDIATAMENTE
            if (currentPayment && currentPayment.id === paymentId) {
                const updatedPayment = {
                    ...currentPayment,
                    status: status,
                    // Atualizar campos que mudam no status CONFIRMED
                    ...(status === "CONFIRMED" && {
                        paidAmount: currentPayment.total - (currentPayment.discount || 0),
                        lastPaymentAt: new Date().toISOString()
                    }),
                    // Resetar campos se voltar para PENDING
                    ...(status === "PENDING" && {
                        paidAmount: 0,
                        lastPaymentAt: null
                    })
                };
                setCurrentPayment(updatedPayment);

                // Notificar o controller sobre a atualização
                if (onUpdated) {
                    onUpdated(updatedPayment as Payment);
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar status:", error);
        }
    };

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 600 },
                    maxWidth: "100vw",
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    {isCreate
                        ? "Adicionar pagamento"
                        : isEdit
                            ? "Editar pagamento"
                            : `Pagamento #${currentPayment?.id}`}
                </Typography>

                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Conteúdo principal */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 120px)",
                    pb: 3,
                }}
            >
                {/* ========================== */}
                {/* 🔸 MODO VIEW */}
                {/* ========================== */}
                {isView && currentPayment && (
                    <Box>
                        {/* Ações */}
                        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Pencil size={14} />}
                                onClick={onEdit}
                            >
                                Editar
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Trash2 size={14} />}
                                onClick={() => onDelete(currentPayment)}
                            >
                                Remover
                            </Button>

                            {/* Status Actions - APENAS CONFIRMAR PAGAMENTOS PENDENTES */}
                            {currentPayment.status === "PENDING" && (
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleUpdateStatusWithRefresh(currentPayment.id, "CONFIRMED")}
                                >
                                    Confirmar
                                </Button>
                            )}
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {/* Dados do pagamento */}
                        <PaymentView
                            payment={currentPayment}
                            onProcessInstallment={(installmentId, paidAmount) =>
                                onProcessInstallment(currentPayment.id, installmentId, paidAmount)
                            }
                        />

                        <Divider sx={{ my: 3 }} />

                        {/* Botão de adicionar novo pagamento */}
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onCreateNew}
                            startIcon={<DollarSign size={16} />}
                        >
                            Adicionar novo pagamento
                        </Button>
                    </Box>
                )}

                {/* ========================== */}
                {/* 🔸 MODO CREATE / EDIT */}
                {/* ========================== */}
                {(isCreate || isEdit) && (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {/* Informações da Venda */}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                        Informações da Venda
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Autocomplete
                                            size="small"
                                            options={saleOptions}
                                            getOptionLabel={(option: Sale) =>
                                                `Venda #${option.id} - ${option.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                            }
                                            value={selectedSale}
                                            onChange={(_, newValue) => handleSaleChange(newValue)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Selecionar Venda"
                                                    fullWidth
                                                    size="small"
                                                />
                                            )}
                                            disabled={isEdit}
                                        />
                                    </Stack>
                                </Box>

                                <Divider />

                                {/* Método de Pagamento */}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                        Método de Pagamento
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Controller
                                            name="method"
                                            control={methods.control}
                                            rules={{ required: "Selecione o método de pagamento" }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Método de Pagamento"
                                                    fullWidth
                                                    size="small"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        handleMethodChange(e.target.value as PaymentMethod);
                                                    }}
                                                >
                                                    {Object.entries(PaymentMethodLabels).map(([key, label]) => (
                                                        <MenuItem key={key} value={key}>
                                                            {label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />

                                        <Controller
                                            name="status"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    select
                                                    label="Status"
                                                    fullWidth
                                                    size="small"
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        handleStatusChange(e.target.value as PaymentStatus);
                                                    }}
                                                >
                                                    {Object.entries(PaymentStatusLabels).map(([key, label]) => (
                                                        <MenuItem key={key} value={key}>
                                                            {label}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            )}
                                        />
                                    </Stack>
                                </Box>

                                <Divider />

                                {/* Valores */}
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                        Valores
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Controller
                                            name="total"
                                            control={methods.control}
                                            rules={{ required: "Informe o valor total" }}
                                            render={({ field, fieldState }) => (
                                                <CurrencyInput
                                                    {...field}
                                                    label="Valor Total"
                                                    fullWidth
                                                    size="small"
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                />
                                            )}
                                        />

                                        <Controller
                                            name="discount"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CurrencyInput
                                                    {...field}
                                                    label="Desconto"
                                                    fullWidth
                                                    size="small"
                                                />
                                            )}
                                        />

                                        {showInstallments && (
                                            <>
                                                <Controller
                                                    name="downPayment"
                                                    control={methods.control}
                                                    render={({ field }) => (
                                                        <CurrencyInput
                                                            {...field}
                                                            label="Entrada"
                                                            fullWidth
                                                            size="small"
                                                        />
                                                    )}
                                                />

                                                <Controller
                                                    name="installmentsTotal"
                                                    control={methods.control}
                                                    render={({ field }) => (
                                                        <CurrencyInput
                                                            {...field}
                                                            label="Valor Total das Parcelas"
                                                            fullWidth
                                                            size="small"
                                                        />
                                                    )}
                                                />

                                                <Controller
                                                    name="firstDueDate"
                                                    control={methods.control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            label="Primeira Data de Vencimento"
                                                            fullWidth
                                                            size="small"
                                                            type="date"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </>
                                        )}
                                    </Stack>
                                </Box>

                                {/* Ações */}
                                <Box pt={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        startIcon={
                                            creating || updating ? <CircularProgress size={18} /> : <CreditCard size={18} />
                                        }
                                        disabled={creating || updating}
                                    >
                                        {isCreate
                                            ? creating
                                                ? "Criando..."
                                                : "Criar pagamento"
                                            : updating
                                                ? "Salvando..."
                                                : "Salvar alterações"}
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    </FormProvider>
                )}
            </Box>
        </Drawer>
    );
}