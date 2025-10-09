import { useFormContext, useFieldArray } from "react-hook-form";
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
} from "@mui/material";
import { Trash2 } from "lucide-react";
import type { SalePayload } from "@/modules/sales/types/salesTypes";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";

export default function ServicesTable() {
    const { control } = useFormContext<SalePayload>();

    const { fields, remove } = useFieldArray({
        control,
        name: "serviceItems",
    });

    if (fields.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{ p: 4, textAlign: "center", borderStyle: "dashed" }}
            >
                <Typography color="text.secondary" variant="body1">
                    Nenhum serviço adicionado à venda
                </Typography>
            </Paper>
        );
    }

    // Total geral de serviços
    const servicesTotal = fields.reduce((acc, item) => {
        const service = item.service as OpticalService;
        return acc + (service?.price ?? 0);
    }, 0);

    return (
        <Box>
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Serviço</TableCell>
                            <TableCell align="right" sx={{ width: 130 }}>
                                Preço
                            </TableCell>
                            <TableCell align="center" sx={{ width: 80 }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fields.map((item, index) => {
                            const service = item.service as OpticalService;

                            return (
                                <TableRow key={item.id ?? index}>
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
                                                currency: "BRL",
                                            })}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => remove(index)} color="error">
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
                <Paper
                    variant="outlined"
                    sx={{ p: 2, mt: 1, bgcolor: "background.default" }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="body2" fontWeight="medium">
                            Resumo dos Serviços:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Typography variant="body2">
                                Total:{" "}
                                <strong>
                                    {servicesTotal.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </strong>
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
