import { Stepper, Step, StepLabel } from "@mui/material";

interface StepperNavigationProps {
    steps: string[];
    activeStep: number;
    onStepChange: (index: number) => void;
}

export default function StepperNavigation({
    steps,
    activeStep,
    onStepChange,
}: StepperNavigationProps) {
    return (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
                <Step
                    key={label}
                    completed={index < activeStep}
                    active={index === activeStep}
                    role="button"
                    tabIndex={0}
                    onClick={() => onStepChange(index)}
                    onKeyDown={(e) => e.key === "Enter" && onStepChange(index)}
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
