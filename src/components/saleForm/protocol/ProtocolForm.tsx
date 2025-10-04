import { useFormContext, Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import {
    Paper,
    Typography,
    TextField,
    Stack,
} from "@mui/material";
import { FileText, Eye, EyeOff } from "lucide-react";
import SphericalInput from "@/components/imask/protocolo/SphericalInput";
import CylindricalInput from "@/components/imask/protocolo/CylindricalInput";
import AdditionInput from "@/components/imask/protocolo/AdditionInput";
import AxisInput from "@/components/imask/AxisInput";

export default function ProtocolForm() {
    const { control } = useFormContext<Sale>();

    const getSafeValue = (value: string | number | null | undefined): string => {
        return value === null || value === undefined ? '' : String(value);
    };

    return (
        <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={24} />
                Dados do Protocolo
            </Typography>

            <Stack spacing={3}>
                {/* Dados Básicos do Protocolo - DENTRO DE CARD */}
                <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: 'grey.50' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <FileText size={20} />
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
                </Paper>

                {/* Dados da Receita - DENTRO DE CARD */}
                <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: 'grey.50' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                        <FileText size={20} />
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
                                    onChange={(e) => field.onChange(e.target.value || null)}
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
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            )}
                        />
                    </Stack>
                </Paper>

                {/* Dados do Olho Direito (OD) - DENTRO DE CARD */}
                <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: 'blue.50', borderColor: 'blue.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'blue.700' }}>
                        <Eye size={20} />
                        Olho Direito (OD)
                    </Typography>

                    {/* Dados Principais OD */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Controller
                            name="protocol.prescription.odSpherical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <SphericalInput
                                    {...field}
                                    label="Esférico OD"
                                    fullWidth
                                    helperText="Formato: +0.00 ou -0.00"
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.odCylindrical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CylindricalInput
                                    {...field}
                                    label="Cilíndrico OD"
                                    fullWidth
                                    helperText="Sempre negativo: -0.00"
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.odAxis"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <AxisInput
                                    {...field}
                                    label="Eixo OD"
                                    fullWidth
                                    helperText="Ângulo entre 0° e 180°"
                                />
                            )}
                        />
                    </Stack>

                    {/* Dados Adicionais OD */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                        <Controller
                            name="protocol.prescription.odDnp"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="DNP OD"
                                    placeholder="31"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                    inputProps={{
                                        maxLength: 2,
                                        inputMode: 'numeric',
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </Paper>

                {/* Dados do Olho Esquerdo (OE) - DENTRO DE CARD */}
                <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: 'green.50', borderColor: 'green.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'green.700' }}>
                        <EyeOff size={20} />
                        Olho Esquerdo (OE)
                    </Typography>

                    {/* Dados Principais OE */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Controller
                            name="protocol.prescription.oeSpherical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <SphericalInput
                                    {...field}
                                    label="Esférico OE"
                                    fullWidth
                                    helperText="Formato: +0.00 ou -0.00"
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.oeCylindrical"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <CylindricalInput
                                    {...field}
                                    label="Cilíndrico OE"
                                    fullWidth
                                    helperText="Sempre negativo: -0.00"
                                />
                            )}
                        />
                        <Controller
                            name="protocol.prescription.oeAxis"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <AxisInput
                                    {...field}
                                    label="Eixo OE"
                                    fullWidth
                                    helperText="Ângulo entre 0° e 180°"
                                />
                            )}
                        />
                    </Stack>

                    {/* Dados Adicionais OE */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                        <Controller
                            name="protocol.prescription.oeDnp"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="DNP OE"
                                    placeholder="30"
                                    fullWidth
                                    value={getSafeValue(field.value)}
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                    inputProps={{
                                        maxLength: 2,
                                        inputMode: 'numeric',
                                    }}
                                />
                            )}
                        />
                    </Stack>
                </Paper>

                {/* Dados Adicionais (Binoculares) - DENTRO DE CARD */}
                <Paper variant="outlined" sx={{ p: 2.5, backgroundColor: 'orange.50', borderColor: 'orange.200' }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'orange.700' }}>
                        <FileText size={20} />
                        Dados Binoculares
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Controller
                            name="protocol.prescription.addition"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <AdditionInput
                                    {...field}
                                    label="Adição"
                                    fullWidth
                                    helperText="Formato: +0.00"
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
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            )}
                        />
                    </Stack>
                </Paper>
            </Stack>
        </Paper>
    );
}