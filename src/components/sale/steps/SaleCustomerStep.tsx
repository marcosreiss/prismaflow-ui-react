import { useFormContext, Controller } from "react-hook-form";
import { useCustomer } from "@/hooks/useCustomer";
import { Box, Typography, Autocomplete, TextField } from "@mui/material";

export default function SaleCustomerStep() {
    const { control, formState: { errors } } = useFormContext(); // 👈 Acessando o contexto
    const { list: { data: customers, isLoading: isLoadingCustomers } } = useCustomer(null);

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 1.5 }}>1. Selecione o Cliente</Typography>
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
                            />
                        )}
                    />
                )}
            />
        </Box>
    );
}