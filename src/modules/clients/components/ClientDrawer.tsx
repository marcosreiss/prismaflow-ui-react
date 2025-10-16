import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    TextField,
    CircularProgress,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { X, Pencil, Trash2, Eye } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useClientDrawerController } from "../hooks/useClientDrawerController";
import type { Client } from "../types/clientTypes";
import { GenderLabels, type Gender } from "../types/clientTypes";

// ==========================
// 🔹 Tipagens e Props
// ==========================
type DrawerMode = "create" | "edit" | "view";

interface ClientDrawerProps {
    open: boolean;
    mode: DrawerMode;
    client?: Client | null;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (client: Client) => void;
    onCreated: (client: Client) => void;
    onUpdated: (client: Client) => void;
    onCreateNew: () => void;
}

// ==========================
// 🔹 Componente principal
// ==========================
export default function ClientDrawer({
    open,
    mode,
    client,
    onClose,
    onEdit,
    onDelete,
    onCreated,
    onUpdated,
    onCreateNew,
}: ClientDrawerProps) {
    const navigate = useNavigate();

    const {
        methods,
        inputRef,
        onSubmit,
        isCreate,
        isEdit,
        isView,
        creating,
        updating,
    } = useClientDrawerController({
        mode,
        client,
        open,
        onCreated,
        onUpdated,
    });

    const title = isCreate
        ? "Adicionar cliente"
        : isEdit
            ? "Editar cliente"
            : client?.name || "Cliente";

    // ==========================
    // 🔹 Render
    // ==========================
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
                sx: {
                    width: { xs: "100%", sm: 600, md: 700 },
                    maxWidth: "100vw",
                    p: { xs: 2, sm: 3 },
                },
            }}
        >
            {/* ========================== */}
            {/* 🔹 Header */}
            {/* ========================== */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                }}
            >
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* ========================== */}
            {/* 🔹 Conteúdo principal */}
            {/* ========================== */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 120px)",
                    pb: 3,
                }}
            >
                {/* ========================== */}
                {/* 🔸 MODO VIEW */}
                {/* ========================== */}
                {isView && client && (
                    <Box>
                        <Stack direction="row" spacing={1} mb={2}>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Pencil size={14} />}
                                onClick={onEdit}
                            >
                                Editar
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Trash2 size={14} />}
                                onClick={() => onDelete(client)}
                            >
                                Remover
                            </Button>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Eye size={14} />}
                                onClick={() =>
                                    navigate(`/clients/${client.id}/prescriptions`)
                                }
                            >
                                Ver receitas
                            </Button>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        <Stack spacing={1}>
                            <Row label="Nome" value={client.name} />
                            <Row label="Apelido" value={client.nickname} />
                            <Row label="CPF" value={client.cpf} />
                            <Row label="RG" value={client.rg} />
                            <Row
                                label="Data de nascimento"
                                value={
                                    client.bornDate
                                        ? new Date(client.bornDate).toLocaleDateString("pt-BR")
                                        : "-"
                                }
                            />
                            <Row
                                label="Gênero"
                                value={
                                    client.gender
                                        ? GenderLabels[client.gender as Gender]
                                        : null
                                }
                            />
                            <Row label="Pai" value={client.fatherName} />
                            <Row label="Mãe" value={client.motherName} />
                            <Row label="Cônjuge" value={client.spouse} />
                            <Row label="Empresa" value={client.company} />
                            <Row label="Ocupação" value={client.occupation} />
                            <Row label="E-mail" value={client.email} />
                            <Row label="Telefone 1" value={client.phone01} />
                            <Row label="Telefone 2" value={client.phone02} />
                            <Row label="Telefone 3" value={client.phone03} />
                            <Row label="Referência 1" value={client.reference01} />
                            <Row label="Referência 2" value={client.reference02} />
                            <Row label="Referência 3" value={client.reference03} />
                            <Row label="Rua" value={client.street} />
                            <Row label="Número" value={client.number} />
                            <Row label="Bairro" value={client.neighborhood} />
                            <Row label="Complemento" value={client.complement} />
                            <Row label="Cidade" value={client.city} />
                            <Row label="UF" value={client.uf} />
                            <Row label="CEP" value={client.cep} />
                            <Row
                                label="Negativado"
                                value={client.isBlacklisted ? "Sim" : "Não"}
                            />
                            <Row label="Observações" value={client.obs} />
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                methods.reset();
                                onCreateNew();
                            }}
                        >
                            Adicionar novo cliente
                        </Button>
                    </Box>
                )}

                {/* ========================== */}
                {/* 🔸 MODO CREATE / EDIT */}
                {/* ========================== */}
                {(isCreate || isEdit) && (
                    <FormProvider {...methods}>
                        <form onSubmit={onSubmit}>
                            <Stack spacing={3}>
                                {/* Seção: Dados pessoais */}
                                <SectionTitle title="Dados pessoais" />
                                <Stack spacing={2}>
                                    <TextField
                                        label="Nome completo"
                                        fullWidth
                                        inputRef={inputRef}
                                        size="small"
                                        {...methods.register("name", { required: true })}
                                    />
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <TextField
                                            label="Apelido"
                                            fullWidth
                                            size="small"
                                            {...methods.register("nickname")}
                                        />
                                        <TextField
                                            label="CPF"
                                            fullWidth
                                            size="small"
                                            {...methods.register("cpf")}
                                        />
                                        <TextField
                                            label="RG"
                                            fullWidth
                                            size="small"
                                            {...methods.register("rg")}
                                        />
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <TextField
                                            label="Data de nascimento"
                                            type="date"
                                            fullWidth
                                            size="small"
                                            InputLabelProps={{ shrink: true }}
                                            {...methods.register("bornDate")}
                                        />
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Gênero</InputLabel>
                                            <Select
                                                label="Gênero"
                                                defaultValue="OTHER"
                                                {...methods.register("gender")}
                                            >
                                                {Object.entries(GenderLabels).map(([key, label]) => (
                                                    <MenuItem key={key} value={key}>
                                                        {label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <TextField
                                        label="Nome do pai"
                                        fullWidth
                                        size="small"
                                        {...methods.register("fatherName")}
                                    />
                                    <TextField
                                        label="Nome da mãe"
                                        fullWidth
                                        size="small"
                                        {...methods.register("motherName")}
                                    />
                                    <TextField
                                        label="Cônjuge"
                                        fullWidth
                                        size="small"
                                        {...methods.register("spouse")}
                                    />
                                </Stack>

                                <Divider />

                                <SectionTitle title="Profissional" />
                                <Stack spacing={2}>
                                    <TextField
                                        label="Empresa"
                                        fullWidth
                                        size="small"
                                        {...methods.register("company")}
                                    />
                                    <TextField
                                        label="Ocupação"
                                        fullWidth
                                        size="small"
                                        {...methods.register("occupation")}
                                    />
                                </Stack>

                                <Divider />

                                {/* Seção: Contato */}
                                <SectionTitle title="Contato" />
                                <Stack spacing={2}>
                                    <TextField
                                        label="E-mail"
                                        fullWidth
                                        size="small"
                                        {...methods.register("email")}
                                    />
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <TextField
                                            label="Telefone principal"
                                            fullWidth
                                            size="small"
                                            {...methods.register("phone01")}
                                        />
                                        <TextField
                                            label="Telefone alternativo"
                                            fullWidth
                                            size="small"
                                            {...methods.register("phone02")}
                                        />
                                        <TextField
                                            label="Telefone adicional"
                                            fullWidth
                                            size="small"
                                            {...methods.register("phone03")}
                                        />
                                    </Box>
                                </Stack>

                                <Divider />

                                <SectionTitle title="Referências" />
                                <Stack spacing={2}>
                                    <TextField
                                        label="Referência 1"
                                        fullWidth
                                        size="small"
                                        {...methods.register("reference01")}
                                    />
                                    <TextField
                                        label="Referência 2"
                                        fullWidth
                                        size="small"
                                        {...methods.register("reference02")}
                                    />
                                    <TextField
                                        label="Referência 3"
                                        fullWidth
                                        size="small"
                                        {...methods.register("reference03")}
                                    />
                                </Stack>

                                <Divider />

                                <SectionTitle title="Endereço" />
                                <Stack spacing={2}>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <TextField
                                            label="Rua"
                                            fullWidth
                                            size="small"
                                            {...methods.register("street")}
                                        />
                                        <TextField
                                            label="Número"
                                            fullWidth
                                            size="small"
                                            {...methods.register("number")}
                                        />
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <TextField
                                            label="Bairro"
                                            fullWidth
                                            size="small"
                                            {...methods.register("neighborhood")}
                                        />
                                        <TextField
                                            label="Complemento"
                                            fullWidth
                                            size="small"
                                            {...methods.register("complement")}
                                        />
                                    </Box>
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <TextField
                                            label="Cidade"
                                            fullWidth
                                            size="small"
                                            {...methods.register("city")}
                                        />
                                        <TextField
                                            label="UF"
                                            fullWidth
                                            size="small"
                                            {...methods.register("uf")}
                                        />
                                        <TextField
                                            label="CEP"
                                            fullWidth
                                            size="small"
                                            {...methods.register("cep")}
                                        />
                                    </Box>
                                </Stack>

                                <Divider />

                                <SectionTitle title="Outros" />
                                <FormControlLabel
                                    control={<Checkbox {...methods.register("isBlacklisted")} />}
                                    label="Cliente Negativado?"
                                />
                                <TextField
                                    label="Observações"
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    size="small"
                                    {...methods.register("obs")}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={creating || updating}
                                    startIcon={
                                        creating || updating ? (
                                            <CircularProgress size={18} />
                                        ) : undefined
                                    }
                                >
                                    {isCreate
                                        ? creating
                                            ? "Criando..."
                                            : "Criar"
                                        : updating
                                            ? "Salvando..."
                                            : "Salvar"}
                                </Button>
                            </Stack>
                        </form>
                    </FormProvider>
                )}
            </Box>
        </Drawer>
    );
}

// ==========================
// 🔹 Subcomponentes auxiliares
// ==========================
function Row({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    if (!value && value !== 0) return null;
    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
                {label}:
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {value}
            </Typography>
        </Box>
    );
}

function SectionTitle({ title }: { title: string }) {
    return (
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            {title}
        </Typography>
    );
}
