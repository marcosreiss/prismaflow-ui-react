import { useState, useMemo, useEffect, type SyntheticEvent } from "react";
import {
    Controller,
    useFormContext,
    type Control,
    type FieldErrors,
} from "react-hook-form";
import {
    Box,
    Typography,
    Autocomplete,
    TextField,
    Button,
    Stack,
    CircularProgress,
} from "@mui/material";
import { User, Plus, XCircle } from "lucide-react";
import dayjs from "dayjs";

import PrescriptionModal from "@/modules/clients/components/PrescriptionModal";
import type { ClientSelectItem } from "@/modules/clients/types/clientTypes";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";
import { useSelectClients } from "@/modules/clients/hooks/useClient";
import { useGetPrescriptionsByClientId } from "@/modules/clients/hooks/usePrescription";
import type { CreateSalePayload } from "../../../types/salesTypes";

interface ClientStepProps {
    control: Control<CreateSalePayload>;
    errors: FieldErrors<CreateSalePayload>;
}

type PrescriptionOption = Prescription & { label: string };

/**
 * Step 1 — Seleção de Cliente + Receita (com debounce de busca)
 */
export default function ClientStep({ control, errors }: ClientStepProps) {
    const { setValue, watch, handleSubmit } = useFormContext();

    // Campo auxiliar de busca
    const searchName = watch("clientSearch") || "";
    const [debouncedSearch, setDebouncedSearch] = useState(searchName);

    const [selectedClient, setSelectedClient] = useState<ClientSelectItem | null>(
        null
    );
    const [selectedPrescription, setSelectedPrescription] =
        useState<Prescription | null>(null);
    const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);

    // ==============================
    // ⏱️ Debounce (500 ms)
    // ==============================
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchName);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchName]);

    // ==============================
    // 🔹 Busca de clientes (autocomplete)
    // ==============================
    const {
        data: clientData,
        isFetching: isLoadingClients,
    } = useSelectClients(debouncedSearch);

    const clientOptions = useMemo(() => clientData?.data || [], [clientData]);

    // ==============================
    // 🔹 Busca de receitas por cliente
    // ==============================
    const {
        data: prescriptionsData,
        isFetching: isLoadingPrescriptions,
    } = useGetPrescriptionsByClientId({
        clientId: selectedClient?.id ?? 0,
        page: 1,
        limit: 100,
    });

    const prescriptionOptions: PrescriptionOption[] =
        prescriptionsData?.data?.content.map((p) => ({
            ...p,
            label: `${p.doctorName || "Médico não informado"} - ${dayjs(
                p.prescriptionDate
            ).format("DD/MM/YYYY")}`,
        })) || [];

    // ==============================
    // 🔹 Ações
    // ==============================
    const handleClientChange = (
        _: SyntheticEvent<Element, Event>,
        newClient: ClientSelectItem | null
    ) => {
        setSelectedClient(newClient);
        setSelectedPrescription(null);
        setValue("clientId", newClient?.id ?? null);
        setValue("prescriptionId", null);
    };

    const handlePrescriptionChange = (
        _: SyntheticEvent<Element, Event>,
        newPrescription: Prescription | null
    ) => {
        setSelectedPrescription(newPrescription);
        setValue("prescriptionId", newPrescription?.id ?? null);
    };

    const handleClearPrescription = () => {
        setSelectedPrescription(null);
        setValue("prescriptionId", null);
    };

    const handleCreatedPrescription = (newPrescription: Prescription) => {
        setSelectedPrescription(newPrescription);
        setValue("prescriptionId", newPrescription.id);
        setOpenPrescriptionModal(false);
    };

    // ==============================
    // 🚀 (Opcional) Submeter após debounce
    // ==============================
    useEffect(() => {
        if (debouncedSearch.trim()) {
            handleSubmit(() => {
                // console.log("Submit automático após debounce:", debouncedSearch);
            })();
        }
    }, [debouncedSearch, handleSubmit]);

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <Box>
            <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
                <User size={22} />
                Selecione o Cliente e Receita
            </Typography>

            {/* ==========================
                🔹 Selecionar Cliente
                ========================== */}
            <Controller
                name="clientId"
                control={control}
                rules={{ required: "O cliente é obrigatório" }}
                render={({ field }) => (
                    <Autocomplete
                        {...field}
                        fullWidth
                        options={clientOptions}
                        loading={isLoadingClients}
                        getOptionLabel={(option) => option.name || ""}
                        value={selectedClient}
                        onInputChange={(_, value) => setValue("clientSearch", value)}
                        onChange={handleClientChange}
                        noOptionsText={"Digite para buscar clientes."}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar cliente"
                                required
                                error={!!errors.clientId}
                                helperText={errors.clientId?.message as string}
                                size="medium"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isLoadingClients ? (
                                                <CircularProgress color="inherit" size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                )}
            />

            {/* ==========================
          🔹 Selecionar Receita (opcional)
          ========================== */}
            {selectedClient && (
                <Box sx={{ mt: 3 }}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 1 }}
                    >
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
                                            {isLoadingPrescriptions ? (
                                                <CircularProgress color="inherit" size={18} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>
            )}

            {/* ==========================
          🔹 Modal de Receita
          ========================== */}
            <PrescriptionModal
                open={openPrescriptionModal}
                mode="create"
                clientId={selectedClient?.id || null}
                prescription={null}
                onClose={() => setOpenPrescriptionModal(false)}
                onCreated={handleCreatedPrescription}
                onUpdated={() => { }}
                onEdit={() => { }}
                onDelete={() => { }}
                onCreateNew={() => { }}
            />
        </Box>
    );
}
