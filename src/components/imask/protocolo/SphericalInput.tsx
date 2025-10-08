// SphericalInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

function cleanSphericalValue(value: string): string {
    if (!value) return '';

    // 1. Converte vírgula para ponto
    let cleaned = value.replace(/,/g, '.');

    // 2. Remove caracteres que não são dígitos, ponto ou sinais (+/-)
    cleaned = cleaned.replace(/[^\d.+-]/g, '');

    // 3. Garante que só haja um ponto decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    // 4. Garante que sinais estejam apenas no início e remove sinais duplicados
    const sign = cleaned.match(/^[+-]/)?.[0] || '';
    let numberPart = cleaned.replace(/[+-]/g, '');
    numberPart = numberPart.replace(/^-/, ''); // Garante que sinais internos sejam removidos

    return sign + numberPart;
}

function validateSpherical(value: string): string {
    if (!value) return '';

    // Permite valores incompletos durante digitação
    if (value === '-' || value === '+' || value === '+.' || value === '-.' || value.endsWith('.')) {
        return '';
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Valor inválido';

    if (numValue < -20.00 || numValue > 20.00) {
        return 'Esférico deve estar entre -20.00 e +20.00';
    }

    return '';
}

function formatFinalValue(value: string): string {
    if (!value) return '';

    // Não formata valores incompletos
    if (value === '-' || value === '+' || value === '+.' || value === '-.') {
        return '';
    }

    const numValue = parseFloat(value);
    // <--- MELHORIA: Retorna vazio se o valor não for um número.
    if (isNaN(numValue)) return '';

    // Limita ao range permitido
    const finalValue = Math.max(-20.00, Math.min(20.00, numValue));

    // Formata com sinal positivo para valores >= 0
    if (finalValue >= 0) {
        return `+${finalValue.toFixed(2)}`;
    } else {
        return finalValue.toFixed(2);
    }
}


export default function SphericalInput({ value, onChange, ...rest }: Props) {
    // <--- CORRIGIDO: Formata o valor na inicialização.
    const [display, setDisplay] = React.useState(() => formatFinalValue(value));
    const [error, setError] = React.useState('');

    // <--- CORRIGIDO: Aplica a formatação sempre que o valor externo mudar.
    React.useEffect(() => {
        setDisplay(formatFinalValue(value));
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const rawValue = e.target.value;
        const cleanedValue = cleanSphericalValue(rawValue);
        setDisplay(cleanedValue);
        onChange(cleanedValue);
        const validationError = validateSpherical(cleanedValue);
        setError(validationError);
    };

    const handleBlur = () => {
        const formatted = formatFinalValue(display);
        const validationError = validateSpherical(formatted);
        setError(validationError);

        if (formatted !== display || !formatted) {
            onChange(formatted);
            setDisplay(formatted);
        }
    };

    return (
        <TextField
            {...rest}
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!error}
            helperText={error || rest.helperText}
            inputProps={{
                inputMode: "decimal",
                placeholder: "-15.00"
            }}
        />
    );
}