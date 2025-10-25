// hooks/usePrescriptionValidation.ts

import { useWatch } from "react-hook-form";
import type { CreatePrescriptionPayload } from "../types/prescriptionTypes";

/**
 * Hook centralizado para todas as validações do formulário de prescrição
 * 
 * Regras implementadas:
 * - RN01: Nome do médico (opcional mas com formato)
 * - RN02: CRM (formato válido se preenchido)
 * - RN03: Data da receita (obrigatória, não futura)
 * - RN04: Eixo obrigatório quando Cilíndrico ≠ 0
 * - RN05: Adição obrigatória para Bifocal/Multifocal
 * - RN06: Tipo de lente obrigatório
 * - RN07: Validação de graus (formato numérico válido)
 */
export function usePrescriptionValidation() {
    // ==============================
    // 🔹 Watch nos campos necessários
    // ==============================

    const lensType = useWatch<CreatePrescriptionPayload, "lensType">({
        name: "lensType",
    }) ?? "";

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

    // ==============================
    // 🔹 Helpers
    // ==============================

    const isCylindricalZero = (value: string | undefined | null): boolean => {
        if (!value || value.trim() === "") return true;
        const normalized = value.replace(",", ".");
        const numValue = parseFloat(normalized);
        return isNaN(numValue) || numValue === 0;
    };

    const isFieldEmpty = (value: string | undefined | null): boolean => {
        return !value || value.trim() === "";
    };

    const requiresBifocalMultifocal = (): boolean => {
        return lensType === "bifocal" || lensType === "multifocal";
    };

    // ==============================
    // 🔹 RN01: Validação de Nome do Médico
    // ==============================

    const validateDoctorName = (value: string | undefined): string | boolean => {
        // Nome é opcional
        if (isFieldEmpty(value)) {
            return true;
        }

        // Se preenchido, deve ter pelo menos 3 caracteres
        if (value!.trim().length < 3) {
            return "Nome do médico deve ter pelo menos 3 caracteres";
        }

        // Deve conter apenas letras, espaços e acentos
        const namePattern = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!namePattern.test(value!.trim())) {
            return "Nome deve conter apenas letras";
        }

        return true;
    };

    // ==============================
    // 🔹 RN02: Validação de CRM
    // ==============================

    const validateCRM = (value: string | undefined): string | boolean => {
        // CRM é opcional
        if (isFieldEmpty(value)) {
            return true;
        }

        // Remove caracteres não numéricos
        const cleaned = value!.replace(/\D/g, "");

        // CRM deve ter entre 4 e 10 dígitos
        if (cleaned.length < 4 || cleaned.length > 10) {
            return "CRM deve ter entre 4 e 10 dígitos";
        }

        return true;
    };

    // ==============================
    // 🔹 RN03: Validação de Data
    // ==============================

    const validatePrescriptionDate = (value: string | undefined): string | boolean => {
        if (isFieldEmpty(value)) {
            return "Data da receita é obrigatória";
        }

        const selectedDate = new Date(value!);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // Fim do dia de hoje

        // Não pode ser data futura
        if (selectedDate > today) {
            return "Data da receita não pode ser futura";
        }

        // Não pode ser muito antiga (exemplo: mais de 5 anos)
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

        if (selectedDate < fiveYearsAgo) {
            return "Data da receita muito antiga (máximo 5 anos)";
        }

        return true;
    };

    // ==============================
    // 🔹 RN04: Validação de Eixo
    // ==============================

    const validateAxis = (
        axisValue: string | undefined,
        cylindricalValue: string | undefined
    ): string | boolean => {
        // Se cilíndrico é zero, eixo não é obrigatório
        if (isCylindricalZero(cylindricalValue)) {
            return true;
        }

        // Se cilíndrico ≠ 0, eixo é obrigatório
        if (isFieldEmpty(axisValue)) {
            return "Eixo obrigatório quando Cilíndrico ≠ 0";
        }

        return true;
    };

    // ==============================
    // 🔹 RN05: Validação de Adição
    // ==============================

    const validateAddition = (value: string | undefined): string | boolean => {
        // Se não é bifocal/multifocal, não é obrigatório
        if (!requiresBifocalMultifocal()) {
            return true;
        }

        // Se é bifocal/multifocal, adição é obrigatória
        if (isFieldEmpty(value)) {
            return "Adição obrigatória para lentes Bifocal/Multifocal";
        }

        return true;
    };

    // ==============================
    // 🔹 RN06: Validação de Tipo de Lente
    // ==============================

    const validateLensType = (value: string | undefined): string | boolean => {
        if (isFieldEmpty(value)) {
            return "Tipo de lente é obrigatório";
        }

        const validTypes = [
            "monofocal",
            "bifocal",
            "multifocal",
            "ocupacional",
            "fotossensivel",
            "comFiltroAzul",
        ];

        if (!validTypes.includes(value!)) {
            return "Tipo de lente inválido";
        }

        return true;
    };

    // ==============================
    // 🔹 RN07: Validação de Grau (Esférico/Cilíndrico)
    // ==============================

    const validateDegreeValue = (
        value: string | undefined,
        fieldName: string
    ): string | boolean => {
        // Campo é opcional
        if (isFieldEmpty(value)) {
            return true;
        }

        // Remove espaços e converte vírgula para ponto
        const cleaned = value!.trim().replace(",", ".");

        // Verifica se é número válido
        const num = parseFloat(cleaned);
        if (isNaN(num)) {
            return `${fieldName} deve ser um número válido`;
        }

        // Validação de range para esférico (-30 a +30)
        if (fieldName.includes("Esférico")) {
            if (num < -30 || num > 30) {
                return "Esférico deve estar entre -30,00 e +30,00";
            }
        }

        // Validação de range para cilíndrico (-10 a 0)
        if (fieldName.includes("Cilíndrico")) {
            if (num > 0 || num < -10) {
                return "Cilíndrico deve estar entre -10,00 e 0,00";
            }
        }

        return true;
    };

    // ==============================
    // 🔹 RN08: Validação de DNP
    // ==============================

    const validateDNP = (value: string | undefined): string | boolean => {
        // DNP é opcional
        if (isFieldEmpty(value)) {
            return true;
        }

        const cleaned = value!.replace(",", ".");
        const num = parseFloat(cleaned);

        if (isNaN(num)) {
            return "DNP deve ser um número válido";
        }

        // DNP geralmente está entre 20mm e 80mm
        if (num < 20 || num > 80) {
            return "DNP deve estar entre 20 e 80 mm";
        }

        return true;
    };

    // ==============================
    // 🔹 RN09: Validação de Centro Óptico
    // ==============================

    const validateOpticalCenter = (value: string | undefined): string | boolean => {
        // Centro óptico é opcional
        if (isFieldEmpty(value)) {
            return true;
        }

        const cleaned = value!.replace(",", ".");
        const num = parseFloat(cleaned);

        if (isNaN(num)) {
            return "Centro Óptico deve ser um número válido";
        }

        // Range típico: 10mm a 40mm
        if (num < 10 || num > 40) {
            return "Centro Óptico deve estar entre 10 e 40 mm";
        }

        return true;
    };

    // ==============================
    // 🔹 RN10: Validação de Observações
    // ==============================

    const validateNotes = (value: string | undefined): string | boolean => {
        // Observações são opcionais
        if (isFieldEmpty(value)) {
            return true;
        }

        // Limite de caracteres: 500
        if (value!.length > 500) {
            return "Observações devem ter no máximo 500 caracteres";
        }

        return true;
    };

    // ==============================
    // 🔹 Retorno
    // ==============================

    return {
        // Validadores básicos
        validateDoctorName,
        validateCRM,
        validatePrescriptionDate,
        validateLensType,
        validateNotes,

        // Validadores de Eixo (RN04)
        validateOdAxisFar: (value: string | undefined) =>
            validateAxis(value, odCylindricalFar),
        validateOeAxisFar: (value: string | undefined) =>
            validateAxis(value, oeCylindricalFar),
        validateOdAxisNear: (value: string | undefined) =>
            validateAxis(value, odCylindricalNear),
        validateOeAxisNear: (value: string | undefined) =>
            validateAxis(value, oeCylindricalNear),

        // Validadores de Adição (RN05)
        validateAdditionRight: validateAddition,
        validateAdditionLeft: validateAddition,

        // Validadores de Grau (RN07)
        validateOdSphericalFar: (value: string | undefined) =>
            validateDegreeValue(value, "Esférico OD Longe"),
        validateOeSphericalFar: (value: string | undefined) =>
            validateDegreeValue(value, "Esférico OE Longe"),
        validateOdSphericalNear: (value: string | undefined) =>
            validateDegreeValue(value, "Esférico OD Perto"),
        validateOeSphericalNear: (value: string | undefined) =>
            validateDegreeValue(value, "Esférico OE Perto"),

        validateOdCylindricalFar: (value: string | undefined) =>
            validateDegreeValue(value, "Cilíndrico OD Longe"),
        validateOeCylindricalFar: (value: string | undefined) =>
            validateDegreeValue(value, "Cilíndrico OE Longe"),
        validateOdCylindricalNear: (value: string | undefined) =>
            validateDegreeValue(value, "Cilíndrico OD Perto"),
        validateOeCylindricalNear: (value: string | undefined) =>
            validateDegreeValue(value, "Cilíndrico OE Perto"),

        // Validadores de DNP (RN08)
        validateDNP,

        // Validadores de Centro Óptico (RN09)
        validateOpticalCenter,

        // Helpers
        isCylindricalZero,
        requiresBifocalMultifocal,
    };
}
