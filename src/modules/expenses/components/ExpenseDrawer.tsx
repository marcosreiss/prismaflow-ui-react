// src/modules/expenses/components/ExpenseDrawer.tsx

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
    MenuItem,
} from "@mui/material";
import { X, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNotification } from "@/context/NotificationContext";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/utils/apiResponse";
import { useCreateExpense, useUpdateExpense } from "../hooks/useExpense";
import type {
    Expense,
    CreateExpensePayload,
    UpdateExpensePayload,
    ExpenseStatus,
    PaymentMethod,
} from "../types/expenseTypes";
import { ExpenseStatusLabels, PaymentMethodLabels } from "../types/expenseTypes";
import CurrencyInput from "@/components/imask/CurrencyInput";


// ==========================
// 🔹 Tipagens e Props
// ==========================
type DrawerMode = "create" | "edit" | "view";

type ExpenseFormValues = {
    description: string;
    amount: number;
    dueDate: string;
    paymentDate?: string;
    paymentMethod?: PaymentMethod | "";
    status?: ExpenseStatus;
};

interface ExpenseDrawerProps {
    open: boolean;
    mode: DrawerMode;
    expense?: Expense | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (expense: Expense) => void;
    onCreated: (expense: Expense) => void;
    onUpdated: (expense: Expense) => void;
    onCreateNew: () => void;
}

