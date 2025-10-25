import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    helperText?: string; // 👈 NOVA PROP
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

const MIN_VALUE = -8;
const MAX_VALUE = 0;
const STEP = 0.25;

const CYL_OPTIONS = (() => {
    const options: string[] = [];
    for (let i = MAX_VALUE; i >= MIN_VALUE; i -= STEP) {
        options.push(formatter.format(i));
    }
    return options;
})();

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

const parseCylValue = (input: string): number => {
    const normalized = input.replace(",", ".").replace(/[^\d.-]/g, "");
    return parseFloat(normalized);
};

const formatCylValue = (value: number): string => {
    return formatter.format(value);
};

const roundToStep = (value: number, step: number): number => {
    return Math.round(value / step) * step;
};

const validateCylValue = (
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
    if (value === "-") {
        return { isValid: false, message: touched ? "Digite um valor válido" : "" };
    }

    const parsed = parseCylValue(value);

    // Não é número
    if (isNaN(parsed)) {
        return { isValid: false, message: touched ? "Valor inválido" : "" };
    }

    // Fora do range
    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
        return {
            isValid: false,
            message: touched
                ? `Valor deve estar entre ${formatCylValue(MIN_VALUE)} e ${formatCylValue(MAX_VALUE)}`
                : "",
        };
    }

    // Valida incremento de 0.25 (apenas se touched)
    if (touched) {
        const remainder = Math.abs((parsed * 100) % (STEP * 100));
        if (remainder > 0.01) {
            return {
                isValid: false,
                message: `Use incrementos de ${STEP} (ex: -0,25, -1,50)`,
            };
        }
    }

    return { isValid: true, message: "" };
};

export default function CylindricalInputAutocomplete({
    value,
    onChange,
    label = "Cilíndrico (CIL)",
    placeholder = "-0,25",
    size = "small",
    helperText, // 👈 NOVA PROP
    required = false,
    onValidationChange,
}: Props) {
    const [inputValue, setInputValue] = useState(value ?? "");
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        setInputValue(value ?? "");
    }, [value]);

    const validation = validateCylValue(inputValue, touched, required);

    // Notifica validação ao pai
    useEffect(() => {
        onValidationChange?.(validation.isValid);
    }, [validation.isValid, onValidationChange]);

    // 👇 FUNÇÃO ATUALIZADA: Prioriza erros, depois helperText customizado
    const getHelperText = (): string => {
        // Prioridade 1: Erro de validação com sugestão
        if (touched && !validation.isValid && validation.message) {
            // Se erro de incremento, adiciona sugestão
            if (inputValue) {
                const parsed = parseCylValue(inputValue);

                if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                    const remainder = Math.abs((parsed * 100) % (STEP * 100));

                    if (remainder > 0.01) {
                        const rounded = roundToStep(parsed, STEP);
                        const formatted = formatCylValue(rounded);
                        return `${validation.message}. Sugestão: ${formatted}`;
                    }
                }
            }

            return validation.message;
        }

        // Prioridade 2: helperText customizado
        if (helperText) {
            return helperText;
        }

        // Prioridade 3: Vazio
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
            const parsed = parseCylValue(newValue);

            // Se for válido, formata
            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const rounded = roundToStep(parsed, STEP);
                const formatted = formatCylValue(rounded);
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
        if (inputValue && inputValue.trim() !== "" && inputValue !== "-") {
            const parsed = parseCylValue(inputValue);

            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const remainder = Math.abs((parsed * 100) % (STEP * 100));

                // Só formata se já for múltiplo válido
                if (remainder < 0.01) {
                    const formatted = formatCylValue(parsed);
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
            options={CYL_OPTIONS}
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
                    helperText={getHelperText()} // 👈 MUDANÇA
                    inputProps={{
                        ...params.inputProps,
                        inputMode: "decimal",
                    }}
                />
            )}
        />
    );
}
