import {
    Box,
    Button,
    Divider,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext, useWatch, Controller } from "react-hook-form";
import { useMemo } from "react";
import CurrencyInput from "@/components/imask/CurrencyInput";
import { PaymentMethodLabels } from "../types/paymentEnums";
import type { PaymentMethod } from "../types/paymentEnums";
import type { PaymentFormValues } from "../types/paymentFormTypes";

const MAX_PAYMENT_METHODS = 2;

const INSTALLMENT_METHODS: PaymentMethod[] = ["INSTALLMENT"];
const isInstallmentMethod = (method: PaymentMethod) => INSTALLMENT_METHODS.includes(method);

export default function PaymentMethodsBuilder() {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext<PaymentFormValues>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "methods",
    });

    const total = useWatch({ control, name: "total" });
    const watchedMethods = useWatch({ control, name: "methods" });

    const usedTypes = useMemo(
        () => new Set(watchedMethods?.map((m) => m.method) ?? []),
        [watchedMethods]
    );

    const methodsSum = useMemo(
        () => watchedMethods?.reduce((acc, m) => acc + (Number(m.amount) || 0), 0) ?? 0,
        [watchedMethods]
    );

    const difference = total - methodsSum;
    const isBalanced = Math.abs(difference) <= 0.01;
    const canAddMethod = fields.length < MAX_PAYMENT_METHODS;

    const handleAddMethod = () => {
        if (!canAddMethod) return;

        const availableMethod = (Object.keys(PaymentMethodLabels) as PaymentMethod[]).find(
            (m) => !usedTypes.has(m)
        );

        if (!availableMethod) return;

        append({
            _key: crypto.randomUUID(),
            method: availableMethod,
            amount: 0,
        });
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                    Métodos de pagamento
                </Typography>

                <Tooltip
                    title={
                        !canAddMethod
                            ? `Limite de ${MAX_PAYMENT_METHODS} métodos atingido`
                            : usedTypes.size === Object.keys(PaymentMethodLabels).length
                                ? "Todos os métodos já foram adicionados"
                                : ""
                    }
                >
                    <span>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Plus size={14} />}
                            onClick={handleAddMethod}
                            disabled={
                                !canAddMethod ||
                                usedTypes.size === Object.keys(PaymentMethodLabels).length
                            }
                        >
                            Adicionar método
                        </Button>
                    </span>
                </Tooltip>
            </Stack>

            <Stack spacing={2}>
                {fields.map((field, index) => {
                    const methodValue = watchedMethods?.[index]?.method;
                    const isInstallment = methodValue ? isInstallmentMethod(methodValue) : false;
                    const fieldError = errors.methods?.[index];

                    return (
                        <Box
                            key={field.id}
                            sx={{
                                border: "1px solid",
                                borderColor: "grey.200",
                                borderRadius: 2,
                                p: 2,
                            }}
                        >
                            <Stack
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                mb={1.5}
                            >
                                <Typography variant="body2" fontWeight={500} color="text.secondary">
                                    Método {index + 1}
                                </Typography>

                                {fields.length > 1 && (
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => remove(index)}
                                        aria-label="Remover método"
                                    >
                                        <Trash2 size={14} />
                                    </IconButton>
                                )}
                            </Stack>

                            <Stack spacing={2}>
                                {/* Tipo do método */}
                                <TextField
                                    {...register(`methods.${index}.method`)}
                                    select
                                    label="Tipo"
                                    fullWidth
                                    size="small"
                                    error={!!fieldError?.method}
                                    helperText={fieldError?.method?.message}
                                    value={watchedMethods?.[index]?.method ?? ""}
                                >
                                    {(Object.entries(PaymentMethodLabels) as [PaymentMethod, string][]).map(
                                        ([key, label]) => (
                                            <MenuItem
                                                key={key}
                                                value={key}
                                                disabled={
                                                    usedTypes.has(key) &&
                                                    watchedMethods?.[index]?.method !== key
                                                }
                                            >
                                                {label}
                                            </MenuItem>
                                        )
                                    )}
                                </TextField>

                                {/* Valor do método */}
                                <Controller
                                    name={`methods.${index}.amount`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <CurrencyInput
                                            value={field.value ?? 0}
                                            onChange={field.onChange}
                                            label="Valor"
                                            fullWidth
                                            size="small"
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />

                                {/* Data do pagamento — obrigatória para métodos à vista */}
                                {!isInstallment && (
                                    <TextField
                                        {...register(`methods.${index}.paidAt`, {
                                            required: "Informe a data do pagamento",
                                        })}
                                        type="date"
                                        label="Data do pagamento"
                                        fullWidth
                                        size="small"
                                        InputLabelProps={{ shrink: true }}
                                        error={!!fieldError?.paidAt}
                                        helperText={
                                            fieldError?.paidAt?.message ??
                                            "Data em que o cliente realizou o pagamento"
                                        }
                                        defaultValue={new Date().toISOString().split("T")[0]}
                                    />
                                )}

                                {/* Campos exclusivos de carnê */}
                                {isInstallment && (
                                    <>
                                        <TextField
                                            {...register(`methods.${index}.installments`, {
                                                valueAsNumber: true,
                                            })}
                                            type="number"
                                            label="Número de parcelas"
                                            fullWidth
                                            size="small"
                                            inputProps={{ min: 1, max: 99, step: 1 }}
                                            error={!!fieldError?.installments}
                                            helperText={
                                                fieldError?.installments?.message ??
                                                "Parcelas geradas automaticamente pelo sistema"
                                            }
                                        />

                                        <TextField
                                            {...register(`methods.${index}.firstDueDate`)}
                                            type="date"
                                            label="Primeira data de vencimento"
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                            error={!!fieldError?.firstDueDate}
                                            helperText={fieldError?.firstDueDate?.message}
                                        />
                                    </>
                                )}
                            </Stack>
                        </Box>
                    );
                })}
            </Stack>

            {fields.length > 0 && (
                <>
                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            Total dos métodos
                        </Typography>

                        <Stack alignItems="flex-end">
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color={isBalanced ? "success.main" : "error.main"}
                            >
                                {methodsSum.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Typography>

                            {!isBalanced && (
                                <Typography variant="caption" color="error.main">
                                    {difference > 0
                                        ? `Faltam ${difference.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}`
                                        : `Excede em ${Math.abs(difference).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}`}
                                </Typography>
                            )}

                            {isBalanced && (
                                <Typography variant="caption" color="success.main">
                                    Valor correto
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                </>
            )}
        </Box>
    );
}
