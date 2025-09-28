// PercentInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: number; // ex: 50 para representar 50%
    onChange: (v: number) => void;
};

export default function PercentInput({ value, onChange, ...rest }: Props) {
    const [display, setDisplay] = React.useState(() => formatDisplay(value));

    React.useEffect(() => {
        setDisplay(formatDisplay(value));
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        // extrai apenas dígitos
        const digits = (e.target.value || "").replace(/\D/g, "");
        const num = digits === "" ? 0 : parseInt(digits, 10);
        onChange(num); // propaga como número cru
        setDisplay(formatDisplay(num));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <TextField
            {...rest}
            value={display} // sempre string formatada (ex: "50%")
            onChange={handleChange}
            onFocus={handleFocus}
            inputProps={{ inputMode: "numeric" }} // não usar type="number"
        />
    );
}

function formatDisplay(value: number): string {
    return `${value ?? 0}%`;
}
