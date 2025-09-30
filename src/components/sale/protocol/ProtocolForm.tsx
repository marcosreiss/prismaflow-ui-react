import { useFormContext, Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import {
    Paper,
    Typography,
    TextField,
    Stack,
    Box,
} from "@mui/material";
import { FileText } from "lucide-react";

export default function ProtocolForm() {
    const { control } = useFormContext<Sale>();

    // Função para garantir que valores null sejam convertidos para string vazia
    const getSafeValue = (value: any): string => {
        return value === null ? '' : value || '';
    };

    return (
        <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={24} />
                Dados do Protocolo
            </Typography>

            <Stack spacing={3}>
                {/* Dados Básicos do Protocolo */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Dados Básicos do Protocolo
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Controller
                            name="protocol.recordNumber"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Número do Registro"
                                    placeholder="PR-2025-001"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            )}
                        />
                        <Controller
                            name="protocol.os"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Ordem de Serviço"
                                    placeholder="OS-9821"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            )}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                        <Controller
                            name="protocol.book"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Livro"
                                    placeholder="Livro A"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            )}
                        />
                        <Controller
                            name="protocol.page"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Página"
                                    type="number"
                                    fullWidth
                                    value={field.value === null ? '' : field.value}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value === '' ? null : parseInt(value, 10));
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </Box>

                {/* Dados da Receita */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Dados da Receita
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Controller
                            name="protocol.prescription.doctorName"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nome do Médico"
                                    placeholder="Dra. Fernanda Lopes"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.crm"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="CRM"
                                    placeholder="CRM-SP-123456"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                    </Stack>
                </Box>

                {/* Dados do Olho Direito (OD) */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Olho Direito (OD)
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Controller
                            name="protocol.prescription.odSpherical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Esférico"
                                    placeholder="-2.00"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.odCylindrical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Cilíndrico"
                                    placeholder="-0.75"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.odAxis"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Eixo"
                                    placeholder="90"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                        <Controller
                            name="protocol.prescription.odDnp"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="DNP"
                                    placeholder="31"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                    </Stack>
                </Box>

                {/* Dados do Olho Esquerdo (OE) */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Olho Esquerdo (OE)
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Controller
                            name="protocol.prescription.oeSpherical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Esférico"
                                    placeholder="-1.50"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.oeCylindrical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Cilíndrico"
                                    placeholder="-0.50"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.oeAxis"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Eixo"
                                    placeholder="85"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                        <Controller
                            name="protocol.prescription.oeDnp"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="DNP"
                                    placeholder="30"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                />
                            )}
                        />
                    </Stack>
                </Box>

                {/* Dados Adicionais */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Controller
                        name="protocol.prescription.addition"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Adição"
                                placeholder="+2.00"
                                fullWidth
                                value={getSafeValue(field.value)}
                            />
                        )}
                    />
                    <Controller
                        name="protocol.prescription.opticalCenter"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Centro Óptico"
                                placeholder="PD 61"
                                fullWidth
                                value={getSafeValue(field.value)}
                            />
                        )}
                    />
                </Stack>
            </Stack>
        </Paper>
    );
}