import { Stepper, Step, StepLabel } from "@mui/material";
import { useSaleFormContext } from "@/modules/sales/context/useSaleFormContext";

interface StepperNavigationProps {
    steps: string[];
}

/**
 * 🔹 Stepper de navegação das etapas do formulário de venda
 */
export default function StepperNavigation({ steps }: StepperNavigationProps) {
    const { activeStep, setActiveStep } = useSaleFormContext();

    const handleStepChange = (index: number) => {
        setActiveStep(index);
    };

    return (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
                <Step
                    key={label}
                    completed={index < activeStep}
                    active={index === activeStep}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleStepChange(index)}
                    onKeyDown={(e) => e.key === "Enter" && handleStepChange(index)}
                    sx={{
                        cursor: "pointer",
                        "&:hover .MuiStepLabel-label": { opacity: 0.8 },
                    }}
                >
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}
