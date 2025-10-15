import { useState, forwardRef } from "react";
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
const ProductSelector = forwardRef<HTMLDivElement, ProductSelectorProps>(
    ({ products, isLoading, disabled = false }, ref) => {
        const { handleAddProduct } = useSaleFormContext();

        const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
        const [quantity, setQuantity] = useState<string>("1");
        const [quantityError, setQuantityError] = useState<string | null>(null);
        const [searchValue, setSearchValue] = useState("");
        const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");

        const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
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
                <Typography
                    variant="h6"
                    sx={{
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontWeight: 600
                    }}
                >
                    <Package size={24} />
                    Adicionar Produtos
                </Typography>

                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        mb: 2,
                        borderRadius: 2
                    }}
                >
                    <Stack spacing={3}>
                        {/* Filtros */}
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 1.5,
                                    color: "text.secondary",
                                    fontWeight: 500
                                }}
                            >
                                Filtros
                            </Typography>
                            <FormControl
                                size="small"
                                sx={{
                                    minWidth: 180,
                                    height: 48
                                }}
                            >
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={selectedCategory}
                                    label="Categoria"
                                    onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "ALL")}
                                    sx={{ height: 48 }}
                                >
                                    <MenuItem value="ALL">Todas as categorias</MenuItem>
                                    {Object.entries(ProductCategoryLabels).map(([key, label]) => (
                                        <MenuItem key={key} value={key}>
                                            {label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Busca e Adição */}
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    mb: 1.5,
                                    color: "text.secondary",
                                    fontWeight: 500
                                }}
                            >
                                Seleção do produto
                            </Typography>

                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                alignItems={{ xs: "stretch", sm: "flex-end" }}
                            >
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
                                    sx={{
                                        flex: 2,
                                        minWidth: 280
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            ref={ref}
                                            label="Buscar produto"
                                            placeholder="Digite o nome ou descrição..."
                                            fullWidth
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                sx: { height: 48 },
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
                                    label="Quantidade"
                                    type="text"
                                    size="small"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    error={!!quantityError}
                                    helperText={quantityError ? "Quantidade inválida" : ""}
                                    sx={{
                                        width: { xs: "100%", sm: 120 },
                                        height: 48,
                                        animation: quantityError ? `${shake} 0.3s ease` : "none",
                                    }}
                                    inputProps={{
                                        inputMode: "numeric",
                                        pattern: "[0-9]*",
                                    }}
                                    InputProps={{ sx: { height: 48 } }}
                                />

                                {/* Botão */}
                                <Button
                                    variant="contained"
                                    onClick={handleAdd}
                                    disabled={!selectedProduct || disabled}
                                    startIcon={<Plus size={18} />}
                                    sx={{
                                        height: 48,
                                        minWidth: 140,
                                        px: 3
                                    }}
                                >
                                    Adicionar
                                </Button>
                            </Stack>
                        </Box>
                    </Stack>
                </Paper>
            </Box>
        );
    }
);

// Definir display name para melhor debugging
ProductSelector.displayName = "ProductSelector";

export default ProductSelector;