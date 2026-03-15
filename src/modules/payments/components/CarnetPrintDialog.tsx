import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slider,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageDataUrl } from "../utils/cropImage";

const COVER_LOGO_ASPECT = 16 / 9;

type CarnetPrintDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: (logoSrc: string | null) => void;
};

export default function CarnetPrintDialog({
    open,
    onClose,
    onConfirm,
}: CarnetPrintDialogProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
        }
    }, [open]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageSrc(typeof reader.result === "string" ? reader.result : null);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        };
        reader.readAsDataURL(file);
    };

    const handlePrintWithoutLogo = () => {
        onConfirm(null);
    };

    const handlePrintWithLogo = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setSubmitting(true);
            const croppedLogo = await getCroppedImageDataUrl(imageSrc, croppedAreaPixels);
            onConfirm(croppedLogo);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Imprimir Carnê</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={3}>
                    <Stack spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                            Você pode imprimir o carnê com ou sem a logo da ótica na capa.
                        </Typography>
                        <Button variant="outlined" component="label" sx={{ width: "fit-content" }}>
                            Selecionar Logo
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                    </Stack>

                    {imageSrc ? (
                        <>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    height: 360,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    background:
                                        "linear-gradient(135deg, rgba(17,24,39,0.95), rgba(59,130,246,0.85))",
                                }}
                            >
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={COVER_LOGO_ASPECT}
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                                />
                            </Box>

                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                    Ajuste o enquadramento da logo para a capa do carnê.
                                </Typography>
                                <Slider
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(_, value) => setZoom(value as number)}
                                />
                            </Box>
                        </>
                    ) : (
                        <Alert severity="info">
                            Nenhuma logo selecionada. Você ainda pode imprimir o carnê sem logo.
                        </Alert>
                    )}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button onClick={handlePrintWithoutLogo} variant="outlined" disabled={submitting}>
                    Imprimir sem logo
                </Button>
                <Button
                    onClick={handlePrintWithLogo}
                    variant="contained"
                    disabled={!imageSrc || !croppedAreaPixels || submitting}
                >
                    {submitting ? "Preparando..." : "Usar logo e imprimir"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
