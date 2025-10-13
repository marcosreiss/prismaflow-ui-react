// components/ProductAccordion.tsx
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, Box, Chip, Stack, Divider } from "@mui/material";
import { Inventory, ExpandMore } from "@mui/icons-material";
import type { SaleProductItem } from "../../types/salesTypes";

// Interface para EmptyState
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

// EmptyState interno com tipos definidos
function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            {icon}
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
                {description}
            </Typography>
        </Box>
    );
}

interface ProductAccordionProps {
    products: SaleProductItem[];
    expanded: boolean;
    onChange: (expanded: boolean) => void;
}

function ProductAccordion({ products, expanded, onChange }: ProductAccordionProps) {
    return (
        <Paper sx={{
            border: 2, // Aumentei de 1 para 2
            borderColor: 'divider',
            borderRadius: 2,
            overflow: 'hidden'
        }}>
            <Accordion expanded={expanded} onChange={(_event, isExpanded) => onChange(isExpanded)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Inventory />
                        <Typography variant="h6" fontWeight="medium">
                            Produtos ({products?.length || 0})
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0 }}>
                    {products && products.length > 0 ? (
                        <Stack spacing={0}>
                            {products.map((item, index) => {
                                const unitPrice = item.product?.salePrice || 0;
                                const total = unitPrice * (item.quantity || 1);

                                return (
                                    <Box key={item.id}>
                                        <Box sx={{ p: 2.5 }}>
                                            {/* Cabeçalho do produto */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="body1" fontWeight="600" sx={{ mb: 0.5 }}>
                                                        {item.product?.name || "Produto não encontrado"}
                                                    </Typography>

                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                        R$ {total.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.quantity || 1} × R$ {unitPrice.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Informações principais em linha */}
                                            <Box sx={{
                                                display: 'flex',
                                                gap: 2,
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                mb: item.frameDetails ? 2 : 0
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                        Qtd:
                                                    </Typography>
                                                    <Chip
                                                        label={item.quantity || 1}
                                                        size="small"
                                                        color="primary"
                                                        variant="filled"
                                                    />
                                                </Box>

                                                {item.product?.brand?.name && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                            Marca:
                                                        </Typography>
                                                        <Chip
                                                            label={item.product.brand.name}
                                                            size="small"
                                                            variant="outlined"
                                                            color="info"
                                                        />
                                                    </Box>
                                                )}

                                                {item.product?.category && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                            Categoria:
                                                        </Typography>
                                                        <Chip
                                                            label={item.product.category}
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                        />
                                                    </Box>
                                                )}

                                                {item.frameDetails && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                            Tipo:
                                                        </Typography>
                                                        <Chip
                                                            label="Armação"
                                                            size="small"
                                                            color="primary"
                                                            variant="filled"
                                                        />
                                                    </Box>
                                                )}
                                            </Box>

                                            {/* Detalhes da armação com layout organizado */}
                                            {item.frameDetails && (
                                                <Paper variant="outlined" sx={{
                                                    p: 2,
                                                    backgroundColor: 'background.default',
                                                    border: 2, // Borda mais forte aqui também
                                                    borderColor: 'divider'
                                                }}>
                                                    <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 1.5, color: 'primary.main' }}>
                                                        📐 Detalhes da Armação
                                                    </Typography>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        gap: 3,
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                                Material:
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="medium">
                                                                {item.frameDetails.material}
                                                            </Typography>
                                                        </Box>

                                                        {item.frameDetails.color && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                                    Cor:
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    {item.frameDetails.color}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {item.frameDetails.reference && (
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                                                    Referência:
                                                                </Typography>
                                                                <Typography variant="body2" fontWeight="medium">
                                                                    {item.frameDetails.reference}
                                                                </Typography>
                                                            </Box>
                                                        )}
                                                    </Box>
                                                </Paper>
                                            )}
                                        </Box>

                                        {/* Divider entre produtos (exceto o último) - Também mais forte */}
                                        {index < products.length - 1 && (
                                            <Divider sx={{ borderWidth: 1 }} />
                                        )}
                                    </Box>
                                );
                            })}
                        </Stack>
                    ) : (
                        <Box sx={{ p: 3 }}>
                            <EmptyState
                                icon={<Inventory sx={{ fontSize: 48, opacity: 0.3 }} />}
                                title="Nenhum produto"
                                description="Esta venda não contém produtos"
                            />
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
}

export default ProductAccordion;