import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
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
} from "@mui/material";
import { Trash2 } from "lucide-react";

export default function SaleItemsTable() {
    // 1. Garante que 'control' vem do contexto
    const { control } = useFormContext<Sale>();

    // 2. Garante que o 'name' é exatamente "productItems"
    const { fields, remove } = useFieldArray({
        control,
        name: "productItems",
    });
    // 👇 ADICIONE ESTE CONSOLE.LOG PARA O TESTE FINAL 👇
    console.log("SaleItemsTable está 'vendo' estes fields:", fields);

    // Se a lista está vazia, o componente não renderiza nada
    if (fields.length === 0) {
        return null;
    }

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Produto</TableCell>
                        <TableCell align="center" sx={{ width: 100 }}>Qtd.</TableCell>
                        <TableCell align="right">Preço Unit.</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((item, index) => {
                        // Acessamos os dados do produto com segurança
                        const product = (item as any).product;
                        const quantity = (item as any).quantity;

                        return (
                            <TableRow key={item.id}>
                                <TableCell>{product?.name ?? "Produto inválido"}</TableCell>
                                <TableCell>
                                    <Controller
                                        control={control}
                                        name={`productItems.${index}.quantity`}
                                        defaultValue={1}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                type="number"
                                                size="small"
                                                sx={{ "& input": { textAlign: "center" } }}
                                                inputProps={{ min: 1, style: { padding: '8.5px 6px' } }}
                                                onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)}
                                            />
                                        )}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {(product?.salePrice ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                </TableCell>
                                <TableCell align="right">
                                    {((quantity || 0) * (product?.salePrice || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
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
    );
}