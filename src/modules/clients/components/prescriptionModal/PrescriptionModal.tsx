import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    IconButton,
    Divider,
    Button,
    Stack,
} from "@mui/material";
import { X, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { usePrescriptionModalController } from "../../hooks/usePrescriptionModalController";
import type { Prescription } from "../../types/prescriptionTypes";
import PrescriptionForm from "./PrescriptionForm";
import PrescriptionView from "./PrescriptionView";
import ConfirmCloseDialog from "@/components/ConfirmCloseDialog";

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

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const getTitle = () => {
        if (controller.isCreate) return "Nova Receita";
        if (controller.isEdit) return "Editar Receita";
        return "Detalhes da Receita";
    };

    const handleClose = () => {
        if (controller.hasUnsavedChanges && !controller.isView) {
            setShowConfirmDialog(true);
        } else {
            onClose();
        }
    };

    const handleDialogClose = (_event: object, reason: string) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") {
            handleClose();
            return;
        }
    };

    const handleSaveAndClose = () => {
        controller.saveDraft();
        setShowConfirmDialog(false);
        onClose();
    };

    const handleCloseWithoutSaving = () => {
        controller.clearDraft();
        setShowConfirmDialog(false);
        onClose();
    };

    const handleCancelClose = () => {
        setShowConfirmDialog(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleDialogClose}
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

                    {/* Botões de Rascunho + Fechar */}
                    <Stack direction="row" spacing={1} alignItems="center">
                        {!controller.isView && (
                            <>
                                {controller.hasDraft && (
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        startIcon={<Trash2 size={16} />}
                                        onClick={controller.clearDraft}
                                    >
                                        Limpar
                                    </Button>
                                )}
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<Save size={16} />}
                                    onClick={controller.saveDraft}
                                >
                                    Salvar Rascunho
                                </Button>
                            </>
                        )}
                        <IconButton onClick={handleClose}>
                            <X size={20} />
                        </IconButton>
                    </Stack>
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
                            onClose={handleClose}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <ConfirmCloseDialog
                open={showConfirmDialog}
                onSaveAndClose={handleSaveAndClose}
                onCloseWithoutSaving={handleCloseWithoutSaving}
                onCancel={handleCancelClose}
            />
        </>
    );
}
