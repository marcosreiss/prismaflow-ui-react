// AxisInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

// --- Constante para o símbolo ---
const AXIS_SYMBOL = "°";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

export default function AxisInput({ value, onChange, ...rest }: Props) {
    const [display, setDisplay] = React.useState(() => formatFinalAxisValue(value));
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        setDisplay(formatFinalAxisValue(value));
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        // Permite digitar apenas números e limita o tamanho
        const cleaned = e.target.value.replace(/[^\d]/g, '').slice(0, 3);
        setDisplay(cleaned);
        setError(validateAxis(cleaned));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        // <--- NOVO: Remove o "°" para facilitar a edição do número.
        setDisplay(unformatValue(display));
        e.target.select();
    };

    const handleBlur = () => {
        // <--- LÓGICA ATUALIZADA --- >
        // Pega o valor numérico puro para validar e salvar
        const numericValue = unformatValue(display);
        const validationError = validateAxis(numericValue);
        setError(validationError);

        if (numericValue && !validationError) {
            // Formata o valor para EXIBIÇÃO (ex: "90°")
            const formattedForDisplay = formatFinalAxisValue(numericValue);
            setDisplay(formattedForDisplay);
            // Salva no formulário apenas o valor NUMÉRICO (ex: "90")
            onChange(numericValue);
        } else {
            // Se for inválido, limpa tudo
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
                placeholder: `90${AXIS_SYMBOL}`,
                // Aumenta o limite para acomodar o símbolo
                maxLength: 4
            }}
        />
    );
}

// ==========================================================
// Funções Auxiliares (Atualizadas)
// ==========================================================

function validateAxis(value: string): string {
    if (!value) return '';

    const numValue = parseInt(value, 10);

    if (isNaN(numValue)) {
        return 'Ângulo inválido';
    }
    if (numValue < 0 || numValue > 180) {
        return 'Ângulo deve ser entre 0° e 180°';
    }

    return '';
}

// <--- NOVA FUNÇÃO: Remove o símbolo para obter o valor puro.
function unformatValue(value: string): string {
    return value.replace(AXIS_SYMBOL, '');
}

// <--- FUNÇÃO ATUALIZADA: Adiciona o símbolo no final.
function formatFinalAxisValue(value: string): string {
    // Primeiro, garante que estamos lidando com o valor numérico puro.
    const numericValue = unformatValue(value);

    if (!numericValue) return '';

    const numValue = parseInt(numericValue, 10);

    if (isNaN(numValue)) {
        return '';
    }

    const finalValue = Math.max(0, Math.min(180, numValue));

    return `${finalValue}${AXIS_SYMBOL}`;
}