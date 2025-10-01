import { useFormContext, useFieldArray } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import type { Service } from "@/types/serviceTypes";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import { Trash2 } from "lucide-react";

export default function ServicesTable() {
    const { control } = useFormContext<Sale>();

    const { fields, remove } = useFieldArray({
        control,
        name: "serviceItems",
    });

    const calculateServiceProfit = (service: Service) => {
        return service.price - service.cost;
    };

    if (fields.length === 0) {
        return (
            <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderStyle: 'dashed' }}>
                <Typography color="text.secondary" variant="body1">
                    Nenhum serviço adicionado à venda
                </Typography>
            </Paper>
        );
    }

    // Calcular totais de serviços
    const servicesTotal = fields.reduce((acc, item) => {
        const service = (item as any).service as Service;
        return acc + (service?.price || 0);
    }, 0);

    const servicesProfit = fields.reduce((acc, item) => {
        const service = (item as any).service as Service;
        return acc + calculateServiceProfit(service);
    }, 0);

    return (
        <Box>
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Serviço</TableCell>
                            <TableCell align="right">Preço</TableCell>
                            <TableCell align="right">Lucro</TableCell>
                            <TableCell align="center" sx={{ width: 80 }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map((item, index) => {
                            const service = (item as any).service as Service;
                            const profit = calculateServiceProfit(service);
                            const profitMargin = ((service.price - service.cost) / service.cost) * 100;

                            return (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {service?.name || "Serviço não encontrado"}
                                            </Typography>
                                            {service?.description && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {service.description}
                                                </Typography>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="medium">
                                            {(service?.price || 0).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Custo: {(service?.cost || 0).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Chip
                                            label={profit.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL"
                                            })}
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                        <Typography variant="caption" color="success.main" display="block">
                                            {profitMargin.toFixed(1)}%
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            onClick={() => remove(index)}
                                            color="error"
                                        >
                                            <Trash2 size={18} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Resumo dos Serviços */}
            {fields.length > 0 && (
                <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight="medium">
                            Resumo dos Serviços:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Typography variant="body2">
                                Total: <strong>{servicesTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                            </Typography>
                            <Typography variant="body2" color="success.main">
                                Lucro: <strong>{servicesProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                            </Typography>
                            <Typography variant="body2">
                                Itens: <strong>{fields.length}</strong>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}