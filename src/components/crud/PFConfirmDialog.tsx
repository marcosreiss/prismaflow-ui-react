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
            <DialogTitle>
                <Typography variant="h6">{title}</Typography>
            </DialogTitle>

            <DialogContent>
                {description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {description}
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2.5, gap: 1.5 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disabled={loading}
                    endIcon={loading ? <CircularProgress size={16} /> : undefined}
                >
                    {loading ? "Excluindo..." : "Confirmar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
