// components/ProtocolAccordion.tsx
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, Box, Chip, Stack, Card, CardContent } from "@mui/material";
import { Assignment, ExpandMore, MedicalServices, Visibility, VisibilityOff } from "@mui/icons-material";

// 1. IMPORTAR os tipos de uma fonte de verdade única
import type { Protocol } from '../../types/salesTypes'; // <-- Ajuste o caminho se necessário
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";

// ===================================================================
// SUBCOMPONENTES
// ===================================================================

// EmptyState: Exibido quando não há dados
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            {icon}
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>{title}</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>{description}</Typography>
        </Box>
    );
}

// EyePrescriptionData: Exibe os detalhes da prescrição para um olho (Direito ou Esquerdo)
function EyePrescriptionData({ title, data, eyePrefix }: { title: string; data: Prescription; eyePrefix: 'od' | 'oe' }) {
    const fields = [
        { key: `${eyePrefix}Spherical`, label: 'Esférico' },
        { key: `${eyePrefix}Cylindrical`, label: 'Cilíndrico' },
        { key: `${eyePrefix}Axis`, label: 'Eixo' },
        { key: `${eyePrefix}Dnp`, label: 'DNP' },
    ];

    // Mapeamento para campos de adição e centro óptico
    const additionalFields = eyePrefix === 'od'
        ? [
            { key: 'additionRight', label: 'Adição' },
            { key: 'opticalCenterRight', label: 'Centro Óptico' },
        ]
        : [
            { key: 'additionLeft', label: 'Adição' },
            { key: 'opticalCenterLeft', label: 'Centro Óptico' },
        ];

    const allFields = [...fields, ...additionalFields];

    // Filtra para mostrar apenas os campos que têm valor
    const validFields = allFields.filter(field => data[field.key as keyof Prescription]);

    if (validFields.length === 0) return null;

    return (
        <Card variant="outlined" sx={{ flex: 1, minWidth: '250px' }}>
            <CardContent>
                <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 2 }}>
                    {validFields.map(({ key, label }) => (
                        <Box key={key}>
                            <Typography variant="body2" color="text.secondary">{label}</Typography>
                            <Typography variant="body1">{data[key as keyof Prescription]}</Typography>
                        </Box>
                    ))}
                </Box>
            </CardContent>
        </Card>
    );
}


// ===================================================================
// COMPONENTE PRINCIPAL
// ===================================================================

// 2. ATUALIZAR as props para aceitar Protocol e Prescription separadamente
interface ProtocolAccordionProps {
    protocol: Protocol | null;
    prescription: Prescription | null;
    expanded: boolean;
    onChange: (isExpanded: boolean) => void;
}

function ProtocolAccordion({ protocol, prescription, expanded, onChange }: ProtocolAccordionProps) {
    const hasProtocol = protocol && Object.values(protocol).some(v => v != null && v !== '');
    const hasPrescription = !!prescription;

    return (
        <Paper sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
            <Accordion expanded={expanded} onChange={(_event, isExpanded) => onChange(isExpanded)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment />
                        <Typography variant="h6" fontWeight="medium">
                            Protocolo e Prescrição
                        </Typography>
                        {hasPrescription && (
                            <Chip
                                icon={<MedicalServices />}
                                label="Com prescrição"
                                color="info"
                                size="small"
                                sx={{ ml: 1 }}
                            />
                        )}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {!hasProtocol && !hasPrescription ? (
                        <EmptyState
                            icon={<Assignment sx={{ fontSize: 48, opacity: 0.3 }} />}
                            title="Nenhum dado"
                            description="Esta venda não possui protocolo ou prescrição associada."
                        />
                    ) : (
                        <Stack spacing={3}>
                            {/* Seção do Protocolo */}
                            {hasProtocol && (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                            Informações do Protocolo
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                                            {protocol.recordNumber && <Box><Typography variant="caption" color="text.secondary">Registro</Typography><Typography>{protocol.recordNumber}</Typography></Box>}
                                            {protocol.book && <Box><Typography variant="caption" color="text.secondary">Livro</Typography><Typography>{protocol.book}</Typography></Box>}
                                            {protocol.page && <Box><Typography variant="caption" color="text.secondary">Página</Typography><Typography>{protocol.page}</Typography></Box>}
                                            {protocol.os && <Box><Typography variant="caption" color="text.secondary">Ordem de Serviço</Typography><Typography>{protocol.os}</Typography></Box>}
                                        </Box>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Seção da Prescrição */}
                            {hasPrescription && (
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <MedicalServices />
                                        Prescrição Médica
                                    </Typography>
                                    <Stack spacing={2}>
                                        {(prescription.doctorName || prescription.crm) && (
                                            <Card variant="outlined">
                                                <CardContent>
                                                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Dados do Médico</Typography>
                                                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mt: 2 }}>
                                                        {prescription.doctorName && <Box><Typography variant="caption" color="text.secondary">Nome</Typography><Typography>{prescription.doctorName}</Typography></Box>}
                                                        {prescription.crm && <Box><Typography variant="caption" color="text.secondary">CRM</Typography><Typography>{prescription.crm}</Typography></Box>}
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        )}
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <EyePrescriptionData title="Olho Direito (OD)" data={prescription} eyePrefix="od" />
                                            <EyePrescriptionData title="Olho Esquerdo (OE)" data={prescription} eyePrefix="oe" />
                                        </Box>
                                        <Chip
                                            icon={prescription.isActive ? <Visibility /> : <VisibilityOff />}
                                            label={prescription.isActive ? "Prescrição Ativa" : "Prescrição Inativa"}
                                            color={prescription.isActive ? "success" : "default"}
                                            variant="outlined"
                                            sx={{ maxWidth: 'fit-content' }}
                                        />
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    )}
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
}

export default ProtocolAccordion;