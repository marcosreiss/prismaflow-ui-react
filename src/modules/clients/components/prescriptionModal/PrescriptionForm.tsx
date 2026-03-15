import {
    Stack,
    TextField,
    Button,
    CircularProgress,
    DialogActions,
    Typography,
    Box,
    MenuItem,
    Tabs,
    Tab,
    Divider,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, Controller, useFormContext, type UseFormReturn } from "react-hook-form";
import AdditionInput from "@/components/imask/protocolo/AdditionInput";
import CylindricalInput from "@/components/imask/protocolo/CylindricalInput";
import DnpInput from "@/components/imask/protocolo/DnpInput";
import SphericalInput from "@/components/imask/protocolo/SphericalInput";
import AxisInput from "@/components/imask/protocolo/AxisInput";
import OpticalCenterInput from "@/components/imask/protocolo/OpticalCenterInput";
import PellicleInput from "@/components/imask/protocolo/PellicleInput";
import { usePrescriptionValidation } from "../../hooks/usePrescriptionValidation";
import type { CreatePrescriptionPayload } from "../../types/prescriptionTypes";

type PrescriptionControllerType = {
    methods: UseFormReturn<CreatePrescriptionPayload>;
    inputRef: React.RefObject<HTMLInputElement | null>;
    handleSubmit: (e?: React.BaseSyntheticEvent) => void;
    creating: boolean;
    updating: boolean;
    isCreate: boolean;
    saveDraft: () => void;
    clearDraft: () => void;
    hasDraft: boolean;
    hasUnsavedChanges: boolean;
};

type PrescriptionFormProps = {
    controller: PrescriptionControllerType;
    onClose: () => void;
};

type EyeSide = "od" | "oe";
type VisionType = "far" | "near";
type SphericalFieldName =
    | "odSphericalFar"
    | "odSphericalNear"
    | "oeSphericalFar"
    | "oeSphericalNear";
type CylindricalFieldName =
    | "odCylindricalFar"
    | "odCylindricalNear"
    | "oeCylindricalFar"
    | "oeCylindricalNear";
type AxisFieldName =
    | "odAxisFar"
    | "odAxisNear"
    | "oeAxisFar"
    | "oeAxisNear";
type DnpFieldName =
    | "odDnpFar"
    | "odDnpNear"
    | "oeDnpFar"
    | "oeDnpNear";
type PellicleFieldName =
    | "odPellicleFar"
    | "odPellicleNear"
    | "oePellicleFar"
    | "oePellicleNear";
type AdditionFieldName = "additionRight" | "additionLeft";

const degreeGridSx = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
    gap: 2,
};

const coerceStringValue = (value: unknown): string => {
    if (typeof value === "string") return value;
    return "";
};

const normalizeNumericValue = (value: unknown): number | null => {
    const normalizedValue = coerceStringValue(value);
    if (!normalizedValue.trim()) return null;
    const parsed = Number.parseFloat(normalizedValue.replace(",", "."));
    return Number.isNaN(parsed) ? null : parsed;
};

const formatQuarterValue = (value: number): string => {
    const rounded = Math.round(value * 4) / 4;
    const signal = rounded > 0 ? "+" : "";
    return `${signal}${rounded.toFixed(2).replace(".", ",")}`;
};

const getSphericalFieldName = (eye: EyeSide, vision: VisionType): SphericalFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odSphericalFar"
            : "odSphericalNear"
        : vision === "far"
          ? "oeSphericalFar"
          : "oeSphericalNear";

const getCylindricalFieldName = (eye: EyeSide, vision: VisionType): CylindricalFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odCylindricalFar"
            : "odCylindricalNear"
        : vision === "far"
          ? "oeCylindricalFar"
          : "oeCylindricalNear";

const getAxisFieldName = (eye: EyeSide, vision: VisionType): AxisFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odAxisFar"
            : "odAxisNear"
        : vision === "far"
          ? "oeAxisFar"
          : "oeAxisNear";

const getDnpFieldName = (eye: EyeSide, vision: VisionType): DnpFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odDnpFar"
            : "odDnpNear"
        : vision === "far"
          ? "oeDnpFar"
          : "oeDnpNear";

const getPellicleFieldName = (eye: EyeSide, vision: VisionType): PellicleFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odPellicleFar"
            : "odPellicleNear"
        : vision === "far"
          ? "oePellicleFar"
          : "oePellicleNear";

