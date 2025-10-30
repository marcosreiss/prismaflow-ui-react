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

const ADDITION_OPTIONS = [
    "+0,00",
    "+0,25",
    "+0,50",
    "+0,75",
    "+1,00",
    "+1,25",
    "+1,50",
    "+1,75",
    "+2,00",
    "+2,25",
    "+2,50",
    "+2,75",
    "+3,00",
    "+3,25",
    "+3,50"
];

const AdditionInput: React.FC<Props> = ({
    value,
    onChange,
    label = "Adição",
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
            {ADDITION_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
        </TextField>
    );
};

export default AdditionInput;
