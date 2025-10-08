import { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { useProduct } from "@/hooks/useProduct";
import type { Product } from "@/modules/products/types/productTypes";
import {
    Box,
    Typography,
    Stack,
    Autocomplete,
    TextField,
    Button,
} from "@mui/material";

export default function SaleItemAddStep() {
    // Acessa os métodos do formulário principal
    const { control } = useFormContext();

    // Obtém a função 'append' para adicionar itens ao array 'productItems'
    const { append } = useFieldArray({
        control,
        name: "productItems",
    });

    // Busca a lista de produtos para o Autocomplete
    const { list: { data: products, isLoading: isLoadingProducts } } = useProduct(null);

    // Estado local para controlar o produto selecionado no Autocomplete
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const handleAddProduct = () => {
        if (selectedProduct) {
            // Adiciona o produto à lista de itens da venda no formulário
            // O tipo 'any' é um pequeno truque para contornar uma limitação 
            // de tipo complexa do react-hook-form com arrays aninhados.
            append({ product: selectedProduct, quantity: 1 } as any);

            // Limpa a seleção para que o usuário possa adicionar o próximo item
            setSelectedProduct(null);
        }
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 1.5 }}>2. Adicionar Itens</Typography>
            <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
                <Autocomplete
                    sx={{ flexGrow: 1 }}
                    options={products || []}
                    getOptionLabel={(option) => option.name || ""}
                    loading={isLoadingProducts}
                    value={selectedProduct}
                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Buscar produto" />
                    )}
                />
                <Button
                    variant="outlined"
                    onClick={handleAddProduct}
                    disabled={!selectedProduct}
                    sx={{ height: 56 }} // Para alinhar a altura com o TextField
                >
                    Adicionar
                </Button>
            </Stack>
        </Box>
    );
}