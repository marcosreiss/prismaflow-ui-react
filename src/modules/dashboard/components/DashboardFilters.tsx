import { Box, TextField, Button, Typography } from "@mui/material";
import type { DashboardFilters } from "../types/dashboardTypes";

type Props = {
    filters: DashboardFilters;
    onChange: (filters: Partial<DashboardFilters>) => void;
    onClear: () => void;
};

export default function DashboardFiltersBar({ filters, onChange, onClear }: Props) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                Período:
            </Typography>

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

            <Button variant="outlined" size="small" onClick={onClear} sx={{ height: 40 }}>
                Mês atual
            </Button>
        </Box>
    );
}
