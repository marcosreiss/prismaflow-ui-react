import type { FieldDef } from "@/components/crud/PFDrawerModal";
import type { ColumnDef } from "@/components/crud/PFTable";
import type { Customer } from "@/types/customerTypes";
import { FormControlLabel, Switch, TextField } from "@mui/material";

// ----------------------
// Tabela
// ----------------------
export const customerColumns: ColumnDef<Customer>[] = [
    { key: "id", label: "ID", width: 80 },
    { key: "name", label: "Nome" },
    { key: "cpf", label: "CPF" },
    { key: "phone01", label: "Telefone" },
    {
        key: "isActive",
        label: "Ativo",
        render: (row) => (row.isActive ? "Sim" : "Não"),
    },
];

// ----------------------
// Formulário
// ----------------------
export const customerFields: FieldDef<Customer>[] = [
    {
        name: "name",
        label: "Nome Completo",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                value={value ?? ""
                }
                onChange={(e) => onChange(e.target.value)}
                required
            />
        ),
    },
    {
        name: "cpf",
        label: "CPF",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                value={value ?? ""
                }
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        name: "email",
        label: "E-mail",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                type="email"
                value={value ?? ""
                }
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        name: "phone01",
        label: "Telefone Principal",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                value={value ?? ""
                }
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    // {
    //     name: "isActive",
    //     label: "Ativo",
    //     component: ({ value, onChange }) => (
    //         <FormControlLabel
    //             control={
    //                 < Switch
    //                     checked={Boolean(value)}
    //                     onChange={(e) => onChange(e.target.checked)
    //                     }
    //                 />
    //             }
    //             label="Ativo"
    //         />
    //     ),
    // },
];