// components/ProtocolAccordion.tsx
import { Accordion, AccordionSummary, AccordionDetails, Paper, Typography, Box, Chip, Stack, Divider } from "@mui/material";
import { Assignment, ExpandMore, MedicalServices } from "@mui/icons-material";

// Interface para EmptyState
interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

// Interface para Prescription com a estrutura real
interface Prescription {
    id?: number;
    doctorName?: string;
    crm?: string;
    addition?: string;
    opticalCenter?: string;
    odSpherical?: string;
    odCylindrical?: string;
    odAxis?: string;
    odDnp?: string;
    oeSpherical?: string;
    oeCylindrical?: string;
    oeAxis?: string;
    oeDnp?: string;
    [key: string]: string | number | undefined;
}

// Interface para Protocol
interface Protocol {
    id?: number;
    recordNumber?: string | null;
    book?: string | null;
    page?: string | null;
    os?: string | null;
    createdAt?: string;
    updatedAt?: string;
    prescription?: Prescription | null;
}

interface ProtocolAccordionProps {
    protocol: Protocol | null;
    expanded: boolean;
    onChange: (isExpanded: boolean) => void; // ← ASSIM
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

// Componente para exibir dados dos olhos com a estrutura real
function EyePrescriptionData({ title, data, prefix }: { title: string; data?: Prescription; prefix: string }) {
    if (!data) return null;

    const eyeFields = [
        { key: `${prefix}Spherical`, label: 'Esférico' },
        { key: `${prefix}Cylindrical`, label: 'Cilíndrico' },
        { key: `${prefix}Axis`, label: 'Eixo' },
        { key: `${prefix}Dnp`, label: 'DNP' },
    ];

    const validFields = eyeFields.filter(field => data[field.key]);

    if (validFields.length === 0) return null;

    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 }}>
                {validFields.map((field) => (
                    <Typography key={field.key} variant="body2">
                        <strong>{field.label}:</strong> {data[field.key]}
                    </Typography>
                ))}
            </Box>
        </Box>
    );
}

// Interface para a função renderAllFields
interface RenderableObject {
    [key: string]: string | number | null | undefined;
}

