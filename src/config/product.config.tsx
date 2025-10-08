import type { FieldDef } from "@/components/crud/PFDrawerModal";
import type { ColumnDef } from "@/components/crud/PFTable";
import CurrencyInput from "@/components/imask/CurrencyInput";
import PercentInput from "@/components/imask/PercentInput";
import type { Brand } from "@/modules/brands/types/brandTypes";
import { type Product, type ProductCategory, ProductCategoryLabels } from "@/types/productTypes";
import { MenuItem, TextField } from "@mui/material";

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
            <CurrencyInput
                fullWidth
                size="small"
                label=""
                value={typeof value === "number" ? value : 0}
                onChange={(val) => onChange(val)}
            />
        ),
    },
    {
        name: "markup",
        label: "Acréscimo (%)",
        component: ({ value, onChange }) => (
            <PercentInput
                fullWidth
                size="small"
                label=""
                value={typeof value === "number" ? value : 0}
                onChange={(val) => onChange(val)}
            />
        ),
    },
    {
        name: "salePrice",
        label: "Preço de Venda",
        component: ({ value, onChange }) => (
            <CurrencyInput
                fullWidth
                size="small"
                label=""
                value={typeof value === "number" ? value : 0}
                onChange={(val) => onChange(val)}
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
    // {
    //     name: "isActive",
    //     label: "Ativo",
    //     component: ({ value, onChange }) => (
    //         <FormControlLabel
    //             control={
    //                 <Switch
    //                     checked={Boolean(value)}
    //                     onChange={(e) => onChange(e.target.checked)}
    //                 />
    //             }
    //             label="Ativo"
    //         />
    //     ),
    // },
];
