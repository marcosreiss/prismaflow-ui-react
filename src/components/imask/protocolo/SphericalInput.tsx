import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    helperText?: string;
    size?: "small" | "medium";
    required?: boolean;
    onValidationChange?: (isValid: boolean) => void;
};

type ValidationResult = {
    isValid: boolean;
    message: string;
};

const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const MIN_VALUE = -40;
const MAX_VALUE = 40;
const STEP = 0.25;

const GRAU_OPTIONS = (() => {
    const options: string[] = [];
    for (let i = MIN_VALUE; i <= MAX_VALUE; i += STEP) {
        const formatted = `${i >= 0 ? "+" : ""}${formatter.format(i)}`;
        options.push(formatted);
    }
    return options;
})();

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

const parseGrauValue = (input: string): number => {
    const normalized = input.replace(",", ".").replace(/[^\d.-]/g, "");
    return parseFloat(normalized);
};

const formatGrauValue = (value: number): string => {
    return `${value >= 0 ? "+" : ""}${formatter.format(value)}`;
};

const roundToStep = (value: number, step: number): number => {
    return Math.round(value / step) * step;
};

const validateGrauValue = (
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

    // Apenas sinal
    if (value === "+" || value === "-") {
        return { isValid: false, message: touched ? "Digite um valor válido" : "" };
    }

    const parsed = parseGrauValue(value);

    // Não é número
    if (isNaN(parsed)) {
        return { isValid: false, message: touched ? "Valor inválido" : "" };
    }

    // Fora do range
    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
        return {
            isValid: false,
            message: touched
                ? `Valor deve estar entre ${formatGrauValue(MIN_VALUE)} e ${formatGrauValue(MAX_VALUE)}`
                : "",
        };
    }

    // Valida incremento de 0.25 (apenas se touched)
    if (touched) {
        const remainder = Math.abs((parsed * 100) % (STEP * 100));
        if (remainder > 0.01) {
            return {
                isValid: false,
                message: `Use incrementos de ${STEP} (ex: +1.25, -2.50)`,
            };
        }
    }

    return { isValid: true, message: "" };
};

export default function SphericalInputAutocomplete({
    value,
    onChange,
    label = "Esférico (ESF)",
    placeholder = "+0.00",
    size = "small",
    helperText,
    required = false,
    onValidationChange,
}: Props) {
    const [inputValue, setInputValue] = useState(value ?? "");
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        setInputValue(value ?? "");
    }, [value]);

    const validation = validateGrauValue(inputValue, touched, required);

    // Notifica validação ao pai
    useEffect(() => {
        onValidationChange?.(validation.isValid);
    }, [validation.isValid, onValidationChange]);

    // Função para determinar qual helperText mostrar
    const getHelperText = (): string => {
        // Prioriza erro de validação
        if (touched && !validation.isValid && validation.message) {
            return validation.message;
        }

        // Depois mostra helperText customizado
        if (helperText) {
            return helperText;
        }

        return "";
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
            const parsed = parseGrauValue(newValue);

            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const rounded = roundToStep(parsed, STEP);
                const formatted = formatGrauValue(rounded);
                setInputValue(formatted);
                onChange(formatted);
            } else {
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

        if (inputValue && inputValue.trim() !== "") {
            const parsed = parseGrauValue(inputValue);
            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const remainder = Math.abs((parsed * 100) % (STEP * 100));

                if (remainder < 0.01) {
                    const formatted = formatGrauValue(parsed);
                    setInputValue(formatted);
                    onChange(formatted);
                }
            }
        }
    };

    return (
        <Autocomplete
            freeSolo
            autoSelect
            disableClearable={false}
            options={GRAU_OPTIONS}
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
