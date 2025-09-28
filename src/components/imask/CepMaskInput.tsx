import React from "react";
import { IMaskInput } from "react-imask";

interface MaskProps {
    name: string;
    onChange: (event: { target: { name: string; value: string } }) => void;
}

const CepMaskInput = React.forwardRef<HTMLInputElement, MaskProps>(
    function CepMaskInput(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="00000-000"
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

export default CepMaskInput;
