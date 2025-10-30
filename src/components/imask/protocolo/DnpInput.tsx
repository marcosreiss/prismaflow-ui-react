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

const DNP_OPTIONS = [
    "25,0",
    "25,5",
    "26,0",
    "26,5",
    "27,0",
    "27,5",
    "28,0",
    "28,5",
    "29,0",
    "29,5",
    "30,0",
    "30,5",
    "31,0",
    "31,5",
    "32,0",
    "32,5",
    "33,0",
    "33,5",
    "34,0",
    "34,5",
    "35,0",
    "35,5",
    "36,0",
    "36,5",
    "37,0",
    "37,5",
    "38,0",
    "38,5",
    "39,0",
    "39,5",
    "40,0"
];

const DnpInput: React.FC<Props> = ({
    value,
    onChange,
    label = "DNP (mm)",
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
        >
            <MenuItem value="">Selecione</MenuItem>
            {DNP_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </TextField>
    );
};

export default DnpInput;
