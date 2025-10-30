// components/imask/protocolo/PellicleInput.tsx

import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    size?: "small" | "medium";
    disabled?: boolean;
    required?: boolean;
    onValidationChange?: (isValid: boolean) => void;
};

type ValidationResult = {
    isValid: boolean;
    message: string;
};

// Formato com duas casas decimais (padrão pt-BR)
const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

// RN05: Película sempre positiva (0 a 4)
const MIN_VALUE = 0;
const MAX_VALUE = 4;
const STEP = 0.25;

// Gera opções de 0.00 até 4.00 com passo de 0.25
const PELLICLE_OPTIONS = (() => {
    const options: string[] = [];
    for (let i = MIN_VALUE; i <= MAX_VALUE; i += STEP) {
        options.push(formatter.format(i));
    }
    return options;
})();

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

const parsePellicleValue = (input: string): number => {
    const normalized = input.replace(",", ".").replace(/[^\d.]/g, "");
    return parseFloat(normalized);
};

const formatPellicleValue = (value: number): string => {
    return formatter.format(value);
};

const roundToStep = (value: number, step: number): number => {
    return Math.round(value / step) * step;
};

const validatePellicleValue = (
    value: string,
    touched: boolean,
    required: boolean
): ValidationResult => {
    // Campo vazio
    if (!value || value.trim() === "") {
        if (!required) {
            return { isValid: true, message: "" };
        }
        return {
            isValid: false,
            message: touched ? "Campo obrigatório" : "",
        };
    }

    const parsed = parsePellicleValue(value);

    // Não é número
    if (isNaN(parsed)) {
        return { isValid: false, message: touched ? "Valor inválido" : "" };
    }

    // RN05: Deve ser positivo (>= 0) e <= 4
    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
        return {
            isValid: false,
            message: touched
                ? `Valor deve estar entre ${formatPellicleValue(MIN_VALUE)} e ${formatPellicleValue(MAX_VALUE)}`
                : "",
        };
    }

    // Valida incremento de 0.25 (apenas se touched)
    if (touched) {
        const remainder = Math.abs((parsed * 100) % (STEP * 100));
        if (remainder > 0.01) {
            return {
                isValid: false,
                message: `Use incrementos de ${formatter.format(STEP)} (ex: 1,00, 1,25, 1,50)`,
            };
        }
    }

    return { isValid: true, message: "" };
};

export default function PellicleInput({
    value,
    onChange,
    label = "Película",
    placeholder = "0,00",
    size = "small",
    disabled = false,
    required = false,
    onValidationChange,
}: Props) {
    const [inputValue, setInputValue] = useState(value ?? "");
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        setInputValue(value ?? "");
    }, [value]);

    const validation = validatePellicleValue(inputValue, touched, required);

    // Notifica validação ao pai
    useEffect(() => {
        onValidationChange?.(validation.isValid);
    }, [validation.isValid, onValidationChange]);

    // Cria helper text com sugestão
    const getHelperText = (): string => {
        if (!validation.message) return "";

        if (touched && inputValue) {
            const parsed = parsePellicleValue(inputValue);

            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const remainder = Math.abs((parsed * 100) % (STEP * 100));

                if (remainder > 0.01) {
                    const rounded = roundToStep(parsed, STEP);
                    const formatted = formatPellicleValue(rounded);
                    return `${validation.message}. Sugestão: ${formatted}`;
                }
            }
        }

        return validation.message;
    };

    const handleInputChange = (
        _event: React.SyntheticEvent,
        newInput: string,
        reason: string
    ) => {
        if (reason === "input") {
            setInputValue(newInput);
            onChange(newInput || null);
        } else if (reason === "clear") {
            setInputValue("");
            onChange(null);
            setTouched(true);
        }
    };

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: string | null
    ) => {
        if (newValue) {
            const parsed = parsePellicleValue(newValue);

            // Se for válido, formata
            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const rounded = roundToStep(parsed, STEP);
                const formatted = formatPellicleValue(rounded);
                setInputValue(formatted);
                onChange(formatted);
            } else {
                // Mantém valor inválido para mostrar erro
                setInputValue(newValue);
                onChange(newValue);
            }
        } else {
            setInputValue("");
            onChange(null);
        }
        setTouched(true);
    };

    const handleBlur = () => {
        setTouched(true);

        // Só formata se JÁ for múltiplo válido de 0.25
        if (inputValue && inputValue.trim() !== "") {
            const parsed = parsePellicleValue(inputValue);

            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const remainder = Math.abs((parsed * 100) % (STEP * 100));

                // Só formata se já for múltiplo válido
                if (remainder < 0.01) {
                    const formatted = formatPellicleValue(parsed);
                    setInputValue(formatted);
                    onChange(formatted);
                }
                // Se não for múltiplo, não faz nada (usuário verá erro + sugestão)
            }
        }
    };

    return (
        <Autocomplete
            freeSolo
            autoSelect
            disableClearable={false}
            disabled={disabled}
            options={PELLICLE_OPTIONS}
            filterOptions={filterOptions}
            value={value ?? ""}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    size={size}
                    required={required}
                    onBlur={handleBlur}
                    error={touched && !validation.isValid}
                    helperText={getHelperText()}
                    inputProps={{
                        ...params.inputProps,
                        inputMode: "decimal",
                    }}
                />
            )}
        />
    );
}
