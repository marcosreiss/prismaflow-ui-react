import { Stepper, Step, StepLabel } from "@mui/material";

interface StepperNavigationProps {
    steps: string[];
    activeStep: number;
    onStepChange: (index: number) => void;
}

export default function StepperNavigation({ steps, activeStep, onStepChange }: StepperNavigationProps) {
    return (
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, index) => (
                <Step
                    key={label}
                    onClick={() => onStepChange(index)}
                    sx={{ cursor: "pointer" }}
                >
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}