function ProtocolAccordion({ protocol, expanded, onChange }: ProtocolAccordionProps) {


    // Verifica se protocol existe e tem dados válidos
    const hasValidProtocol = protocol && (
        protocol.id ||
        protocol.recordNumber ||
        protocol.book ||
        protocol.page ||
        protocol.os ||
        protocol.prescription
    );

    const hasPrescription = protocol?.prescription;

    // Converte prescription null para undefined para compatibilidade
    const prescriptionData = protocol?.prescription || undefined;

    // Função para mostrar todos os campos disponíveis de um objeto
    const renderAllFields = (obj: RenderableObject | null, title: string, excludeFields: string[] = []) => {
        if (!obj) return null;

        const validFields = Object.entries(obj).filter(([key, value]) =>
            value !== null &&
            value !== undefined &&
            value !== '' &&
            !excludeFields.includes(key)
        );

        if (validFields.length === 0) return null;

        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                    {title}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                    {validFields.map(([key, value]) => {
                        let displayKey = key;
                        let displayValue = value;

                        // Formatações específicas para datas
                        if (key.includes('Date') || key.includes('date') || key === 'createdAt' || key === 'updatedAt') {
                            try {
                                displayValue = new Date(value as string).toLocaleString('pt-BR');
                            } catch {
                                displayValue = value;
                            }
                        }

                        // Traduz as chaves para português
                        const translations: { [key: string]: string } = {
                            'doctorName': 'Nome do Médico',
                            'crm': 'CRM',
                            'addition': 'Adição',
                            'opticalCenter': 'Centro Óptico',
                            'recordNumber': 'Número do Registro',
                            'os': 'Ordem de Serviço',
                            'id': 'ID',
                            'book': 'Livro',
                            'page': 'Página',
                        };

                        displayKey = translations[key] || key.charAt(0).toUpperCase() + key.slice(1);

                        return (
                            <Box key={key}>
                                <Typography variant="body2" color="text.secondary">
                                    {displayKey}
                                </Typography>
                                <Typography variant="body1" fontWeight={key === 'id' || key === 'doctorName' ? 'medium' : 'normal'}>
                                    {displayValue as string}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        );
    };

    return (
        <Paper sx={{ border: 1, borderColor: 'grey.200', borderRadius: 2 }}>
            <Accordion expanded={expanded} onChange={(_event, isExpanded) => onChange(isExpanded)}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Assignment />
                        <Typography variant="h6" fontWeight="medium">
                            Protocolo ({hasValidProtocol ? 1 : 0})
                            {hasPrescription && (
                                <Chip
                                    icon={<MedicalServices />}
                                    label="Com prescrição"
                                    color="info"
                                    size="small"
                                    sx={{ ml: 1 }}
                                />
                            )}
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    {hasValidProtocol ? (
                        <Stack spacing={3}>
                            {/* Seção do Protocolo */}
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Assignment />
                                    Informações do Protocolo
                                </Typography>

                                {/* Chips com informações principais */}
                                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                                    {protocol.id && (
                                        <Chip
                                            label={`ID: ${protocol.id}`}
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                        />
                                    )}
                                    {protocol.recordNumber && (
                                        <Chip
                                            label={`Registro: ${protocol.recordNumber}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                    {protocol.book && (
                                        <Chip
                                            label={`Livro: ${protocol.book}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                    {protocol.page && (
                                        <Chip
                                            label={`Página: ${protocol.page}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                    {protocol.os && (
                                        <Chip
                                            label={`OS: ${protocol.os}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    )}
                                </Box>

                                {/* Mostra TODOS os campos do protocolo */}
                                {renderAllFields(protocol as RenderableObject, 'Detalhes do Protocolo', ['prescription'])}
                            </Box>

                            {/* Seção da Prescrição Médica */}
                            {hasPrescription && (
                                <>
                                    <Divider />

                                    <Box>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MedicalServices />
                                            Prescrição Médica
                                        </Typography>

                                        {/* Dados do Médico */}
                                        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                Dados do Médico
                                            </Typography>
                                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                                {prescriptionData?.doctorName && (
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Nome do Médico
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {prescriptionData.doctorName}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                {prescriptionData?.crm && (
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            CRM
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {prescriptionData.crm}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Dados da Prescrição */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 3 }}>
                                            <EyePrescriptionData
                                                title="Olho Direito (OD)"
                                                data={prescriptionData}
                                                prefix="od"
                                            />
                                            <EyePrescriptionData
                                                title="Olho Esquerdo (OE)"
                                                data={prescriptionData}
                                                prefix="oe"
                                            />
                                        </Box>

                                        {/* Dados Adicionais */}
                                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                                            {prescriptionData?.addition && (
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Adição
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {prescriptionData.addition}
                                                    </Typography>
                                                </Box>
                                            )}
                                            {prescriptionData?.opticalCenter && (
                                                <Box>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Centro Óptico
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {prescriptionData.opticalCenter}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>

                                        {/* Mostra outros campos da prescrição que não foram exibidos */}
                                        {renderAllFields(
                                            prescriptionData as RenderableObject,
                                            'Outras Informações',
                                            ['doctorName', 'crm', 'addition', 'opticalCenter', 'odSpherical', 'odCylindrical', 'odAxis', 'odDnp', 'oeSpherical', 'oeCylindrical', 'oeAxis', 'oeDnp']
                                        )}
                                    </Box>
                                </>
                            )}
                        </Stack>
                    ) : (
                        <EmptyState
                            icon={<Assignment sx={{ fontSize: 48, opacity: 0.3 }} />}
                            title="Nenhum protocolo"
                            description="Esta venda não possui protocolo associado"
                        />
                    )}
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
}

export default ProtocolAccordion;