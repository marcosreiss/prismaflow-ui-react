import { Box, Button } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";
import type { SalePayload } from "@/modules/sales/types/salesTypes";

export default function SaleFormActions() {
    const { watch } = useFormContext<SalePayload>();
    const {
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
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mt: 3,
            }}
        >
            <Box>
                <Button
                    variant="outlined"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                >
                    Salvar Rascunho
                </Button>
            </Box>

            <Box>
                <Button
                    variant="contained"
                    size="large"
                    onClick={methods.handleSubmit(handleSubmitSale)}
                    disabled={isSubmitting || !hasProducts}
                >
                    {isSubmitting
                        ? "Salvando..."
                        : isEditMode
                            ? "Atualizar Venda"
                            : "Finalizar Venda"}
                </Button>
            </Box>
        </Box>
    );
}
