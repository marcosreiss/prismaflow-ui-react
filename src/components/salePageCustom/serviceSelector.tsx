import { useState } from "react";
import type { Service } from "@/types/serviceTypes";
import {
    Autocomplete,
    TextField,
    Button,
    Stack,
    Typography,
    Box,
    Chip,
    Paper,
} from "@mui/material";
import { Plus, Settings } from "lucide-react";

interface ServiceSelectorProps {
    services: Service[];
    isLoading: boolean;
    onAddService: (service: Service) => void;
    disabled?: boolean;
}

export default function ServiceSelector({
    services,
    isLoading,
    onAddService,
    disabled = false
}: ServiceSelectorProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    const handleAddService = () => {
        if (selectedService) {
            onAddService(selectedService);
            setSelectedService(null);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && selectedService) {
            event.preventDefault();
            handleAddService();
        }
    };

    const calculateProfit = (service: Service) => {
        return service.price - service.cost;
    };

    const calculateProfitMargin = (service: Service) => {
        return ((service.price - service.cost) / service.cost) * 100;
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Settings size={24} />
                Adicionar Serviços
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Autocomplete
                        sx={{ flexGrow: 1 }}
                        options={services || []}
                        getOptionLabel={(service) =>
                            `${service.name} - ${service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                        }
                        loading={isLoading}
                        value={selectedService}
                        onChange={(_, newValue) => setSelectedService(newValue)}
                        onKeyPress={handleKeyPress}
                        disabled={disabled}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar serviço"
                                placeholder="Digite o nome do serviço..."
                                fullWidth
                            />
                        )}
                        renderOption={(props, service) => (
                            <li {...props}>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Typography variant="body2" fontWeight="medium">
                                            {service.name}
                                        </Typography>
                                        <Chip
                                            label={service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>

                                    {service.description && (
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                            {service.description}
                                        </Typography>
                                    )}

                                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={`Custo: ${service.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Lucro: ${calculateProfit(service).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                                            size="small"
                                            color="success"
                                            variant="outlined"
                                        />
                                        <Chip
                                            label={`Margem: ${calculateProfitMargin(service).toFixed(1)}%`}
                                            size="small"
                                            color="success"
                                        />
                                    </Box>
                                </Box>
                            </li>
                        )}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleAddService}
                        disabled={!selectedService || disabled}
                        startIcon={<Plus size={18} />}
                        sx={{ height: 56, minWidth: 120 }}
                    >
                        Adicionar
                    </Button>
                </Stack>
            </Paper>

            {/* Informações do Serviço Selecionado */}
            {selectedService && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Settings size={16} />
                        Serviço Selecionado
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                        <Stack spacing={1} sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Nome:</Typography>
                                <Typography variant="body2">{selectedService.name}</Typography>
                            </Box>
                            {selectedService.description && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" fontWeight="medium">Descrição:</Typography>
                                    <Typography variant="body2">{selectedService.description}</Typography>
                                </Box>
                            )}
                        </Stack>

                        <Stack spacing={1} sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Preço de Venda:</Typography>
                                <Typography variant="body2" fontWeight="bold" color="primary.main">
                                    {selectedService.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Custo:</Typography>
                                <Typography variant="body2">
                                    {selectedService.cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" fontWeight="medium">Lucro:</Typography>
                                <Typography variant="body2" color="success.main" fontWeight="bold">
                                    {calculateProfit(selectedService).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    ({calculateProfitMargin(selectedService).toFixed(1)}%)
                                </Typography>
                            </Box>
                        </Stack>
                    </Stack>
                </Paper>
            )}
        </Box>
    );
}