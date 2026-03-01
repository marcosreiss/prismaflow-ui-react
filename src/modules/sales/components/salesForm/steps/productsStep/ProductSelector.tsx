import { useState, useEffect, forwardRef } from "react";
import { useFormContext } from "react-hook-form";
import type { Product, ProductCategory } from "@/modules/products/types/productTypes";
import { ProductCategoryLabels } from "@/modules/products/types/productTypes";
import {
    Autocomplete, TextField, Button, Stack, Typography, Box,
    Paper, MenuItem, FormControl, InputLabel, Select,
    CircularProgress, keyframes,
} from "@mui/material";
import { Plus, Package } from "lucide-react";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";
import { useGetProducts } from "@/modules/products/hooks/useProduct";
import type { SalePayload } from "@/modules/sales/types/salesTypes";
import { useGetBrands } from "@/modules/brands/hooks/useBrand";


const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
`;

interface ProductSelectorProps {
    disabled?: boolean;
}

const ProductSelector = forwardRef<HTMLDivElement, ProductSelectorProps>(
    ({ disabled = false }, ref) => {
        const { handleAddProduct } = useSaleFormContext();
        const { watch } = useFormContext<SalePayload>();

        const productItems = watch("productItems") ?? [];
        const addedProductIds = new Set(
            productItems.map((item) => item.productId ?? item.product?.id)
        );

        const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
        const [quantity, setQuantity] = useState<string>("1");
        const [quantityError, setQuantityError] = useState<string | null>(null);
        const [searchValue, setSearchValue] = useState("");
        const [debouncedSearch, setDebouncedSearch] = useState("");
        const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");

        const [selectedBrand, setSelectedBrand] = useState<{ id: number; name: string } | null>(null);
        const [brandSearch, setBrandSearch] = useState("");
        const [debouncedBrandSearch, setDebouncedBrandSearch] = useState("");


        useEffect(() => {
            const t = setTimeout(() => setDebouncedSearch(searchValue), 400);
            return () => clearTimeout(t);
        }, [searchValue]);

        useEffect(() => {
            const t = setTimeout(() => setDebouncedBrandSearch(brandSearch), 400);
            return () => clearTimeout(t);
        }, [brandSearch]);

        const { data: brandsResponse, isFetching: isBrandLoading } = useGetBrands({
            page: 1,
            limit: 50,
            search: debouncedBrandSearch,
        });

        const brands = brandsResponse?.data?.content || [];

        const { data: productsResponse, isFetching: isLoading } = useGetProducts({
            page: 1,
            limit: 50,
            search: debouncedSearch,
            category: selectedCategory !== "ALL" ? selectedCategory : undefined,
            brandId: selectedBrand?.id ?? undefined,
        });

        const products = isLoading
            ? []
            : (productsResponse?.data?.content || []).filter(
                (p) => !addedProductIds.has(p.id)
            );


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

        const productNoOptionsText = isLoading
            ? "Buscando..."
            : debouncedSearch.trim().length === 0
                ? "Digite para buscar produtos."
                : "Nenhum produto encontrado.";

        return (
            <Box>
                <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
                    <Package size={24} />
                    Adicionar Produtos
                </Typography>

                <Paper variant="outlined" sx={{ p: 3, mb: 2, borderRadius: 2 }}>
                    <Stack spacing={3}>
                        {/* Filtro por categoria */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, color: "text.secondary", fontWeight: 500 }}>
                                Filtros
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                <FormControl size="small" sx={{ minWidth: 180, height: 48 }}>
                                    <InputLabel>Categoria</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        label="Categoria"
                                        onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "ALL")}
                                        sx={{ height: 48 }}
                                    >
                                        <MenuItem value="ALL">Todas as categorias</MenuItem>
                                        {Object.entries(ProductCategoryLabels).map(([key, label]) => (
                                            <MenuItem key={key} value={key}>{label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Autocomplete
                                    options={brands}
                                    getOptionLabel={(b) => b.name}
                                    loading={isBrandLoading}
                                    loadingText="Buscando marcas..."
                                    noOptionsText={debouncedBrandSearch.trim() === "" ? "Digite para buscar." : "Nenhuma marca encontrada."}
                                    filterOptions={(x) => x}
                                    value={selectedBrand}
                                    inputValue={brandSearch}
                                    onInputChange={(_, value) => setBrandSearch(value)}
                                    onChange={(_, newValue) => setSelectedBrand(newValue)}
                                    disabled={disabled}
                                    sx={{ minWidth: 180 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Marca"
                                            placeholder="Digite a marca..."
                                            size="small"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {isBrandLoading ? <CircularProgress color="inherit" size={18} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Box>

                        {/* Busca e adição */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1.5, color: "text.secondary", fontWeight: 500 }}>
                                Seleção do produto
                            </Typography>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "flex-end" }}>
                                <Autocomplete
                                    options={products}
                                    getOptionLabel={(p) => `${p.name || "Sem nome"} - ${ProductCategoryLabels[p.category]}`}
                                    loading={isLoading}
                                    loadingText="Buscando produtos..."
                                    noOptionsText={productNoOptionsText}
                                    filterOptions={(x) => x}
                                    value={selectedProduct}
                                    inputValue={searchValue}
                                    onInputChange={(_, value) => setSearchValue(value)}
                                    onChange={(_, newValue) => setSelectedProduct(newValue)}
                                    onKeyPress={handleKeyPress}
                                    disabled={disabled}
                                    sx={{ flex: 2, minWidth: 280 }}
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

                                <TextField
                                    label="Quantidade"
                                    type="text"
                                    size="small"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    error={!!quantityError}
                                    helperText={quantityError ? "Quantidade inválida" : ""}
                                    sx={{ width: { xs: "100%", sm: 120 }, height: 48, animation: quantityError ? `${shake} 0.3s ease` : "none" }}
                                    inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                                    InputProps={{ sx: { height: 48 } }}
                                />

                                <Button
                                    variant="contained"
                                    onClick={handleAdd}
                                    disabled={!selectedProduct || disabled}
                                    startIcon={<Plus size={18} />}
                                    sx={{ height: 48, minWidth: 140, px: 3 }}
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

ProductSelector.displayName = "ProductSelector";
export default ProductSelector;
