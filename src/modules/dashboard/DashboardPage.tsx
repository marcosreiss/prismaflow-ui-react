// src/modules/dashboard/DashboardPage.tsx
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    useTheme,
} from "@mui/material";
import {
    Home,
    Tag,
    ShoppingCart,
    Box as BoxIcon,
    Users,
    Cake,
    AlertTriangle,
    DollarSign,
    CreditCard,
    Plus,
} from "lucide-react";

type QuickLink = {
    label: string;
    description: string;
    path: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const mainActions: QuickLink[] = [
    {
        label: "Nova Venda",
        description: "Registrar uma nova venda",
        path: "/sales/new",
        Icon: ShoppingCart,
    },
    {
        label: "Vendas",
        description: "Consultar histórico de vendas",
        path: "/sales",
        Icon: DollarSign,
    },
    {
        label: "Pagamentos",
        description: "Acompanhar parcelas e recebimentos",
        path: "/payments",
        Icon: CreditCard,
    },
    {
        label: "Clientes",
        description: "Lista completa de clientes",
        path: "/clients",
        Icon: Users,
    },
    {
        label: "Aniversariantes",
        description: "Clientes que fazem aniversário hoje",
        path: "/clients-birthday",
        Icon: Cake,
    },
    {
        label: "Receitas a vencer",
        description: "Receitas que vencem nos próximos 7 dias",
        path: "/expiring-prescriptions",
        Icon: AlertTriangle,
    },
];

const cadastros: QuickLink[] = [
    {
        label: "Produtos",
        description: "Cadastrar e gerenciar produtos",
        path: "/products",
        Icon: ShoppingCart,
    },
    {
        label: "Marcas",
        description: "Cadastrar e gerenciar marcas",
        path: "/brands",
        Icon: Tag,
    },
    {
        label: "Serviços",
        description: "Cadastrar e gerenciar serviços ópticos",
        path: "/services",
        Icon: BoxIcon,
    },
];

export default function DashboardPage() {
    const navigate = useNavigate();
    const theme = useTheme();

    const renderQuickCard = (item: QuickLink) => {
        const { label, description, path, Icon } = item;

        return (
            <Card
                key={path}
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    borderColor: "grey.200",
                    height: "100%",
                    transition: "box-shadow 0.2s ease, border-color 0.2s ease, transform 0.1s ease",
                    "&:hover": {
                        boxShadow: "0 4px 18px rgba(15,23,42,0.08)",
                        borderColor: "primary.main",
                        transform: "translateY(-1px)",
                    },
                    backgroundColor: "grey.100",
                }}
            >
                <CardActionArea
                    onClick={() => navigate(path)}
                    sx={{ height: "100%" }}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                            p: 2.5,
                        }}
                    >
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "primary.main",
                            }}
                        >
                            <Icon
                                width={20}
                                height={20}
                                color={theme.palette.common?.white ?? "#ffffff"}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ mb: 0.5, color: "text.primary" }}
                            >
                                {label}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                            >
                                {description}
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    };

    return (
        <Box id="dashboardpage">
            {/* Header */}
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

                {/* Ações rápidas */}
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

            {/* Seção Hoje */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1, color: "text.primary" }}
                >
                    Hoje
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
                        gap: 2,
                    }}
                >
                    {/* Esses cards por enquanto podem ficar estáticos ou com dados mockados leves,
              até você ligar na API. */}
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            borderColor: "grey.200",
                            backgroundColor: "grey.100",
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                Aniversariantes de hoje
                            </Typography>
                            <Typography variant="h4" sx={{ color: "text.primary" }}>
                                0
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            borderColor: "grey.200",
                            backgroundColor: "grey.100",
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                Receitas a vencer (7 dias)
                            </Typography>
                            <Typography variant="h4" sx={{ color: "text.primary" }}>
                                0
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Espaços reservados para métricas futuras */}
                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            borderColor: "grey.200",
                            backgroundColor: "grey.100",
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                Vendas de hoje
                            </Typography>
                            <Typography variant="h4" sx={{ color: "text.primary" }}>
                                0
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            borderColor: "grey.200",
                            backgroundColor: "grey.100",
                        }}
                    >
                        <CardContent sx={{ p: 2.5 }}>
                            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>
                                Pagamentos de hoje
                            </Typography>
                            <Typography variant="h4" sx={{ color: "text.primary" }}>
                                0
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Seção Operação do dia a dia */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5, color: "text.primary" }}
                >
                    Operação
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {mainActions.map(renderQuickCard)}
                </Box>
            </Box>

            {/* Seção Cadastros */}
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant="h6"
                    sx={{ mb: 1.5, color: "text.primary" }}
                >
                    Cadastros
                </Typography>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 2,
                    }}
                >
                    {cadastros.map(renderQuickCard)}
                </Box>
            </Box>
        </Box>
    );
}
