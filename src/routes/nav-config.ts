import type { NavItem } from "@/components/pfsidebar/types";

export const navData: NavItem[] = [
  { title: "Página Inicial", path: "/", icon: "Home" },
  { title: "Marcas", path: "/brands", icon: "Tag" },
  { title: "Produtos", path: "/products", icon: "ShoppingCart" },
  { title: "Serviços", path: "/services", icon: "Box" },
  { title: "Clientes", path: "/clients", icon: "Users" },
  { title: "Aniversariantes do dia", path: "/clients-birthday", icon: "Users" },
  { title: "Receitas Vencidas", path: "/expiring-prescriptions", icon: "Users" },
  { title: "Vendas", path: "/sales", icon: "DollarSign" },
  // { title: "Pagamentos", path: "/payments", icon: "CreditCard" },
];
