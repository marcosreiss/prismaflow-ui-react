// components/EmptyState.tsx
import { Box, Typography } from "@mui/material";

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function EmptyState({ icon, title, description }: EmptyStateProps) {
    return (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            {icon}
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'medium' }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
                {description}
            </Typography>
        </Box>
    );
}

export default EmptyState;