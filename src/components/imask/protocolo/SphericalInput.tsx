import React, { useMemo, useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    size?: "small" | "medium";
};

const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

const generateGrauOptions = () => {
    const options: string[] = [];
    for (let i = -40; i <= 40; i += 0.25) {
        const formatted = `${i >= 0 ? "+" : ""}${formatter.format(i)}`;
        options.push(formatted);
    }
    return options;
};

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

export default function SphericalInputAutocomplete({
    value,
    onChange,
    label = "Esférico (ESF)",
    placeholder = "+0.00",
    size = "small",
}: Props) {
    const GRAU_OPTIONS = useMemo(() => generateGrauOptions(), []);
    const [inputValue, setInputValue] = useState(value ?? "");

    const handleInputChange = (
        _event: React.SyntheticEvent,
        newInput: string,
        reason: string
    ) => {
        if (reason === "input") {
            // permite digitação de sinal e até duas casas decimais
            if (newInput.match(/^[+-]?\d{0,2}([,.]\d{0,2})?$/)) {
                setInputValue(newInput);
                onChange(newInput);
            }
        } else if (reason === "clear") {
            setInputValue("");
            onChange(null);
        }
    };

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: string | null
    ) => {
        setInputValue(newValue ?? "");
        onChange(newValue);
    };

    const handleBlur = () => {
        // atraso evita conflito de eventos internos do Autocomplete
        setTimeout(() => {
            if (!inputValue) {
                onChange(null);
                return;
            }

            const normalized = parseFloat(
                inputValue.replace(",", ".").replace(/[^\d.-]/g, "")
            );
            if (isNaN(normalized)) {
                setInputValue("");
                onChange(null);
                return;
            }

            // Corta valor entre -40 e +40
            let clamped = Math.min(Math.max(normalized, -40), 40);
            // Passo de 0.25
            clamped = Math.round(clamped * 4) / 4;

            const formatted = `${clamped >= 0 ? "+" : ""}${formatter.format(clamped)}`;
            setInputValue(formatted);
            onChange(formatted);
        }, 0);
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
                    onBlur={handleBlur}
                    inputProps={{
                        ...params.inputProps,
                        inputMode: "decimal",
                    }}
                />
            )}
        />
    );
}
