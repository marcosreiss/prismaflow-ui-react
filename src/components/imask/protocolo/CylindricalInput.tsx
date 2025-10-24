import React, { useMemo, useState } from "react";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    size?: "small" | "medium";
};

// formato oftálmico com duas casas decimais
const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

// opções entre 0 e -8, passo 0.25
const generateCylOptions = () => {
    const opts: string[] = [];
    for (let i = 0; i >= -8; i -= 0.25) {
        opts.push(formatter.format(i));
    }
    return opts;
};

const filterOptions = createFilterOptions<string>({
    matchFrom: "any",
    limit: 100,
});

export default function CylindricalInputAutocomplete({
    value,
    onChange,
    label = "Cilíndrico (CIL)",
    placeholder = "-0,25",
    size = "small",
}: Props) {
    const CYL_OPTIONS = useMemo(() => generateCylOptions(), []);
    const [inputValue, setInputValue] = useState(value ?? "");
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleInputChange = (
        _event: React.SyntheticEvent,
        newInputValue: string,
        reason: string
    ) => {
        if (reason === "input") {
            // permite números negativos com vírgula ou ponto
            if (
                newInputValue.match(/^[-]?\d{0,2}([,.]\d{0,2})?$/) ||
                newInputValue === ""
            ) {
                setError(false);
                setErrorMsg("");
                setInputValue(newInputValue);
                onChange(newInputValue);
            } else {
                setError(true);
                setErrorMsg("Formato inválido");
            }
        } else if (reason === "clear") {
            setError(false);
            setErrorMsg("");
            setInputValue("");
            onChange(null);
        }
    };

    const handleChange = (
        _event: React.SyntheticEvent,
        newValue: string | null
    ) => {
        setError(false);
        setErrorMsg("");
        setInputValue(newValue ?? "");
        onChange(newValue);
    };

    const handleBlur = () => {
        setTimeout(() => {
            if (!inputValue || inputValue.trim() === "" || inputValue === "-") {
                // se vazio ou sinal isolado, volta para 0.00
                const formatted = formatter.format(0);
                setInputValue(formatted);
                onChange(formatted);
                setError(false);
                setErrorMsg("");
                return;
            }

            const raw = inputValue.replace(",", ".").replace(/[^\d.-]/g, "");
            const num = parseFloat(raw);

            if (isNaN(num)) {
                const formatted = formatter.format(0);
                setInputValue(formatted);
                onChange(formatted);
                setError(false);
                setErrorMsg("");
                return;
            }

            // Limita entre -8 e 0, ajusta passo
            let clamped = Math.max(Math.min(num, 0), -8);
            clamped = Math.round(clamped * 4) / 4;

            const formatted = formatter.format(clamped);
            setInputValue(formatted);
            onChange(formatted);
            setError(false);
            setErrorMsg("");
        }, 0);
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
                    error={error}
                    helperText={error ? errorMsg : ""}
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
