import {
    Stack,
    TextField,
    Button,
    CircularProgress,
    DialogActions,
    Typography,
    Box,
    Divider,
    MenuItem,
} from "@mui/material";
import { FormProvider, Controller, useFormContext, type UseFormReturn } from "react-hook-form";
import AdditionInput from "@/components/imask/protocolo/AdditionInput";
import CylindricalInput from "@/components/imask/protocolo/CylindricalInput";
import DnpInput from "@/components/imask/protocolo/DnpInput";
import SphericalInput from "@/components/imask/protocolo/SphericalInput";
import AxisInput from "@/components/imask/protocolo/AxisInput";
import OpticalCenterInput from "@/components/imask/protocolo/OpticalCenterInput";
import PellicleInput from "@/components/imask/protocolo/PellicleInput";
import { useFieldRules } from "../../hooks/useFieldRules";
import { usePrescriptionValidation } from "../../hooks/usePrescriptionValidation";
import type { CreatePrescriptionPayload } from "../../types/prescriptionTypes";
import { useNotification } from "@/context/NotificationContext";

type PrescriptionControllerType = {
    methods: UseFormReturn<CreatePrescriptionPayload>;
    inputRef: React.RefObject<HTMLInputElement | null>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    creating: boolean;
    updating: boolean;
    isCreate: boolean;
};

type PrescriptionFormProps = {
    controller: PrescriptionControllerType;
    onClose: () => void;
};

export default function PrescriptionForm({
    controller,
    onClose,
}: PrescriptionFormProps) {
    const { methods, inputRef, creating, updating, isCreate, handleSubmit } = controller;

    return (
        <FormProvider {...methods}>
            <PrescriptionFormContent
                inputRef={inputRef}
                creating={creating}
                updating={updating}
                isCreate={isCreate}
                onClose={onClose}
                handleSubmit={handleSubmit}
            />
        </FormProvider>
    );
}

