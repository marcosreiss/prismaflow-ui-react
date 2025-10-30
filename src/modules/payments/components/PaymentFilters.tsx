import {
    Box,
    Stack,
    TextField,
    MenuItem,
    Button,
    Paper,
} from "@mui/material";
import { X } from "lucide-react";
import { PaymentMethodLabels, PaymentStatusLabels } from "../types/paymentTypes";
import type { PaymentStatus, PaymentMethod } from "../types/paymentTypes";

// ==============================
// 🔹 Tipagens Atualizadas
// ==============================
interface PaymentFiltersProps {
    status: PaymentStatus | '';
    method: PaymentMethod | '';
    dateRange: { start: string; end: string };
    clientSearch: string; // 🆕 NOVO
    onStatusChange: (status: PaymentStatus | '') => void;
    onMethodChange: (method: PaymentMethod | '') => void;
    onDateChange: (dateRange: { start: string; end: string }) => void;
    onClientSearchChange: (clientSearch: string) => void; // 🆕 NOVO
}

// ==============================
// 🔹 Componente Principal Atualizado
// ==============================
export default function PaymentFilters({
    status,
    method,
    dateRange,
    onStatusChange,
    onMethodChange,
    onDateChange,
    onClientSearchChange, // 🆕 NOVO
}: PaymentFiltersProps) {

    // Limpar todos os filtros
    const handleClearFilters = () => {
        onStatusChange('');
        onMethodChange('');
        onDateChange({ start: '', end: '' });
        onClientSearchChange(''); // 🆕 LIMPAR BUSCA POR CLIENTE
    };

    // Verificar se há algum filtro ativo (atualizado)
    const hasActiveFilters = status || method || dateRange.start || dateRange.end;

    return (
        <Paper
            elevation={1}
            sx={{
                p: 2,
                border: 2,
                borderColor: 'divider',
                backgroundColor: 'background.paper'
            }}
        >
            <Stack spacing={2}>
                {/* Cabeçalho com título e botão limpar */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1
                }}>
                    <Box sx={{
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '1.1rem'
                    }}>
                        Filtros
                    </Box>

                    {hasActiveFilters && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="inherit"
                            onClick={handleClearFilters}
                            startIcon={<X size={14} />}
                            sx={{
                                borderWidth: 1.5,
                                '&:hover': { borderWidth: 1.5 }
                            }}
                        >
                            Limpar Filtros
                        </Button>
                    )}
                </Box>

                {/* Filtros em grid responsivo ATUALIZADO */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: '1fr 1fr',
                        md: '140px 180px 1fr 1fr' // 🆕 MAIS UMA COLUNA
                    },
                    gap: 2,
                    alignItems: 'start'
                }}>
                    {/* Filtro por Status */}
                    <TextField
                        select
                        size="small"
                        label="Status"
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value as PaymentStatus | '')}
                        fullWidth
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {Object.entries(PaymentStatusLabels).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Filtro por Método */}
                    <TextField
                        select
                        size="small"
                        label="Método"
                        value={method}
                        onChange={(e) => onMethodChange(e.target.value as PaymentMethod | '')}
                        fullWidth
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {Object.entries(PaymentMethodLabels).map(([key, label]) => (
                            <MenuItem key={key} value={key}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Filtro por Período */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        sx={{
                            gridColumn: {
                                xs: '1',
                                sm: '1 / -1',
                                md: 'auto'
                            }
                        }}
                    >
                        <TextField
                            size="small"
                            label="Data início"
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => onDateChange({ ...dateRange, start: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                        <Box sx={{
                            color: 'text.secondary',
                            alignSelf: 'center',
                            textAlign: 'center',
                            minWidth: '40px'
                        }}>
                            até
                        </Box>
                        <TextField
                            size="small"
                            label="Data fim"
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => onDateChange({ ...dateRange, end: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
}