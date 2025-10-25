import React, { useEffect, useState } from "react";
import {
    Autocomplete,
    TextField,
    createFilterOptions,
    type AutocompleteInputChangeReason,
} from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    helperText?: string; // 👈 Prop para mensagem customizada
    size?: "small" | "medium";
    disabled?: boolean;
    required?: boolean;
    onValidationChange?: (isValid: boolean) => void;
};

type ValidationResult = {
    isValid: boolean;
    message: string;
};

const MIN_VALUE = 0;
const MAX_VALUE = 180;

// Gera lista de opções de 0° a 180°
const AXIS_OPTIONS = Array.from({ length: 181 }, (_, i) => `${i}°`);

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

const parseAxisValue = (input: string): number => {
    const digits = input.replace(/[^\d]/g, "");
    return parseInt(digits, 10);
};

const formatAxisValue = (value: number): string => {
    return `${value}°`;
};

const validateAxisValue = (
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

    const parsed = parseAxisValue(value);

    // Não é número
    if (isNaN(parsed)) {
        return { isValid: false, message: touched ? "Valor inválido" : "" };
    }

    // Fora do range
    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
        return {
            isValid: false,
            message: touched
                ? `Valor deve estar entre ${MIN_VALUE}° e ${MAX_VALUE}°`
                : "",
        };
    }

    return { isValid: true, message: "" };
};

export default function AxisInputAutocomplete({
    value,
    onChange,
    label = "Eixo (°)",
    placeholder = "0°",
    size = "small",
    helperText, // 👈 Recebe helperText customizado
    disabled = false,
    required = false,
    onValidationChange,
}: Props) {

    console.log("🔍 AxisInput props:", {
        disabled,
        helperText,
        value,
    });

    const [inputValue, setInputValue] = useState(value ?? "");
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        setInputValue(value ?? "");
    }, [value]);

    const validation = validateAxisValue(inputValue, touched, required);

    // Notifica validação ao pai
    useEffect(() => {
        onValidationChange?.(validation.isValid);
    }, [validation.isValid, onValidationChange]);

    // ✅ LÓGICA: Prioriza helperText customizado quando desabilitado
    const getHelperText = (): string => {
        // 1. Se campo desabilitado E helperText foi passado → usa helperText
        if (disabled && helperText) {
            return helperText;
        }

        // 2. Se campo habilitado E tem erro de validação → mostra erro
        if (!disabled && touched && !validation.isValid) {
            return validation.message;
        }

        // 3. Caso contrário → vazio
        return "";
    };

    const handleInputChange = (
        _event: React.SyntheticEvent,
        newInputValue: string,
        reason: AutocompleteInputChangeReason
    ) => {
        if (reason === "clear" || newInputValue === "") {
            setInputValue("");
            onChange(null);
            return;
        }

        if (reason === "input") {
            const digits = newInputValue.replace(/[^\d]/g, "");

            if (!digits) {
                setInputValue("");
                onChange(null);
                return;
            }

            // Limita entre 0 e 180
            const num = Math.min(Math.max(parseInt(digits, 10), MIN_VALUE), MAX_VALUE);
            const formatted = formatAxisValue(num);

            setInputValue(formatted);
            onChange(formatted);
        }

        if (reason === "reset" || reason === "selectOption") {
            setInputValue(newInputValue);
            onChange(newInputValue);
        }
    };

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: string | null
    ) => {
        setInputValue(newValue ?? "");
        onChange(newValue);
        setTouched(true);
    };

    const handleBlur = () => {
        setTouched(true);

        // Formata valor ao perder foco
        if (inputValue && inputValue.trim() !== "") {
            const parsed = parseAxisValue(inputValue);

            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const formatted = formatAxisValue(parsed);
                setInputValue(formatted);
                onChange(formatted);
            }
        }
    };

    return (
        <Autocomplete
            freeSolo
            autoSelect
            disableClearable={false}
            size={size}
            disabled={disabled}
            options={AXIS_OPTIONS}
            filterOptions={filterOptions}
            isOptionEqualToValue={(option, val) => option === val}
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
                    disabled={disabled}
                    onBlur={handleBlur}
                    error={!disabled && touched && !validation.isValid} // 👈 Erro só se habilitado
                    helperText={getHelperText()} // 👈 Usa função customizada
                    inputProps={{
                        ...params.inputProps,
                        inputMode: "numeric",
                    }}
                />
            )}
        />
    );
}
