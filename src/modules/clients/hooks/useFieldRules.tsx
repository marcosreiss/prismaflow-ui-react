// hooks/useFieldRules.ts

import { useFormContext, useWatch } from "react-hook-form";
import type { CreatePrescriptionPayload } from "../types/prescriptionTypes";

export function useFieldRules() {

    const { watch } = useFormContext<CreatePrescriptionPayload>();
    const lensTypeRaw = watch("lensType");


    // 👇 Captura o valor (pode ser undefined)
    // const lensTypeRaw = useWatch<CreatePrescriptionPayload, "lensType">({
    //     name: "lensType",
    // });

    // 👇 FORÇA string vazia se undefined/null
    const lensType = lensTypeRaw ?? "";

    const odCylindricalFar = useWatch<CreatePrescriptionPayload, "odCylindricalFar">({
        name: "odCylindricalFar",
    }) ?? "";

    const oeCylindricalFar = useWatch<CreatePrescriptionPayload, "oeCylindricalFar">({
        name: "oeCylindricalFar",
    }) ?? "";

    const odCylindricalNear = useWatch<CreatePrescriptionPayload, "odCylindricalNear">({
        name: "odCylindricalNear",
    }) ?? "";

    const oeCylindricalNear = useWatch<CreatePrescriptionPayload, "oeCylindricalNear">({
        name: "oeCylindricalNear",
    }) ?? "";

    const isCylindricalZero = (value: string | undefined | null): boolean => {
        if (!value || value.trim() === "") return true;
        const normalized = value.replace(",", ".");
        const numValue = parseFloat(normalized);
        return isNaN(numValue) || numValue === 0;
    };

    const isOdAxisFarDisabled = isCylindricalZero(odCylindricalFar);
    const isOeAxisFarDisabled = isCylindricalZero(oeCylindricalFar);
    const isOdAxisNearDisabled = isCylindricalZero(odCylindricalNear);
    const isOeAxisNearDisabled = isCylindricalZero(oeCylindricalNear);

    const showAddition = lensType === "bifocal" || lensType === "multifocal";
    const showPellicle = lensType === "bifocal" || lensType === "multifocal";

    // 👇 Usa o valor tratado (nunca undefined)
    const showNearVision = lensType !== "monofocal";

    console.log("🔍 DEBUG useFieldRules APÓS mudança:", {
        lensTypeRaw,
        lensType,
        showNearVision,
        isMonofocal: lensType === "monofocal",
    });

    return {
        isOdAxisFarDisabled,
        isOeAxisFarDisabled,
        isOdAxisNearDisabled,
        isOeAxisNearDisabled,
        showAddition,
        showPellicle,
        showNearVision,
        lensType, // 👈 Retorna o valor tratado
        isCylindricalZero,
    };
}
