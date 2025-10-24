import React, { useMemo, useState } from "react";
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
    size?: "small" | "medium";
    disabled?: boolean;
};

const generateDnpOptions = (): string[] => {
    const options: string[] = [];
    for (let i = 25; i <= 40; i += 0.5) {
        options.push(i.toFixed(1).replace(".", ",")); // vírgula padrão pt‑BR
    }
    return options;
};

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

export default function DnpInputAutocomplete({
    value,
    onChange,
    label = "DNP (mm)",
    placeholder = "30,0",
    size = "small",
    disabled = false,
}: Props) {
    const DNP_OPTIONS = useMemo(() => generateDnpOptions(), []);
    const [inputValue, setInputValue] = useState(value ?? "");

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
            const parsed = newInputValue.replace(",", ".").replace(/[^\d.]/g, "");
            if (!parsed) {
                setInputValue("");
                onChange(null);
                return;
            }

            // permite digitação parcial como "2", "28", "29.5"
            const partial = parsed.match(/^\d{0,2}(\.\d{0,1})?$/);
            if (partial) setInputValue(newInputValue);
            return;
        }

        if (reason === "selectOption") {
            setInputValue(newInputValue);
            onChange(newInputValue);
        }
    };

    const handleBlur = () => {
        // atraso garante execução após o Autocomplete atualizar internamente
        setTimeout(() => {
            const raw = inputValue.replace(",", ".").replace(/[^\d.]/g, "");
            const num = parseFloat(raw);

            if (isNaN(num)) {
                setInputValue("");
                onChange(null);
                return;
            }

            let clamped = Math.min(Math.max(num, 25), 40);
            clamped = Math.round(clamped * 2) / 2; // passo de 0.5

            const formatted = clamped.toFixed(1).replace(".", ",");
            setInputValue(formatted);
            onChange(formatted);
        }, 0);
    };

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: string | null
    ) => {
        setInputValue(newValue ?? "");
        onChange(newValue);
    };

    return (
        <Autocomplete
            freeSolo
            autoSelect
            disableClearable={false}
            size={size}
            disabled={disabled}
            options={DNP_OPTIONS}
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
