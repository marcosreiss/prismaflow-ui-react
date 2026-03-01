// src/modules/dashboard/components/DashboardTodayCards.tsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Cake, AlertTriangle } from "lucide-react";
import { useGetBirthdays } from "@/modules/clients/hooks/useClient";
import { useGetExpiringPrescriptions } from "@/modules/clients/hooks/usePrescription";

const TODAY_LIMIT = 1; // só precisamos da contagem

function formatToday(): string {
    const d = new Date();
    // formato YYYY-MM-DD, compatível com o que você comentou no hook
    return d.toISOString().substring(0, 10); // [web:28]
}

export default function HomeTodayCards() {
    const navigate = useNavigate();
    const today = useMemo(() => formatToday(), []);

    const { data: birthdaysData, isLoading: loadingBirthdays } = useGetBirthdays({
        page: 1,
        limit: TODAY_LIMIT,
        date: today,
    });

    const { data: expiringData, isLoading: loadingExpiring } = useGetExpiringPrescriptions({
        page: 1,
        limit: TODAY_LIMIT,
        date: today,
    });

    const birthdaysCount = birthdaysData?.data?.totalElements ?? 0;
    const expiringCount = expiringData?.data?.totalElements ?? 0;

    const loading = loadingBirthdays || loadingExpiring;

    const cards = [
        {
            label: "Aniversariantes de hoje",
            value: loading ? "…" : birthdaysCount.toString(),
            description: "Clientes com aniversário na data de hoje",
            icon: Cake,
            onClick: () => navigate("/clients-birthday"),
        },
        {
            label: "Receitas a vencer (7 dias)",
            value: loading ? "…" : expiringCount.toString(),
            description: "Prescrições que vencem nos próximos 7 dias",
            icon: AlertTriangle,
            onClick: () => navigate("/expiring-prescriptions"),
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                gap: 2,
            }}
        >
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <Card
                        key={card.label}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            borderColor: "grey.200",
                            backgroundColor: "grey.100",
                            transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease",
                            "&:hover": {
                                boxShadow: "0 4px 18px rgba(15,23,42,0.08)",
                                borderColor: "primary.main",
                                transform: "translateY(-1px)",
                            },
                        }}
                    >
                        <CardActionArea onClick={card.onClick}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        mb: 1,
                                    }}
                                >
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        {card.label}
                                    </Typography>
                                    <Box
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "primary.main",
                                        }}
                                    >
                                        <Icon size={18} color="#ffffff" />
                                    </Box>
                                </Box>

                                <Typography variant="h4" sx={{ color: "text.primary" }}>
                                    {card.value}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ color: "text.secondary", mt: 0.5 }}
                                >
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                );
            })}
        </Box>
    );
}
