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

// Agora inclui 0.00 no começo da lista
const generateAdditionOptions = (): string[] => {
    const options: string[] = [];
    for (let i = 0; i <= 3.5; i += 0.25) {
        options.push(`+${formatter.format(i)}`);
    }
    return options;
};

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

export default function AdditionInputAutocomplete({
    value,
    onChange,
    label = "Adição",
    placeholder = "+0.00",
    size = "small",
}: Props) {
    const ADDITION_OPTIONS = useMemo(() => generateAdditionOptions(), []);
    const [inputValue, setInputValue] = useState(value ?? "");

    const handleInputChange = (
        _event: React.SyntheticEvent,
        newInput: string,
        reason: string
    ) => {
        if (reason === "input") {
            // permite +0,00 e valores até duas casas decimais
            if (newInput.match(/^[+]?(\d{0,1})([.,]\d{0,2})?$/)) {
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
        setTimeout(() => {
            if (!inputValue) {
                onChange(null);
                return;
            }

            const normalized = parseFloat(
                inputValue.replace(",", ".").replace(/[^\d.]/g, "")
            );
            if (isNaN(normalized)) {
                setInputValue("");
                onChange(null);
                return;
            }

            // Novo limite: 0.00 a 3.50
            const clamped = Math.min(Math.max(0, normalized), 3.5);
            const rounded = Math.round(clamped * 4) / 4;

            const formatted = `+${formatter.format(rounded)}`;
            setInputValue(formatted);
            onChange(formatted);
        }, 0);
    };

    return (
        <Autocomplete
            freeSolo
            autoSelect
            disableClearable={false}
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
