import type { NavItem } from "@/components/pfsidebar/types";

export const navData: NavItem[] = [
  { title: "Página Inicial", path: "/", icon: "Home" },
  { title: "Marcas", path: "/brands", icon: "Tag" },
  { title: "Produtos", path: "/products", icon: "ShoppingCart" },
  { title: "Serviços", path: "/services", icon: "Box" },
  {
    title: "Clientes",
    icon: "Users",
    children: [
      {
        title: "Lista de Clientes",
        path: "/clients",
        icon: "List",
      },
      {
        title: "Aniversariantes do dia",
        path: "/clients-birthday",
        icon: "Cake",
      },
      {
        title: "Receitas Vencidas",
        path: "/expiring-prescriptions",
        icon: "AlertTriangle",
      },
    ],
  },
  { title: "Vendas", path: "/sales", icon: "DollarSign" },
  { title: "Pagamentos", path: "/payments", icon: "CreditCard" },
];
