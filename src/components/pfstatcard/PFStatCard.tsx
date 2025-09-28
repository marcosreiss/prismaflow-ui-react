import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

export type PFStatCardProps = {
    title: string;
    subtitle?: string;
    value: string | number;
    color?: string; // cor do badge
};

export default function PFStatCard({ title, subtitle = 'Este mês', value, color }: PFStatCardProps) {
    const theme = useTheme();
    const mainColor = color || theme.palette.primary.main;

    return (
        <Card
            sx={{
                borderRadius: 3,
                bgcolor: theme.palette.background.paper,
            }}
        >
            <CardContent>
                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="text.primary"
                    gutterBottom
                >
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                    <Box
                        component="span"
                        sx={{
                            bgcolor: alpha(mainColor, 0.1),
                            color: mainColor,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: 14,
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                        }}
                    >
                        {value}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
