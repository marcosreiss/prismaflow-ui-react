import type { FieldDef } from "@/components/crud/PFDrawerModal";
import type { ColumnDef } from "@/components/crud/PFTable";
import type { Customer } from "@/types/customerTypes";
import { TextField } from "@mui/material";

// ----------------------
// Tabela
// ----------------------
export const customerColumns: ColumnDef<Customer>[] = [
    { key: "id", label: "ID", width: 80 },
    { key: "name", label: "Nome" },
    { key: "cpf", label: "CPF" },
    { key: "phone01", label: "Telefone" },
    { key: "email", label: "E-mail" }, // substitui isActive
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
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                required
            />
        ),
    },
    {
        name: "nickname",
        label: "Apelido",
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
        name: "cpf",
        label: "CPF",
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
        name: "rg",
        label: "RG",
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
        name: "bornDate",
        label: "Data de Nascimento",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        name: "gender",
        label: "Sexo",
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
        name: "fatherName",
        label: "Nome do Pai",
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
        name: "motherName",
        label: "Nome da Mãe",
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
        name: "spouse",
        label: "Cônjuge",
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
        name: "email",
        label: "E-mail",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                type="email"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    {
        name: "company",
        label: "Empresa",
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
        name: "occupation",
        label: "Profissão",
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
        name: "street",
        label: "Rua",
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
        name: "number",
        label: "Número",
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
        name: "neighborhood",
        label: "Bairro",
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
        name: "city",
        label: "Cidade",
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
        name: "uf",
        label: "UF",
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
        name: "cep",
        label: "CEP",
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
        name: "complement",
        label: "Complemento",
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
        name: "isBlacklisted",
        label: "Negativado",
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
        name: "obs",
        label: "Observações",
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
        name: "phone01",
        label: "Telefone 1",
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
        name: "phone02",
        label: "Telefone 2",
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
        name: "phone03",
        label: "Telefone 3",
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
        name: "reference01",
        label: "Referência 1",
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
        name: "reference02",
        label: "Referência 2",
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
        name: "reference03",
        label: "Referência 3",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
];
