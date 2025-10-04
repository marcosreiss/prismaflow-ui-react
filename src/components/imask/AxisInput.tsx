// AxisInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

export default function AxisInput({ value, onChange, ...rest }: Props) {
    const [display, setDisplay] = React.useState(() => value || '');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        setDisplay(value || '');
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const rawValue = e.target.value;
        const maskedValue = axisMask(rawValue);

        setDisplay(maskedValue);

        const validationError = validateAxis(maskedValue, true);
        setError(validationError);

        if (!validationError && !isPartialAxisValue(maskedValue)) {
            onChange(maskedValue);
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handleBlur = () => {
        const formatted = formatFinalAxisValue(display);
        const validationError = validateAxis(formatted, false);
        setError(validationError);

        setDisplay(formatted);

        if (!validationError) {
            onChange(formatted);
        } else {
            onChange('');
            setDisplay('');
            setError('');
        }
    };

    return (
        <TextField
            {...rest}
            value={display}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            error={!!error}
            helperText={error || rest.helperText}
            inputProps={{
                inputMode: "numeric",
                placeholder: "90",
                maxLength: 3
            }}
        />
    );
}

// ==========================================================
// Funções Auxiliares para Ângulo (Eixo)
// ==========================================================

function isPartialAxisValue(value: string): boolean {
    return value === '' || value === '0';
}

function axisMask(value: string): string {
    if (!value) return '';

    // Permite apenas dígitos
    let cleaned = value.replace(/[^\d]/g, '');

    // Remove zeros à esquerda, exceto se for o único caractere
    if (cleaned.length > 1 && cleaned.startsWith('0')) {
        cleaned = cleaned.replace(/^0+/, '');
    }

    // Limita a 3 dígitos (0-180 graus)
    if (cleaned.length > 3) {
        cleaned = cleaned.slice(0, 3);
    }

    return cleaned;
}

function validateAxis(value: string, isTyping: boolean): string {
    if (!value) return '';

    // Não valida valores incompletos durante a digitação
    if (isTyping && isPartialAxisValue(value)) {
        return '';
    }

    const numValue = parseInt(value, 10);

    if (isNaN(numValue) && !isTyping) {
        return 'Ângulo inválido';
    } else if (isNaN(numValue) && isTyping) {
        return '';
    }

    // Ângulo deve estar entre 0 e 180 graus
    if (numValue < 0 || numValue > 180) {
        return 'Ângulo deve estar entre 0° e 180°';
    }

    return '';
}

function formatFinalAxisValue(value: string): string {
    if (!value || isPartialAxisValue(value)) return '';

    const numValue = parseInt(value, 10);

    if (isNaN(numValue)) {
        return '';
    }

    // Garante que está no range 0-180
    const finalValue = Math.max(0, Math.min(180, numValue));

    return finalValue.toString();
}