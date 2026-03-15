import { useCallback, useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CreatePrescriptionPayload } from "../types/prescriptionTypes";

export type EyeSide = "od" | "oe";
export type VisionType = "far" | "near";
export type SphericalFieldName =
    | "odSphericalFar"
    | "odSphericalNear"
    | "oeSphericalFar"
    | "oeSphericalNear";
export type CylindricalFieldName =
    | "odCylindricalFar"
    | "odCylindricalNear"
    | "oeCylindricalFar"
    | "oeCylindricalNear";
export type AxisFieldName =
    | "odAxisFar"
    | "odAxisNear"
    | "oeAxisFar"
    | "oeAxisNear";
export type DnpFieldName =
    | "odDnpFar"
    | "odDnpNear"
    | "oeDnpFar"
    | "oeDnpNear";
export type PellicleFieldName =
    | "odPellicleFar"
    | "odPellicleNear"
    | "oePellicleFar"
    | "oePellicleNear";
export type AdditionFieldName = "additionRight" | "additionLeft";

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

export const getSphericalFieldName = (eye: EyeSide, vision: VisionType): SphericalFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odSphericalFar"
            : "odSphericalNear"
        : vision === "far"
          ? "oeSphericalFar"
          : "oeSphericalNear";

export const getCylindricalFieldName = (eye: EyeSide, vision: VisionType): CylindricalFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odCylindricalFar"
            : "odCylindricalNear"
        : vision === "far"
          ? "oeCylindricalFar"
          : "oeCylindricalNear";

export const getAxisFieldName = (eye: EyeSide, vision: VisionType): AxisFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odAxisFar"
            : "odAxisNear"
        : vision === "far"
          ? "oeAxisFar"
          : "oeAxisNear";

export const getDnpFieldName = (eye: EyeSide, vision: VisionType): DnpFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odDnpFar"
            : "odDnpNear"
        : vision === "far"
          ? "oeDnpFar"
          : "oeDnpNear";

export const getPellicleFieldName = (eye: EyeSide, vision: VisionType): PellicleFieldName =>
    eye === "od"
        ? vision === "far"
            ? "odPellicleFar"
            : "odPellicleNear"
        : vision === "far"
          ? "oePellicleFar"
          : "oePellicleNear";

type UsePrescriptionFormBehaviorReturn = {
    lensType: string;
    monofocalVisionType: "far" | "near";
    isMonofocal: boolean;
    isAutoNearLens: boolean;
    showAddition: boolean;
    showPellicle: boolean;
    showNearVision: boolean;
};

export function usePrescriptionFormBehavior(
    methods: UseFormReturn<CreatePrescriptionPayload>
): UsePrescriptionFormBehaviorReturn {
    const { watch, getValues, setValue } = methods;

    const lensType = watch("lensType") ?? "";
    const monofocalVisionType = (watch("monofocalVisionType") ?? "far") as "far" | "near";
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
        if (!isAutoNearLens || !additionRight) return;
        if (!odSphericalFar && !odCylindricalFar && !odAxisFar && !odDnpFar) return;
        if (hasNearValues("od")) return;

        autoFillNearFields("od", additionRight);
    }, [
        isAutoNearLens,
        additionRight,
        odSphericalFar,
        odCylindricalFar,
        odAxisFar,
        odDnpFar,
        autoFillNearFields,
        hasNearValues,
    ]);

    useEffect(() => {
        if (!isAutoNearLens || !additionLeft) return;
        if (!oeSphericalFar && !oeCylindricalFar && !oeAxisFar && !oeDnpFar) return;
        if (hasNearValues("oe")) return;

        autoFillNearFields("oe", additionLeft);
    }, [
        isAutoNearLens,
        additionLeft,
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

    return {
        lensType,
        monofocalVisionType,
        isMonofocal,
        isAutoNearLens,
        showAddition,
        showPellicle,
        showNearVision,
    };
}
