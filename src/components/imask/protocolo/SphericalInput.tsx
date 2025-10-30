import React from "react";
import { TextField, MenuItem } from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    size?: "small" | "medium";
    helperText?: string;
};

function montarOpcoes() {
    const range = 40;
    const step = 0.25;
    const formatter = (n: number) => (n > 0 ? "+" : n < 0 ? "" : "") + n.toFixed(2).replace(".", ",");
    const opcoesPos = [];
    const opcoesNeg = [];

    for (let v = step; v <= range; v += step) opcoesPos.push(formatter(v));
    for (let v = -step; v >= -range; v -= step) opcoesNeg.push(formatter(v));
    return ["0,00", ...opcoesPos, ...opcoesNeg];
}

const GRAU_OPTIONS = montarOpcoes();

const SphericalInput: React.FC<Props> = ({
    value,
    onChange,
    label = "Esférico",
    placeholder = "",
    size = "medium",
    helperText = "",
}) => {
    return (
        <TextField
            select
            fullWidth
            size={size}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            variant="outlined"
            SelectProps={{
                MenuProps: {
                    PaperProps: {
                        style: { maxHeight: 360 },
                    },
                    anchorOrigin: { vertical: "center", horizontal: "left" },
                    transformOrigin: { vertical: "center", horizontal: "left" },
                },
                native: false,
            }}
        >
            <MenuItem value="">Selecione</MenuItem>
            {GRAU_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </TextField>
    );
};

export default SphericalInput;