// ==========================
// 🔹 Componente principal
// ==========================
export default function ExpenseDrawer({
    open,
    mode,
    expense,
    onClose,
    onEdit,
    onDelete,
    onCreated,
    onUpdated,
    onCreateNew,
}: ExpenseDrawerProps) {
    // ==========================
    // 🔹 Formulário (React Hook Form)
    // ==========================
    const methods = useForm<ExpenseFormValues>({
        defaultValues: {
            description: "",
            amount: 0,
            dueDate: "",
            paymentDate: "",
            paymentMethod: "",
            status: "SCHEDULED",
        },
    });
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { addNotification } = useNotification();

    // ==========================
    // 🔹 Estados derivados
    // ==========================
    const isCreate = mode === "create";
    const isEdit = mode === "edit";
    const isView = mode === "view";

    // ==========================
    // 🔹 Hooks de mutação
    // ==========================
    const { mutateAsync: createExpense, isPending: creating } = useCreateExpense();
    const { mutateAsync: updateExpense, isPending: updating } = useUpdateExpense();

    // ==========================
    // 🔹 Efeitos
    // ==========================
    useEffect(() => {
        if ((isCreate || isEdit) && open) {
            inputRef.current?.focus();
        }
    }, [isCreate, isEdit, open]);

    useEffect(() => {
        if (!open) {
            methods.reset({ description: "", amount: 0, dueDate: "", paymentDate: "", paymentMethod: "" });

            return;
        }

        if ((isEdit || isView) && expense) {
            methods.reset({
                description: expense.description,
                amount: expense.amount,
                dueDate: expense.dueDate?.slice(0, 10) ?? "",
                paymentDate: expense.paymentDate?.slice(0, 10) ?? "",
                paymentMethod: expense.paymentMethod ?? "",
                status: expense.status,
            });
        } else {
            methods.reset({ description: "", amount: 0, dueDate: "", paymentDate: "", paymentMethod: "" });

        }
    }, [open, isCreate, isEdit, isView, expense, methods]);

    // ==========================
    // 🔹 Submissão do formulário
    // ==========================
    const handleSubmit = methods.handleSubmit(async (values) => {
        try {
            const payload = {
                ...values,
                amount: Number(values.amount),
                paymentMethod: values.paymentMethod || undefined,
                paymentDate: values.paymentDate || undefined,
            };

            if (isCreate) {
                const res = await createExpense(payload as CreateExpensePayload);
                if (res?.data) onCreated(res.data);
            } else if (isEdit && expense) {
                const res = await updateExpense({
                    id: expense.id,
                    data: payload as UpdateExpensePayload,
                });
                if (res?.data) onUpdated(res.data);
            }
        } catch (error) {
            const axiosErr = error as AxiosError<ApiResponse<null>>;
            const message =
                axiosErr.response?.data?.message ?? "Erro ao salvar despesa.";
            addNotification(message, "error");
        }
    });

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    // ==========================
    // 🔹 Render
    // ==========================
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 480, md: 520 },
                    maxWidth: "100vw",
                    p: { xs: 2, sm: 3 },
                },
            }}
        >
            {/* 🔹 Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                    {isCreate
                        ? "Adicionar despesa"
                        : isEdit
                            ? "Editar despesa"
                            : expense?.description || "Despesa"}
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* 🔹 Conteúdo principal */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "calc(100vh - 120px)", pb: 3 }}>

                {/* 🔸 MODO VIEW */}
                {isView && expense && (
                    <Box>
                        <Stack direction="row" spacing={1} mb={2}>
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
                                onClick={() => onDelete(expense)}
                            >
                                Remover
                            </Button>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1}>
                            <Row label="Descrição" value={expense.description} />
                            <Row label="Valor" value={formatCurrency(expense.amount)} />
                            <Row label="Vencimento" value={expense.dueDate?.slice(0, 10)} />
                            <Row label="Status" value={ExpenseStatusLabels[expense.status]} />
                            <Row
                                label="Forma de pagamento"
                                value={expense.paymentMethod ? PaymentMethodLabels[expense.paymentMethod] : null}
                            />
                            <Row label="Data de pagamento" value={expense.paymentDate?.slice(0, 10)} />
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                methods.reset({ description: "", amount: 0, dueDate: "", paymentDate: "", paymentMethod: "" });
                                onCreateNew();
                            }}
                        >
                            Adicionar nova despesa
                        </Button>
                    </Box>
                )}

                {/* 🔸 MODO CREATE / EDIT */}
                {(isCreate || isEdit) && (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>

                                {/* Descrição */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Descrição
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        inputRef={inputRef}
                                        size="small"
                                        {...methods.register("description", { required: true })}
                                        placeholder="Ex: Aluguel, energia elétrica..."
                                    />
                                </Box>

                                {/* Valor */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Valor (R$)
                                    </Typography>
                                    <CurrencyInput
                                        fullWidth
                                        size="small"
                                        value={methods.watch("amount") ?? 0}
                                        onChange={(v) => methods.setValue("amount", v, { shouldValidate: true })}
                                        placeholder="0,00"
                                    />
                                </Box>

                                {/* Vencimento */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Vencimento
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        {...methods.register("dueDate", { required: true })}
                                    />
                                </Box>

                                {/* Status */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Status
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        select
                                        value={methods.watch("status") ?? "SCHEDULED"}
                                        {...methods.register("status")}
                                        onChange={(e) =>
                                            methods.setValue("status", e.target.value as ExpenseStatus, {
                                                shouldValidate: true,
                                            })
                                        }
                                    >
                                        {Object.entries(ExpenseStatusLabels).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                {/* Forma de pagamento */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Forma de pagamento
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        select
                                        defaultValue=""
                                        {...methods.register("paymentMethod")}
                                    >
                                        <MenuItem value="">Nenhuma</MenuItem>
                                        {Object.entries(PaymentMethodLabels).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                {/* Data de pagamento */}
                                <Box>
                                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                                        Data de pagamento
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        {...methods.register("paymentDate")}
                                    />
                                </Box>

                                {/* Botão de ação */}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={creating || updating}
                                    startIcon={
                                        creating || updating ? <CircularProgress size={18} /> : undefined
                                    }
                                >
                                    {isCreate
                                        ? creating ? "Criando..." : "Criar"
                                        : updating ? "Salvando..." : "Salvar"}
                                </Button>

                            </Stack>
                        </form>
                    </FormProvider>
                )}
            </Box>
        </Drawer>
    );
}

// ==========================
// 🔹 Subcomponente auxiliar
// ==========================
function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (!value && value !== 0) return null;

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
                {label}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {value}
            </Typography>
        </Box>
    );
}
