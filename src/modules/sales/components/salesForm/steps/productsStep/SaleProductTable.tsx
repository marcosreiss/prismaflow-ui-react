import { useState } from "react";
import React from "react";
import {
    useFormContext,
    useFieldArray,
    Controller,
} from "react-hook-form";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField,
    Typography,
    Collapse,
} from "@mui/material";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { SalePayload, SaleProductItem } from "@/modules/sales/types/salesTypes";
import FrameDetailsForm from "./FrameDetailsForm";

export default function SaleProductTable() {
    const { control } = useFormContext<SalePayload>();
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    const { fields, remove } = useFieldArray({
        control,
        name: "productItems",
    });

    const toggleRowExpansion = (index: number) => {
        setExpandedRows((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    if (fields.length === 0) {
        return (
            <Paper variant="outlined" sx={{ p: 4, textAlign: "center", borderStyle: "dashed" }}>
                <Typography color="text.secondary" variant="body1">
                    Nenhum produto adicionado à venda
                </Typography>
            </Paper>
        );
    }

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: 40 }}></TableCell>
                        <TableCell>Produto</TableCell>
                        <TableCell align="center" sx={{ width: 120 }}>
                            Quantidade
                        </TableCell>
                        <TableCell align="right" sx={{ width: 130 }}>
                            Preço Unit.
                        </TableCell>
                        <TableCell align="right" sx={{ width: 130 }}>
                            Subtotal
                        </TableCell>
                        <TableCell align="center" sx={{ width: 80 }}>
                            Ações
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((item, index) => {
                        const productItem = item as unknown as SaleProductItem;
                        const product = productItem.product;
                        const quantity = productItem.quantity ?? 0;
                        const unitPrice = product?.salePrice ?? 0;
                        const subtotal = quantity * unitPrice;
                        const isExpanded = expandedRows.includes(index);
                        const hasFrameDetails = product?.category === "FRAME";

                        return (
                            <React.Fragment key={item.id ?? index}>
                                <TableRow>
                                    <TableCell>
                                        {hasFrameDetails && (
                                            <IconButton size="small" onClick={() => toggleRowExpansion(index)}>
                                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </IconButton>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Typography variant="body2" fontWeight="medium">
                                            {product?.name || "Produto não encontrado"}
                                        </Typography>
                                        {product?.category && (
                                            <Typography variant="caption" color="text.secondary">
                                                Categoria: {product.category}
                                            </Typography>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Controller
                                            control={control}
                                            name={`productItems.${index}.quantity`}
                                            rules={{
                                                required: "Quantidade é obrigatória",
                                                min: { value: 1, message: "Mínimo 1" },
                                            }}
                                            render={({ field, fieldState: { error } }) => (
                                                <TextField
                                                    {...field}
                                                    type="number"
                                                    size="small"
                                                    error={!!error}
                                                    helperText={error?.message}
                                                    sx={{
                                                        width: 80,
                                                        "& .MuiInputBase-input": {
                                                            textAlign: "center",
                                                            padding: "8px 6px",
                                                        },
                                                    }}
                                                    inputProps={{ min: 1, step: 1 }}
                                                    onChange={(e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        field.onChange(isNaN(value) ? 1 : value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </TableCell>

                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="medium">
                                            {unitPrice.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="right">
                                        <Typography variant="body2" fontWeight="medium" color="primary">
                                            {subtotal.toLocaleString("pt-BR", {
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

                                {hasFrameDetails && (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                <FrameDetailsForm index={index} />
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
