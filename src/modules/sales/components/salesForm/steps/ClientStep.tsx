// Step 1: seleção de cliente, data da venda e receita
import { useState, useMemo, useEffect, type SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
    Box, Typography, Autocomplete, TextField, Button,
    Stack, CircularProgress, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent,
} from "@mui/material";
import { User, Plus, XCircle, Eye } from "lucide-react";
import dayjs from "dayjs";

import PrescriptionModal from "@/modules/clients/components/prescriptionModal/PrescriptionModal";
import PrescriptionPreview from "@/modules/sales/components/salesForm/PrescriptionPreview";
import type { ClientSelectItem } from "@/modules/clients/types/clientTypes";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";
import { useGetClients } from "@/modules/clients/hooks/useClient";
import { useGetPrescriptionsByClientId } from "@/modules/clients/hooks/usePrescription";
import type { SalePayload } from "../../../types/salesTypes";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";
import type { PrescriptionOption } from "@/modules/sales/context/SaleFormContext";

export default function ClientStep() {
    const {
        existingSale,
        selectedClient,
        setSelectedClient,
        selectedPrescription,
        setSelectedPrescription,
    } = useSaleFormContext();

    const { control, setValue, formState: { errors } } = useFormContext<SalePayload>();

    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchValue), 500);
        return () => clearTimeout(t);
    }, [searchValue]);

    const { data: clientData, isFetching: isLoadingClients } = useGetClients({
        page: 1, limit: 50, search: debouncedSearch,
    });
    const clientOptions = useMemo(() => clientData?.data?.content || [], [clientData]);

    const { data: prescriptionsData } = useGetPrescriptionsByClientId({
        clientId: selectedClient?.id ?? 0,
        page: 1,
        limit: 100,
    });

    const prescriptionOptions: PrescriptionOption[] =
        prescriptionsData?.data?.content?.map((p) => ({
            ...p,
            label: `${p.doctorName || "Médico não informado"} - ${dayjs(p.prescriptionDate).format("DD/MM/YYYY")}`,
        })) || [];

    // hidrata receita no modo edição
    useEffect(() => {
        if (!existingSale?.prescriptionId || !prescriptionsData?.data?.content) return;
        if (selectedPrescription) return;
        const found = prescriptionsData.data.content.find(
            (p) => p.id === existingSale.prescriptionId
        );
        if (found) {
            setSelectedPrescription({
                ...found,
                label: `${found.doctorName || "Médico não informado"} - ${dayjs(found.prescriptionDate).format("DD/MM/YYYY")}`,
            });
        }
    }, [existingSale?.prescriptionId, prescriptionsData, selectedPrescription, setSelectedPrescription]);

    const handleClientChange = (
        _: SyntheticEvent,
        newClient: ClientSelectItem | null,
        onChangeFormClientId: (val: number | null) => void
    ) => {
        setSelectedClient(newClient);
        setSelectedPrescription(null);
        setShowPreview(false);
        onChangeFormClientId(newClient?.id ?? null);
        setValue("prescriptionId", null);
    };

    const handlePrescriptionChange = (_: SyntheticEvent, newPrescription: PrescriptionOption | null) => {
        setSelectedPrescription(newPrescription);
        setValue("prescriptionId", newPrescription?.id ?? null);
    };

    const handleClearPrescription = () => {
        setSelectedPrescription(null);
        setShowPreview(false);
        setValue("prescriptionId", null);
    };

    const clientNoOptionsText = isLoadingClients
        ? "Buscando..."
        : debouncedSearch.trim().length === 0
            ? "Digite para buscar clientes."
            : "Nenhum cliente encontrado.";

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <User size={22} />
                Selecione o Cliente e Receita
            </Typography>

            {/* Data da venda */}
            <Box sx={{ mb: 3 }}>
                <Controller
                    name="saleDate"
                    control={control}
                    rules={{ required: "Data da venda é obrigatória" }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            type="date"
                            label="Data da Venda"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            InputLabelProps={{ shrink: true }}
                        />
                    )}
                />
            </Box>

            {/* Cliente */}
            <Controller
                name="clientId"
                control={control}
                rules={{ required: "O cliente é obrigatório" }}
                render={({ field }) => (
                    <Autocomplete<ClientSelectItem>
                        fullWidth
                        options={clientOptions}
                        loading={isLoadingClients}
                        loadingText="Buscando clientes..."
                        noOptionsText={clientNoOptionsText}
                        getOptionLabel={(option) => option.name || ""}
                        value={selectedClient}
                        onInputChange={(_, value) => setSearchValue(value)}
                        onChange={(e, val) => handleClientChange(e, val, field.onChange)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        filterOptions={(x) => x}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar cliente"
                                required
                                error={!!errors.clientId}
                                helperText={errors.clientId?.message as string}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoadingClients ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                )}
            />

            {/* Receita */}
            {selectedClient && (
                <Box sx={{ mt: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Receita (opcional)
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {selectedPrescription && (
                                <>
                                    <Tooltip title="Visualizar receita">
                                        <IconButton size="small" onClick={() => setShowPreview(true)}>
                                            <Eye size={16} />
                                        </IconButton>
                                    </Tooltip>
                                    <Button size="small" color="error" variant="outlined"
                                        startIcon={<XCircle size={16} />} onClick={handleClearPrescription}>
                                        Limpar
                                    </Button>
                                </>
                            )}
                            <Button size="small" variant="contained"
                                startIcon={<Plus size={16} />} onClick={() => setOpenPrescriptionModal(true)}>
                                Nova Receita
                            </Button>
                        </Stack>
                    </Stack>

                    <Autocomplete<PrescriptionOption>
                        fullWidth
                        options={prescriptionOptions}
                        getOptionLabel={(option) => option.label}
                        value={selectedPrescription}
                        onChange={handlePrescriptionChange}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        noOptionsText="Nenhuma receita encontrada para este cliente."
                        freeSolo={false}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecionar receita existente"
                                placeholder="Selecione uma receita vinculada"
                                size="small"
                                inputProps={{ ...params.inputProps, readOnly: true }}
                            />
                        )}
                    />
                </Box>
            )}

            {/* Modal de preview da receita */}
            {selectedPrescription && (
                <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Detalhes da Receita</Typography>
                            <IconButton size="small" onClick={() => setShowPreview(false)}>
                                <XCircle size={18} />
                            </IconButton>
                        </Stack>
                    </DialogTitle>
                    <DialogContent dividers>
                        <PrescriptionPreview prescription={selectedPrescription} />
                    </DialogContent>
                </Dialog>
            )}

            {/* Modal de nova receita */}
            <PrescriptionModal
                open={openPrescriptionModal}
                mode="create"
                clientId={selectedClient?.id || null}
                prescription={null}
                onClose={() => setOpenPrescriptionModal(false)}
                onCreated={(p: Prescription) => {
                    const newOption: PrescriptionOption = {
                        ...p,
                        label: `${p.doctorName || "Médico não informado"} - ${dayjs(p.prescriptionDate).format("DD/MM/YYYY")}`,
                    };
                    setSelectedPrescription(newOption);
                    setValue("prescriptionId", p.id);
                    setOpenPrescriptionModal(false);
                }}
                onUpdated={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
                onCreateNew={() => { }}
            />
        </Box>
    );
}
