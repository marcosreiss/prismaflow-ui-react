import { Box, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import AdditionInput from "@/components/imask/protocolo/AdditionInput";
import AxisInput from "@/components/imask/protocolo/AxisInput";
import CylindricalInput from "@/components/imask/protocolo/CylindricalInput";
import DnpInput from "@/components/imask/protocolo/DnpInput";
import PellicleInput from "@/components/imask/protocolo/PellicleInput";
import SphericalInput from "@/components/imask/protocolo/SphericalInput";
import { usePrescriptionValidation } from "../../hooks/usePrescriptionValidation";
import {
    getAxisFieldName,
    getCylindricalFieldName,
    getDnpFieldName,
    getPellicleFieldName,
    getSphericalFieldName,
    type AdditionFieldName,
    type EyeSide,
    type VisionType,
} from "../../hooks/usePrescriptionFormBehavior";
import type { CreatePrescriptionPayload } from "../../types/prescriptionTypes";

const degreeGridSx = {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
    gap: 2,
};

type PrescriptionEyeFieldsProps = {
    eye: EyeSide;
    vision: VisionType;
    isAutoNearLens: boolean;
    showAddition: boolean;
    showPellicle: boolean;
};

export default function PrescriptionEyeFields({
    eye,
    vision,
    isAutoNearLens,
    showAddition,
    showPellicle,
}: PrescriptionEyeFieldsProps) {
    const { control } = useFormContext<CreatePrescriptionPayload>();
    const validation = usePrescriptionValidation();
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
                                onChange={field.onChange}
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
}
