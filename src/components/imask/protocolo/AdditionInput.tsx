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

const MIN_VALUE = 0;
const MAX_VALUE = 3.5;
const STEP = 0.25;

const ADDITION_OPTIONS = (() => {
    const options: string[] = [];
    for (let i = MIN_VALUE; i <= MAX_VALUE; i += STEP) {
        options.push(`+${formatter.format(i)}`);
    }
    return options;
})();

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

const parseAdditionValue = (input: string): number => {
    const normalized = input.replace(",", ".").replace(/[^\d.]/g, "");
    return parseFloat(normalized);
};

const formatAdditionValue = (value: number): string => {
    return `+${formatter.format(value)}`;
};

const roundToStep = (value: number, step: number): number => {
    return Math.round(value / step) * step;
};

const validateAdditionValue = (
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
    if (value === "+") {
        return { isValid: false, message: touched ? "Digite um valor válido" : "" };
    }

    const parsed = parseAdditionValue(value);

    // Não é número
    if (isNaN(parsed)) {
        return { isValid: false, message: touched ? "Valor inválido" : "" };
    }

    // Fora do range
    if (parsed < MIN_VALUE || parsed > MAX_VALUE) {
        return {
            isValid: false,
            message: touched
                ? `Valor deve estar entre ${formatAdditionValue(MIN_VALUE)} e ${formatAdditionValue(MAX_VALUE)}`
                : "",
        };
    }

    // Valida incremento de 0.25 (apenas se touched)
    if (touched) {
        const remainder = Math.abs((parsed * 100) % (STEP * 100));
        if (remainder > 0.01) {
            return {
                isValid: false,
                message: `Use incrementos de ${STEP.toFixed(2).replace(".", ",")} (ex: +1,25, +2,50)`,
            };
        }
    }

    return { isValid: true, message: "" };
};

export default function AdditionInputAutocomplete({
    value,
    onChange,
    label = "Adição",
    placeholder = "+0,00",
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

    const validation = validateAdditionValue(inputValue, touched, required);

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
                const parsed = parseAdditionValue(inputValue);

                if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                    const remainder = Math.abs((parsed * 100) % (STEP * 100));

                    if (remainder > 0.01) {
                        const rounded = roundToStep(parsed, STEP);
                        const formatted = formatAdditionValue(rounded);
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
            const parsed = parseAdditionValue(newValue);

            // Se for válido, formata
            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const rounded = roundToStep(parsed, STEP);
                const formatted = formatAdditionValue(rounded);
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
        if (inputValue && inputValue.trim() !== "" && inputValue !== "+") {
            const parsed = parseAdditionValue(inputValue);

            if (!isNaN(parsed) && parsed >= MIN_VALUE && parsed <= MAX_VALUE) {
                const remainder = Math.abs((parsed * 100) % (STEP * 100));

                // Só formata se já for múltiplo válido
                if (remainder < 0.01) {
                    const formatted = formatAdditionValue(parsed);
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
            size={size}
            options={ADDITION_OPTIONS}
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
