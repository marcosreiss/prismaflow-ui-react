// CurrencyInput.tsx
import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";

const formatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

type Props = Omit<TextFieldProps, "value" | "onChange"> & {
  value: number; // value em reais (ex: 12.34)
  onChange: (v: number) => void;
};

export default function CurrencyInput({ value, onChange, ...rest }: Props) {
  const [display, setDisplay] = React.useState(() => formatter.format(value ?? 0));

  // keep display in sync when parent programmatically changes value
  React.useEffect(() => {
    setDisplay(formatter.format(value ?? 0));
  }, [value]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    // extrai só dígitos
    const digits = (e.target.value || "").replace(/\D/g, "");
    // interpretar como centavos ("" => 0)
    const cents = digits === "" ? 0 : parseInt(digits, 10);
    const reais = cents / 100;
    onChange(Number((reais).toFixed(2))); // propaga valor numérico
    setDisplay(formatter.format(reais));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // opcional: selecionar tudo ao focar
    e.target.select();
  };

  return (
    <TextField
      {...rest}
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
    />
  );
}
