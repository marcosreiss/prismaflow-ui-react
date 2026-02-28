// Seletor de serviços ópticos com busca paginada
import { useState, useEffect } from "react";
import {
    Autocomplete, TextField, Button, Stack, Typography,
    Box, Chip, Paper, CircularProgress,
} from "@mui/material";
import { Plus, Settings } from "lucide-react";
import type { OpticalService } from "@/modules/opticalservices/types/opticalServiceTypes";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";
import { useGetOpticalServices } from "@/modules/opticalservices/hooks/useOpticalService";

interface ServiceSelectorProps {
    disabled?: boolean;
}

export default function SaleServiceSelector({ disabled = false }: ServiceSelectorProps) {
    const { handleAddService } = useSaleFormContext();
    const [selectedService, setSelectedService] = useState<OpticalService | null>(null);
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    // debounce da busca
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchValue), 400);
        return () => clearTimeout(t);
    }, [searchValue]);

    const { data: servicesResponse, isFetching: isLoading } = useGetOpticalServices({
        page: 1,
        limit: 50,
        search: debouncedSearch,
    });

    const services = servicesResponse?.data?.content || [];

    const handleAdd = () => {
        if (selectedService) {
            handleAddService(selectedService);
            setSelectedService(null);
            setSearchValue("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && selectedService) {
            event.preventDefault();
            handleAdd();
        }
    };

    const formatPrice = (price?: number | null): string =>
        (price ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, service: OpticalService) => (
        <li {...props}>
            <Box sx={{ width: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="body2" fontWeight="medium">
                        {service.name || "Serviço sem nome"}
                    </Typography>
                    <Chip label={formatPrice(service.price)} size="small" color="primary" variant="outlined" />
                </Box>
                {service.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                        {service.description}
                    </Typography>
                )}
            </Box>
        </li>
    );

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <Settings size={24} />
                Adicionar Serviços
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Autocomplete
                        sx={{ flexGrow: 1 }}
                        options={services}
                        getOptionLabel={(s) => `${s.name || "Serviço sem nome"} - ${formatPrice(s.price)}`}
                        loading={isLoading}
                        value={selectedService}
                        inputValue={searchValue}
                        onInputChange={(_, value) => setSearchValue(value)}
                        onChange={(_, newValue) => setSelectedService(newValue)}
                        onKeyPress={handleKeyPress}
                        disabled={disabled}
                        noOptionsText="Nenhum serviço encontrado"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar serviço"
                                placeholder="Digite o nome do serviço..."
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoading ? <CircularProgress color="inherit" size={18} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        renderOption={renderOption}
                    />

                    <Button
                        variant={selectedService ? "contained" : "outlined"}
                        onClick={handleAdd}
                        disabled={!selectedService || disabled}
                        startIcon={<Plus size={18} />}
                        sx={{ height: 56, minWidth: 120 }}
                    >
                        Adicionar
                    </Button>
                </Stack>
            </Paper>

            {/* Preview do serviço selecionado */}
            {selectedService && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "action.hover" }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                        <Settings size={16} />
                        Serviço Selecionado
                    </Typography>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                        <Stack spacing={1} sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" fontWeight="medium">Nome:</Typography>
                                <Typography variant="body2">{selectedService.name}</Typography>
                            </Box>
                            {selectedService.description && (
                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Typography variant="body2" fontWeight="medium">Descrição:</Typography>
                                    <Typography variant="body2" color="text.secondary">{selectedService.description}</Typography>
                                </Box>
                            )}
                        </Stack>
                        <Stack spacing={1} sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body2" fontWeight="medium">Preço:</Typography>
                                <Typography variant="body2" fontWeight="bold" color="primary.main">
                                    {formatPrice(selectedService.price)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Paper>
            )}
        </Box>
    );
}
