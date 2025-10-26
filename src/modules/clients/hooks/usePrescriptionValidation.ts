import { useWatch } from "react-hook-form";
import type { CreatePrescriptionPayload } from "../types/prescriptionTypes";

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

    const isFieldEmpty = (value: string | null | undefined): boolean => {
        return !value || value.trim() === "";
    };

    const requiresBifocalMultifocal = (): boolean => {
        return lensType === "bifocal" || lensType === "multifocal";
    };

    // RN01: Nome do médico
    const validateDoctorName = (value: string | null | undefined): string | boolean => {
        if (isFieldEmpty(value)) return true;
        if (value!.trim().length < 3) return "Nome do médico deve ter pelo menos 3 caracteres";
        const namePattern = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!namePattern.test(value!.trim())) return "Nome deve conter apenas letras";
        return true;
    };

    // RN02: CRM
    const validateCRM = (value: string | null | undefined): string | boolean => {
        if (isFieldEmpty(value)) return true;
        const cleaned = value!.replace(/\D/g, "");
        if (cleaned.length < 4 || cleaned.length > 10) return "CRM deve ter entre 4 e 10 dígitos";
        return true;
    };

    // RN03: Data
    const validatePrescriptionDate = (value: string | null | undefined): string | boolean => {
        if (isFieldEmpty(value)) return "Data da receita é obrigatória";
        const selectedDate = new Date(value!);
        const today = new Date(); today.setHours(23, 59, 59, 999);
        if (selectedDate > today) return "Data da receita não pode ser futura";
        const fiveYearsAgo = new Date(); fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        if (selectedDate < fiveYearsAgo) return "Data da receita muito antiga (máximo 5 anos)";
        return true;
    };

    // RN04: Validação de Eixo
    const validateAxis = (
        axisValue: string | null | undefined,
        cylindricalValue: string | null | undefined
    ): string | boolean => {
        if (isCylindricalZero(cylindricalValue)) return true;
        if (isFieldEmpty(axisValue)) return "Eixo obrigatório quando Cilíndrico ≠ 0";
        return true;
    };

    // RN05: Adição
    const validateAddition = (value: string | null | undefined): string | boolean => {
        if (!requiresBifocalMultifocal()) return true;
        if (isFieldEmpty(value)) return "Adição obrigatória para lentes Bifocal/Multifocal";
        return true;
    };

    // RN06: Tipo de lente
    const validateLensType = (value: string | null | undefined): string | boolean => {
        if (isFieldEmpty(value)) return "Tipo de lente é obrigatório";
        const validTypes = [
            "monofocal",
            "bifocal",
            "multifocal",
            "ocupacional",
            "fotossensivel",
            "comFiltroAzul",
        ];
        if (!validTypes.includes(value!)) return "Tipo de lente inválido";
        return true;
    };

    // RN07: Grau (Esférico/Cilíndrico)
    const validateDegreeValue = (
        value: string | null | undefined,
        fieldName: string
    ): string | boolean => {
        if (isFieldEmpty(value)) return true;
        const cleaned = value!.trim().replace(",", ".");
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
    const validateDNP = (value: string | null | undefined): string | boolean => {
        if (isFieldEmpty(value)) return true;
        const cleaned = value!.replace(",", ".");
        const num = parseFloat(cleaned);
        if (isNaN(num)) return "DNP deve ser um número válido";
        if (num < 25 || num > 40) return "DNP deve estar entre 25 e 40 mm";
        return true;
    };

    // RN09: Centro Óptico
    const validateOpticalCenter = (value: string | null | undefined): string | boolean => {
        if (isFieldEmpty(value)) return true;
        const cleaned = value!.replace(",", ".");
        const num = parseFloat(cleaned);
        if (isNaN(num)) return "Centro Óptico deve ser um número válido";
        if (num < 14 || num > 40) return "Centro Óptico deve estar entre 10 e 40 mm";
        return true;
    };

    // RN10: Observações
    const validateNotes = (value: string | null | undefined): string | boolean => {
        if (isFieldEmpty(value)) return true;
        if (value!.length > 500) return "Observações devem ter no máximo 500 caracteres";
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

        validateOdAxisFar: (value: string | null | undefined) => validateAxis(value, odCylindricalFar),
        validateOeAxisFar: (value: string | null | undefined) => validateAxis(value, oeCylindricalFar),
        validateOdAxisNear: (value: string | null | undefined) => validateAxis(value, odCylindricalNear),
        validateOeAxisNear: (value: string | null | undefined) => validateAxis(value, oeCylindricalNear),

        validateAdditionRight: validateAddition,
        validateAdditionLeft: validateAddition,

        validateOdSphericalFar: (value: string | null | undefined) => validateDegreeValue(value, "Esférico OD Longe"),
        validateOeSphericalFar: (value: string | null | undefined) => validateDegreeValue(value, "Esférico OE Longe"),
        validateOdSphericalNear: (value: string | null | undefined) => validateDegreeValue(value, "Esférico OD Perto"),
        validateOeSphericalNear: (value: string | null | undefined) => validateDegreeValue(value, "Esférico OE Perto"),

        validateOdCylindricalFar: (value: string | null | undefined) => validateDegreeValue(value, "Cilíndrico OD Longe"),
        validateOeCylindricalFar: (value: string | null | undefined) => validateDegreeValue(value, "Cilíndrico OE Longe"),
        validateOdCylindricalNear: (value: string | null | undefined) => validateDegreeValue(value, "Cilíndrico OD Perto"),
        validateOeCylindricalNear: (value: string | null | undefined) => validateDegreeValue(value, "Cilíndrico OE Perto"),

        validateDNP,
        validateOpticalCenter,

        isCylindricalZero,
        requiresBifocalMultifocal,
    };
}
