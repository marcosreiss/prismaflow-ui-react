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
    keyframes,
} from "@mui/material";
import { Plus, Package } from "lucide-react";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";

// 🔹 Animação de erro (shake)
const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
`;

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
    const [quantity, setQuantity] = useState<string>("1");
    const [quantityError, setQuantityError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Permite apagar campo
        if (value === "" || /^[0-9]*$/.test(value)) {
            setQuantity(value);
            setQuantityError(null);
        }
    };

    const handleAdd = async () => {
        const parsedQty = Number(quantity);

        if (!selectedProduct) return;

        if (!quantity || parsedQty <= 0) {
            setQuantityError("*");
            return;
        }

        await handleAddProduct({ ...selectedProduct, quantity: parsedQty });
        setSelectedProduct(null);
        setQuantity("1");
        setSearchValue("");
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
                        <FormControl size="small" sx={{ minWidth: 150, height: 40 }}>
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Categoria"
                                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "ALL")}
                                sx={{ height: 40, display: "flex", alignItems: "center" }}
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
                            sx={{ flex: 1.5, height: 40 }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Buscar produto"
                                    placeholder="Digite o nome ou descrição..."
                                    fullWidth
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        sx: { height: 40 },
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
                            type="text" // permite apagar
                            size="small"
                            value={quantity}
                            onChange={handleQuantityChange}
                            error={!!quantityError}
                            helperText={quantityError ?? ""}
                            sx={{
                                width: 100,
                                height: 40,
                                animation: quantityError ? `${shake} 0.3s ease` : "none",
                            }}
                            inputProps={{
                                inputMode: "numeric",
                                pattern: "[0-9]*",
                            }}
                            InputProps={{ sx: { height: 40 } }}
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
