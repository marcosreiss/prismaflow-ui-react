// components/ProductAccordion.tsx
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, Box, Chip, Stack } from "@mui/material";
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
        <Paper sx={{ border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
            <Accordion expanded={expanded} onChange={(_event, isExpanded) => onChange(isExpanded)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Inventory />
                        <Typography variant="h6" fontWeight="medium">
                            Produtos ({products?.length || 0})
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {products && products.length > 0 ? (
                        <Stack spacing={2}>
                            {products.map((item) => {
                                // ✅ CALCULA os valores baseado no SaleProductItem
                                const unitPrice = item.product?.salePrice || 0;
                                const total = unitPrice * (item.quantity || 1);

                                return (
                                    <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body1" fontWeight="medium">
                                                    {item.product?.name || "Produto não encontrado"}
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                                                    <Chip
                                                        label={`Qtd: ${item.quantity || 1}`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    <Chip
                                                        label={`R$ ${unitPrice.toFixed(2)} un.`}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                    {item.frameDetails && (
                                                        <Chip
                                                            label="Armação"
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    )}
                                                    {item.product?.category && (
                                                        <Chip
                                                            label={item.product.category}
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                        />
                                                    )}
                                                </Box>
                                                {/* Mostrar detalhes da armação se existir */}
                                                {item.frameDetails && (
                                                    <Box sx={{ mt: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Material: {item.frameDetails.material}
                                                            {item.frameDetails.color && ` • Cor: ${item.frameDetails.color}`}
                                                            {item.frameDetails.reference && ` • Ref: ${item.frameDetails.reference}`}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Typography variant="body1" fontWeight="bold" color="primary.main">
                                                R$ {total.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                );
                            })}
                        </Stack>
                    ) : (
                        <EmptyState
                            icon={<Inventory sx={{ fontSize: 48, opacity: 0.3 }} />}
                            title="Nenhum produto"
                            description="Esta venda não contém produtos"
                        />
                    )}
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
}

export default ProductAccordion;