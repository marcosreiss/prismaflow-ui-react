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

// 👇 TIPO DO CONTROLLER
type PrescriptionControllerType = {
    methods: UseFormReturn<CreatePrescriptionPayload>;
    inputRef: React.RefObject<HTMLInputElement>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => void;
    creating: boolean;
    updating: boolean;
    isCreate: boolean;
};

type PrescriptionFormProps = {
    controller: PrescriptionControllerType; // ✅ Tipado
    onClose: () => void;
};

export default function PrescriptionForm({
    controller,
    onClose,
}: PrescriptionFormProps) {
    const { methods, inputRef, handleSubmit, creating, updating, isCreate } = controller;

    return (
        <FormProvider {...methods}>
            <PrescriptionFormContent
                inputRef={inputRef}
                handleSubmit={handleSubmit}
                creating={creating}
                updating={updating}
                isCreate={isCreate}
                onClose={onClose}
            />
        </FormProvider>
    );
}

type PrescriptionFormContentProps = {
    inputRef: React.RefObject<HTMLInputElement>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => void;
    creating: boolean;
    updating: boolean;
    isCreate: boolean;
    onClose: () => void;
};

function PrescriptionFormContent({
    inputRef,
    handleSubmit,
    creating,
    updating,
    isCreate,
    onClose,
}: PrescriptionFormContentProps) {
    const { control, register } = useFormContext();
    const fieldRules = useFieldRules();
    const validation = usePrescriptionValidation();

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
            }}
        >
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
                        />
                        <TextField
                            fullWidth
                            size="small"
                            label="CRM"
                            {...register("crm", {
                                validate: validation.validateCRM,
                            })}
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
