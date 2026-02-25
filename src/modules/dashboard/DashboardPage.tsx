// src/modules/dashboard/DashboardPage.tsx
import { Box, Typography } from "@mui/material";
import DashboardHeader from "@/modules/dashboard/components/DashboardHeader";
import DashboardTodayCards from "@/modules/dashboard/components/DashboardTodayCards";
import {
    DashboardMainActions,
    DashboardCadastros,
} from "@/modules/dashboard/components/DashboardQuickLinks";

export default function DashboardPage() {
    return (
        <Box id="dashboardpage">
            <DashboardHeader />

            {/* Hoje */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1, color: "text.primary" }}
                >
                    Hoje
                </Typography>
                <DashboardTodayCards />
            </Box>

            {/* Operação */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5, color: "text.primary" }}
                >
                    Operação
                </Typography>
                <DashboardMainActions />
            </Box>

            {/* Cadastros */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5, color: "text.primary" }}
                >
                    Cadastros
                </Typography>
                <DashboardCadastros />
            </Box>
        </Box>
    );
}
