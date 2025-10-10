import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

const formatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function isZeroString(v: string): boolean {
    if (!v) return false;
    const normalized = v.replace(",", ".").replace(/[+-]/g, "").trim();
    return normalized === "0.00" || normalized === "0";
}

export default function CylindricalInput({ value, onChange, ...rest }: Props) {
    const [display, setDisplay] = React.useState(value);

    React.useEffect(() => {
        console.log("[useEffect] external value changed:", value);
        if (isZeroString(value)) {
            console.log("→ RESETTING display (zero detected)");
            setDisplay("");
            return;
        }
        setDisplay(value);
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const raw = e.target.value;
        const digits = raw.replace(/[^0-9]/g, "");

        console.groupCollapsed("[handleChange - Cylindrical]");
        console.log("raw:", raw);
        console.log("digits:", digits);

        // 1️⃣ campo totalmente vazio
        if (raw === "") {
            console.log("→ EMPTY FIELD");
            setDisplay("");
            onChange("");
            console.groupEnd();
            return;
        }

        // 2️⃣ só "-" e nada mais (usuário começou a digitar)
        if (raw.trim() === "-") {
            console.log("→ ONLY SIGN");
            setDisplay("-");
            onChange("-");
            console.groupEnd();
            return;
        }

        // 3️⃣ se não há dígitos válidos
        if (!digits) {
            console.log("→ NO DIGITS");
            setDisplay("");
            onChange("");
            console.groupEnd();
            return;
        }

        // 4️⃣ converte para centavos e força sempre negativo
        let num = parseInt(digits, 10) / 100;
        num *= -1;

        // aplica limite (ex: até -20.00, opcional)
        num = Math.max(-20, Math.min(0, num));

        const formatted = formatter.format(num);
        console.log("→ FORMATTED VALUE:", formatted, "(num:", num, ")");

        // 5️⃣ limpa se for zero
        if (isZeroString(formatted)) {
            console.log("→ ZERO DETECTED, clearing input");
            setDisplay("");
            onChange("");
            console.groupEnd();
            return;
        }

        const final = `-${formatted.replace("-", "")}`; // garante sinal negativo
        setDisplay(final);
        onChange(final);
        console.groupEnd();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        console.log("[handleFocus]");
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
                placeholder: "-0.25",
            }}
        />
    );
}
