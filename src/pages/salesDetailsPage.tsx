import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Paper,
    Typography,
    Box,
    Chip,
    Divider,
    Button,
    CircularProgress,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNotification } from "@/context/NotificationContext";
import { useSaleDetails } from "@/services/useSaleDetails";

export default function SalesDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const saleId = id ? parseInt(id) : null;
    const { data: sale, isLoading, error } = useSaleDetails(saleId);

    console.log('🔍 Dados do hook específico:', sale);

    useEffect(() => {
        if (error) {
            addNotification("Erro ao carregar detalhes da venda.", "error");
        }
    }, [error, addNotification]);

    const handleBack = () => {
        navigate("/sales");
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!sale) {
        return (
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Venda não encontrada</Typography>
                <Button onClick={handleBack} startIcon={<ArrowBack />}>
                    Voltar para lista
                </Button>
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                borderRadius: 2,
                borderColor: "grey.200",
                backgroundColor: "background.paper",
                p: 3,
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button onClick={handleBack} startIcon={<ArrowBack />}>
                        Voltar
                    </Button>
                    <Typography variant="h4">Venda #{sale.id}</Typography>
                    <Chip
                        label={sale.isActive ? "Ativa" : "Cancelada"}
                        color={sale.isActive ? "success" : "error"}
                        variant="filled"
                    />
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Informações da Venda */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Informações da Venda</Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "120px 1fr",
                        rowGap: 2,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        ID:
                    </Typography>
                    <Typography variant="body1">{sale.id}</Typography>

                    <Typography variant="body2" color="text.secondary">
                        Cliente:
                    </Typography>
                    <Typography variant="body1">
                        {sale.client?.name || "-"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        CPF:
                    </Typography>
                    <Typography variant="body1">
                        {sale.client?.cpf || "-"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Data:
                    </Typography>
                    <Typography variant="body1">
                        {sale.createdAt ? new Date(sale.createdAt).toLocaleString('pt-BR') : "-"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Atualizado em:
                    </Typography>
                    <Typography variant="body1">
                        {sale.updatedAt ? new Date(sale.updatedAt).toLocaleString('pt-BR') : "-"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Observações:
                    </Typography>
                    <Typography variant="body1">
                        {sale.notes || "-"}
                    </Typography>
                </Box>
            </Box>

            {/* Protocolo */}
            {sale.protocol && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Protocolo</Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "140px 1fr",
                            rowGap: 1.5,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            ID Protocolo:
                        </Typography>
                        <Typography variant="body1">{sale.protocol.recordNumber}</Typography>

                        {sale.protocol.recordNumber && (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    Número:
                                </Typography>
                                <Typography variant="body1">{sale.protocol.recordNumber}</Typography>
                            </>
                        )}

                        {sale.protocol.book && (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    Livro:
                                </Typography>
                                <Typography variant="body1">{sale.protocol.book}</Typography>
                            </>
                        )}

                        {sale.protocol.page && (
                            <>
                                <Typography variant="body2" color="text.secondary">
                                    Página:
                                </Typography>
                                <Typography variant="body1">{sale.protocol.page}</Typography>
                            </>
                        )}
                    </Box>
                </Box>
            )}

            {/* Produtos */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Produtos ({sale.products?.length || 0})</Typography>
                {sale.products && sale.products.length > 0 ? (
                    sale.products.map((product) => (
                        <Box key={product.id} sx={{
                            p: 2,
                            mb: 1,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'grey.200'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="body1" fontWeight="medium">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {product.productId}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Quantidade: {product.quantity}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Preço unitário: R$ {product.unitPrice?.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" fontWeight="bold">
                                    R$ {product.total?.toFixed(2)}
                                </Typography>
                            </Box>
                            {product.frameDetailsResponse && (
                                <Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: 'grey.300' }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Detalhes da armação
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Nenhum produto nesta venda
                    </Typography>
                )}
            </Box>

            {/* Serviços */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Serviços ({sale.services?.length || 0})</Typography>
                {sale.services && sale.services.length > 0 ? (
                    sale.services.map((service) => (
                        <Box key={service.id} sx={{
                            p: 2,
                            mb: 1,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'grey.200'
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                                    <Typography variant="body1" fontWeight="medium">
                                        {service.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ID: {service.opticalServiceId}
                                    </Typography>
                                </Box>
                                <Typography variant="body1" fontWeight="bold">
                                    R$ {service.price?.toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Nenhum serviço nesta venda
                    </Typography>
                )}
            </Box>

            {/* Resumo Financeiro */}
            <Box sx={{
                p: 3,
                bgcolor: 'primary.50',
                borderRadius: 2,
                border: 1,
                borderColor: 'primary.200',
                maxWidth: 400,
                ml: 'auto'
            }}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>Resumo Financeiro</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto", rowGap: 1, columnGap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Produtos:
                    </Typography>
                    <Typography variant="body2">
                        R$ {sale.products?.reduce((sum, p) => sum + (p.total || 0), 0)?.toFixed(2) || "0,00"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Total Serviços:
                    </Typography>
                    <Typography variant="body2">
                        R$ {sale.services?.reduce((sum, s) => sum + (s.price || 0), 0)?.toFixed(2) || "0,00"}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Desconto:
                    </Typography>
                    <Typography variant="body2" color="error.main">
                        - R$ {sale.discount?.toFixed(2) || "0,00"}
                    </Typography>

                    <Divider sx={{ gridColumn: '1 / -1', my: 1 }} />

                    <Typography variant="body1" fontWeight="bold" color="text.secondary">
                        Total Final:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                        R$ {sale.total?.toFixed(2) || "0,00"}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}