import { Box, Stack, Typography } from "@mui/material";
import type { Product } from "../types/productTypes";
import { ProductCategoryLabels } from "../types/productTypes";

export default function ProductView({ product }: { product: Product }) {
    return (
        <Stack spacing={1}>
            <Row label="Nome" value={product.name} />
            <Row label="Descrição" value={product.description} />
            <Row label="Preço de custo" value={formatCurrency(product.costPrice)} />
            <Row label="Preço de venda" value={formatCurrency(product.salePrice)} />
            <Row label="Acréscimo (%)" value={formatPercent((product.markup - 1) * 100)} />
            <Row label="Categoria" value={ProductCategoryLabels[product.category]} />
            <Row label="Marca" value={product.brand?.name ?? "-"} />
            <Row label="Estoque atual" value={product.stockQuantity} />
            <Row label="Estoque mínimo" value={product.minimumStock} />
        </Stack>
    );
}

// ==========================
// 🔹 Subcomponente auxiliar
// ==========================
function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    if (!value && value !== 0) return null;

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
                {label}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {value}
            </Typography>
        </Box>
    );
}

// ==========================
// 🔹 Helpers
// ==========================
function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}
