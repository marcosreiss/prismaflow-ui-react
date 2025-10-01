import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert, Button } from "@mui/material";
import { useSale } from "@/hooks/useSale";
import type { Sale } from "@/types/saleTypes";
import SaleFormManager from "@/components/saleForm/SaleFormManager";

interface SaleFormProps {
    mode?: "create" | "edit";
}

export default function SaleForm({ mode = "create" }: SaleFormProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const isEditMode = mode === "edit" || !!id;

    const {
        detail: { data: existingSale, isLoading: isLoadingSale },
    } = useSale(isEditMode && id ? id : null);

    // Caso esteja carregando (edição)
    if (isEditMode && isLoadingSale) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Carregando dados da venda...</Typography>
            </Box>
        );
    }

    // Caso não encontre a venda (edição)
    if (isEditMode && !existingSale && !isLoadingSale) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
                flexDirection="column"
            >
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Venda não encontrada ou erro ao carregar dados.
                </Alert>
                <Button variant="contained" onClick={() => navigate("/sales")}>
                    Voltar para Lista
                </Button>
            </Box>
        );
    }

    // Renderiza o manager com os dados corretos
    return <SaleFormManager mode={isEditMode ? "edit" : "create"} existingSale={existingSale as Sale} />;
}
