import { productColumns, productFields } from "@/config/product.config";
import { useProduct } from "@/hooks/useProduct";
import { useBrand } from "@/modules/brands/hooks/useBrand";
import { ProductCategoryLabels, type Product } from "@/types/productTypes";
import type { Brand } from "@/modules/brands/brandTypes";
import {
    Box,
    Typography,
    Chip,
    Divider,
    Autocomplete,
    TextField,
} from "@mui/material";
import { CrudPage } from "./CrudPage";

export default function ProductsPage() {
    // hook para buscar marcas e usar no autocomplete
    const {
        list: { data: brandOptions = [] },
    } = useBrand();

    return (
        <CrudPage<Product>
            title="Produto"
            addLabel="Adicionar novo produto"
            columns={productColumns}
            // sobrescrevendo o campo "brand" para usar Autocomplete
            fields={productFields.map((field) =>
                field.name === "brand"
                    ? {
                        ...field,
                        component: ({ value, onChange }) => (
                            <Autocomplete
                                size="small"
                                options={brandOptions}
                                getOptionLabel={(option: Brand) => option.name}
                                value={
                                    brandOptions.find(
                                        (b) => b.id === (value as Brand | null)?.id
                                    ) || null
                                }
                                onChange={(_, newValue) => {
                                    onChange(newValue ? { id: newValue.id } : null);
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Marca" fullWidth />
                                )}
                            />
                        ),
                    }
                    : field
            )}
            useCrudHook={useProduct}
            renderView={(product) => (
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Typography variant="h6">{product.name}</Typography>
                        <Chip
                            size="small"
                            label={product.isActive ? "Ativo" : "Inativo"}
                            color={product.isActive ? "success" : "default"}
                            variant={product.isActive ? "filled" : "outlined"}
                        />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "140px 1fr",
                            rowGap: 1.5,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            ID
                        </Typography>
                        <Typography variant="body1">{product.id}</Typography>

                        <Typography variant="body2" color="text.secondary">
                            Nome
                        </Typography>
                        <Typography variant="body1">{product.name}</Typography>

                        <Typography variant="body2" color="text.secondary">
                            Categoria
                        </Typography>
                        <Typography variant="body1">
                            {ProductCategoryLabels[product.category]}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Marca
                        </Typography>
                        <Typography variant="body1">{product.brand?.name ?? "-"}</Typography>

                        <Typography variant="body2" color="text.secondary">
                            Preço Venda
                        </Typography>
                        <Typography variant="body1">{product.salePrice}</Typography>

                        <Typography variant="body2" color="text.secondary">
                            Estoque
                        </Typography>
                        <Typography variant="body1">{product.stockQuantity}</Typography>
                    </Box>
                </Box>
            )}
        />
    );
}
