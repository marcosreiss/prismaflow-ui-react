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
        const digits = (e.target.value || "").replace(/\D/g, "");
        const num = digits === "" ? 0 : parseInt(digits, 10);
        onChange(num);
        setDisplay(formatDisplay(num));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    return (
        <TextField
            {...rest}
            value={display}
            onChange={handleChange}
            onFocus={handleFocus}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
    );
}

function formatDisplay(value: number): string {
    return `${value ?? 0}%`;
}
