// Step 1: seleção de cliente, data da venda e receita
import { useState, useMemo, useEffect, type SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
    Box, Typography, Autocomplete, TextField, Button,
    Stack, CircularProgress, Collapse, Paper, IconButton, Tooltip,
    Dialog,
    DialogContent,
    DialogTitle,
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

type PrescriptionOption = Prescription & { label: string };

export default function ClientStep() {
    const { existingSale } = useSaleFormContext();
    const { control, setValue, formState: { errors } } = useFormContext<SalePayload>();

    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState<ClientSelectItem | null>(
        existingSale?.client
            ? { id: existingSale.client.id, name: existingSale.client.name || "" }
            : null
    );
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionOption | null>(null);
    const [previewPrescription, setPreviewPrescription] = useState<PrescriptionOption | null>(null);
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
        const found = prescriptionsData.data.content.find(
            (p) => p.id === existingSale.prescriptionId
        );
        if (found) {
            const option = {
                ...found,
                label: `${found.doctorName || "Médico não informado"} - ${dayjs(found.prescriptionDate).format("DD/MM/YYYY")}`,
            };
            setSelectedPrescription(option);
            setPreviewPrescription(option);
            setShowPreview(false);
        }
    }, [existingSale?.prescriptionId, prescriptionsData]);

    // sincroniza cliente ao voltar de outro step
    useEffect(() => {
        if (selectedClient) return;
        const formClientId = control._formValues?.clientId;
        if (!formClientId || !clientOptions.length) return;
        const found = clientOptions.find((c) => c.id === formClientId);
        if (found) setSelectedClient(found);
    }, [clientOptions, control._formValues?.clientId, selectedClient]);

    const handleClientChange = (
        _: SyntheticEvent,
        newClient: ClientSelectItem | null,
        onChangeFormClientId: (val: number | null) => void
    ) => {
        setSelectedClient(newClient);
        setSelectedPrescription(null);
        setPreviewPrescription(null);
        setShowPreview(false);
        onChangeFormClientId(newClient?.id ?? null);
        setValue("prescriptionId", null);
    };

    const handlePrescriptionChange = (_: SyntheticEvent, newPrescription: PrescriptionOption | null) => {
        setSelectedPrescription(newPrescription);
        setPreviewPrescription(newPrescription);
        setShowPreview(false);
        setValue("prescriptionId", newPrescription?.id ?? null);
    };

    const handleClearPrescription = () => {
        setSelectedPrescription(null);
        setPreviewPrescription(null);
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
                        <Stack direction="row" spacing={1}>
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

                    {/* Select de receita com renderOption para preview inline no dropdown */}
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

                    {/* Preview expandido da receita selecionada */}
                    <Collapse in={showPreview} timeout="auto" unmountOnExit>
                        {previewPrescription && (
                            <Paper variant="outlined" sx={{ p: 2, mt: 1.5, borderRadius: 2 }}>
                                <PrescriptionPreview prescription={previewPrescription} />
                            </Paper>
                        )}
                    </Collapse>
                </Box>
            )}

            {/* Modal de nova receita */}
            <PrescriptionModal
                open={openPrescriptionModal}
                mode="create"
                clientId={selectedClient?.id || null}
                prescription={null}
                onClose={() => setOpenPrescriptionModal(false)}
                onCreated={(p) => {
                    const newOption: PrescriptionOption = {
                        ...p,
                        label: `${p.doctorName || "Médico não informado"} - ${dayjs(p.prescriptionDate).format("DD/MM/YYYY")}`,
                    };
                    setSelectedPrescription(newOption);
                    setPreviewPrescription(newOption);
                    setValue("prescriptionId", p.id);
                    setOpenPrescriptionModal(false);
                }}
                onUpdated={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
                onCreateNew={() => { }}
            />

            {showPreview && previewPrescription && (
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
                        <PrescriptionPreview prescription={previewPrescription} />
                    </DialogContent>
                </Dialog>
            )}
        </Box>
    );
}
