import { useParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { useGetSaleById } from "@/modules/sales/hooks/useSales";
import SaleFormManager from "@/modules/sales/components/salesForm/SaleFormManager";
import SaleFormProvider from "@/modules/sales/context/SaleFormProvider";

// ==============================
// 🔹 Página principal de criação/edição de venda
// ==============================
export default function SalesFormPage() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = Boolean(id);

    // Busca da venda se estiver em modo edição
    const { data: saleResponse, isLoading, isError } = useGetSaleById(
        isEditMode ? Number(id) : null
    );

    // Estados de carregamento e erro
    if (isEditMode && isLoading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
            >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>
                    Carregando dados da venda...
                </Typography>
            </Box>
        );
    }

    if (isEditMode && isError) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="60vh"
                gap={2}
            >
                <Alert severity="error">
                    Ocorreu um erro ao carregar os dados da venda.
                </Alert>
            </Box>
        );
    }

    // Venda carregada (modo edição)
    const existingSale = saleResponse?.data ?? null;

    // Envolve toda a tela com o contexto global
    return (
        <Box sx={{ py: 3 }}>
            <SaleFormProvider
                mode={isEditMode ? "edit" : "create"}
                existingSale={existingSale}
            >
                <SaleFormManager />
            </SaleFormProvider>
        </Box>
    );
}