type PrescriptionFormContentProps = {
    inputRef: React.RefObject<HTMLInputElement | null>;
    creating: boolean;
    updating: boolean;
    isCreate: boolean;
    onClose: () => void;
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

// ✅ FUNÇÕES AUXILIARES PARA MENSAGENS DE ERRO
function getFieldLabel(fieldName: string): string {
    const fieldLabels: Record<string, string> = {
        doctorName: "Nome do médico",
        crm: "CRM",
        prescriptionDate: "Data da receita",
        lensType: "Tipo de lente",
        frameAndRef: "Armação e Ref",
        notes: "Observações",
        odSphericalFar: "OD Esférico Longe",
        odCylindricalFar: "OD Cilíndrico Longe",
        odAxisFar: "OD Eixo Longe",
        odDnpFar: "OD DNP Longe",
        oeSphericalFar: "OE Esférico Longe",
        oeCylindricalFar: "OE Cilíndrico Longe",
        oeAxisFar: "OE Eixo Longe",
        oeDnpFar: "OE DNP Longe",
        odSphericalNear: "OD Esférico Perto",
        odCylindricalNear: "OD Cilíndrico Perto",
        odAxisNear: "OD Eixo Perto",
        odDnpNear: "OD DNP Perto",
        oeSphericalNear: "OE Esférico Perto",
        oeCylindricalNear: "OE Cilíndrico Perto",
        oeAxisNear: "OE Eixo Perto",
        oeDnpNear: "OE DNP Perto",
        additionRight: "Adição OD",
        additionLeft: "Adição OE",
        opticalCenterRight: "Centro Óptico OD",
        opticalCenterLeft: "Centro Óptico OE",
        odPellicleFar: "OD Película Longe",
        odPellicleNear: "OD Película Perto",
        oePellicleFar: "OE Película Longe",
        oePellicleNear: "OE Película Perto",
    };

    return fieldLabels[fieldName] || fieldName;
}

function getFirstErrorMessage(errors: Record<string, unknown>): string | null {
    if (!errors || Object.keys(errors).length === 0) return null;

    for (const [fieldName, error] of Object.entries(errors)) {
        if (error && typeof error === 'object' && 'message' in error && error.message) {
            const fieldLabel = getFieldLabel(fieldName);
            return `${fieldLabel}: ${error.message}`;
        }
    }

    return null;
}

function countErrors(errors: Record<string, unknown>): number {
    if (!errors || Object.keys(errors).length === 0) return 0;

    let count = 0;
    for (const value of Object.values(errors)) {
        if (value && typeof value === 'object' && 'message' in value) {
            count++;
        }
    }
    return count;
}

function PrescriptionFormContent({
    inputRef,
    creating,
    updating,
    isCreate,
    onClose,
    handleSubmit,
}: PrescriptionFormContentProps) {
    const { control, register, formState, trigger } = useFormContext<CreatePrescriptionPayload>();
    const fieldRules = useFieldRules();
    const validation = usePrescriptionValidation();
    const { addNotification } = useNotification();

    // ✅ FUNÇÃO DE SUBMIT COM MENSAGENS DE ERRO ESPECÍFICAS
    const handleFormSubmit = async (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault();

        const isValid = await trigger(undefined, { shouldFocus: true });

        if (!isValid) {
            const firstError = getFirstErrorMessage(formState.errors);
            const errorCount = countErrors(formState.errors);

            if (firstError && errorCount > 1) {
                addNotification(`${firstError} (e mais ${errorCount - 1} campo(s) para corrigir)`, "error");
            } else if (firstError) {
                addNotification(firstError, "error");
            } else {
                addNotification("Existem campos obrigatórios ou inválidos no formulário.", "error");
            }
            return;
        }

        handleSubmit(e);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <Stack spacing={2}>
                {/* ========== PROFISSIONAL ========== */}
                <Section title="Profissional">
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            fullWidth
                            inputRef={inputRef}
                            size="small"
                            label="Nome do médico"
                            {...register("doctorName", {
                                validate: validation.validateDoctorName,
                            })}
                            error={!!formState.errors.doctorName}
                            helperText={formState.errors.doctorName?.message}
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="CRM"
                            {...register("crm", {
                                validate: validation.validateCRM,
                            })}
                            error={!!formState.errors.crm}
                            helperText={formState.errors.crm?.message}
                        />
                    </Stack>
                </Section>

                {/* ========== DATA DA RECEITA ========== */}
                <Section title="Data da Receita">
                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        {...register("prescriptionDate", {
                            required: "Data da receita é obrigatória",
                            validate: validation.validatePrescriptionDate,
                        })}
                        error={!!formState.errors.prescriptionDate}
                        helperText={formState.errors.prescriptionDate?.message}
                    />
                </Section>

                {/* ========== INFORMAÇÕES GERAIS ========== */}
                <Section title="Informações Gerais">
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Armação e Ref"
                            {...register("frameAndRef")}
                            error={!!formState.errors.frameAndRef}
                            helperText={formState.errors.frameAndRef?.message}
                        />
                        <Controller
                            name="lensType"
                            control={control}
                            defaultValue=""
                            rules={{
                                validate: validation.validateLensType,
                            }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    size="small"
                                    label="Tipo de Lente"
                                    value={field.value || ""}
                                    onChange={e => field.onChange(e.target.value)}
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error?.message ||
                                        "Determina quais campos serão exibidos"
                                    }
                                >
                                    <MenuItem value="">Selecione...</MenuItem>
                                    <MenuItem value="monofocal">Monofocal</MenuItem>
                                    <MenuItem value="bifocal">Bifocal</MenuItem>
                                    <MenuItem value="multifocal">Multifocal</MenuItem>
                                    <MenuItem value="ocupacional">Ocupacional</MenuItem>
                                    <MenuItem value="fotossensivel">Fotossensível</MenuItem>
                                    <MenuItem value="comFiltroAzul">Com Filtro Azul</MenuItem>
                                </TextField>
                            )}
                        />
                    </Stack>
                    <TextField
                        fullWidth
                        size="small"
                        label="Observações"
                        multiline
                        rows={2}
                        {...register("notes", {
                            validate: validation.validateNotes,
                        })}
                        error={!!formState.errors.notes}
                        helperText={formState.errors.notes?.message}
                        sx={{ mt: 2 }}
                    />
                </Section>

                {/* ========== GRAU DE LONGE ========== */}
                <Section title="Grau de Longe">
                    <Typography fontWeight={600} mb={1}>Olho Direito (OD)</Typography>
                    <GridBlock>
                        <Controller
                            name="odSphericalFar"
                            control={control}
                            rules={{ validate: validation.validateOdSphericalFar }}
                            render={({ field, fieldState }) => (
                                <SphericalInput
                                    label="Esférico"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="odCylindricalFar"
                            control={control}
                            rules={{ validate: validation.validateOdCylindricalFar }}
                            render={({ field, fieldState }) => (
                                <CylindricalInput
                                    label="Cilíndrico"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="odAxisFar"
                            control={control}
                            rules={{ validate: validation.validateOdAxisFar }}
                            render={({ field, fieldState }) => (
                                <AxisInput
                                    label="Eixo"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    disabled={fieldRules.isOdAxisFarDisabled}
                                    required={!fieldRules.isOdAxisFarDisabled}
                                    helperText={
                                        fieldState.error?.message ||
                                        (fieldRules.isOdAxisFarDisabled
                                            ? "Desabilitado (Cilíndrico = 0)"
                                            : "")
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="odDnpFar"
                            control={control}
                            rules={{ validate: validation.validateDNP }}
                            render={({ field, fieldState }) => (
                                <DnpInput
                                    label="DNP"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        {fieldRules.showPellicle && (
                            <Controller
                                name="odPellicleFar"
                                control={control}
                                render={({ field }) => (
                                    <PellicleInput
                                        label="Película"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        )}
                    </GridBlock>

                    <Typography fontWeight={600} mt={2} mb={1}>Olho Esquerdo (OE)</Typography>
                    <GridBlock>
                        <Controller
                            name="oeSphericalFar"
                            control={control}
                            rules={{ validate: validation.validateOeSphericalFar }}
                            render={({ field, fieldState }) => (
                                <SphericalInput
                                    label="Esférico"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="oeCylindricalFar"
                            control={control}
                            rules={{ validate: validation.validateOeCylindricalFar }}
                            render={({ field, fieldState }) => (
                                <CylindricalInput
                                    label="Cilíndrico"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="oeAxisFar"
                            control={control}
                            rules={{ validate: validation.validateOeAxisFar }}
                            render={({ field, fieldState }) => (
                                <AxisInput
                                    label="Eixo"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    disabled={fieldRules.isOeAxisFarDisabled}
                                    required={!fieldRules.isOeAxisFarDisabled}
                                    helperText={
                                        fieldState.error?.message ||
                                        (fieldRules.isOeAxisFarDisabled
                                            ? "Desabilitado (Cilíndrico = 0)"
                                            : "")
                                    }
                                />
                            )}
                        />
                        <Controller
                            name="oeDnpFar"
                            control={control}
                            rules={{ validate: validation.validateDNP }}
                            render={({ field, fieldState }) => (
                                <DnpInput
                                    label="DNP"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        {fieldRules.showPellicle && (
                            <Controller
                                name="oePellicleFar"
                                control={control}
                                render={({ field }) => (
                                    <PellicleInput
                                        label="Película"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        )}
                    </GridBlock>
                </Section>

                {/* ========== GRAU DE PERTO ========== */}
                {fieldRules.showNearVision && (
                    <Section title="Grau de Perto">
                        <Typography fontWeight={600} mb={1}>Olho Direito (OD)</Typography>
                        <GridBlock>
                            <Controller
                                name="odSphericalNear"
                                control={control}
                                rules={{ validate: validation.validateOdSphericalNear }}
                                render={({ field, fieldState }) => (
                                    <SphericalInput
                                        label="Esférico"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="odCylindricalNear"
                                control={control}
                                rules={{ validate: validation.validateOdCylindricalNear }}
                                render={({ field, fieldState }) => (
                                    <CylindricalInput
                                        label="Cilíndrico"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="odAxisNear"
                                control={control}
                                rules={{ validate: validation.validateOdAxisNear }}
                                render={({ field, fieldState }) => (
                                    <AxisInput
                                        label="Eixo"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        disabled={fieldRules.isOdAxisNearDisabled}
                                        required={!fieldRules.isOdAxisNearDisabled}
                                        helperText={
                                            fieldState.error?.message ||
                                            (fieldRules.isOdAxisNearDisabled
                                                ? "Desabilitado (Cilíndrico = 0)"
                                                : "")
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="odDnpNear"
                                control={control}
                                rules={{ validate: validation.validateDNP }}
                                render={({ field, fieldState }) => (
                                    <DnpInput
                                        label="DNP"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            {fieldRules.showPellicle && (
                                <Controller
                                    name="odPellicleNear"
                                    control={control}
                                    render={({ field }) => (
                                        <PellicleInput
                                            label="Película"
                                            size="small"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            )}
                            {fieldRules.showAddition && (
                                <Controller
                                    name="additionRight"
                                    control={control}
                                    rules={{ validate: validation.validateAdditionRight }}
                                    render={({ field, fieldState }) => (
                                        <AdditionInput
                                            label="Adição"
                                            size="small"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            )}
                            <Controller
                                name="opticalCenterRight"
                                control={control}
                                rules={{ validate: validation.validateOpticalCenter }}
                                render={({ field, fieldState }) => (
                                    <OpticalCenterInput
                                        label="Centro Óptico"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </GridBlock>

                        <Typography fontWeight={600} mt={2} mb={1}>Olho Esquerdo (OE)</Typography>
                        <GridBlock>
                            <Controller
                                name="oeSphericalNear"
                                control={control}
                                rules={{ validate: validation.validateOeSphericalNear }}
                                render={({ field, fieldState }) => (
                                    <SphericalInput
                                        label="Esférico"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="oeCylindricalNear"
                                control={control}
                                rules={{ validate: validation.validateOeCylindricalNear }}
                                render={({ field, fieldState }) => (
                                    <CylindricalInput
                                        label="Cilíndrico"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="oeAxisNear"
                                control={control}
                                rules={{ validate: validation.validateOeAxisNear }}
                                render={({ field, fieldState }) => (
                                    <AxisInput
                                        label="Eixo"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        disabled={fieldRules.isOeAxisNearDisabled}
                                        required={!fieldRules.isOeAxisNearDisabled}
                                        helperText={
                                            fieldState.error?.message ||
                                            (fieldRules.isOeAxisNearDisabled
                                                ? "Desabilitado (Cilíndrico = 0)"
                                                : "")
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="oeDnpNear"
                                control={control}
                                rules={{ validate: validation.validateDNP }}
                                render={({ field, fieldState }) => (
                                    <DnpInput
                                        label="DNP"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                            {fieldRules.showPellicle && (
                                <Controller
                                    name="oePellicleNear"
                                    control={control}
                                    render={({ field }) => (
                                        <PellicleInput
                                            label="Película"
                                            size="small"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            )}
                            {fieldRules.showAddition && (
                                <Controller
                                    name="additionLeft"
                                    control={control}
                                    rules={{ validate: validation.validateAdditionLeft }}
                                    render={({ field, fieldState }) => (
                                        <AdditionInput
                                            label="Adição"
                                            size="small"
                                            value={field.value ?? ""}
                                            onChange={field.onChange}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            )}
                            <Controller
                                name="opticalCenterLeft"
                                control={control}
                                rules={{ validate: validation.validateOpticalCenter }}
                                render={({ field, fieldState }) => (
                                    <OpticalCenterInput
                                        label="Centro Óptico"
                                        size="small"
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />
                        </GridBlock>
                    </Section>
                )}

                {!fieldRules.showNearVision && !!fieldRules.lensType && (
                    <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            ℹ️ Lentes monofocais não requerem medidas de perto
                        </Typography>
                    </Box>
                )}
            </Stack>

            <DialogActions sx={{ mt: 3, px: 0 }}>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={creating || updating}
                    startIcon={creating || updating ? <CircularProgress size={18} /> : undefined}
                >
                    {isCreate ? (creating ? "Salvando..." : "Criar") : (updating ? "Salvando..." : "Salvar")}
                </Button>
            </DialogActions>
        </form>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>{title}</Typography>
            {children}
            <Divider sx={{ my: 2 }} />
        </Box>
    );
}

function GridBlock({ children }: { children: React.ReactNode }) {
    return (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
            {children}
        </Box>
    );
}