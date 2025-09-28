// IMaskCurrency.tsx (exemplo)
import { IMaskInput } from "react-imask";
import TextField from "@mui/material/TextField";

type Props = {
    value: number; // em reais
    onChange: (v: number) => void;
    label?: string;
    name?: string;
};

export default function IMaskCurrency({ value, onChange, label, name }: Props) {
    const formatted = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2 }).format(value ?? 0);
    // so pra não reclamar de variável não usada
    console.log(onChange, name);
    
    return (
        <TextField
            label={label}
            value={formatted}
            InputProps={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                inputComponent: (IMaskInput as any),
                inputProps: {
                    mask: Number,
                    scale: 2, // casas decimais
                    signed: false,
                    thousandsSeparator: ".",
                    radix: ",",
                    mapToRadix: [".", ","],
                    // onAccept será passado pelo Controller abaixo
                },
            }}
            onChange={() => { }}
        />
    );
}
