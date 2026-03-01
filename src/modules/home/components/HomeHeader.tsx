// src/modules/dashboard/components/DashboardHeader.tsx
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { Home, Plus } from "lucide-react";

export default function HomeHeader() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1.5,
                mb: 3,
            }}
        >
            <Box>
                <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Home size={22} />
                    Início
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    Acesso rápido às principais áreas do sistema
                </Typography>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Plus size={18} />}
                    onClick={() => navigate("/sales/new")}
                >
                    Nova venda
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate("/clients")}
                >
                    Novo cliente
                </Button>
            </Box>
        </Box>
    );
}
