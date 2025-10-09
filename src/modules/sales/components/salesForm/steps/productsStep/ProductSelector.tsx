import { useState } from "react";
import type { Product, ProductCategory } from "@/modules/products/types/productTypes";
import { ProductCategoryLabels } from "@/modules/products/types/productTypes";
import {
    Autocomplete,
    TextField,
    Button,
    Stack,
    Typography,
    Box,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    CircularProgress,
} from "@mui/material";
import { Plus, Package } from "lucide-react";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";

interface ProductSelectorProps {
    products: Product[];
    isLoading: boolean;
    disabled?: boolean;
}

/**
 * 🔹 Seletor de produtos com filtro por categoria e busca
 */
export default function ProductSelector({
    products,
    isLoading,
    disabled = false,
}: ProductSelectorProps) {
    const { handleAddProduct } = useSaleFormContext();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");

    const handleAdd = async () => {
        if (selectedProduct) {
            await handleAddProduct({ ...selectedProduct, quantity });
            setSelectedProduct(null);
            setQuantity(1);
            setSearchValue("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && selectedProduct) {
            event.preventDefault();
            handleAdd();
        }
    };

    const filteredProducts = products.filter((product) => {
        if (!product) return false;
        const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory;
        const productName = product.name?.toLowerCase() || "";
        const productDescription = product.description?.toLowerCase() || "";
        const searchTerm = searchValue.toLowerCase();
        return matchesCategory && (productName.includes(searchTerm) || productDescription.includes(searchTerm));
    });

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Package size={24} />
                Adicionar Produtos
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
                        {/* Categoria */}
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Categoria"
                                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "ALL")}
                            >
                                <MenuItem value="ALL">Todas</MenuItem>
                                {Object.entries(ProductCategoryLabels).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Busca */}
                        <Autocomplete
                            options={filteredProducts}
                            getOptionLabel={(p) => `${p.name || "Sem nome"} - ${ProductCategoryLabels[p.category]}`}
                            loading={isLoading}
                            noOptionsText="Nenhum produto encontrado"
                            value={selectedProduct}
                            inputValue={searchValue}
                            onInputChange={(_, value) => setSearchValue(value)}
                            onChange={(_, newValue) => setSelectedProduct(newValue)}
                            onKeyPress={handleKeyPress}
                            disabled={disabled}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Buscar produto"
                                    placeholder="Digite o nome ou descrição..."
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {isLoading ? <CircularProgress color="inherit" size={18} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />

                        {/* Quantidade */}
                        <TextField
                            label="Qtd."
                            type="number"
                            size="small"
                            inputProps={{ min: 1 }}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            sx={{ width: 100 }}
                        />

                        {/* Botão */}
                        <Button
                            variant="contained"
                            onClick={handleAdd}
                            disabled={!selectedProduct || disabled}
                            startIcon={<Plus size={18} />}
                            sx={{ height: 40, minWidth: 120 }}
                        >
                            Adicionar
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
