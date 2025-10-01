// components/ProductAccordion.tsx
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, Box, Chip, Stack } from "@mui/material";
import { Inventory, ExpandMore } from "@mui/icons-material";

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

interface Product {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    frameDetailsResponse?: object;
}

interface ProductAccordionProps {
    products: Product[];
    expanded: boolean;
    onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

function ProductAccordion({ products, expanded, onChange }: ProductAccordionProps) {
    return (
        <Paper sx={{ border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
            <Accordion expanded={expanded} onChange={onChange}>
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
                            {products.map((product) => (
                                <Paper key={product.id} variant="outlined" sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1" fontWeight="medium">
                                                {product.name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                                                <Chip
                                                    label={`Qtd: ${product.quantity}`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                <Chip
                                                    label={`R$ ${product.unitPrice?.toFixed(2)} un.`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                                {product.frameDetailsResponse && (
                                                    <Chip
                                                        label="Armação"
                                                        size="small"
                                                        color="primary"
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                        <Typography variant="body1" fontWeight="bold" color="primary.main">
                                            R$ {product.total?.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}
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