import { Box, Button } from "@mui/material";

interface SaleFormActionsProps {
    activeStep: number;
    totalSteps: number;
    isLoading: boolean;
    hasProducts: boolean;
    isEditMode?: boolean;
    onBack: () => void;
    onNext: () => void;
    onSaveDraft: () => void;
    onSubmit: () => void;
}

export default function SaleFormActions({
    activeStep,
    totalSteps,
    isLoading,
    hasProducts,
    isEditMode = false,
    onBack,
    onNext,
    onSaveDraft,
    onSubmit,
}: SaleFormActionsProps) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box>
                {activeStep > 0 && (
                    <Button onClick={onBack} sx={{ mr: 1 }}>
                        Voltar
                    </Button>
                )}
                <Button
                    variant="outlined"
                    onClick={onSaveDraft}
                    disabled={isLoading}
                >
                    Salvar Rascunho
                </Button>
            </Box>

            <Box>
                {activeStep < totalSteps - 1 ? (
                    <Button
                        variant="contained"
                        onClick={onNext}
                        disabled={!hasProducts && activeStep === 1}
                    >
                        Próximo
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={onSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Salvando...' : (isEditMode ? 'Atualizar Venda' : 'Finalizar Venda')}
                    </Button>
                )}
            </Box>
        </Box>
    );
}