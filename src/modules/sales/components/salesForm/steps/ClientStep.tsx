import { useState, useMemo, useEffect, type SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
    Box, Typography, Autocomplete, TextField, Button, Stack, CircularProgress,
} from "@mui/material";
import { User, Plus, XCircle } from "lucide-react";
import dayjs from "dayjs";

import PrescriptionModal from "@/modules/clients/components/PrescriptionModal";
import type { ClientSelectItem } from "@/modules/clients/types/clientTypes";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";
import { useSelectClients } from "@/modules/clients/hooks/useClient";
import { useGetPrescriptionsByClientId } from "@/modules/clients/hooks/usePrescription";
import type { CreateSalePayload } from "../../../types/salesTypes";

type PrescriptionOption = Prescription & { label: string };

export default function ClientStep() {
    const {
        control,
        setValue,
        formState: { errors },
    } = useFormContext<CreateSalePayload>();

    // 🔎 busca local (não vai pro form)
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedClient, setSelectedClient] = useState<ClientSelectItem | null>(null);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchValue), 500);
        return () => clearTimeout(t);
    }, [searchValue]);

    // Clientes
    const { data: clientData, isFetching: isLoadingClients } = useSelectClients(debouncedSearch);
    const clientOptions = useMemo(() => clientData?.data || [], [clientData]);

    // Receitas por cliente
    const { data: prescriptionsData, isFetching: isLoadingPrescriptions } =
        useGetPrescriptionsByClientId({
            clientId: selectedClient?.id ?? 0,
            page: 1,
            limit: 100,
        });

    const prescriptionOptions: PrescriptionOption[] =
        prescriptionsData?.data?.content.map((p) => ({
            ...p,
            label: `${p.doctorName || "Médico não informado"} - ${dayjs(p.prescriptionDate).format("DD/MM/YYYY")}`,
        })) || [];

    const handleClientChange = (
        _: SyntheticEvent,
        newClient: ClientSelectItem | null,
        onChangeFormClientId: (val: number | null) => void
    ) => {
        setSelectedClient(newClient);
        setSelectedPrescription(null);
        onChangeFormClientId(newClient?.id ?? null); // escreve no form
        setValue("prescriptionId", null);
    };

    const handlePrescriptionChange = (_: SyntheticEvent, newPrescription: Prescription | null) => {
        setSelectedPrescription(newPrescription);
        setValue("prescriptionId", newPrescription?.id ?? null);
    };

    const handleClearPrescription = () => {
        setSelectedPrescription(null);
        setValue("prescriptionId", null);
    };

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                <User size={22} />
                Selecione o Cliente e Receita
            </Typography>

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
                        getOptionLabel={(option) => option.name || ""}
                        value={selectedClient}
                        onInputChange={(_, value) => setSearchValue(value)}
                        onChange={(e, val) => handleClientChange(e, val, (v) => field.onChange(v))}
                        noOptionsText="Digite para buscar clientes."
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

            {/* Receita (opcional) */}
            {selectedClient && (
                <Box sx={{ mt: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Receita (opcional)
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {selectedPrescription && (
                                <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    startIcon={<XCircle size={16} />}
                                    onClick={handleClearPrescription}
                                >
                                    Limpar
                                </Button>
                            )}
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<Plus size={16} />}
                                onClick={() => setOpenPrescriptionModal(true)}
                            >
                                Nova Receita
                            </Button>
                        </Stack>
                    </Stack>

                    <Autocomplete<PrescriptionOption>
                        fullWidth
                        options={prescriptionOptions}
                        loading={isLoadingPrescriptions}
                        getOptionLabel={(option) => option.label}
                        value={selectedPrescription as PrescriptionOption | null}
                        onChange={handlePrescriptionChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecionar receita existente"
                                placeholder="Selecione uma receita vinculada"
                                size="small"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoadingPrescriptions ? <CircularProgress color="inherit" size={18} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>
            )}

            <PrescriptionModal
                open={openPrescriptionModal}
                mode="create"
                clientId={selectedClient?.id || null}
                prescription={null}
                onClose={() => setOpenPrescriptionModal(false)}
                onCreated={(p) => {
                    setSelectedPrescription(p);
                    setValue("prescriptionId", p.id);
                }}
                onUpdated={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
                onCreateNew={() => { }}
            />
        </Box>
    );
}
