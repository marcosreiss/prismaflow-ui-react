// src/design-system/components/PFButton.tsx
import Button, { type ButtonProps } from '@mui/material/Button';
import { usePrismGradient } from '../utils/gradients';

export interface PFButtonProps extends Omit<ButtonProps, 'variant'> {
    variant?: 'solid' | 'soft' | 'outline' | 'prism';
}

export default function PFButton({ variant = 'solid', ...props }: PFButtonProps) {
    const { prism, prismHover } = usePrismGradient();

    if (variant === 'prism') {
        return (
            <Button
                {...props}
                sx={{
                    background: prism,
                    color: 'common.white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    '&:hover': { background: prismHover },
                }}
            />
        );
    }

    if (variant === 'soft') {
        return (
            <Button
                {...props}
                variant="contained"
                color={props.color || 'secondary'}
                sx={{ filter: 'saturate(105%)', bgcolor: 'secondary.main', color: 'common.white' }}
            />
        );
    }

    if (variant === 'outline') {
        return <Button {...props} variant="outlined" />;
    }

    return <Button {...props} variant="contained" color={props.color || 'primary'} />;
}
