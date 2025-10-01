/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Paper,
    Typography,
    Box,
    Chip,
    Divider,
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";
import {
    ArrowBack,
    Person,
    Receipt,
    AttachMoney,
    Inventory,
    Build,
    Assignment,
} from "@mui/icons-material";
import { useNotification } from "@/context/NotificationContext";
import { useSaleDetails } from "@/services/useSaleDetails";
import ProductAccordion from "@/components/saleDetails/ProductAccordion";
import ServiceAccordion from "@/components/saleDetails/ServiceAccordion";
import ProtocolAccordion from "@/components/saleDetails/ProtocolAccordion";

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    sx?: any;
}

function InfoCard({ title, children, icon, sx }: InfoCardProps) {
    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.200',
                ...sx,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {icon}
                <Typography variant="h6" fontWeight="medium">
                    {title}
                </Typography>
            </Box>
            {children}
        </Paper>
    );
}


export default function SalesDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const saleId = id ? parseInt(id) : null;
    const { data: apiResponse, isLoading, error } = useSaleDetails(saleId);
    const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

    const sale = (apiResponse as any)?.data;

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

    // No SalesDetailsPage.tsx, antes do return principal
    console.log('Dados da venda:', sale);
    console.log('Protocolo:', sale?.protocol);

    return (
        <Box>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Button onClick={handleBack} startIcon={<ArrowBack />}>
                            Voltar
                        </Button>
                        <Typography variant="h4">Venda #{sale.id}</Typography>
                        {/* <Chip
                            label={sale.isActive ? "Ativa" : "Cancelada"}
                            color={sale.isActive ? "success" : "error"}
                            variant="filled"
                        /> */}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                            icon={<Inventory />}
                            label={`${sale.products?.length || 0} produtos`}
                            variant="outlined"
                            size="small"
                        />
                        <Chip
                            icon={<Build />}
                            label={`${sale.services?.length || 0} serviços`}
                            variant="outlined"
                            size="small"
                        />
                        <Chip
                            icon={<Assignment />}
                            label={`${sale.protocol ? 1 : 0} protocolo`}
                            variant="outlined"
                            size="small"
                        />
                        <Chip
                            icon={<AttachMoney />}
                            label={`R$ ${sale.total?.toFixed(2) || '0,00'}`}
                            color="primary"
                            variant="outlined"
                            size="small"
                        />
                    </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Cliente
                        </Typography>
                        <Typography variant="body1">
                            {sale.client?.name || "-"}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Data
                        </Typography>
                        <Typography variant="body1">
                            {sale.createdAt ? new Date(sale.createdAt).toLocaleDateString('pt-BR') : "-"}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Status
                        </Typography>
                        <Typography variant="body1">
                            {sale.isActive ? "Ativa" : "Finalizada"}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* Layout Principal */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: 3,
                alignItems: 'flex-start'
            }}>
                {/* Coluna da Esquerda - Informações Principais */}
                <Box sx={{ flex: 2 }}>
                    <Stack spacing={3}>
                        {/* Card de Informações da Venda */}
                        <InfoCard title="Informações da Venda" icon={<Receipt />}>
                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                                    gap: 2,
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        ID da Venda
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        #{sale.id}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Data de Criação
                                    </Typography>
                                    <Typography variant="body1">
                                        {sale.createdAt ? new Date(sale.createdAt).toLocaleString('pt-BR') : "-"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Última Atualização
                                    </Typography>
                                    <Typography variant="body1">
                                        {sale.updatedAt ? new Date(sale.updatedAt).toLocaleString('pt-BR') : "-"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Status
                                    </Typography>
                                    <Typography variant="body1">
                                        {sale.isActive ? "🟢 Ativa" : "🔴 Finalizada"}
                                    </Typography>
                                </Box>
                            </Box>
                        </InfoCard>

                        {/* Accordion de Produtos */}
                        <ProductAccordion
                            products={sale.products || []}
                            expanded={expandedAccordion === 'products'}
                            onChange={(isExpanded) => setExpandedAccordion(isExpanded ? 'products' : false)} // ← ASSIM
                        />

                        {/* Accordion de Serviços */}
                        <ServiceAccordion
                            services={sale.services || []}
                            expanded={expandedAccordion === 'services'}
                            onChange={(isExpanded) => setExpandedAccordion(isExpanded ? 'services' : false)}
                        />
                        {/* Accordion de Protocolo */}
                        <ProtocolAccordion
                            protocol={sale.protocol || null}
                            expanded={expandedAccordion === 'protocol'}
                            onChange={(isExpanded) => setExpandedAccordion(isExpanded ? 'protocol' : false)}
                        />

                        {/* Card de Observações (se existir) */}
                        {sale.notes && (
                            <InfoCard title="Observações">
                                <Typography variant="body1">
                                    {sale.notes}
                                </Typography>
                            </InfoCard>
                        )}
                    </Stack>
                </Box>

                {/* Coluna da Direita - Informações Secundárias */}
                <Box sx={{ flex: 1, minWidth: { xs: '100%', lg: 300 } }}>
                    <Stack spacing={3}>
                        <InfoCard title="Cliente" icon={<Person />}>
                            <Stack spacing={1.5}>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        Nome
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {sale.client?.name || "-"}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body2" color="text.secondary">
                                        CPF
                                    </Typography>
                                    <Typography variant="body1">
                                        {sale.client?.cpf || "-"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </InfoCard>

                        <InfoCard title="Resumo Financeiro" icon={<AttachMoney />}>
                            <Stack spacing={1.5}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Subtotal:</Typography>
                                    <Typography variant="body2">
                                        R$ {sale.subtotal?.toFixed(2) || "0,00"}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2">Desconto:</Typography>
                                    <Typography variant="body2" color="error.main">
                                        - R$ {sale.discount?.toFixed(2) || "0,00"}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body1" fontWeight="bold">Total:</Typography>
                                    <Typography variant="body1" fontWeight="bold" color="primary.main">
                                        R$ {sale.total?.toFixed(2) || "0,00"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </InfoCard>
                    </Stack>
                </Box>
            </Box>

            {/* Ações Rápidas */}
            <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={handleBack}>
                        Voltar para Lista
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/sales/edit/${sale.id}`)}
                    >
                        Editar Venda
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}