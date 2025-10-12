import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Box,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";

type ExpiringPrescriptionMessageModalProps = {
    open: boolean;
    onClose: () => void;
    client: {
        name: string;
        phone01: string;
        prescriptionDate: string;
    } | null;
};

export default function ExpiringPrescriptionMessageModal({
    open,
    onClose,
    client,
}: ExpiringPrescriptionMessageModalProps) {
    const [message, setMessage] = useState("");

    // 🧾 Template base do .env
    const baseTemplate =
        import.meta.env.VITE_EXPIRING_PRESCRIPTION_MESSAGE_TEMPLATE ||
        "Olá {{nome}}, aqui é da Ótica Reis! Notamos que sua receita feita em {{data}} completou 1 ano. Recomendamos uma nova consulta para atualizar o grau e cuidar bem da sua visão. 👓";

    useEffect(() => {
        if (client) {
            const firstName = client.name.trim().split(" ")[0];

            // Formatação simples de data (sem date-fns)
            const dateObj = new Date(client.prescriptionDate);
            const formattedDate = dateObj.toLocaleDateString("pt-BR");

            const filled = baseTemplate
                .replace("{{nome}}", firstName)
                .replace("{{data}}", formattedDate);

            setMessage(filled);
        }
    }, [client, baseTemplate]);

    // Link dinâmico do WhatsApp
    const waLink = useMemo(() => {
        if (!client?.phone01 || !message) return "#";
        return `https://wa.me/${client.phone01}?text=${encodeURIComponent(message)}`;
    }, [client, message]);

    if (!client) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 3, p: 1 },
            }}
        >
            <DialogTitle>
                Enviar mensagem para{" "}
                <Typography component="span" fontWeight={600}>
                    {client.name}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        label="Mensagem"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="outlined">
                    Fechar
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!client.phone01 || !message}
                >
                    Mandar mensagem
                </Button>
            </DialogActions>
        </Dialog>
    );
}
