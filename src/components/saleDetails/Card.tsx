// components/InfoCard.tsx (vamos criar este componente)
import { Paper, Typography, Box } from '@mui/material';
import type { SxProps } from '@mui/system';
import type { ReactNode } from 'react';

interface InfoCardProps {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
    sx?: SxProps;
}

export default function InfoCard({ title, children, icon, sx }: InfoCardProps) {
    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: 2,
                border: 1,
                borderColor: 'grey.divider',
                ...sx,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {icon}
                <Typography variant="h6" fontWeight="medium">
                    {title}
                </Typography>
            </Box>
            {children}
        </Paper>
    );
}