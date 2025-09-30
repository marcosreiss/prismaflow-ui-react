import { useState } from "react";
import type { Product, ProductCategory } from "@/types/productTypes";
import { ProductCategoryLabels } from "@/types/productTypes";
import {
    Autocomplete,
    TextField,
    Button,
    Stack,
    Typography,
    Box,
    Chip,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { Plus, Package, Tag } from "lucide-react";

interface ProductSelectorProps {
    products: Product[];
    isLoading: boolean;
    onAddProduct: (product: Product) => void;
    disabled?: boolean;
}

export default function ProductSelector({
    products,
    isLoading,
    onAddProduct,
    disabled = false
}: ProductSelectorProps) {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "ALL">("ALL");

    const handleAddProduct = () => {
        if (selectedProduct) {
            onAddProduct(selectedProduct);
            setSelectedProduct(null);
            setSearchValue("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && selectedProduct) {
            event.preventDefault();
            handleAddProduct();
        }
    };

    // Filtrar produtos por categoria e termo de busca - CORRIGIDO
    const filteredProducts = products.filter(product => {
        if (!product) return false;

        const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory;

        // CORREÇÃO: Verificar se as propriedades existem antes de usar toLowerCase()
        const productName = product.name || "";
        const productDescription = product.description || "";
        const searchTerm = searchValue || "";

        const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            productDescription.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const getCategoryColor = (category: ProductCategory) => {
        const colors = {
            FRAME: "primary",
            LENS: "secondary",
            ACCESSORY: "success"
        } as const;
        return colors[category];
    };

    const getStockStatus = (product: Product) => {
        if (!product) return { label: "Indisponível", color: "error" as const };
        if (product.stockQuantity === 0) return { label: "Sem Estoque", color: "error" as const };
        if (product.stockQuantity <= product.minimumStock) return { label: "Estoque Baixo", color: "warning" as const };
        return { label: "Em Estoque", color: "success" as const };
    };

    // CORREÇÃO: Função para renderizar opções sem problemas com key
    const renderOption = (props: any, product: Product) => {
        if (!product) return null;

        const { key, ...otherProps } = props;

        return (
            <li key={key} {...otherProps}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body2" fontWeight="medium">
                            {product.name || "Produto sem nome"}
                        </Typography>
                        <Chip
                            label={ProductCategoryLabels[product.category] || "Sem categoria"}
                            size="small"
                            color={getCategoryColor(product.category)}
                            variant="outlined"
                        />
                    </Box>

                    {product.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            {product.description}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip
                            label={getStockStatus(product).label}
                            size="small"
                            color={getStockStatus(product).color}
                            variant="filled"
                        />
                        <Typography variant="caption" color="text.secondary">
                            Estoque: {product.stockQuantity || 0}
                        </Typography>
                        {product.brand && (
                            <Typography variant="caption" color="text.secondary">
                                Marca: {product.brand.name}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" fontWeight="bold">
                            {(product.salePrice || 0).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            })}
                        </Typography>
                        {product.markup && product.markup > 0 && (
                            <Typography variant="caption" color="success.main">
                                Markup: {product.markup}%
                            </Typography>
                        )}
                    </Box>
                </Box>
            </li>
        );
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Package size={24} />
                Adicionar Produtos
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack spacing={2}>
                    {/* Filtro e Busca em linha */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
                        {/* Filtro por Categoria */}
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Categoria</InputLabel>
                            <Select
                                value={selectedCategory}
                                label="Categoria"
                                onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "ALL")}
                            >
                                <MenuItem value="ALL">Todas as Categorias</MenuItem>
                                <MenuItem value="FRAME">Armação</MenuItem>
                                <MenuItem value="LENS">Lente</MenuItem>
                                <MenuItem value="ACCESSORY">Acessório</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Busca de Produtos */}
                        <Box sx={{ flex: 1 }}>
                            <Autocomplete
                                options={filteredProducts}
                                getOptionLabel={(product) => {
                                    if (!product) return "Produto inválido";
                                    return `${product.name || "Sem nome"} - ${ProductCategoryLabels[product.category] || "Sem categoria"}`;
                                }}
                                loading={isLoading}
                                value={selectedProduct}
                                inputValue={searchValue}
                                onInputChange={(_, value) => setSearchValue(value || "")}
                                onChange={(_, newValue) => setSelectedProduct(newValue)}
                                onKeyPress={handleKeyPress}
                                disabled={disabled}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Buscar produto"
                                        placeholder="Digite o nome ou descrição do produto..."
                                        fullWidth
                                    />
                                )}
                                renderOption={renderOption}
                            />
                        </Box>

                        {/* Botão Adicionar */}
                        <Button
                            variant="contained"
                            onClick={handleAddProduct}
                            disabled={!selectedProduct || disabled}
                            startIcon={<Plus size={18} />}
                            sx={{ height: 40, minWidth: 120 }}
                        >
                            Adicionar
                        </Button>
                    </Stack>
                </Stack>
            </Paper>

            {/* Informações do Produto Selecionado */}
            {selectedProduct && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Tag size={16} />
                        Produto Selecionado
                    </Typography>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        <Stack spacing={1} sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Nome:</Typography>
                                <Typography variant="body2">{selectedProduct.name || "Sem nome"}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Categoria:</Typography>
                                <Chip
                                    label={ProductCategoryLabels[selectedProduct.category] || "Sem categoria"}
                                    size="small"
                                    color={getCategoryColor(selectedProduct.category)}
                                />
                            </Box>
                            {selectedProduct.brand && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" fontWeight="medium">Marca:</Typography>
                                    <Typography variant="body2">{selectedProduct.brand.name}</Typography>
                                </Box>
                            )}
                        </Stack>

                        <Stack spacing={1} sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Preço de Venda:</Typography>
                                <Typography variant="body2" fontWeight="bold" color="primary.main">
                                    {(selectedProduct.salePrice || 0).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL"
                                    })}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Estoque:</Typography>
                                <Chip
                                    label={getStockStatus(selectedProduct).label}
                                    size="small"
                                    color={getStockStatus(selectedProduct).color}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Estoque Mínimo:</Typography>
                                <Typography variant="body2">{selectedProduct.minimumStock || 0}</Typography>
                            </Box>
                        </Stack>
                    </Stack>

                    {selectedProduct.description && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                                <strong>Descrição:</strong> {selectedProduct.description}
                            </Typography>
                        </Box>
                    )}
                </Paper>
            )}

            {/* Estatísticas Rápidas */}
            {products && products.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                        {filteredProducts.length} produto(s) encontrado(s) •
                        {products.filter(p => p && p.stockQuantity === 0).length} sem estoque •
                        {products.filter(p => p && p.stockQuantity && p.minimumStock && p.stockQuantity <= p.minimumStock && p.stockQuantity > 0).length} com estoque baixo
                    </Typography>
                </Box>
            )}
        </Box>
    );
}