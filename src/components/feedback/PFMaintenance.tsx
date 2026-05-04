import { Box, Button, Typography, Paper } from "@mui/material";
import { RefreshCw, ArrowLeft } from "lucide-react";
import { useRouter } from "@/routes/hooks";

type PFMaintenanceProps = {
    title?: string;
    description?: string;
    onRefresh?: () => void;
    backUrl?: string;
};

export default function PFMaintenance({
    title = "Página em manutenção",
    description = "Estamos trabalhando para disponibilizar esta funcionalidade em breve.",
    onRefresh,
    backUrl,
}: PFMaintenanceProps) {
    const router = useRouter();

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                borderColor: "grey.200",
                backgroundColor: "background.paper",
                p: 4,
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                {/* Ícone */}
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "grey.100",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <RefreshCw size={28} />
                </Box>

                {/* Texto */}
                <Typography variant="h6">{title}</Typography>

                <Typography variant="body2" color="text.secondary" maxWidth={400}>
                    {description}
                </Typography>

                {/* Ações */}
                <Box display="flex" gap={1.5} mt={1}>
                    {backUrl && (
                        <Button
                            variant="outlined"
                            startIcon={<ArrowLeft size={18} />}
                            onClick={() =>
                                backUrl ? router.push(backUrl) : router.back()
                            }
                        >
                            Voltar
                        </Button>
                    )}

                    {onRefresh && (
                        <Button
                            variant="contained"
                            startIcon={<RefreshCw size={18} />}
                            onClick={onRefresh}
                        >
                            Tentar novamente
                        </Button>
                    )}
                </Box>
            </Box>
        </Paper>
    );
}