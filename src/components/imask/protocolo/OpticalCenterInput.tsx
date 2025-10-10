import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

function isZeroString(v: string): boolean {
    if (!v) return false;
    const normalized = v.replace(",", ".").replace(/[^\d.]/g, "");
    return normalized === "0" || normalized === "0.0";
}

export default function OpticalCenterInput({ value, onChange, ...rest }: Props) {
    const [display, setDisplay] = React.useState(value);

    React.useEffect(() => {
        if (isZeroString(value)) {
            setDisplay("");
            return;
        }
        setDisplay(value);
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const raw = e.target.value;
        const digits = raw.replace(/[^0-9]/g, "");

        // 1️⃣ campo vazio
        if (!raw.trim()) {
            setDisplay("");
            onChange("");
            return;
        }

        // 2️⃣ sem dígitos
        if (!digits) {
            setDisplay("");
            onChange("");
            return;
        }

        // 3️⃣ converte para décimos
        let num = parseInt(digits, 10) / 10;

        // 4️⃣ aplica limites (0–99.9)
        num = Math.max(0, Math.min(99.9, num));

        // 5️⃣ limpa se for 0
        if (num === 0) {
            setDisplay("");
            onChange("");
            return;
        }

        // 6️⃣ formata
        const formatted = formatter.format(num);

        setDisplay(formatted);
        onChange(formatted);
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
            inputProps={{
                inputMode: "decimal",
                placeholder: "0,0",
            }}
        />
    );
}
