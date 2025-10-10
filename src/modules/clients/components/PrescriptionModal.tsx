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
import { FormProvider, Controller } from "react-hook-form"; // <--- ALTERADO: Importa o Controller
import { usePrescriptionModalController } from "../hooks/usePrescriptionModalController";
import type { Prescription } from "../types/prescriptionTypes";

// --- Importando os novos componentes de input com máscara ---
import AdditionInput from "@/components/imask/protocolo/AdditionInput";
import CylindricalInput from "@/components/imask/protocolo/CylindricalInput";
import DnpInput from "@/components/imask/protocolo/DnpInput";
import SphericalInput from "@/components/imask/protocolo/SphericalInput";
import AxisInput from "@/components/imask/protocolo/AxisInput";

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

            <DialogContent dividers={isView && prescription != null} sx={{ px: 1.5, py: 2 }}>
                {isView && prescription && (
                    <Stack spacing={2}>
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

                        <Row label="Médico" value={prescription.doctorName} />
                        <Row label="CRM" value={prescription.crm} />
                        <Row label="Data da Receita" value={prescription.prescriptionDate} />

                        <Divider sx={{ my: 2 }} />
                        <Typography fontWeight={600} fontSize={14}>
                            Olho Direito (OD)
                        </Typography>
                        <GridBlock>
                            <Row label="Esférico" value={prescription.odSpherical} />
                            <Row label="Cilíndrico" value={prescription.odCylindrical} />
                            <Row label="Eixo" value={prescription.odAxis} />
                            <Row label="DNP" value={prescription.odDnp} />
                            <Row label="Adição" value={prescription.additionRight} />
                            <Row
                                label="Centro Óptico"
                                value={prescription.opticalCenterRight}
                            />
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
                            <Row label="Adição" value={prescription.additionLeft} />
                            <Row
                                label="Centro Óptico"
                                value={prescription.opticalCenterLeft}
                            />
                        </GridBlock>

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
                                {/* Profissional */}
                                <Section title="Profissional">
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        spacing={2}
                                    >
                                        <TextField
                                            fullWidth
                                            inputRef={inputRef}
                                            size="small"
                                            label="Nome do médico"
                                            {...methods.register("doctorName")}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="CRM"
                                            {...methods.register("crm")}
                                        />
                                    </Stack>
                                </Section>

                                <Section title="Data da Receita">
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label=""
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            {...methods.register("prescriptionDate", { required: true })}
                                        />
                                    </Stack>
                                </Section>

                                {/* Olho Direito */}
                                <Section title="Olho Direito (OD)">
                                    <GridBlock>
                                        <Controller
                                            name="odSpherical"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <SphericalInput
                                                    label="Esférico"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="odCylindrical"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CylindricalInput
                                                    label="Cilíndrico"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="odAxis"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AxisInput
                                                    label="Eixo"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="odDnp"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <DnpInput
                                                    label="DNP"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="additionRight"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AdditionInput
                                                    label="Adição"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <TextField
                                            size="small"
                                            label="Centro Óptico"
                                            {...methods.register("opticalCenterRight")}
                                        />
                                    </GridBlock>
                                </Section>

                                {/* Olho Esquerdo */}
                                <Section title="Olho Esquerdo (OE)">
                                    <GridBlock>
                                        <Controller
                                            name="oeSpherical"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <SphericalInput
                                                    label="Esférico"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="oeCylindrical"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CylindricalInput
                                                    label="Cilíndrico"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="oeAxis"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AxisInput
                                                    label="Eixo"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="oeDnp"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <DnpInput
                                                    label="DNP"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="additionLeft"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AdditionInput
                                                    label="Adição"
                                                    size="small"
                                                    {...field}
                                                    value={field.value || ""} // <--- CORREÇÃO
                                                />
                                            )}
                                        />
                                        <TextField
                                            size="small"
                                            label="Centro Óptico"
                                            {...methods.register("opticalCenterLeft")}
                                        />
                                    </GridBlock>
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
                                        creating || updating ? (
                                            <CircularProgress size={18} />
                                        ) : undefined
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
function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
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
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
            }}
        >
            {children}
        </Box>
    );
}

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