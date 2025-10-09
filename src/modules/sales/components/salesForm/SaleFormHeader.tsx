import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";

interface SaleFormHeaderProps {
    onBack: () => void;
}

export default function SaleFormHeader({ onBack }: SaleFormHeaderProps) {
    const { mode, existingSale } = useSaleFormContext();
    const isEditMode = mode === "edit";

    const isLoadingSale = isEditMode && !existingSale;

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            {/* Botão voltar */}
            <IconButton
                onClick={onBack}
                aria-label="Voltar"
                sx={{
                    width: { xs: 40, sm: 36 },
                    height: { xs: 40, sm: 36 },
                }}
            >
                <ArrowLeft size={20} />
            </IconButton>

            {/* Título */}
            <Typography component="div" variant="h5" fontWeight="bold">
                {isEditMode ? "Editar Venda" : "Nova Venda"}
                {isEditMode && existingSale && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                        sx={{ ml: 1 }}
                    >
                        (ID: {existingSale.id})
                    </Typography>
                )}
            </Typography>

            {/* Indicador de status */}
            {isEditMode && (
                <Box sx={{ ml: "auto" }}>
                    <Box
                        sx={(theme) => ({
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.75,
                            py: 0.5,
                            borderRadius: 1.5,
                            transition: "background-color 0.3s ease, color 0.3s ease",
                            bgcolor: existingSale
                                ? theme.palette.primary.main + "1A"
                                : theme.palette.action.hover,
                            color: existingSale
                                ? theme.palette.primary.main
                                : theme.palette.text.secondary,
                            border: `1px solid ${existingSale
                                    ? theme.palette.primary.main + "40"
                                    : theme.palette.divider
                                }`,
                        })}
                    >
                        {isLoadingSale ? (
                            <CircularProgress size={16} thickness={4} />
                        ) : (
                            existingSale && <CheckCircle2 size={16} strokeWidth={2} />
                        )}

                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.4,
                            }}
                        >
                            {isLoadingSale
                                ? "Carregando..."
                                : existingSale
                                    ? "Dados carregados"
                                    : "Sem dados"}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
