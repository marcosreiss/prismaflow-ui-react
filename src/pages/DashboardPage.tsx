import { Box } from "@mui/material";
import PFStatCard from "@/components/pfstatcard/PFStatCard";
import PFRecentList from "@/components/pfrecentlist/PFRecentList";
import {
    mockStats,
    mockRecentSales,
    mockRecentPayments,
} from "@/mock/dashboard";

export default function DashboardPage() {
    return (
        <Box id="dashboardpage">
            {/* KPIs - CSS Grid */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                    gap: 2,
                }}
            >
                {mockStats.map((stat) => (
                    <Box key={stat.title}>
                        <PFStatCard {...stat} />
                    </Box>
                ))}
            </Box>

            {/* Gráfico */}
            {/* <Box sx={{ mt: 3 }}>
                <PFChartCard title="Vendas por Mês" data={mockSalesChart} />
            </Box> */}

            {/* Listas recentes - CSS Grid */}
            <Box
                sx={{
                    mt: 3,
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 2,
                }}
            >
                <PFRecentList title="Vendas Recentes" items={mockRecentSales} />
                <PFRecentList title="Pagamentos Recentes" items={mockRecentPayments} />
            </Box>
        </Box>
    );
}
