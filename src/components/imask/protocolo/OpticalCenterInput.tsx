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

const OPTICAL_CENTER_OPTIONS = [
    "14,0", "14,5", "15,0", "15,5", "16,0", "16,5", "17,0", "17,5",
    "18,0", "18,5", "19,0", "19,5", "20,0", "20,5", "21,0", "21,5",
    "22,0", "22,5", "23,0", "23,5", "24,0", "24,5", "25,0", "25,5",
    "26,0", "26,5", "27,0", "27,5", "28,0", "28,5", "29,0", "29,5",
    "30,0", "30,5", "31,0", "31,5", "32,0", "32,5", "33,0", "33,5",
    "34,0", "34,5", "35,0", "35,5", "36,0", "36,5", "37,0", "37,5",
    "38,0", "38,5", "39,0", "39,5", "40,0"
];

const OpticalCenterInput: React.FC<Props> = ({
    value,
    onChange,
    label = "Centro óptico (mm)",
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
            {OPTICAL_CENTER_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </TextField>
    );
};

export default OpticalCenterInput;
