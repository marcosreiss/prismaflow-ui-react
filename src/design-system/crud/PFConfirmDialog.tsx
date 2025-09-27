import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

type PFConfirmDialogProps = {
    open: boolean;
    title: string;
    description?: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function PFConfirmDialog({
    open,
    title,
    description,
    onCancel,
    onConfirm,
}: PFConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {description && <Typography variant="body2">{description}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit">
                    Cancelar
                </Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
