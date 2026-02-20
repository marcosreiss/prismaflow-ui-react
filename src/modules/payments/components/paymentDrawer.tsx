import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    CircularProgress,
    Stack,
} from "@mui/material";
import { X, Pencil, Trash2, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider } from "react-hook-form";

import { usePaymentDrawerController } from "../hooks/usePaymentDrawerController";
import PaymentView from "./PaymentView";
import PaymentMethodsBuilder from "./PaymentMethodsBuilder";

import type { PaymentStatus } from "../types/paymentEnums";
import type { PaymentDetails, Payment } from "../types";

// ==============================
// Tipagens
// ==============================
interface PaymentDrawerProps {
    open: boolean;
    mode: "edit" | "view";
    payment?: PaymentDetails | null;
    paymentId: number | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (payment: PaymentDetails) => void;
    onUpdateStatus: (paymentId: number, status: PaymentStatus, reason?: string) => void;
    onPayInstallment: (installmentId: number, paidAmount: number, paidAt?: string) => void;
    onUpdated: (payment: Payment) => void;
}

// ==============================
// Componente principal
// ==============================
export default function PaymentDrawer({
    open,
    mode,
    payment,
    onClose,
    onEdit,
    onDelete,
    onUpdateStatus,
    onPayInstallment,
    onUpdated,
}: PaymentDrawerProps) {
    const controller = usePaymentDrawerController({
        mode,
        payment,
        onUpdated,
        onEdit,
        onDelete,
        onUpdateStatus,
        onPayInstallment,
    });

    const {
        methods,
        handleSubmit,
        configuring,
        handleStatusChange,
        handlePayInstallment,
    } = controller;

    const isEdit = mode === "edit";
    const isView = mode === "view";

    // Estado local para refletir atualizações de status sem aguardar refetch
    const [currentPayment, setCurrentPayment] = useState<PaymentDetails | null>(
        payment ?? null
    );

    useEffect(() => {
        setCurrentPayment(payment ?? null);
    }, [payment]);

    // Foca no primeiro campo ao abrir em modo edit
    useEffect(() => {
        if (open && isEdit) {
            const firstInput = document.querySelector<HTMLInputElement>(
                "input[name='total']"
            );
            firstInput?.focus();
        }
    }, [open, isEdit]);

    // Atualiza status e reflete localmente sem aguardar o React Query
    const handleStatusChangeWithOptimisticUpdate = async (
        status: PaymentStatus,
        reason?: string
    ) => {
        if (!currentPayment) return;

        await handleStatusChange(status, reason);

        setCurrentPayment((prev) =>
            prev ? { ...prev, status } : prev
        );
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 600, md: 800 },
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
                    {isEdit
                        ? `Editar pagamento #${currentPayment?.id}`
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
                {/* MODO VIEW */}
                {isView && currentPayment && (
                    <Box>
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

                            {currentPayment.status === "PENDING" && (
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() =>
                                        handleStatusChangeWithOptimisticUpdate("CONFIRMED")
                                    }
                                >
                                    Confirmar
                                </Button>
                            )}

                            {currentPayment.status === "CONFIRMED" && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    onClick={() =>
                                        handleStatusChangeWithOptimisticUpdate("PENDING")
                                    }
                                >
                                    Reverter para pendente
                                </Button>
                            )}
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {/* PaymentView será atualizado na próxima etapa */}
                        <PaymentView
                            paymentId={currentPayment.id}
                            onPayInstallment={handlePayInstallment}
                        />
                    </Box>
                )}

                {/* MODO EDIT */}
                {isEdit && (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                {/* Builder de métodos — gerencia methods[] com validação da soma */}
                                <PaymentMethodsBuilder />

                                <Divider />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    startIcon={
                                        configuring
                                            ? <CircularProgress size={18} />
                                            : <CreditCard size={18} />
                                    }
                                    disabled={configuring}
                                >
                                    {configuring ? "Salvando..." : "Salvar pagamento"}
                                </Button>
                            </Stack>
                        </form>
                    </FormProvider>
                )}
            </Box>
        </Drawer>
    );
}
