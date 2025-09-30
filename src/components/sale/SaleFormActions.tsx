import {
    Box,
    Button,
} from "@mui/material";
import { Save, ShoppingCart, ArrowLeft } from "lucide-react";

interface SaleFormActionsProps {
    activeStep: number;
    totalSteps: number;
    creating: boolean;
    hasProducts: boolean;
    onBack: () => void;
    onNext: () => void;
    onSaveDraft: () => void;
    onSubmit: () => void;
}

export default function SaleFormActions({
    activeStep,
    totalSteps,
    creating,
    hasProducts,
    onBack,
    onNext,
    onSaveDraft,
    onSubmit
}: SaleFormActionsProps) {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
            pt: 2,
            borderTop: 1,
            borderColor: 'divider'
        }}>
            <Box>
                {activeStep > 0 && (
                    <Button
                        onClick={onBack}
                        variant="outlined"
                        disabled={creating}
                        startIcon={<ArrowLeft size={18} />}
                    >
                        Voltar
                    </Button>
                )}
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<Save size={18} />}
                    disabled={creating}
                    onClick={onSaveDraft}
                >
                    Salvar Rascunho
                </Button>

                {activeStep < totalSteps - 1 ? (
                    <Button
                        variant="contained"
                        onClick={onNext}
                        disabled={creating}
                    >
                        Próximo
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={onSubmit}
                        disabled={creating || !hasProducts}
                        startIcon={<ShoppingCart size={20} />}
                        size="large"
                    >
                        {creating ? "Processando..." : "Finalizar Venda"}
                    </Button>
                )}
            </Box>
        </Box>
    );
}