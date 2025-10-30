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

const MIN_VALUE = 14.0;
const MAX_VALUE = 40.0;
const STEP = 0.5;

const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

const OPTICAL_CENTER_OPTIONS = (() => {
    const options: string[] = [];
    for (let val = MIN_VALUE; val <= MAX_VALUE + 0.001; val += STEP) {
        options.push(formatter.format(val).replace(".", ","));
    }
    return options;
})();

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 60,
});

const parseOpticalValue = (input: string): number => {
    const normalized = input.replace(",", ".").replace(/[^\d.-]/g, "");
    return parseFloat(normalized);
};

const formatOpticalValue = (value: number): string => {
    return formatter.format(value).replace(".", ",");
};

const roundToStep = (value: number, step: number): number => {
    return Math.round(value / step) * step;
};

const validateOpticalValue = (
    value: string,
    touched: boolean,
    required: boolean
): ValidationResult => {
    if (!value || value.trim() === "") {
        if (!required) return { isValid: true, message: "" };
        return {
            isValid: false,
            message: touched ? "Campo obrigatório" : "",
        };
    }

    const parsed = parseOpticalValue(value);

    if (isNaN(parsed)) {
        return { isValid: false, message: touched ? "Valor inválido" : "" };
    }

    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
        return {
            isValid: false,
            message: touched
                ? `Valor deve estar entre ${MIN_VALUE.toFixed(1).replace(".", ",")} mm e ${MAX_VALUE.toFixed(1).replace(".", ",")} mm`
                : "",
        };
    }

    // Valida incremento de 0.5 mm
    if (touched) {
        const remainder = Math.abs((parsed * 10) % (STEP * 10));
        if (remainder > 0.01) {
            return {
                isValid: false,
                message: `Use incrementos de ${STEP} (ex: 14,0 / 16,5 / 32,0)`,
            };
        }
    }

    return { isValid: true, message: "" };
};

export default function OpticalCenterInputAutocomplete({
    value,
    onChange,
    label = "Centro Óptico (mm)",
    placeholder = "14,0",
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

    const validation = validateOpticalValue(inputValue, touched, required);

    // Notifica validação ao pai
    useEffect(() => {
        onValidationChange?.(validation.isValid);
    }, [validation.isValid, onValidationChange]);

    const getHelperText = (): string => {
        if (touched && !validation.isValid && validation.message) {
            return validation.message;
        }
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
            const parsed = parseOpticalValue(newValue);
            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const rounded = roundToStep(parsed, STEP);
                const formatted = formatOpticalValue(rounded);
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
            const parsed = parseOpticalValue(inputValue);
            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const remainder = Math.abs((parsed * 10) % (STEP * 10));
                if (remainder < 0.01) {
                    const formatted = formatOpticalValue(parsed);
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
            options={OPTICAL_CENTER_OPTIONS}
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
