import { Controller } from "react-hook-form";
import type { Sale } from "@/types/saleTypes";
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
} from "@mui/material";
import { User } from "lucide-react";

interface ClientStepProps {
    control: any;
    errors: any;
    customers: any[];
    isLoadingCustomers: boolean;
}

export default function ClientStep({ control, errors, customers, isLoadingCustomers }: ClientStepProps) {
    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <User size={24} />
                Selecione o Cliente
            </Typography>
            <Controller
                name="client"
                control={control}
                rules={{ required: "O cliente é obrigatório" }}
                render={({ field }) => (
                    <Autocomplete
                        {...field}
                        options={customers || []}
                        getOptionLabel={(option) => option.name || ""}
                        loading={isLoadingCustomers}
                        value={customers?.find((c) => c.id === field.value?.id) || null}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar cliente"
                                required
                                error={!!errors.client}
                                helperText={(errors.client?.message as string) || ""}
                                size="medium"
                            />
                        )}
                    />
                )}
            />
        </Box>
    );
}