# Rotas e Navegacao

## Estrutura

O projeto usa `useRoutes` em `src/routes/section.tsx` e separa a aplicacao em:

- `PublicRouter`
- `PrivateRouter`

## Area Publica

Usa `BlankLayout` e hoje concentra:

- `/` -> `LoginPage`

## Area Privada

Usa `DashboardLayout` com `Outlet`.

Rotas principais:

- `/` -> `HomePage`
- `/brands` -> `BrandsPage`
- `/products` -> `ProductsPage`
- `/services` -> `OpticalServicesPage`
- `/clients` -> `ClientsPage`
- `/clients-birthday` -> `ClientsBirthdaysPage`
- `/expiring-prescriptions` -> `ExpiringPrescriptionsPage`
- `/clients/:id/prescriptions` -> `ClientPrescriptionsPage`
- `/sales` -> `SalesPage`
- `/sales/new` -> `CreateSalePage`
- `/sales/edit/:id` -> `CreateSalePage`
- `/sales/:id` -> `SalesDetailsPage`
- `/payments` -> `PaymentsPage`
- `/expenses` -> `ExpensesPage`
- `/dashboard` -> `DashboardPage`

Rotas desconhecidas redirecionam para `/`.

## Menu Lateral

O menu e definido em `src/routes/nav-config.ts` e alimenta `PFSidebar`.

Itens principais:

- Pagina Inicial
- Marcas
- Produtos
- Servicos
- Clientes
- Vendas
- Pagamentos
- Despesas
- Balanco

## Hooks Locais de Navegacao

### `useRouter`

Expõe:

- `back`
- `forward`
- `refresh`
- `push`
- `replace`

### `usePathname`

Expõe o `pathname` atual para componentes como a sidebar.

## Observacoes

- CRUDs simples usam drawers e permanecem na mesma rota
- vendas usam rotas dedicadas para criar, editar e visualizar detalhes
- paginas sao carregadas com `lazy()` e `Suspense`
