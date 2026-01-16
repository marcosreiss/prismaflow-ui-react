import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

type ConfirmCloseDialogProps = {
    open: boolean;
    onSaveAndClose: () => void;
    onCloseWithoutSaving: () => void;
    onCancel: () => void;
};

export default function ConfirmCloseDialog({
    open,
    onSaveAndClose,
    onCloseWithoutSaving,
    onCancel,
}: ConfirmCloseDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>Alterações não salvas</DialogTitle>
            <DialogContent>
                <Typography>
                    Você tem alterações não salvas. O que deseja fazer?
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onCancel} color="inherit">
                    Cancelar
                </Button>
                <Button onClick={onCloseWithoutSaving} color="error" variant="outlined">
                    Fechar sem salvar
                </Button>
                <Button onClick={onSaveAndClose} variant="contained">
                    Salvar rascunho
                </Button>
            </DialogActions>
        </Dialog>
    );
}
