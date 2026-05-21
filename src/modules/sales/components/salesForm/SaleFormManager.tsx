// Orquestra os steps do formulário de venda em uma página única
import { Box, Paper, Divider, Alert, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";

import SaleFormHeader from "./SaleFormHeader";
import SaleSummary from "./SaleSummary";
import SaleFormActions from "./SaleFormActions";
import ClientStep from "./steps/ClientStep";
import ProductsStep from "./steps/productsStep/ProductsStep";
import ProtocolStep from "./steps/ProtocolStep";
import ReviewStep from "./steps/ReviewStep";

export default function SaleFormManager() {
    const navigate = useNavigate();
    const { methods, handleSubmitSale } = useSaleFormContext();
    const { handleSubmit, formState: { errors, isSubmitting } } = methods;

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                maxWidth: 1200,
                mx: "auto",
            }}
        >
            <SaleFormHeader onBack={() => navigate("/sales")} />
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Preencha os dados da venda em uma única página
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Organize a venda de cima para baixo: cliente, itens, protocolo e revisão final.
                </Typography>
            </Box>

            {errors.root && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {errors.root.message as string}
                </Alert>
            )}

            <form
                onSubmit={handleSubmit(handleSubmitSale)}
                style={{ display: "flex", flexDirection: "column" }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", lg: "row" },
                        gap: 4,
                        alignItems: "flex-start",
                    }}
                >
                    <Box
                        sx={{
                            flex: 2,
                            minWidth: 0,
                        }}
                    >
                        <Stack spacing={3}>
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                <ClientStep />
                            </Paper>

                            <ProductsStep isLoading={isSubmitting} />

                            <ProtocolStep />

                            <ReviewStep />
                        </Stack>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            minWidth: { xs: "100%", lg: 320 },
                            position: { lg: "sticky" },
                            top: { lg: 24 },
                        }}
                    >
                        <SaleSummary />
                    </Box>
                </Box>

                <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2, mt: 4 }}>
                    <SaleFormActions />
                </Box>
            </form>
        </Paper>
    );
}
