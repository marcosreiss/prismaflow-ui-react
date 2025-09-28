import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
} from "@mui/material";

type PFConfirmDialogProps = {
    open: boolean;
    title: string;
    description?: string;
    onCancel: () => void;
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
};

export default function PFConfirmDialog({
    open,
    title,
    description,
    onCancel,
    onConfirm,
    loading = false,
}: PFConfirmDialogProps) {
    return (
        <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {description && <Typography variant="body2">{description}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="inherit" disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} /> : undefined}
                >
                    {loading ? "Excluindo..." : "Confirmar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
