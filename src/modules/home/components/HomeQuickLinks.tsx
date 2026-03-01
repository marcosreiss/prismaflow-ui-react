// src/modules/dashboard/components/DashboardQuickLinks.tsx
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Typography,
    useTheme,
} from "@mui/material";
import {
    ShoppingCart,
    DollarSign,
    CreditCard,
    Users,
    Cake,
    AlertTriangle,
    ShoppingCart as ProductIcon,
    Tag,
    Box as BoxIcon,
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
        Icon: ProductIcon,
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

function QuickCard({ item }: { item: QuickLink }) {
    const navigate = useNavigate();
    const theme = useTheme();
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
            <CardActionArea onClick={() => navigate(path)} sx={{ height: "100%" }}>
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
                        <Icon height={20} width={20} color={theme.palette.common?.white ?? "#ffffff"} />
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
}

export function HomeMainActions() {
    return (
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
            {mainActions.map((item) => (
                <QuickCard key={item.path} item={item} />
            ))}
        </Box>
    );
}

export function HomeCadastros() {
    return (
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
            {cadastros.map((item) => (
                <QuickCard key={item.path} item={item} />
            ))}
        </Box>
    );
}
