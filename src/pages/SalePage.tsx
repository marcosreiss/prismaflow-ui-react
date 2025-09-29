// src/pages/sales/SalesPage.tsx

import { saleColumns, saleFields } from "@/config/sale.config";
import { useSale } from "@/hooks/useSale";
import type { Sale } from "@/types/saleTypes";
import { Box, Typography, Chip, Divider } from "@mui/material";
import { CrudPage } from "./CrudPage";

export default function SalesPage() {
    return (
        <CrudPage<Sale>
            title="Vendas"
            addLabel="Adicionar nova venda"
            columns={saleColumns}
            fields={saleFields}
            useCrudHook={useSale}
            renderView={(sale) => (
                <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Typography variant="h6">Venda #{sale.id}</Typography>
                        <Chip
                            size="small"
                            label={sale.isActive ? "Ativa" : "Cancelada"}
                            color={sale.isActive ? "success" : "default"}
                        />
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">Cliente</Typography>
                        <Typography variant="body1">{sale.client?.name ?? "N/A"}</Typography>

                        <Typography variant="body2" color="text.secondary">Data</Typography>
                        <Typography variant="body1">
                            {new Date(sale.createdAt).toLocaleString('pt-BR')}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                        <Typography variant="body1">R$ {sale.subtotal.toFixed(2)}</Typography>

                        <Typography variant="body2" color="text.secondary">Desconto</Typography>
                        <Typography variant="body1">R$ {sale.discount.toFixed(2)}</Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>Total</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>R$ {sale.total.toFixed(2)}</Typography>
                    </Box>
                </Box>
            )}
        />
    );
}