import { Box, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";
import type { SalePayload } from "@/modules/sales/types/salesTypes";

export default function SaleFormActions() {
    const { watch } = useFormContext<SalePayload>();
    const {
        activeStep,
        handleBack,
        handleNext,
        handleSaveDraft,
        handleSubmitSale,
        mode,
        methods,
    } = useSaleFormContext();

    const productItems = watch("productItems") ?? [];
    const hasProducts = productItems.length > 0;
    const isEditMode = mode === "edit";

    const {
        formState: { isSubmitting },
    } = methods;

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Box>
                {activeStep > 0 && (
                    <Button onClick={handleBack} sx={{ mr: 1 }}>
                        Voltar
                    </Button>
                )}
                <Button
                    variant="outlined"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                >
                    Salvar Rascunho
                </Button>
            </Box>

            <Box>
                {activeStep < 3 ? ( // totalSteps fixado = 4
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!hasProducts && activeStep === 1}
                    >
                        Próximo
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        onClick={methods.handleSubmit(handleSubmitSale)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? "Salvando..."
                            : isEditMode
                                ? "Atualizar Venda"
                                : "Finalizar Venda"}
                    </Button>
                )}
            </Box>
        </Box>
    );
}
