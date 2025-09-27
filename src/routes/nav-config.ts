import type { NavItem } from "@/design-system/components/pfsidebar/types";

export const navData: NavItem[] = [
  { title: "Página Inicial", path: "/", icon: "Home" },
  {
    title: "Cadastros",
    icon: "Folder",
    children: [
      { title: "Categorias", path: "/categorias", icon: "Layers" },
      { title: "Clientes", path: "/customers", icon: "User" },
      { title: "Produtos", path: "/products", icon: "Box" },
      { title: "Serviços", path: "/services", icon: "Briefcase" },
      { title: "Marcas", path: "/brands", icon: "Tag" },
      { title: "Marcas PF", path: "/pf-brandpage", icon: "Tag" },

    ],
  },
  { title: "Gestão", path: "/gestao", icon: "Settings" },
  { title: "Relatórios", path: "/relatorios", icon: "BarChart" },
];
