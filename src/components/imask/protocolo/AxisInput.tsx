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

// Gera lista de opções de 0º a 180º
const generateAxisOptions = (): string[] => {
    return Array.from({ length: 181 }, (_, i) => `${i}º`);
};

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

export default function AxisInputAutocomplete({
    value,
    onChange,
    label = "Eixo (°)",
    placeholder = "0°",
    size = "small",
    disabled = false,
}: Props) {
    const AXIS_OPTIONS = useMemo(generateAxisOptions, []);
    const [inputValue, setInputValue] = useState(value || "");

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
            const digits = newInputValue.replace(/[^0-9]/g, "");
            if (!digits) {
                setInputValue("");
                onChange(null);
                return;
            }

            const num = Math.min(Math.max(parseInt(digits, 10), 0), 180);
            const formatted = `${num}º`;
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
        setInputValue(newValue || "");
        onChange(newValue);
    };

    return (
        <Autocomplete
            freeSolo
            size={size}
            disabled={disabled}
            options={AXIS_OPTIONS}
            filterOptions={filterOptions}
            isOptionEqualToValue={(option, val) => option === val}
            value={value || null}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder={placeholder}
                    type="text"
                    inputProps={{
                        ...params.inputProps,
                        inputMode: "numeric",
                    }}
                />
            )}
        />
    );
}
