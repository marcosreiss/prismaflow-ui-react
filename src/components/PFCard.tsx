// src/design-system/components/PFCard.tsx
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import type { SxProps } from '@mui/material/styles';

interface PFCardProps {
    title?: string;
    subheader?: string;
    children?: React.ReactNode;
    sx?: SxProps;
}

export default function PFCard({ title, subheader, children, sx }: PFCardProps) {
    return (
        <Card sx={{ borderRadius: 16, ...sx }}>
            {(title || subheader) && (
                <CardHeader title={title} subheader={subheader} sx={{ pb: 0.5 }} />
            )}
            <CardContent>{children}</CardContent>
        </Card>
    );
}
