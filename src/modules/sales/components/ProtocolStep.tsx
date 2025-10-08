import { Controller, useFormContext } from "react-hook-form";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Divider,
    FormControlLabel,
    Checkbox,
    Stack,
} from "@mui/material";
import { FileText } from "lucide-react";
import type { CreateSalePayload } from "../types/salesTypes";

export default function ProtocolStep() {
    const { control } = useFormContext<CreateSalePayload>();

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FileText size={22} color="#1976d2" />
                <Typography variant="h6">Protocolo</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                O protocolo é opcional, mas pode ser usado para registrar informações internas
                de controle como número de livro, página ou OS.
            </Typography>

            <Stack spacing={2}>
                {/* Número de Registro */}
                <Controller
                    name="protocol.recordNumber"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Número de Registro"
                            placeholder="Ex: A123"
                        />
                    )}
                />

                {/* Livro e Página */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Controller
                        name="protocol.book"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                size="small"
                                label="Livro"
                                placeholder="Ex: 1"
                            />
                        )}
                    />
                    <Controller
                        name="protocol.page"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                type="number"
                                size="small"
                                label="Página"
                                placeholder="Ex: 20"
                                inputProps={{ min: 0 }}
                            />
                        )}
                    />
                </Stack>

                {/* Ordem de Serviço */}
                <Controller
                    name="protocol.os"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            fullWidth
                            size="small"
                            label="Ordem de Serviço (OS)"
                            placeholder="Ex: OS001"
                        />
                    )}
                />

                {/* Ativo (opcional) */}
                <Controller
                    name="protocol.isActive"
                    control={control}
                    defaultValue={true}
                    render={({ field }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={!!field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                />
                            }
                            label="Protocolo ativo"
                        />
                    )}
                />
            </Stack>
        </Paper>
    );
}
