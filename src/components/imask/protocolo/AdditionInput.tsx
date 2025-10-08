// AdditionInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

// --- Funções Auxiliares Refatoradas ---

/**
 * Valida o valor da Adição.
 * A adição deve ser positiva e estar entre +0.75 e +4.00.
 */
function validateAddition(value: string): string {
    if (!value) return ''; // Campo vazio é válido (opcional)

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Valor inválido';

    if (numValue <= 0) {
        return 'Adição deve ser positiva';
    }
    if (numValue < 0.75 || numValue > 4.00) {
        return 'Adição deve estar entre +0.75 e +4.00';
    }

    return ''; // Sem erros
}

/**
 * Formata o valor final para o padrão "+X.XX" ao sair do campo.
 */
function formatFinalValue(value: string): string {
    if (!value) return '';

    // Garante que o valor seja tratado como número para evitar erros com "+." etc.
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return ''; // Se não for um número válido, retorna vazio

    // Adição é sempre positiva
    const sign = '+';

    // Formata para ter duas casas decimais
    const formattedNumber = numValue.toFixed(2);

    return `${sign}${formattedNumber}`;
}


// --- Componente React Corrigido ---

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

export default function AdditionInput({ value, onChange, ...rest }: Props) {
    // <--- CORRIGIDO: Formata o valor na inicialização do estado de exibição.
    const [display, setDisplay] = React.useState(() => formatFinalValue(value));
    const [error, setError] = React.useState('');

    // <--- CORRIGIDO: Garante que a formatação seja aplicada sempre que o valor externo mudar.
    React.useEffect(() => {
        setDisplay(formatFinalValue(value));
    }, [value]);

    /**
     * Permite a digitação livre, limpando apenas caracteres inválidos.
     * RESOLVE O PROBLEMA DE NÃO CONSEGUIR APAGAR O PONTO.
     */
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const rawValue = e.target.value;

        // 1. Troca vírgula por ponto
        let cleaned = rawValue.replace(/,/g, '.');

        // 2. Remove caracteres inválidos. Permite sinal SÓ no início. Permite dígitos e UM ponto.
        cleaned = cleaned.replace(/[^\d.]/g, (char, index) => {
            if (char === '+' && index === 0) return char;
            // Adição não pode ser negativa, então removemos o "-"
            return '';
        });

        // 3. Garante que haja apenas um ponto decimal
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }

        // 4. Limita as casas decimais durante a digitação para evitar entradas muito longas
        if (parts[1] && parts[1].length > 2) {
            cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`;
        }

        // Atualiza o display e o estado pai com o valor "sujo" e válido
        setDisplay(cleaned);
        onChange(cleaned);
        setError(validateAddition(cleaned));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    /**
     * Ao sair, formata o valor para o padrão final (+X.XX) e atualiza os estados.
     */
    const handleBlur = () => {
        const validationError = validateAddition(display);
        setError(validationError);

        if (display && !validationError) {
            const formatted = formatFinalValue(display);
            setDisplay(formatted);
            onChange(formatted); // Atualiza o estado pai com o valor final formatado
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
                inputMode: "decimal",
                placeholder: "+2.00",
                maxLength: 6, // Ex: "+4.00"
            }}
        />
    );
}