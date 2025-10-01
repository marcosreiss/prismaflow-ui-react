import {
    Box,
    Typography,
    Paper,
    Stack,
} from "@mui/material";
import { CheckCircle } from "lucide-react";

interface ReviewStepProps {
    client: any;
    productItems: any[];
    subtotal: number;
    discount: number;
    total: number;
}

export default function ReviewStep({
    client,
    productItems,
    subtotal,
    discount,
    total
}: ReviewStepProps) {
    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle size={24} />
                Resumo da Venda
            </Typography>
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Cliente</Typography>
                        <Typography variant="body1" fontWeight="medium">
                            {client?.name || "Não selecionado"}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary">Itens da Venda</Typography>
                        <Typography variant="body1">
                            {productItems.length} produto(s)
                        </Typography>
                        {productItems.map((item, index) => (
                            <Typography key={index} variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                • {(item as any).product.name} x {(item as any).quantity}
                            </Typography>
                        ))}
                    </Box>

                    <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" color="text.secondary">Subtotal</Typography>
                            <Typography variant="body1">
                                {subtotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" color="text.secondary">Desconto</Typography>
                            <Typography variant="body1" color="error.main">
                                -{(discount || 0).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" color="primary.main">
                                {total.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL"
                                })}
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}