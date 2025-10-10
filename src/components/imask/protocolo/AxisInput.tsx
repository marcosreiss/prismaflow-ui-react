import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

function isZeroString(v: string): boolean {
    if (!v) return false;
    const normalized = v.replace(/[^\d]/g, "");
    return normalized === "0";
}

export default function AxisInput({ value, onChange, ...rest }: Props) {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const [display, setDisplay] = React.useState(value);

    React.useEffect(() => {
        if (isZeroString(value)) {
            setDisplay("");
            return;
        }
        setDisplay(value);
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const raw = e.target.value.replace(/º/g, "");
        const digits = raw.replace(/[^0-9]/g, "");

        // Campo vazio
        if (!raw.trim()) {
            setDisplay("");
            onChange("");
            return;
        }

        // Digitação parcial
        if (!digits) {
            setDisplay(raw);
            onChange(raw);
            return;
        }

        let num = parseInt(digits, 10);
        num = Math.max(0, Math.min(180, num));

        if (num === 0) {
            setDisplay("");
            onChange("");
            return;
        }

        const formatted = `${num}º`;
        setDisplay(formatted);
        onChange(formatted);

        // ⚡ força cursor antes do símbolo "º"
        requestAnimationFrame(() => {
            const el = inputRef.current;
            if (el) {
                const pos = formatted.length - 1; // antes do "º"
                el.setSelectionRange(pos, pos);
            }
        });
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // seleciona tudo ao focar
        e.target.select();
    };

    return (
        <TextField
            {...rest}
            inputRef={inputRef}
            value={display}
            onChange={handleChange}
            onFocus={handleFocus}
            inputProps={{
                inputMode: "numeric",
                placeholder: "0º",
            }}
        />
    );
}