export default function PrescriptionForm({
    controller,
    onClose,
}: PrescriptionFormProps) {
    const { methods, inputRef, creating, updating, isCreate, handleSubmit, saveDraft, clearDraft, hasDraft } = controller;

    return (
        <FormProvider {...methods}>
            <PrescriptionFormContent
                inputRef={inputRef}
                creating={creating}
                updating={updating}
                isCreate={isCreate}
                onClose={onClose}
                handleSubmit={handleSubmit}
                saveDraft={saveDraft}
                clearDraft={clearDraft}
                hasDraft={hasDraft}
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
    handleSubmit: (e?: React.BaseSyntheticEvent) => void;
    saveDraft: () => void;
    clearDraft: () => void;
    hasDraft: boolean;
};

function PrescriptionFormContent({
    inputRef,
    creating,
    updating,
    isCreate,
    onClose,
    handleSubmit,
}: PrescriptionFormContentProps) {
    const { control, register, formState, watch, setValue, getValues } = useFormContext<CreatePrescriptionPayload>();
    const validation = usePrescriptionValidation();
    const [currentTab, setCurrentTab] = useState(0);
    const [rightNearAutoFilled, setRightNearAutoFilled] = useState(false);
    const [leftNearAutoFilled, setLeftNearAutoFilled] = useState(false);

    const lensType = watch("lensType") ?? "";
    const monofocalVisionType = watch("monofocalVisionType") ?? "far";
    const additionRight = watch("additionRight") ?? "";
    const additionLeft = watch("additionLeft") ?? "";
    const odSphericalFar = watch("odSphericalFar") ?? "";
    const odCylindricalFar = watch("odCylindricalFar") ?? "";
    const odAxisFar = watch("odAxisFar") ?? "";
    const odDnpFar = watch("odDnpFar") ?? "";
    const oeSphericalFar = watch("oeSphericalFar") ?? "";
    const oeCylindricalFar = watch("oeCylindricalFar") ?? "";
    const oeAxisFar = watch("oeAxisFar") ?? "";
    const oeDnpFar = watch("oeDnpFar") ?? "";

    const isMonofocal = lensType === "monofocal";
    const isAutoNearLens = lensType === "multifocal" || lensType === "ocupacional";
    const showAddition = lensType === "bifocal" || lensType === "multifocal" || lensType === "ocupacional";
    const showPellicle = lensType === "bifocal";
    const showNearVision = !isMonofocal;

    const handleFormSubmit = async (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        handleSubmit(e);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const autoFillNearFields = useCallback((eye: EyeSide, additionValue: string) => {
        const sphericalFar = getValues(getSphericalFieldName(eye, "far"));
        const sphericalFarNumber = normalizeNumericValue(sphericalFar);
        const additionNumber = normalizeNumericValue(additionValue);

        if (sphericalFarNumber !== null && additionNumber !== null) {
            setValue(
                getSphericalFieldName(eye, "near"),
                formatQuarterValue(sphericalFarNumber + additionNumber),
                { shouldDirty: true, shouldValidate: true }
            );
        }

        const cylindricalFar = coerceStringValue(getValues(getCylindricalFieldName(eye, "far")));
        const axisFar = coerceStringValue(getValues(getAxisFieldName(eye, "far")));
        const dnpFar = coerceStringValue(getValues(getDnpFieldName(eye, "far")));

        setValue(getCylindricalFieldName(eye, "near"), cylindricalFar, { shouldDirty: true, shouldValidate: true });
        setValue(getAxisFieldName(eye, "near"), axisFar, { shouldDirty: true, shouldValidate: true });
        setValue(getDnpFieldName(eye, "near"), dnpFar, { shouldDirty: true, shouldValidate: true });
    }, [getValues, setValue]);

    const hasNearValues = useCallback((eye: EyeSide) => {
        return Boolean(
            getValues(getSphericalFieldName(eye, "near")) ||
            getValues(getCylindricalFieldName(eye, "near")) ||
            getValues(getAxisFieldName(eye, "near")) ||
            getValues(getDnpFieldName(eye, "near"))
        );
    }, [getValues]);

    useEffect(() => {
        if (!isAutoNearLens) {
            setRightNearAutoFilled(false);
            setLeftNearAutoFilled(false);
            return;
        }

        if (!additionRight) setRightNearAutoFilled(false);
        if (!additionLeft) setLeftNearAutoFilled(false);
    }, [isAutoNearLens, additionRight, additionLeft]);

    useEffect(() => {
        if (!isAutoNearLens || !additionRight || rightNearAutoFilled) return;
        if (!odSphericalFar && !odCylindricalFar && !odAxisFar && !odDnpFar) return;
        if (hasNearValues("od")) {
            setRightNearAutoFilled(true);
            return;
        }

        autoFillNearFields("od", additionRight);
        setRightNearAutoFilled(true);
    }, [
        isAutoNearLens,
        additionRight,
        rightNearAutoFilled,
        odSphericalFar,
        odCylindricalFar,
        odAxisFar,
        odDnpFar,
        autoFillNearFields,
        hasNearValues,
    ]);

    useEffect(() => {
        if (!isAutoNearLens || !additionLeft || leftNearAutoFilled) return;
        if (!oeSphericalFar && !oeCylindricalFar && !oeAxisFar && !oeDnpFar) return;
        if (hasNearValues("oe")) {
            setLeftNearAutoFilled(true);
            return;
        }

        autoFillNearFields("oe", additionLeft);
        setLeftNearAutoFilled(true);
    }, [
        isAutoNearLens,
        additionLeft,
        leftNearAutoFilled,
        oeSphericalFar,
        oeCylindricalFar,
        oeAxisFar,
        oeDnpFar,
        autoFillNearFields,
        hasNearValues,
    ]);

    useEffect(() => {
        if (isMonofocal && !monofocalVisionType) {
            setValue("monofocalVisionType", "far");
        }

        if (!isMonofocal) {
            setValue("monofocalVisionType", "");
        }
    }, [isMonofocal, monofocalVisionType, setValue]);

    const renderEyeFields = (eye: EyeSide, vision: VisionType) => {
        const eyeLabel = eye === "od" ? "Olho Direito (OD)" : "Olho Esquerdo (OE)";
        const additionName: AdditionFieldName = eye === "od" ? "additionRight" : "additionLeft";
        const isNear = vision === "near";
        const shouldShowAdditionFirst = isNear && isAutoNearLens;
        const shouldShowAddition = isNear && showAddition;
        const fieldPrefix = eye === "od" ? "Od" : "Oe";
        const sphericalName = getSphericalFieldName(eye, vision);
        const cylindricalName = getCylindricalFieldName(eye, vision);
        const axisName = getAxisFieldName(eye, vision);
        const dnpName = getDnpFieldName(eye, vision);
        const pellicleName = getPellicleFieldName(eye, vision);

        return (
            <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={2}>
                    {eyeLabel}
                </Typography>
                <Box sx={degreeGridSx}>
                    {shouldShowAdditionFirst && (
                        <Controller
                            name={additionName}
                            control={control}
                            rules={{
                                validate: eye === "od"
                                    ? validation.validateAdditionRight
                                    : validation.validateAdditionLeft,
                            }}
                            render={({ field, fieldState }) => (
                                <AdditionInput
                                    label="Adição"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={(value) => {
                                        field.onChange(value);
                                        if (eye === "od") {
                                            setRightNearAutoFilled(false);
                                        } else {
                                            setLeftNearAutoFilled(false);
                                        }
                                    }}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    )}
                    <Controller
                        name={sphericalName}
                        control={control}
                        rules={{
                            validate:
                                fieldPrefix === "Od"
                                    ? isNear
                                        ? validation.validateOdSphericalNear
                                        : validation.validateOdSphericalFar
                                    : isNear
                                      ? validation.validateOeSphericalNear
                                      : validation.validateOeSphericalFar,
                        }}
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
                        name={cylindricalName}
                        control={control}
                        rules={{
                            validate:
                                fieldPrefix === "Od"
                                    ? isNear
                                        ? validation.validateOdCylindricalNear
                                        : validation.validateOdCylindricalFar
                                    : isNear
                                      ? validation.validateOeCylindricalNear
                                      : validation.validateOeCylindricalFar,
                        }}
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
                        name={axisName}
                        control={control}
                        rules={{
                            validate:
                                fieldPrefix === "Od"
                                    ? isNear
                                        ? validation.validateOdAxisNear
                                        : validation.validateOdAxisFar
                                    : isNear
                                      ? validation.validateOeAxisNear
                                      : validation.validateOeAxisFar,
                        }}
                        render={({ field, fieldState }) => (
                            <AxisInput
                                label="Eixo"
                                size="small"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        name={dnpName}
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
                    {showPellicle && (
                        <Controller
                            name={pellicleName}
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
                    {shouldShowAddition && !shouldShowAdditionFirst && (
                        <Controller
                            name={additionName}
                            control={control}
                            rules={{
                                validate: eye === "od"
                                    ? validation.validateAdditionRight
                                    : validation.validateAdditionLeft,
                            }}
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
                </Box>
            </Box>
        );
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <Stack spacing={3}>
                <Stack spacing={2}>
                    <Typography variant="h6" fontWeight={600}>
                        Informações da Receita
                    </Typography>

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

                    <TextField
                        fullWidth
                        size="small"
                        type="date"
                        label="Data da Receita"
                        InputLabelProps={{ shrink: true }}
                        {...register("prescriptionDate", {
                            required: "Data da receita é obrigatória",
                            validate: validation.validatePrescriptionDate,
                        })}
                        error={!!formState.errors.prescriptionDate}
                        helperText={formState.errors.prescriptionDate?.message}
                    />

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
                                    label="Tipo de Lente *"
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                >
                                    <MenuItem value="">Selecione...</MenuItem>
                                    <MenuItem value="monofocal">Monofocal</MenuItem>
                                    <MenuItem value="bifocal">Bifocal</MenuItem>
                                    <MenuItem value="multifocal">Multifocal</MenuItem>
                                    <MenuItem value="ocupacional">Ocupacional</MenuItem>
                                </TextField>
                            )}
                        />
                    </Stack>

                    {isMonofocal && (
                        <Controller
                            name="monofocalVisionType"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    select
                                    fullWidth
                                    size="small"
                                    label="Tipo de Grau"
                                    value={field.value || "far"}
                                    onChange={(e) => field.onChange(e.target.value)}
                                >
                                    <MenuItem value="far">Grau de Longe</MenuItem>
                                    <MenuItem value="near">Grau de Perto</MenuItem>
                                </TextField>
                            )}
                        />
                    )}

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
                    />
                </Stack>

                <Divider />

                <Box>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Medidas Oftalmológicas
                    </Typography>

                    {showNearVision ? (
                        <>
                            <Tabs
                                value={currentTab}
                                onChange={handleTabChange}
                                variant="fullWidth"
                                sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                                <Tab label="Grau de Longe" />
                                <Tab label="Grau de Perto" />
                            </Tabs>

                            <TabPanel value={currentTab} index={0}>
                                <Stack spacing={3}>
                                    {renderEyeFields("od", "far")}
                                    <Divider />
                                    {renderEyeFields("oe", "far")}
                                </Stack>
                            </TabPanel>

                            <TabPanel value={currentTab} index={1}>
                                <Stack spacing={3}>
                                    {renderEyeFields("od", "near")}
                                    <Divider />
                                    {renderEyeFields("oe", "near")}
                                </Stack>
                            </TabPanel>
                        </>
                    ) : (
                        <Stack spacing={3}>
                            {monofocalVisionType === "near" ? renderEyeFields("od", "near") : renderEyeFields("od", "far")}
                            <Divider />
                            {monofocalVisionType === "near" ? renderEyeFields("oe", "near") : renderEyeFields("oe", "far")}
                        </Stack>
                    )}
                </Box>

                <Divider />

                <Box>
                    <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Centro Óptico (Altura)
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                        Altura do centro óptico para posicionamento correto das lentes
                    </Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                        <Controller
                            name="opticalCenterRight"
                            control={control}
                            rules={{ validate: validation.validateOpticalCenter }}
                            render={({ field, fieldState }) => (
                                <OpticalCenterInput
                                    label="Centro Óptico OD"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            name="opticalCenterLeft"
                            control={control}
                            rules={{ validate: validation.validateOpticalCenter }}
                            render={({ field, fieldState }) => (
                                <OpticalCenterInput
                                    label="Centro Óptico OE"
                                    size="small"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    </Box>
                </Box>
            </Stack>

            <DialogActions sx={{ mt: 3, px: 0, gap: 1, justifyContent: "flex-end" }}>
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

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`prescription-tabpanel-${index}`}
            aria-labelledby={`prescription-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}
