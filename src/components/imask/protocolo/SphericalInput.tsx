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
    // considera +0,00, -0,00, 0,00, +0.00, -0.00, 0.00, etc.
    if (!v) return false;
    const normalized = v.replace(",", ".").replace(/[+-]/g, "").trim();
    return normalized === "0.00" || normalized === "0";
}

export default function SphericalInput({ value, onChange, ...rest }: Props) {
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
        const hasMinus = raw.trim().startsWith("-");
        const hasPlus = raw.trim().startsWith("+");
        const digits = raw.replace(/[^0-9]/g, "");

        console.groupCollapsed("[handleChange]");
        console.log("raw:", raw);
        console.log("hasMinus:", hasMinus, "hasPlus:", hasPlus);
        console.log("digits:", digits);

        if (raw === "") {
            console.log("→ EMPTY FIELD");
            setDisplay("");
            onChange("");
            console.groupEnd();
            return;
        }

        if ((hasMinus || hasPlus) && digits.length === 0) {
            console.log("→ ONLY SIGN");
            const sign = hasMinus ? "-" : "+";
            setDisplay(sign);
            onChange(sign);
            console.groupEnd();
            return;
        }

        if (!digits) {
            console.log("→ NO DIGITS");
            setDisplay("");
            onChange("");
            console.groupEnd();
            return;
        }

        let num = parseInt(digits, 10) / 100;
        if (hasMinus) num *= -1;

        num = Math.max(-20, Math.min(20, num));

        const formatted = `${num >= 0 ? "+" : ""}${formatter.format(num)}`;
        console.log("→ FORMATTED VALUE:", formatted, "(num:", num, ")");

        // 🔹 zera se valor for +0,00 ou -0,00
        if (isZeroString(formatted)) {
            console.log("→ ZERO DETECTED, clearing input");
            setDisplay("");
            onChange("");
            console.groupEnd();
            return;
        }

        setDisplay(formatted);
        onChange(formatted);
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
                placeholder: "-15.00",
            }}
        />
    );
}
