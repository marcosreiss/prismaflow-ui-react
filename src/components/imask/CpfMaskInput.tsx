import { IMaskInput } from "react-imask";
import React from "react";

interface MaskProps {
    name: string;
    onChange: (event: { target: { name: string; value: string } }) => void;
}

const CpfMaskInput = React.forwardRef<HTMLInputElement, MaskProps>(
    function CpfMaskInput(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="000.000.000-00"
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

export default CpfMaskInput;
