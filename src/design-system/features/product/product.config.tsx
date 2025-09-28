import type { ColumnDef } from "@/design-system/crud/PFTable";
import { ProductCategoryLabels, type Product, type ProductCategory } from "@/types/productTypes";
import type { FieldDef } from "@/design-system/crud/PFDrawerModal";
import type { Brand } from "@/types/brandTypes";
import { TextField, Switch, FormControlLabel, MenuItem } from "@mui/material";

// ----------------------
// Tabela
// ----------------------
export const productColumns: ColumnDef<Product>[] = [
    { key: "id", label: "ID", width: 80 },
    { key: "name", label: "Nome" },
    {
        key: "category",
        label: "Categoria",
        render: (row) => ProductCategoryLabels[row.category],
    },
    { key: "salePrice", label: "Preço Venda" },
    { key: "stockQuantity", label: "Estoque" },
    {
        key: "isActive",
        label: "Ativo",
        render: (row) => (row.isActive ? "Sim" : "Não"),
    },
];


// ----------------------
// Formulário
// ----------------------
export const productFields: FieldDef<Product>[] = [
    {
        name: "name",
        label: "Nome",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        name: "description",
        label: "Descrição",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        name: "costPrice",
        label: "Preço de Custo",
        component: ({ value, onChange }) => (
            <TextField
                type="number"
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        ),
    },
    {
        name: "markup",
        label: "Markup (%)",
        component: ({ value, onChange }) => (
            <TextField
                type="number"
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        ),
    },
    {
        name: "salePrice",
        label: "Preço de Venda",
        component: ({ value, onChange }) => (
            <TextField
                type="number"
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        ),
    },
    {
        name: "stockQuantity",
        label: "Qtd. Estoque",
        component: ({ value, onChange }) => (
            <TextField
                type="number"
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
            />
        ),
    },
    {
        name: "minimumStock",
        label: "Estoque Mínimo",
        component: ({ value, onChange }) => (
            <TextField
                type="number"
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(parseInt(e.target.value, 10))}
            />
        ),
    },
    {
        name: "category",
        label: "Categoria",
        component: ({ value, onChange }) => (
            <TextField
                select
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value as ProductCategory)}
            >
                {Object.entries(ProductCategoryLabels).map(([key, label]) => (
                    <MenuItem key={key} value={key}>
                        {label}
                    </MenuItem>
                ))}
            </TextField>
        ),
    },
    {
        name: "brand",
        label: "Marca",
        component: ({ value, onChange }) => {
            const brandValue = value as Brand | null;

            return (
                <TextField
                    fullWidth
                    size="small"
                    value={brandValue?.id ?? ""}
                    placeholder="Selecione a marca"
                    onChange={(e) => {
                        const id = e.target.value ? Number(e.target.value) : null;
                        onChange(id ? ({ id } as Brand) : null);
                    }}
                />
            );
        },
    },
    {
        name: "isActive",
        label: "Ativo",
        component: ({ value, onChange }) => (
            <FormControlLabel
                control={
                    <Switch
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                    />
                }
                label="Ativo"
            />
        ),
    },
];
