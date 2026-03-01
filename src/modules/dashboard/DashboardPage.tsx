import { Box, Typography } from "@mui/material";
import { useDashboardController } from "./hooks/useDashboardController";
import DashboardMetricCards from "./components/DashboardMetricCards";
import DashboardFiltersBar from "./components/DashboardFilters";

export default function DashboardPage() {
    const {
        filters,
        handleFilterChange,
        balance,
        salesSummary,
        overdueCount,
        overdueTotal,
        loadingBalance,
        loadingSales,
        loadingOverdue,
    } = useDashboardController();

    const loadingCards = loadingBalance || loadingSales || loadingOverdue;

    return (
        <Box id="dashboardpage">
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: "text.primary" }}>
                Dashboard
            </Typography>

            <DashboardFiltersBar
                filters={filters}
                onChange={handleFilterChange}
            />

            {/* Métricas principais */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 1.5, color: "text.primary" }}>
                    Visão geral
                </Typography>
                <DashboardMetricCards
                    balance={balance}
                    salesSummary={salesSummary}
                    overdueCount={overdueCount}
                    overdueTotal={overdueTotal}
                    loading={loadingCards}
                />
            </Box>
        </Box>
    );
}