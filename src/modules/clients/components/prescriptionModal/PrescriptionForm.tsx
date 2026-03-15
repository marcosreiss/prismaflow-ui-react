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
import { useState } from "react";
import { FormProvider, Controller, useFormContext, type UseFormReturn } from "react-hook-form";
import OpticalCenterInput from "@/components/imask/protocolo/OpticalCenterInput";
import { usePrescriptionFormBehavior } from "../../hooks/usePrescriptionFormBehavior";
import { usePrescriptionValidation } from "../../hooks/usePrescriptionValidation";
import type { CreatePrescriptionPayload } from "../../types/prescriptionTypes";
import PrescriptionEyeFields from "./PrescriptionEyeFields";

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
    const methods = useFormContext<CreatePrescriptionPayload>();
    const { control, register, formState } = methods;
    const validation = usePrescriptionValidation();
    const {
        isMonofocal,
        monofocalVisionType,
        showAddition,
        showPellicle,
        showNearVision,
        isAutoNearLens,
    } = usePrescriptionFormBehavior(methods);
    const [currentTab, setCurrentTab] = useState(0);

    const handleFormSubmit = async (e?: React.BaseSyntheticEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        handleSubmit(e);
    };

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
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
                                    <PrescriptionEyeFields
                                        eye="od"
                                        vision="far"
                                        isAutoNearLens={isAutoNearLens}
                                        showAddition={showAddition}
                                        showPellicle={showPellicle}
                                    />
                                    <Divider />
                                    <PrescriptionEyeFields
                                        eye="oe"
                                        vision="far"
                                        isAutoNearLens={isAutoNearLens}
                                        showAddition={showAddition}
                                        showPellicle={showPellicle}
                                    />
                                </Stack>
                            </TabPanel>

                            <TabPanel value={currentTab} index={1}>
                                <Stack spacing={3}>
                                    <PrescriptionEyeFields
                                        eye="od"
                                        vision="near"
                                        isAutoNearLens={isAutoNearLens}
                                        showAddition={showAddition}
                                        showPellicle={showPellicle}
                                    />
                                    <Divider />
                                    <PrescriptionEyeFields
                                        eye="oe"
                                        vision="near"
                                        isAutoNearLens={isAutoNearLens}
                                        showAddition={showAddition}
                                        showPellicle={showPellicle}
                                    />
                                </Stack>
                            </TabPanel>
                        </>
                    ) : (
                        <Stack spacing={3}>
                            <PrescriptionEyeFields
                                eye="od"
                                vision={monofocalVisionType === "near" ? "near" : "far"}
                                isAutoNearLens={isAutoNearLens}
                                showAddition={showAddition}
                                showPellicle={showPellicle}
                            />
                            <Divider />
                            <PrescriptionEyeFields
                                eye="oe"
                                vision={monofocalVisionType === "near" ? "near" : "far"}
                                isAutoNearLens={isAutoNearLens}
                                showAddition={showAddition}
                                showPellicle={showPellicle}
                            />
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
