import React, { useCallback, useRef } from "react";
import { TextField, MenuItem } from "@mui/material";

type Props = {
    value: string | null;
    onChange: (v: string | null) => void;
    label?: string;
    placeholder?: string;
    size?: "small" | "medium";
    helperText?: string;
};

function montarOpcoes() {
    const range = 40;
    const step = 0.25;
    const formatter = (n: number) => (n > 0 ? "+" : n < 0 ? "" : "") + n.toFixed(2).replace(".", ",");
    const opcoesPos = [];
    const opcoesNeg = [];

    for (let v = step; v <= range; v += step) opcoesPos.push(formatter(v));
    for (let v = -step; v >= -range; v -= step) opcoesNeg.push(formatter(v));
    return [...opcoesPos.reverse(), "0,00", ...opcoesNeg];
}

const GRAU_OPTIONS = montarOpcoes();
const ZERO_OPTION = "0,00";

const SphericalInput: React.FC<Props> = ({
    value,
    onChange,
    label = "Esférico",
    placeholder = "",
    size = "medium",
    helperText = "",
}) => {
    const menuPaperRef = useRef<HTMLDivElement | null>(null);

    const centerOptionInScroll = useCallback((targetValue: string) => {
        const paper = menuPaperRef.current;
        if (!paper) return;

        const option = paper.querySelector<HTMLElement>(`[data-option-value="${targetValue}"]`);
        if (!option) return;

        const optionTop = option.offsetTop;
        const optionHeight = option.offsetHeight;
        const paperHeight = paper.clientHeight;
        const nextScrollTop = optionTop - paperHeight / 2 + optionHeight / 2;

        paper.scrollTop = Math.max(0, nextScrollTop);
    }, []);

    return (
        <TextField
            select
            fullWidth
            size={size}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            variant="outlined"
            SelectProps={{
                MenuProps: {
                    PaperProps: {
                        ref: menuPaperRef,
                        style: { maxHeight: 360 },
                    },
                    anchorOrigin: { vertical: "center", horizontal: "left" },
                    transformOrigin: { vertical: "center", horizontal: "left" },
                    TransitionProps: {
                        onEntered: () => {
                            centerOptionInScroll(value || ZERO_OPTION);
                        },
                    },
                },
                native: false,
            }}
        >
            <MenuItem value="">Selecione</MenuItem>
            {GRAU_OPTIONS.map((option) => (
                <MenuItem key={option} value={option} data-option-value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default SphericalInput;
