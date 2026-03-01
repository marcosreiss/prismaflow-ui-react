// src/modules/dashboard/DashboardPage.tsx
import { Box, Typography } from "@mui/material";
import HomeHeader from "@/modules/home/components/HomeHeader";
import TodayCards from "@/modules/home/components/HomeTodayCards";
import {
    HomeCadastros,
    HomeMainActions,
} from "@/modules/home/components/HomeQuickLinks";

export default function HomePage() {
    return (
        <Box id="dashboardpage">
            <HomeHeader />

            {/* Hoje */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1, color: "text.primary" }}
                >
                    Hoje
                </Typography>
                <TodayCards />
            </Box>

            {/* Operação */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5, color: "text.primary" }}
                >
                    Operação
                </Typography>
                <HomeMainActions />
            </Box>

            {/* Cadastros */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5, color: "text.primary" }}
                >
                    Cadastros
                </Typography>
                <HomeCadastros />
            </Box>
        </Box>
    );
}
