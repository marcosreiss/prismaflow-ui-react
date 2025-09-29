// src/config/sale.config.ts

import type { ColumnDef } from "@/components/crud/PFTable";
import type { FieldDef } from "@/components/crud/PFDrawerModal";
import type { Sale } from "@/types/saleTypes";
import { TextField, Switch, FormControlLabel } from "@mui/material";
import CurrencyInput from "@/components/imask/CurrencyInput";

// ----------------------
// Tabela
// ----------------------
export const saleColumns: ColumnDef<Sale>[] = [
    { key: "id", label: "ID", width: 80 },
    {
        key: "client",
        label: "Cliente",
        // Acessa a propriedade aninhada 'name' do objeto 'client'
        render: (row) => row.client?.name ?? "N/A",
    },
    {
        key: "total",
        label: "Total",
        render: (row) => `R$ ${row.total.toFixed(2)}`
    },
    {
        key: "createdAt",
        label: "Data",
        render: (row) => new Date(row.createdAt).toLocaleDateString('pt-BR')
    },
    {
        key: "isActive",
        label: "Status",
        render: (row) => (row.isActive ? "Ativa" : "Cancelada"),
    },
];

// ----------------------
// Formulário
// ----------------------
export const saleFields: FieldDef<Sale>[] = [
    {
        name: "client",
        label: "Cliente ID",
        // NOTA: O ideal aqui é usar um componente de Autocomplete
        // que busca e seleciona clientes da API.
        // Por simplicidade, usamos um campo de texto para o ID.
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                placeholder="Digite o ID do Cliente"
                value={(value as any)?.id ?? ""}
                onChange={(e) => onChange({ id: Number(e.target.value) })}
            />
        ),
    },
    {
        name: "discount",
        label: "Desconto (R$)",
        component: ({ value, onChange }) => (
            <CurrencyInput
                fullWidth
                size="small"
                label="Valor do Desconto"
                value={typeof value === "number" ? value : 0}
                onChange={(numericValue) => onChange(numericValue)}
            />
        ),
    },
    {
        name: "notes",
        label: "Observações",
        component: ({ value, onChange }) => (
            <TextField
                fullWidth
                size="small"
                multiline
                rows={4}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
            />
        ),
    },
    // NOTA: Os campos 'productItems' e 'serviceItems' são muito complexos para um formulário simples.
    // Eles exigiriam uma interface separada para adicionar/remover itens da venda.
    // Por isso, foram omitidos deste formulário básico.
    {
        name: "isActive",
        label: "Ativa",
        component: ({ value, onChange }) => (
            <FormControlLabel
                control={<Switch checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />}
                label="Venda ativa"
            />
        ),
    },
];