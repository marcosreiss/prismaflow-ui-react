import type { Sale } from "@/modules/sales/types/salesTypes";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowLeft } from "lucide-react";

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
                sx={{ width: { xs: 40, sm: 36 }, height: { xs: 40, sm: 36 } }}
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
                    <Typography
                        variant="body2"
                        color={existingSale ? "success.main" : "text.secondary"}
                        sx={{
                            px: 2,
                            py: 0.5,
                            bgcolor: existingSale ? "success.light" : "grey.100",
                            borderRadius: 1,
                            fontWeight: "medium",
                        }}
                    >
                        {existingSale ? "✅ Dados carregados" : "⏳ Carregando..."}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
