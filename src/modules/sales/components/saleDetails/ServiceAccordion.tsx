// components/ServiceAccordion.tsx
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, Box, Stack } from "@mui/material";
import { Build, ExpandMore } from "@mui/icons-material";
// 1. IMPORTAR o tipo SaleServiceItem, assim como no ProductAccordion
import type { SaleServiceItem } from "../../types/salesTypes";

// Interface para EmptyState (sem alterações)
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

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

// 2. REMOVER a interface local 'Service'
// interface Service { ... }

// 3. ATUALIZAR a interface de props para usar SaleServiceItem[]
interface ServiceAccordionProps {
    services: SaleServiceItem[];
    expanded: boolean;
    onChange: (isExpanded: boolean) => void;
}

function ServiceAccordion({ services, expanded, onChange }: ServiceAccordionProps) {
    return (
        <Paper sx={{ border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
            <Accordion expanded={expanded} onChange={(_event, isExpanded) => onChange(isExpanded)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Build />
                        <Typography variant="h6" fontWeight="medium">
                            Serviços ({services?.length || 0})
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {services && services.length > 0 ? (
                        <Stack spacing={2}>
                            {/* 4. AJUSTAR o map para usar as propriedades de SaleServiceItem */}
                            {services.map((item) => (
                                <Paper key={item.id} variant="outlined" sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1" fontWeight="medium">
                                                {/* Acessa o nome dentro do objeto aninhado 'service' */}
                                                {item.service?.name || "Serviço não encontrado"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                {/* Acessa o ID dentro do objeto aninhado 'service' */}
                                                ID: {item.service?.id || "N/A"}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" fontWeight="bold" color="primary.main">
                                            {/* Usa o preço diretamente do item */}
                                            R$ {item.service?.price?.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <EmptyState
                            icon={<Build sx={{ fontSize: 48, opacity: 0.3 }} />}
                            title="Nenhum serviço"
                            description="Esta venda não contém serviços"
                        />
                    )}
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
}

export default ServiceAccordion;