// components/ServiceAccordion.tsx
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, Box, Stack } from "@mui/material";
import { Build, ExpandMore } from "@mui/icons-material";

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

interface Service {
    id: number;
    description: string;
    opticalServiceId: number;
    price: number;
}

interface ServiceAccordionProps {
    services: Service[];
    expanded: boolean;
    onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

function ServiceAccordion({ services, expanded, onChange }: ServiceAccordionProps) {
    return (
        <Paper sx={{ border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
            <Accordion expanded={expanded} onChange={onChange}>
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
                            {services.map((service) => (
                                <Paper key={service.id} variant="outlined" sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1" fontWeight="medium">
                                                {service.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                                ID: {service.opticalServiceId}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" fontWeight="bold" color="primary.main">
                                            R$ {service.price?.toFixed(2)}
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