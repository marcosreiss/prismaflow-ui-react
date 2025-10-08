// DnpInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

// --- Funções Auxiliares ---

/**
 * Valida o valor do DNP.
 * DNP deve ser um número entre 0.01 e 99.99.
 */
function validateDnp(value: string): string {
    if (!value) return ''; // Campo vazio é válido (opcional)

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Valor inválido';

    if (numValue < 0.01 || numValue > 99.99) {
        return 'DNP deve estar entre 0.01 e 99.99';
    }

    return ''; // Sem erros
}

/**
 * Formata o valor final para garantir duas casas decimais.
 */
function formatFinalValue(value: string): string {
    if (!value) return '';

    const numValue = parseFloat(value);
    // Se não for um número válido (ex: o usuário digita algo inválido), retorna vazio.
    if (isNaN(numValue)) return '';

    // Garante duas casas decimais
    return numValue.toFixed(2);
}

// --- Componente React ---

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

export default function DnpInput({ value, onChange, ...rest }: Props) {
    // <--- CORRIGIDO: Formata o valor na inicialização do estado.
    const [display, setDisplay] = React.useState(() => formatFinalValue(value));
    const [error, setError] = React.useState('');

    // <--- CORRIGIDO: Aplica a formatação sempre que o valor externo mudar.
    React.useEffect(() => {
        setDisplay(formatFinalValue(value));
    }, [value]);

    /**
     * Permite a digitação livre, aceitando números e ponto decimal.
     */
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const rawValue = e.target.value;

        // 1. Troca vírgula por ponto
        let cleaned = rawValue.replace(/,/g, '.');

        // 2. Remove caracteres inválidos. Permite apenas dígitos e UM ponto.
        cleaned = cleaned.replace(/[^\d.]/g, '');

        // 3. Garante que haja apenas um ponto decimal
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }

        // 4. Limita as casas inteiras (antes do ponto) para 2 dígitos
        if (parts[0] && parts[0].length > 2) {
            cleaned = `${parts[0].slice(0, 2)}${parts[1] ? '.' + parts[1] : ''}`;
        }

        // 5. Limita as casas decimais (depois do ponto) para 2 dígitos
        if (parts[1] && parts[1].length > 2) {
            cleaned = `${parts[0]}.${parts[1].slice(0, 2)}`;
        }

        // 6. Remove múltiplos zeros à esquerda na parte inteira
        if (parts[0] && parts[0].length > 1 && parts[0][0] === '0' && parts[0][1] !== '.') {
            cleaned = `${parts[0].replace(/^0+/, '')}${parts[1] ? '.' + parts[1] : ''}`;
        }

        // 7. Previne ponto no início
        if (cleaned === '.') {
            cleaned = '0.';
        }

        // Atualiza o display e o estado pai
        setDisplay(cleaned);
        onChange(cleaned);
        setError(validateDnp(cleaned));
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    /**
     * Ao sair, formata o valor final com duas casas decimais.
     */
    const handleBlur = () => {
        const validationError = validateDnp(display);
        setError(validationError);

        if (display && !validationError) {
            const formatted = formatFinalValue(display);
            setDisplay(formatted);
            onChange(formatted);
        } else if (display && display.endsWith('.')) {
            // Remove ponto solto no final
            const withoutDot = display.slice(0, -1);
            const formatted = formatFinalValue(withoutDot);
            setDisplay(formatted);
            onChange(formatted);
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
                placeholder: "62.00",
                maxLength: 5, // Ex: "99.99"
            }}
        />
    );
}