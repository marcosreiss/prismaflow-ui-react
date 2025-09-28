import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

export type PFChartCardProps = {
    title: string;
    data: { name: string; value: number }[];
};

export default function PFChartCard({ title, data }: PFChartCardProps) {
    const theme = useTheme();

    const xAxis = [
        {
            id: 'categories',
            data: data.map((d) => d.name),
            scaleType: 'band' as const,
        },
    ];

    const series = [
        {
            data: data.map((d) => d.value),
            color: theme.palette.primary.main,
        },
    ];

    return (
        <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <CardContent>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {title}
                </Typography>
                <BarChart
                    xAxis={xAxis}
                    series={series}
                    height={280}
                    sx={{
                        borderRadius: 2,
                        bgcolor: theme.palette.background.paper,
                    }}
                />
            </CardContent>
        </Card>
    );
}
