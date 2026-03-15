import { useWatch } from "react-hook-form";
import type { CreatePrescriptionPayload } from "../types/prescriptionTypes";

type FormFieldValue = string | number | boolean | null | undefined;

/**
 * Hook centralizado para todas as validações do formulário de prescrição
 */
export function usePrescriptionValidation() {
    // ==========================================
    // ----------- Campanhas dinâmicas ----------
    // ==========================================
    const lensType = useWatch<CreatePrescriptionPayload, "lensType">({ name: "lensType" }) ?? "";
    const odCylindricalFar = useWatch<CreatePrescriptionPayload, "odCylindricalFar">({ name: "odCylindricalFar" }) ?? "";
    const oeCylindricalFar = useWatch<CreatePrescriptionPayload, "oeCylindricalFar">({ name: "oeCylindricalFar" }) ?? "";
    const odCylindricalNear = useWatch<CreatePrescriptionPayload, "odCylindricalNear">({ name: "odCylindricalNear" }) ?? "";
    const oeCylindricalNear = useWatch<CreatePrescriptionPayload, "oeCylindricalNear">({ name: "oeCylindricalNear" }) ?? "";

    // ============================
    // ----------- Helpers ---------
    // ============================

    const isCylindricalZero = (value: string | null | undefined): boolean => {
        if (!value || value.trim() === "") return true;
        const normalized = value.replace(",", ".");
        const numValue = parseFloat(normalized);
        return isNaN(numValue) || numValue === 0;
    };

    const toOptionalString = (value: FormFieldValue): string | null => {
        return typeof value === "string" ? value : null;
    };

    const isFieldEmpty = (value: FormFieldValue): boolean => {
        const stringValue = toOptionalString(value);
        return !stringValue || stringValue.trim() === "";
    };

    const requiresAddition = (): boolean => {
        return lensType === "bifocal" || lensType === "multifocal" || lensType === "ocupacional";
    };

    // RN01: Nome do médico
    const validateDoctorName = (value: FormFieldValue): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return true;
        if (stringValue!.trim().length < 3) return "Nome do médico deve ter pelo menos 3 caracteres";
        const namePattern = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!namePattern.test(stringValue!.trim())) return "Nome deve conter apenas letras";
        return true;
    };

    // RN02: CRM
    const validateCRM = (value: FormFieldValue): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return true;
        const cleaned = stringValue!.replace(/\D/g, "");
        if (cleaned.length < 4 || cleaned.length > 10) return "CRM deve ter entre 4 e 10 dígitos";
        return true;
    };

    // RN03: Data
    const validatePrescriptionDate = (value: FormFieldValue): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return "Data da receita é obrigatória";
        const selectedDate = new Date(stringValue!);
        const today = new Date(); today.setHours(23, 59, 59, 999);
        if (selectedDate > today) return "Data da receita não pode ser futura";
        const fiveYearsAgo = new Date(); fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        if (selectedDate < fiveYearsAgo) return "Data da receita muito antiga (máximo 5 anos)";
        return true;
    };

    // RN04: Validação de Eixo
    const validateAxis = (
        axisValue: FormFieldValue,
        cylindricalValue: FormFieldValue
    ): string | boolean => {
        if (isCylindricalZero(toOptionalString(cylindricalValue))) return true;
        if (isFieldEmpty(axisValue)) return "Eixo obrigatório quando Cilíndrico ≠ 0";
        return true;
    };

    // RN05: Adição
    const validateAddition = (value: FormFieldValue): string | boolean => {
        if (!requiresAddition()) return true;
        if (isFieldEmpty(value)) return "Adição obrigatória para lentes Bifocal/Multifocal/Ocupacional";
        return true;
    };

    // RN06: Tipo de lente
    const validateLensType = (value: FormFieldValue): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return "Tipo de lente é obrigatório";
        const validTypes = [
            "monofocal",
            "bifocal",
            "multifocal",
            "ocupacional",
            "fotossensivel",
            "comFiltroAzul",
        ];
        if (!stringValue || !validTypes.includes(stringValue)) return "Tipo de lente inválido";
        return true;
    };

    // RN07: Grau (Esférico/Cilíndrico)
    const validateDegreeValue = (
        value: FormFieldValue,
        fieldName: string
    ): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return true;
        const cleaned = stringValue!.trim().replace(",", ".");
        const num = parseFloat(cleaned);
        if (isNaN(num)) return `${fieldName} deve ser um número válido`;
        if (fieldName.includes("Esférico")) {
            if (num < -40 || num > 40) return "Esférico deve estar entre -40,00 e +40,00";
        }
        if (fieldName.includes("Cilíndrico")) {
            if (num > 0 || num < -10) return "Cilíndrico deve estar entre -10,00 e 0,00";
        }
        return true;
    };

    // RN08: DNP
    const validateDNP = (value: FormFieldValue): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return true;
        const cleaned = stringValue!.replace(",", ".");
        const num = parseFloat(cleaned);
        if (isNaN(num)) return "DNP deve ser um número válido";
        if (num < 25 || num > 40) return "DNP deve estar entre 25 e 40 mm";
        return true;
    };

    // RN09: Centro Óptico
    const validateOpticalCenter = (value: FormFieldValue): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return true;
        const cleaned = stringValue!.replace(",", ".");
        const num = parseFloat(cleaned);
        if (isNaN(num)) return "Centro Óptico deve ser um número válido";
        if (num < 14 || num > 40) return "Centro Óptico deve estar entre 10 e 40 mm";
        return true;
    };

    // RN10: Observações
    const validateNotes = (value: FormFieldValue): string | boolean => {
        const stringValue = toOptionalString(value);
        if (isFieldEmpty(value)) return true;
        if (stringValue!.length > 500) return "Observações devem ter no máximo 500 caracteres";
        return true;
    };

    // =============================
    // ---------- Retorno ----------
    // =============================
    return {
        validateDoctorName,
        validateCRM,
        validatePrescriptionDate,
        validateLensType,
        validateNotes,

        validateOdAxisFar: (value: FormFieldValue) => validateAxis(value, odCylindricalFar),
        validateOeAxisFar: (value: FormFieldValue) => validateAxis(value, oeCylindricalFar),
        validateOdAxisNear: (value: FormFieldValue) => validateAxis(value, odCylindricalNear),
        validateOeAxisNear: (value: FormFieldValue) => validateAxis(value, oeCylindricalNear),

        validateAdditionRight: validateAddition,
        validateAdditionLeft: validateAddition,

        validateOdSphericalFar: (value: FormFieldValue) => validateDegreeValue(value, "Esférico OD Longe"),
        validateOeSphericalFar: (value: FormFieldValue) => validateDegreeValue(value, "Esférico OE Longe"),
        validateOdSphericalNear: (value: FormFieldValue) => validateDegreeValue(value, "Esférico OD Perto"),
        validateOeSphericalNear: (value: FormFieldValue) => validateDegreeValue(value, "Esférico OE Perto"),

        validateOdCylindricalFar: (value: FormFieldValue) => validateDegreeValue(value, "Cilíndrico OD Longe"),
        validateOeCylindricalFar: (value: FormFieldValue) => validateDegreeValue(value, "Cilíndrico OE Longe"),
        validateOdCylindricalNear: (value: FormFieldValue) => validateDegreeValue(value, "Cilíndrico OD Perto"),
        validateOeCylindricalNear: (value: FormFieldValue) => validateDegreeValue(value, "Cilíndrico OE Perto"),

        validateDNP,
        validateOpticalCenter,

        isCylindricalZero,
        requiresBifocalMultifocal: requiresAddition,
        requiresAddition,
    };
}
