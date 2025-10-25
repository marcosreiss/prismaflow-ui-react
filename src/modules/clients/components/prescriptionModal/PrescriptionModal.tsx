import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    IconButton,
    Divider,
} from "@mui/material";
import { X } from "lucide-react";
import { usePrescriptionModalController } from "../../hooks/usePrescriptionModalController";
import type { Prescription } from "../../types/prescriptionTypes";
import PrescriptionForm from "./PrescriptionForm";
import PrescriptionView from "./PrescriptionView";

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
    const controller = usePrescriptionModalController({
        open,
        mode,
        clientId,
        prescription,
        onCreated: onCreated ?? (() => { }),
        onUpdated: onUpdated ?? (() => { }),
    });

    const getTitle = () => {
        if (controller.isCreate) return "Nova Receita";
        if (controller.isEdit) return "Editar Receita";
        return "Detalhes da Receita";
    };

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
                    {getTitle()}
                </DialogTitle>
                <IconButton onClick={onClose}>
                    <X size={20} />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <DialogContent dividers={controller.isView && !!prescription} sx={{ px: 1.5, py: 2 }}>
                {controller.isView && prescription ? (
                    <PrescriptionView
                        prescription={prescription}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onCreateNew={onCreateNew}
                    />
                ) : (
                    <PrescriptionForm
                        controller={controller}
                        onClose={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
