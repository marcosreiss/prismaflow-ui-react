// CurrencyInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

const formatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
  value: number; // valor bruto (sem máscara), ex: 12.34
  onChange: (v: number) => void;
};

export default function CurrencyInput({ value, onChange, ...rest }: Props) {
  const [display, setDisplay] = React.useState(() =>
    formatter.format(value ?? 0)
  );

  // Mantém display sincronizado quando o valor externo muda
  React.useEffect(() => {
    setDisplay(formatter.format(value ?? 0));
  }, [value]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // extrai só dígitos
    const digits = (e.target.value || "").replace(/\D/g, "");
    // interpreta como centavos
    const cents = digits === "" ? 0 : parseInt(digits, 10);
    const reais = cents / 100;
    onChange(Number(reais.toFixed(2))); // propaga como número
    setDisplay(formatter.format(reais));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // seleciona tudo ao focar
    e.target.select();
  };

  return (
    <TextField
      {...rest}
      value={display} // sempre string formatada
      onChange={handleChange}
      onFocus={handleFocus}
      inputProps={{ inputMode: "numeric" }} // não usar type="number"
    />
  );
}
