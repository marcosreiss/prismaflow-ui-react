import { IMaskInput } from "react-imask";
import React from "react";

interface MaskProps {
    name: string;
    onChange: (event: { target: { name: string; value: string } }) => void;
}

const CelularMaskInput = React.forwardRef<HTMLInputElement, MaskProps>(
    function CelularMaskInput(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="(00) 0 0000-0000"
                definitions={{ 0: /[0-9]/ }}
                inputRef={ref}
                unmask={true}
                onAccept={(value: unknown) =>
                    onChange({ target: { name: props.name, value: value as string } })
                }
            />
        );
    }
);

export default CelularMaskInput;
