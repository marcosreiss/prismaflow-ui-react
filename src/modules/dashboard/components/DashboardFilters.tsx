import { useState } from "react";
import {
    Box, Typography, ToggleButton, ToggleButtonGroup, TextField
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
    startOfWeek, endOfWeek,
    startOfMonth, endOfMonth,
    startOfYear, endOfYear,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DashboardFilters } from "../types/dashboardTypes";

type PeriodPreset = "week" | "month" | "year" | "custom";

const fmt = (d: Date) => d.toISOString().substring(0, 10);

type Props = {
    filters: DashboardFilters;
    onChange: (filters: Partial<DashboardFilters>) => void;
};

export default function DashboardFiltersBar({ filters, onChange }: Props) {
    const [preset, setPreset] = useState<PeriodPreset>("month");

    // valores dos pickers como Date para o MUI
    const [monthValue, setMonthValue] = useState<Date | null>(new Date());
    const [yearValue, setYearValue] = useState<Date | null>(new Date());
    const [weekValue, setWeekValue] = useState<Date | null>(new Date());

    const handlePreset = (_: React.MouseEvent<HTMLElement>, value: PeriodPreset | null) => {
        if (!value) return;
        setPreset(value);

        // ao trocar o preset, aplica o range atual do picker correspondente
        const now = new Date();
        if (value === "month") {
            onChange({ startDate: fmt(startOfMonth(now)), endDate: fmt(endOfMonth(now)) });
            setMonthValue(now);
        } else if (value === "year") {
            onChange({ startDate: fmt(startOfYear(now)), endDate: fmt(endOfYear(now)) });
            setYearValue(now);
        } else if (value === "week") {
            onChange({ startDate: fmt(startOfWeek(now, { locale: ptBR })), endDate: fmt(endOfWeek(now, { locale: ptBR })) });
            setWeekValue(now);
        }
    };

    const handleMonthChange = (date: Date | null) => {
        if (!date) return;
        setMonthValue(date);
        onChange({ startDate: fmt(startOfMonth(date)), endDate: fmt(endOfMonth(date)) });
    };

    const handleYearChange = (date: Date | null) => {
        if (!date) return;
        setYearValue(date);
        onChange({ startDate: fmt(startOfYear(date)), endDate: fmt(endOfYear(date)) });
    };

    const handleWeekChange = (date: Date | null) => {
        if (!date) return;
        setWeekValue(date);
        onChange({
            startDate: fmt(startOfWeek(date, { locale: ptBR })),
            endDate: fmt(endOfWeek(date, { locale: ptBR })),
        });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                    Período:
                </Typography>

                <ToggleButtonGroup
                    value={preset}
                    exclusive
                    onChange={handlePreset}
                    size="small"
                    sx={{ height: 40 }}
                >
                    <ToggleButton value="week">Semana</ToggleButton>
                    <ToggleButton value="month">Mês</ToggleButton>
                    <ToggleButton value="year">Ano</ToggleButton>
                    <ToggleButton value="custom">Personalizado</ToggleButton>
                </ToggleButtonGroup>

                {/* Semana — picker de dia, mas mostra range da semana */}
                {preset === "week" && (
                    <DatePicker
                        label="Selecione a semana"
                        value={weekValue}
                        onChange={handleWeekChange}
                        slotProps={{
                            textField: { size: "small", sx: { width: 200 } },
                            // destaca a semana inteira no calendário
                            day: (ownerState) => {
                                const isInWeek =
                                    weekValue &&
                                    ownerState.day >= startOfWeek(weekValue, { locale: ptBR }) &&
                                    ownerState.day <= endOfWeek(weekValue, { locale: ptBR });
                                return {
                                    sx: isInWeek
                                        ? { backgroundColor: "primary.light", borderRadius: 0, color: "primary.contrastText" }
                                        : {},
                                };
                            },
                        }}
                    />
                )}

                {/* Mês — picker com views year + month */}
                {preset === "month" && (
                    <DatePicker
                        label="Mês"
                        value={monthValue}
                        onChange={handleMonthChange}
                        views={["year", "month"]}
                        openTo="month"
                        format="MM/yyyy"
                        slotProps={{ textField: { size: "small", sx: { width: 160 } } }}
                    />
                )}

                {/* Ano — picker com view year apenas */}
                {preset === "year" && (
                    <DatePicker
                        label="Ano"
                        value={yearValue}
                        onChange={handleYearChange}
                        views={["year"]}
                        openTo="year"
                        format="yyyy"
                        slotProps={{ textField: { size: "small", sx: { width: 120 } } }}
                    />
                )}

                {/* Personalizado — dois campos de data livres */}
                {preset === "custom" && (
                    <>
                        <TextField
                            label="Data inicial"
                            type="date"
                            size="small"
                            value={filters.startDate ?? ""}
                            onChange={(e) => onChange({ startDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 180 }}
                        />
                        <TextField
                            label="Data final"
                            type="date"
                            size="small"
                            value={filters.endDate ?? ""}
                            onChange={(e) => onChange({ endDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: 180 }}
                        />
                    </>
                )}

                {/* Exibe o range ativo como feedback */}
                {filters.startDate && filters.endDate && (
                    <Typography variant="caption" sx={{ color: "text.disabled" }}>
                        {filters.startDate} → {filters.endDate}
                    </Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
}
