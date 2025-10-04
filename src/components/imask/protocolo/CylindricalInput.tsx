// CylindricalInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
    value: string;
    onChange: (v: string) => void;
};

export default function CylindricalInput({ value, onChange, ...rest }: Props) {
    const [display, setDisplay] = React.useState(() => value || '');
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        // Garante que o estado interno 'display' reflita o 'value' externo
        setDisplay(value || '');
    }, [value]);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const rawValue = e.target.value;
        const maskedValue = cylindricalMask(rawValue);

        // 1. SEMPRE ATUALIZA O DISPLAY PARA PERMITIR A DIGITAÇÃO
        setDisplay(maskedValue);

        // 2. Tenta validar o valor mascarado (isTyping: true)
        const validationError = validateCylindrical(maskedValue, true);
        setError(validationError);

        // 3. Se for um valor completo e válido, pode chamar onChange.
        // O valor é o mascarado/digitado, o onBlur fará a formatação final.
        if (!validationError && !isPartialValue(maskedValue, true)) {
            onChange(maskedValue);
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handleBlur = () => {
        // O onBlur é o momento de formatar o valor final, validar e commitar o onChange
        const formatted = formatFinalValue(display);
        const validationError = validateCylindrical(formatted, false); // Validação final
        setError(validationError);

        // 1. Atualiza o display com o valor FORMATADO.
        setDisplay(formatted);

        // 2. Se o valor FORMATADO for válido, chama o onChange.
        if (!validationError) {
            onChange(formatted);
        } else {
            // Caso o valor formatado seja inválido, limpamos o campo e o erro.
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
                inputMode: "decimal",
                placeholder: "-0.75"
            }}
        />
    );
}

// ==========================================================
// Funções Auxiliares
// ==========================================================

function isPartialValue(value: string, isCylindrical: boolean = false): boolean {
    // Para cilíndrico, apenas '-' e valores que terminam com '.' são parciais
    if (isCylindrical) {
        return value === '-' || value.endsWith('.');
    }
    // Para genérico (esférico)
    return value === '-' || value === '+' || value === '+.' || value === '-.' || value.endsWith('.');
}


function cylindricalMask(value: string): string {
    if (!value) return '';

    // 1. Limpa: permite apenas dígitos, ponto e sinal.
    let cleaned = value.replace(/[^\d.,-]/g, ''); // Cilíndrico só pode ser negativo ou não ter sinal
    cleaned = cleaned.replace(/,/g, '.');

    // Remove sinais que não estão no início
    const sign = cleaned.match(/^-/)?.[0] || '';
    let numberPart = cleaned.replace(/-/g, '');

    // 2. Remove múltiplos pontos, deixando apenas o primeiro
    const parts = numberPart.split('.');
    if (parts.length > 2) {
        numberPart = parts[0] + '.' + parts.slice(1).join('');
    }

    // 3. Montagem mais flexível
    const match = numberPart.match(/^(\d*)(\.?)(\d*)$/);
    if (match) {
        const [, integer, dot, decimal] = match;

        let maskedValue = sign + integer;
        if (dot || decimal) {
            maskedValue += `.${decimal}`;
        }
        return maskedValue;
    }

    return sign + numberPart;
}


function validateCylindrical(value: string, isTyping: boolean): string {
    if (!value) return '';

    // 1. Não valida valores incompletos durante a digitação
    if (isTyping && isPartialValue(value, true)) {
        return '';
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue) && !isTyping) {
        return 'Valor inválido';
    } else if (isNaN(numValue) && isTyping) {
        return '';
    }

    // 2. Cilíndrico sempre negativo (regra de negócio)
    // 0.00 é aceitável, mas +0.00 não.
    if (numValue > 0) {
        return 'Cilíndrico deve ser negativo';
    }

    // 3. Limite máximo (em módulo)
    if (numValue < -6.00) {
        return 'Cilíndrico deve ser maior que -6.00';
    }

    return '';
}


function formatFinalValue(value: string): string {
    if (!value || isPartialValue(value, true)) return '';

    const match = value.match(/^(-?)(\d*)(\.?)(\d*)$/);
    if (match) {
        const [, , integer, , decimal] = match;

        if (!integer && !decimal) return '';

        let finalInteger = integer || '0';
        let finalDecimal = decimal || '00';

        // Garante 2 casas decimais e trunca
        finalDecimal = finalDecimal.padEnd(2, '0').slice(0, 2);

        // Remove zeros à esquerda (exceto se for '0')
        finalInteger = finalInteger.replace(/^0+(?=\d)/, '');
        if (!finalInteger) finalInteger = '0';

        // Garante o sinal NEGATIVO no valor que será parseado
        const parsedValue = `-${finalInteger}.${finalDecimal}`;
        let numValue = parseFloat(parsedValue);

        // Limita e garante que não é positivo
        if (!isNaN(numValue)) {
            // Se o valor for 0, deve ser formatado como '' (vazio)
            if (numValue === 0) {
                return '';
            }
            // Não permite positivo (já tratado no parse, mas para segurança)
            if (numValue > 0) {
                numValue = 0;
            }
            // Limita a -6.00
            if (numValue < -6.00) {
                numValue = -6.00;
            }
        } else {
            return '';
        }

        // Retorna o valor fixado com 2 casas decimais e o sinal '-' (já garantido por ser negativo)
        return '-' + Math.abs(numValue).toFixed(2);
    }

    return '';
}