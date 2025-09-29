import { useFormContext, Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import {
    Paper,
    Typography,
    TextField,
    Stack,
    Box,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { FileText } from "lucide-react";

export default function ProtocolForm() {
    const { control } = useFormContext<Sale>();

    return (
        <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FileText size={24} />
                Dados do Protocolo
            </Typography>

            <Stack spacing={3}>
                {/* Dados Básicos do Protocolo */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="protocol.recordNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Número do Registro"
                                    placeholder="PR-2025-001"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="protocol.os"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Ordem de Serviço"
                                    placeholder="OS-9821"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="protocol.book"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Livro"
                                    placeholder="Livro A"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="protocol.page"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Página"
                                    type="number"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Dados da Receita */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Dados da Receita
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="protocol.prescription.doctorName"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Nome do Médico"
                                        placeholder="Dra. Fernanda Lopes"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="protocol.prescription.crm"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="CRM"
                                        placeholder="CRM-SP-123456"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Dados do Olho Direito (OD) */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Olho Direito (OD)
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="protocol.prescription.odSpherical"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Esférico"
                                        placeholder="-2.00"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="protocol.prescription.odCylindrical"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Cilíndrico"
                                        placeholder="-0.75"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="protocol.prescription.odAxis"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Eixo"
                                        placeholder="90"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="protocol.prescription.odDnp"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="DNP"
                                        placeholder="31"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Dados do Olho Esquerdo (OE) */}
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Olho Esquerdo (OE)
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="protocol.prescription.oeSpherical"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Esférico"
                                        placeholder="-1.50"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="protocol.prescription.oeCylindrical"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Cilíndrico"
                                        placeholder="-0.50"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Controller
                                name="protocol.prescription.oeAxis"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Eixo"
                                        placeholder="85"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Controller
                                name="protocol.prescription.oeDnp"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="DNP"
                                        placeholder="30"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Dados Adicionais */}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="protocol.prescription.addition"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Adição"
                                    placeholder="+2.00"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Controller
                            name="protocol.prescription.opticalCenter"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Centro Óptico"
                                    placeholder="PD 61"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Stack>
        </Paper>
    );
}