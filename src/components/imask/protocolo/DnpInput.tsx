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

export default function DnpInput({ value, onChange, ...rest }: Props) {
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

        // 1️⃣ Campo vazio
        if (!raw.trim()) {
            setDisplay("");
            onChange("");
            return;
        }

        // 2️⃣ Nenhum dígito
        if (!digits) {
            setDisplay("");
            onChange("");
            return;
        }

        // 3️⃣ Converte para décimos
        let num = parseInt(digits, 10) / 10;
        num = Math.max(0, Math.min(99.9, num)); // limite sensato

        // 4️⃣ Se 0 → limpa
        if (num === 0) {
            setDisplay("");
            onChange("");
            return;
        }

        // 5️⃣ Formata com uma casa decimal
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
