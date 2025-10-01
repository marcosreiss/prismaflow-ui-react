import { useFormContext, Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import { FrameMaterialTypeLabels } from "@/types/frameDetailsTypes";
import {
    Paper,
    Typography,
    TextField,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Glasses } from "lucide-react";

interface FrameDetailsFormProps {
    index: number;
}

export default function FrameDetailsForm({ index }: FrameDetailsFormProps) {
    const { control } = useFormContext<Sale>();

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Glasses size={18} />
                Detalhes da Armação
            </Typography>

            <Stack spacing={2}>
                <Controller
                    name={`productItems.${index}.frameDetails.reference`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Referência"
                            placeholder="RB1234"
                            fullWidth
                            size="small"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || null)}
                        />
                    )}
                />

                <Controller
                    name={`productItems.${index}.frameDetails.color`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Cor"
                            placeholder="Preto Fosco"
                            fullWidth
                            size="small"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || null)}
                        />
                    )}
                />

                <Controller
                    name={`productItems.${index}.frameDetails.material`}
                    control={control}
                    defaultValue="ACETATE" // ✅ VALOR PADRÃO OBRIGATÓRIO
                    rules={{ required: "O material é obrigatório" }}
                    render={({ field, fieldState: { error } }) => (
                        <FormControl fullWidth size="small" error={!!error}>
                            <InputLabel>Tipo de Material *</InputLabel>
                            <Select
                                {...field}
                                label="Tipo de Material *"
                                value={field.value || "ACETATE"} // ✅ Garante valor sempre definido
                            >
                                {Object.entries(FrameMaterialTypeLabels).map(([value, label]) => (
                                    <MenuItem key={value} value={value}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error && (
                                <Typography variant="caption" color="error">
                                    {error.message}
                                </Typography>
                            )}
                        </FormControl>
                    )}
                />
            </Stack>
        </Paper>
    );
}