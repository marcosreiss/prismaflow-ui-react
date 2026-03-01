import { Box, Card, CardContent, Typography, Skeleton } from "@mui/material";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, AlertTriangle } from "lucide-react";
import type { Balance, SalesSummary } from "../types/dashboardTypes";

function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

type MetricCardProps = {
    label: string;
    value: string;
    description: string;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    iconColor?: string;
    loading?: boolean;
};

function MetricCard({ label, value, description, icon: Icon, iconColor = "#ffffff", loading }: MetricCardProps) {
    return (
        <Card
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
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {label}
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
                        <Icon size={18} color={iconColor} />
                    </Box>
                </Box>

                {loading ? (
                    <Skeleton variant="text" width={120} height={40} />
                ) : (
                    <Typography variant="h5" sx={{ color: "text.primary", fontWeight: 700 }}>
                        {value}
                    </Typography>
                )}

                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}

type Props = {
    balance: Balance | null;
    salesSummary: SalesSummary | null;
    overdueCount: number;
    overdueTotal: number;
    loading?: boolean;
};

export default function DashboardMetricCards({ balance, salesSummary, overdueCount, overdueTotal, loading }: Props) {
    const cards = [
        {
            label: "Receita confirmada",
            value: formatCurrency(balance?.revenue ?? 0),
            description: "Pagamentos com status confirmado",
            icon: TrendingUp,
        },
        {
            label: "Despesas pagas",
            value: formatCurrency(balance?.expenses ?? 0),
            description: "Despesas com status pago",
            icon: TrendingDown,
        },
        {
            label: "Lucro líquido",
            value: formatCurrency(balance?.netProfit ?? 0),
            description: "Receita menos despesas",
            icon: DollarSign,
        },
        {
            label: "Vendas no período",
            value: (salesSummary?.count ?? 0).toString(),
            description: `Ticket médio: ${formatCurrency(salesSummary?.averageTicket ?? 0)}`,
            icon: ShoppingCart,
        },
        {
            label: "Parcelas em atraso",
            value: overdueCount.toString(),
            description: `Total: ${formatCurrency(overdueTotal)}`,
            icon: AlertTriangle,
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" },
                gap: 2,
            }}
        >
            {cards.map((card) => (
                <MetricCard key={card.label} {...card} loading={loading} />
            ))}
        </Box>
    );
}
