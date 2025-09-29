import type { FieldDef } from "@/components/crud/PFDrawerModal";
import type { ColumnDef } from "@/components/crud/PFTable";
import CurrencyInput from "@/components/imask/CurrencyInput";
import type { Service } from "@/types/serviceTypes";
import { FormControlLabel, Switch, TextField } from "@mui/material";

// ----------------------
// Tabela
// ----------------------
export const serviceColumns: ColumnDef<Service>[] = [
    { key: "id", label: "ID", width: 80 },
    { key: "name", label: "Nome" },
    { key: "price", label: "Preço" },
    {
        key: "isActive",
        label: "Ativo",
        render: (row) => (row.isActive ? "Sim" : "Não"),
    },
];

// ----------------------
// Formulário
// ----------------------
export const serviceFields: FieldDef<Service>[] = [
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
        name: "price",
        label: "Preço",
        component: ({ value, onChange }) => (
            <CurrencyInput
                fullWidth
                size="small"
                label="Preço do Serviço"
                value={typeof value === "number" ? value : 0}
                onChange={(numericValue) => onChange(numericValue)}
            />
        ),
    },
    {
        name: "cost",
        label: "Custo",
        component: ({ value, onChange }) => (
            <CurrencyInput
                fullWidth
                size="small"
                label="Custo do Serviço"
                value={typeof value === "number" ? value : 0}
                onChange={(numericValue) => onChange(numericValue)}
            />
        ),
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