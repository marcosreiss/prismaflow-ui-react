import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Divider,
    Stack,
    TextField,
    Button,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { X, Pencil, Trash2 } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { usePrescriptionModalController } from "../hooks/usePrescriptionModalController";
import type { Prescription } from "../types/prescriptionTypes";

type PrescriptionModalProps = {
    open: boolean;
    mode: "create" | "edit" | "view";
    clientId: number | null;
    prescription?: Prescription | null;
    onClose: () => void;
    onCreated: (prescription: Prescription) => void;
    onUpdated: (prescription: Prescription) => void;
    onEdit: () => void;
    onDelete: (prescription: Prescription) => void;
    onCreateNew: () => void;
};

// ==============================
// 🔹 Componente principal
// ==============================
export default function PrescriptionModal({
    open,
    mode,
    clientId,
    prescription,
    onClose,
    onCreated,
    onUpdated,
    onEdit,
    onDelete,
    onCreateNew,
}: PrescriptionModalProps) {
    const {
        methods,
        inputRef,
        handleSubmit,
        creating,
        updating,
        isCreate,
        isEdit,
        isView,
    } = usePrescriptionModalController({
        open,
        mode,
        clientId,
        prescription,
        onCreated,
        onUpdated,
    });

    // ==============================
    // 🔹 Render
    // ==============================
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { borderRadius: 2, p: 1.5 } }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1,
                }}
            >
                <DialogTitle sx={{ p: 0, fontWeight: "bold" }}>
                    {isCreate
                        ? "Nova Receita"
                        : isEdit
                            ? "Editar Receita"
                            : "Detalhes da Receita"}
                </DialogTitle>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <DialogContent dividers sx={{ px: 1.5, py: 2 }}>
                {isView && prescription && (
                    <Stack spacing={2}>
                        {/* Ações no modo View */}
                        <Stack direction="row" spacing={1} mb={1}>
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
                                onClick={() => onDelete(prescription)}
                            >
                                Remover
                            </Button>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {/* Dados da receita */}
                        <Row label="Médico" value={prescription.doctorName} />
                        <Row label="CRM" value={prescription.crm} />
                        <Divider sx={{ my: 2 }} />
                        <Typography fontWeight={600} fontSize={14}>
                            Olho Direito (OD)
                        </Typography>
                        <GridBlock>
                            <Row label="Esférico" value={prescription.odSpherical} />
                            <Row label="Cilíndrico" value={prescription.odCylindrical} />
                            <Row label="Eixo" value={prescription.odAxis} />
                            <Row label="DNP" value={prescription.odDnp} />
                        </GridBlock>

                        <Divider sx={{ my: 2 }} />
                        <Typography fontWeight={600} fontSize={14}>
                            Olho Esquerdo (OE)
                        </Typography>
                        <GridBlock>
                            <Row label="Esférico" value={prescription.oeSpherical} />
                            <Row label="Cilíndrico" value={prescription.oeCylindrical} />
                            <Row label="Eixo" value={prescription.oeAxis} />
                            <Row label="DNP" value={prescription.oeDnp} />
                        </GridBlock>

                        <Divider sx={{ my: 2 }} />
                        <Row label="Adição" value={prescription.addition} />
                        <Row label="Centro Óptico" value={prescription.opticalCenter} />

                        <Divider sx={{ my: 3 }} />
                        <Button fullWidth variant="contained" onClick={onCreateNew}>
                            Nova Receita
                        </Button>
                    </Stack>
                )}

                {(isCreate || isEdit) && (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                {/* Médico / CRM */}
                                <Section title="Profissional">
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            inputRef={inputRef}
                                            size="small"
                                            label="Nome do médico"
                                            {...methods.register("doctorName", { required: true })}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="CRM"
                                            {...methods.register("crm")}
                                        />
                                    </Stack>
                                </Section>

                                {/* Olho Direito */}
                                <Section title="Olho Direito (OD)">
                                    <GridBlock>
                                        <TextField
                                            size="small"
                                            label="Esférico"
                                            {...methods.register("odSpherical")}
                                        />
                                        <TextField
                                            size="small"
                                            label="Cilíndrico"
                                            {...methods.register("odCylindrical")}
                                        />
                                        <TextField
                                            size="small"
                                            label="Eixo"
                                            {...methods.register("odAxis")}
                                        />
                                        <TextField
                                            size="small"
                                            label="DNP"
                                            {...methods.register("odDnp")}
                                        />
                                    </GridBlock>
                                </Section>

                                {/* Olho Esquerdo */}
                                <Section title="Olho Esquerdo (OE)">
                                    <GridBlock>
                                        <TextField
                                            size="small"
                                            label="Esférico"
                                            {...methods.register("oeSpherical")}
                                        />
                                        <TextField
                                            size="small"
                                            label="Cilíndrico"
                                            {...methods.register("oeCylindrical")}
                                        />
                                        <TextField
                                            size="small"
                                            label="Eixo"
                                            {...methods.register("oeAxis")}
                                        />
                                        <TextField
                                            size="small"
                                            label="DNP"
                                            {...methods.register("oeDnp")}
                                        />
                                    </GridBlock>
                                </Section>

                                {/* Campos adicionais */}
                                <Section title="Outros">
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            size="small"
                                            label="Adição"
                                            {...methods.register("addition")}
                                        />
                                        <TextField
                                            size="small"
                                            label="Centro Óptico"
                                            {...methods.register("opticalCenter")}
                                        />
                                    </Stack>
                                </Section>
                            </Stack>

                            <DialogActions sx={{ mt: 3, px: 0 }}>
                                <Button onClick={onClose} variant="outlined">
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={creating || updating}
                                    startIcon={
                                        creating || updating ? <CircularProgress size={18} /> : undefined
                                    }
                                >
                                    {isCreate
                                        ? creating
                                            ? "Salvando..."
                                            : "Criar"
                                        : updating
                                            ? "Salvando..."
                                            : "Salvar"}
                                </Button>
                            </DialogActions>
                        </form>
                    </FormProvider>
                )}
            </DialogContent>
        </Dialog>
    );
}

// ==============================
// 🔹 Subcomponentes auxiliares
// ==============================
function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
                {title}
            </Typography>
            {children}
            <Divider sx={{ my: 2 }} />
        </Box>
    );
}

function GridBlock({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
                gap: 2,
            }}
        >
            {children}
        </Box>
    );
}

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
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
