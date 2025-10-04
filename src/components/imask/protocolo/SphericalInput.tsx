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
    // Isso é crucial para que o parseFloat funcione corretamente e para limitar a digitação.
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


export default function SphericalInput({ value, onChange, ...rest }: Props) {
    const [display, setDisplay] = React.useState(() => value || '');
    const [error, setError] = React.useState('');

    // ✅ CORREÇÃO: Removida a verificação condicional e a dependência 'display'
    // O Hook agora sincroniza 'value' com 'display' de forma limpa.
    React.useEffect(() => {
        // Aplica a limpeza ao valor externo (prop) antes de definir no estado interno
        setDisplay(cleanSphericalValue(value) || '');
    }, [value]); // Depende apenas da prop 'value' e da função 'cleanSphericalValue'

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const rawValue = e.target.value;

        // Aplica a limpeza e conversão de vírgula para ponto
        const cleanedValue = cleanSphericalValue(rawValue);

        // Permite digitar livremente (mas limpo/mascarado)
        setDisplay(cleanedValue);

        // Chamamos onChange com o valor limpo
        onChange(cleanedValue);

        // Validação em tempo real (apenas para feedback)
        const validationError = validateSpherical(cleanedValue);
        setError(validationError);
    };

    const handleBlur = () => {
        // Formata ao sair do campo
        const formatted = formatFinalValue(display);
        const validationError = validateSpherical(formatted);
        setError(validationError);

        // ✅ Ajuste: Atualiza o estado/prop 'value' se houver formatação OU se for um valor vazio
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
    if (isNaN(numValue)) return value;

    // Limita ao range permitido
    const finalValue = Math.max(-20.00, Math.min(20.00, numValue));

    // ✅ CORREÇÃO: Formata com sinal positivo para valores >= 0
    if (finalValue >= 0) {
        return `+${finalValue.toFixed(2)}`;
    } else {
        return finalValue.toFixed(2);
    }
}