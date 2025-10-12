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

type BirthdayMessageModalProps = {
    open: boolean;
    onClose: () => void;
    client: {
        name: string;
        phone01: string;
    } | null;
};

export default function BirthdayMessageModal({
    open,
    onClose,
    client,
}: BirthdayMessageModalProps) {
    const [message, setMessage] = useState("");

    // 🎉 Mensagem base do .env
    const baseTemplate =
        import.meta.env.VITE_BIRTHDAY_MESSAGE_TEMPLATE ||
        "A equipe da Ótica Reis quer te parabenizar por esse dia tão especial, {{nome}}! Desejamos um ano de muitas conquistas e realizações. Um abraço!";

    // Substitui o placeholder pelo nome do cliente
    useEffect(() => {
        if (client) {
            // Extrai apenas o primeiro nome (antes do primeiro espaço)
            const firstName = client.name.trim().split(" ")[0];
            const filled = baseTemplate.replace("{{nome}}", firstName);
            setMessage(filled);
        }
    }, [client, baseTemplate]);

    // Gera link do WhatsApp dinamicamente
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
