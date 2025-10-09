import type { Sale } from "@/modules/sales/types/salesTypes";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

interface SaleFormHeaderProps {
    isEditMode: boolean;
    existingSale?: Sale | null;
    onBack: () => void;
}

export default function SaleFormHeader({
    isEditMode,
    existingSale,
    onBack,
}: SaleFormHeaderProps) {
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
                                ? theme.palette.primary.main + "1A" // leve transparência (10%)
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
                        {existingSale ? (
                            <CheckCircle2 size={16} strokeWidth={2} />
                        ) : (
                            <Loader2
                                size={16}
                                strokeWidth={2}
                                className="animate-spin"
                            />
                        )}
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                lineHeight: 1.4,
                            }}
                        >
                            {existingSale ? "Dados carregados" : "Carregando..."}
                        </Typography>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
