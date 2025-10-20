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
import { FormProvider, Controller } from "react-hook-form";
import { usePrescriptionModalController } from "../hooks/usePrescriptionModalController";
import type { Prescription } from "../types/prescriptionTypes";

import AdditionInput from "@/components/imask/protocolo/AdditionInput";
import CylindricalInput from "@/components/imask/protocolo/CylindricalInput";
import DnpInput from "@/components/imask/protocolo/DnpInput";
import SphericalInput from "@/components/imask/protocolo/SphericalInput";
import AxisInput from "@/components/imask/protocolo/AxisInput";
import OpticalCenterInput from "@/components/imask/protocolo/OpticalCenterInput";

type PrescriptionModalProps = {
    open: boolean;
    mode: "create" | "edit" | "view";
    clientId: number | null;
    prescription?: Prescription | null;
    onClose: () => void;
    onCreated?: (prescription: Prescription) => void;
    onUpdated?: (prescription: Prescription) => void;
    onEdit?: () => void;
    onDelete?: (prescription: Prescription) => void;
    onCreateNew?: () => void;
};

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
        onCreated: onCreated ?? (() => { }),
        onUpdated: onUpdated ?? (() => { }),
    });

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{ sx: { borderRadius: 2, p: 1.5 } }}
        >
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

            <DialogContent dividers={isView && !!prescription} sx={{ px: 1.5, py: 2 }}>
                {isView && prescription && (
                    <Stack spacing={2}>
                        {(onEdit || onDelete) && (
                            <Stack direction="row" spacing={1} mb={1}>
                                {onEdit && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        startIcon={<Pencil size={14} />}
                                        onClick={onEdit}
                                    >
                                        Editar
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Trash2 size={14} />}
                                        onClick={() => onDelete(prescription)}
                                    >
                                        Remover
                                    </Button>
                                )}
                            </Stack>
                        )}

                        {(onEdit || onDelete) && <Divider sx={{ mb: 2 }} />}

                        <Row label="Médico" value={prescription.doctorName} />
                        <Row label="CRM" value={prescription.crm} />
                        <Row
                            label="Data da Receita"
                            value={
                                prescription.prescriptionDate
                                    ? new Date(prescription.prescriptionDate).toLocaleDateString(
                                        "pt-BR"
                                    )
                                    : "-"
                            }
                        />

                        <Divider sx={{ my: 2 }} />
                        <Typography fontWeight={600} fontSize={14}>
                            Informações Gerais
                        </Typography>
                        <GridBlock>
                            <Row label="Armação e Ref" value={prescription.frameAndRef} />
                            <Row label="Tipo de Lente" value={prescription.lensType} />
                            <Row label="Observações" value={prescription.notes} />
                        </GridBlock>

                        <Divider sx={{ my: 2 }} />
                        <Typography fontWeight={600} fontSize={14}>
                            Olho Direito (OD)
                        </Typography>
                        <GridBlock>
                            <Row label="Esférico (Longe)" value={prescription.odSphericalFar} />
                            <Row label="Cilíndrico (Longe)" value={prescription.odCylindricalFar} />
                            <Row label="Eixo (Longe)" value={prescription.odAxisFar} />
                            <Row label="DNP (Longe)" value={prescription.odDnpFar} />
                            <Row label="Esférico (Perto)" value={prescription.odSphericalNear} />
                            <Row label="Cilíndrico (Perto)" value={prescription.odCylindricalNear} />
                            <Row label="Eixo (Perto)" value={prescription.odAxisNear} />
                            <Row label="DNP (Perto)" value={prescription.odDnpNear} />
                            <Row label="Película Longe" value={prescription.odPellicleFar} />
                            <Row label="Película Perto" value={prescription.odPellicleNear} />
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
                            <Row label="Esférico (Longe)" value={prescription.oeSphericalFar} />
                            <Row label="Cilíndrico (Longe)" value={prescription.oeCylindricalFar} />
                            <Row label="Eixo (Longe)" value={prescription.oeAxisFar} />
                            <Row label="DNP (Longe)" value={prescription.oeDnpFar} />
                            <Row label="Esférico (Perto)" value={prescription.oeSphericalNear} />
                            <Row label="Cilíndrico (Perto)" value={prescription.oeCylindricalNear} />
                            <Row label="Eixo (Perto)" value={prescription.oeAxisNear} />
                            <Row label="DNP (Perto)" value={prescription.oeDnpNear} />
                            <Row label="Película Longe" value={prescription.oePellicleFar} />
                            <Row label="Película Perto" value={prescription.oePellicleNear} />
                            <Row label="Adição" value={prescription.additionLeft} />
                            <Row
                                label="Centro Óptico"
                                value={prescription.opticalCenterLeft}
                            />
                        </GridBlock>

                        {onCreateNew && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Button fullWidth variant="contained" onClick={onCreateNew}>
                                    Nova Receita
                                </Button>
                            </>
                        )}
                    </Stack>
                )}

                {(isCreate || isEdit) && (
                    <FormProvider {...methods}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSubmit(e);
                                handleSubmit().then(() => {
                                    onClose();
                                });
                            }}
                        >
                            <Stack spacing={2}>
                                <Section title="Profissional">
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            {...methods.register("prescriptionDate", {
                                                required: true,
                                            })}
                                        />
                                    </Stack>
                                </Section>

                                <Section title="Informações Gerais">
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Armação e Ref"
                                            {...methods.register("frameAndRef")}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Tipo de Lente"
                                            {...methods.register("lensType")}
                                        />
                                    </Stack>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Observações"
                                        multiline
                                        rows={2}
                                        {...methods.register("notes")}
                                        sx={{ mt: 2 }}
                                    />
                                </Section>

                                <Section title="Olho Direito (OD)">
                                    <GridBlock>
                                        <Controller
                                            name="odSphericalFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <SphericalInput label="Esférico (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="odCylindricalFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CylindricalInput label="Cilíndrico (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="odAxisFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AxisInput label="Eixo (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="odDnpFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <DnpInput label="DNP (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="odSphericalNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <SphericalInput label="Esférico (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="odCylindricalNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CylindricalInput label="Cilíndrico (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="odAxisNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AxisInput label="Eixo (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="odDnpNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <DnpInput label="DNP (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <TextField
                                            size="small"
                                            label="Película Longe"
                                            {...methods.register("odPellicleFar")}
                                        />
                                        <TextField
                                            size="small"
                                            label="Película Perto"
                                            {...methods.register("odPellicleNear")}
                                        />
                                        <Controller
                                            name="additionRight"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AdditionInput label="Adição" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="opticalCenterRight"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <OpticalCenterInput label="Centro Óptico" size="small" {...field} />
                                            )}
                                        />
                                    </GridBlock>
                                </Section>

                                <Section title="Olho Esquerdo (OE)">
                                    <GridBlock>
                                        <Controller
                                            name="oeSphericalFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <SphericalInput label="Esférico (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="oeCylindricalFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CylindricalInput label="Cilíndrico (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="oeAxisFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AxisInput label="Eixo (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="oeDnpFar"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <DnpInput label="DNP (Longe)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="oeSphericalNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <SphericalInput label="Esférico (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="oeCylindricalNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <CylindricalInput label="Cilíndrico (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="oeAxisNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AxisInput label="Eixo (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="oeDnpNear"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <DnpInput label="DNP (Perto)" size="small" {...field} />
                                            )}
                                        />
                                        <TextField
                                            size="small"
                                            label="Película Longe"
                                            {...methods.register("oePellicleFar")}
                                        />
                                        <TextField
                                            size="small"
                                            label="Película Perto"
                                            {...methods.register("oePellicleNear")}
                                        />
                                        <Controller
                                            name="additionLeft"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <AdditionInput label="Adição" size="small" {...field} />
                                            )}
                                        />
                                        <Controller
                                            name="opticalCenterLeft"
                                            control={methods.control}
                                            render={({ field }) => (
                                                <OpticalCenterInput label="Centro Óptico" size="small" {...field} />
                                            )}
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
