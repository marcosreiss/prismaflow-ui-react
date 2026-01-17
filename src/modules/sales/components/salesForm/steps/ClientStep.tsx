import { useState, useMemo, useEffect, type SyntheticEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
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

import PrescriptionModal from "@/modules/clients/components/prescriptionModal/PrescriptionModal";
import type { ClientSelectItem } from "@/modules/clients/types/clientTypes";
import type { Prescription } from "@/modules/clients/types/prescriptionTypes";
import { useGetClients } from "@/modules/clients/hooks/useClient";
import { useGetPrescriptionsByClientId } from "@/modules/clients/hooks/usePrescription";
import type { SalePayload } from "../../../types/salesTypes";
import { useSaleFormContext } from '@/modules/sales/context/useSaleFormContext'; // ← IMPORT ADICIONADO

type PrescriptionOption = Prescription & { label: string };

export default function ClientStep() {
    const { existingSale } = useSaleFormContext(); // ← HOOK ADICIONADO

    const {
        control,
        setValue,
        getValues,
        formState: { errors },
    } = useFormContext<SalePayload>();

    // 🔎 busca local (não vai pro form)
    const [searchValue, setSearchValue] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [selectedClient, setSelectedClient] = useState<ClientSelectItem | null>(null);
    const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionOption | null>(null);
    const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);

    // ============ 🚀 MELHORIA: Hidratação automática do cliente ============
    useEffect(() => {
        // Se tem existingSale com cliente, selecione automaticamente
        if (existingSale?.client && !selectedClient) {
            const clientFromSale: ClientSelectItem = {
                id: existingSale.client.id,
                name: existingSale.client.name || ""
            };
            setSelectedClient(clientFromSale);
        }
    }, [existingSale, selectedClient]);

    // ============ 🔁 Debounce da busca ============
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchValue), 500);
        return () => clearTimeout(t);
    }, [searchValue]);

    // ============ 🔹 Buscar clientes ============
    const { data: clientData, isFetching: isLoadingClients } = useGetClients({
        page: 1,
        limit: 50,
        search: debouncedSearch,
    });
    const clientOptions = useMemo(() => clientData?.data?.content || [], [clientData]);

    // ============ 🔹 Buscar receitas do cliente selecionado ============
    const { data: prescriptionsData } = // ← REMOVIDA variável não usada
        useGetPrescriptionsByClientId({
            clientId: selectedClient?.id ?? 0,
            page: 1,
            limit: 100,
        });

    const prescriptionOptions: PrescriptionOption[] =
        prescriptionsData?.data?.content?.map((p) => ({ // ← ADICIONADO ? opcional
            ...p,
            label: `${p.doctorName || "Médico não informado"} - ${dayjs(
                p.prescriptionDate
            ).format("DD/MM/YYYY")}`,
        })) || [];

    // ============================================================
    // 🧩 Hidratar seleção inicial (modo edição ou ao voltar steps)
    // ============================================================
    useEffect(() => {
        const clientId = getValues("clientId");
        const prescriptionId = getValues("prescriptionId");

        // 🔹 Cliente - MANTIDO como fallback
        if (clientId && !selectedClient) {
            const foundClient = clientOptions.find((c) => c.id === clientId);
            if (foundClient) setSelectedClient(foundClient);
        }

        // 🔹 Receita
        if (prescriptionId && prescriptionsData?.data?.content) {
            const foundPrescription = prescriptionsData.data.content.find(
                (p) => p.id === prescriptionId
            );
            if (foundPrescription) {
                setSelectedPrescription({
                    ...foundPrescription,
                    label: `${foundPrescription.doctorName || "Médico não informado"} - ${dayjs(
                        foundPrescription.prescriptionDate
                    ).format("DD/MM/YYYY")}`,
                });
            }
        }
    }, [clientOptions, prescriptionsData, getValues, selectedClient]);

    // ============================================================
    // 🔹 Manipuladores de seleção
    // ============================================================
    const handleClientChange = (
        _: SyntheticEvent,
        newClient: ClientSelectItem | null,
        onChangeFormClientId: (val: number | null) => void
    ) => {
        setSelectedClient(newClient);
        setSelectedPrescription(null);
        onChangeFormClientId(newClient?.id ?? null);
        setValue("prescriptionId", null);
    };

    const handlePrescriptionChange = (
        _: SyntheticEvent,
        newPrescription: PrescriptionOption | null
    ) => {
        setSelectedPrescription(newPrescription);
        setValue("prescriptionId", newPrescription?.id ?? null);
    };

    const handleClearPrescription = () => {
        setSelectedPrescription(null);
        setValue("prescriptionId", null);
    };

    // ============================================================
    // 🔹 Renderização
    // ============================================================
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
                        onChange={(e, val) => handleClientChange(e, val, field.onChange)} // ← SIMPLIFICADO
                        noOptionsText="Digite para buscar clientes."
                        isOptionEqualToValue={(option, value) => option.id === value.id}
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
                        getOptionLabel={(option) => option.label} // ← REMOVIDO loading não usado
                        value={selectedPrescription}
                        onChange={handlePrescriptionChange}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        freeSolo={false} // impede digitar livremente
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecionar receita existente"
                                placeholder="Selecione uma receita vinculada"
                                size="small"
                                inputProps={{
                                    ...params.inputProps,
                                    readOnly: true, // impede digitar
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                            />
                        )}
                    />
                </Box>
            )}

            {/* Modal de receita */}
            <PrescriptionModal
                open={openPrescriptionModal}
                mode="create"
                clientId={selectedClient?.id || null}
                prescription={null}
                onClose={() => setOpenPrescriptionModal(false)}
                onCreated={(p) => {
                    const newOption: PrescriptionOption = {
                        ...p,
                        label: `${p.doctorName || "Médico não informado"} - ${dayjs(p.prescriptionDate).format(
                            "DD/MM/YYYY"
                        )}`,
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