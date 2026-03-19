# Organizacao Por Modulos

## Estrategia de Modularizacao

O projeto esta estruturado por dominio em `src/modules`. Cada modulo tende a agrupar:

- paginas
- hooks de query e mutacao
- page controllers
- componentes especificos
- tipos
- utilitarios locais
- contexto local, quando o fluxo exige estado compartilhado mais rico

## Modulos Existentes

### `auth`

Responsavel por autenticacao e login.

Arquivos centrais:

- `pages/LoginPage.tsx`
- `hooks/useAuth.ts`
- `hooks/useLoginPageController.ts`
- `types/auth.ts`

### `branch`

Responsavel por busca de filiais para seletores e filtros.

Arquivo central:

- `useBranch.ts`

### `home`

Modulo da pagina inicial autenticada.

Arquivos centrais:

- `HomePage.tsx`
- `components/HomeHeader.tsx`
- `components/HomeTodayCards.tsx`
- `components/HomeQuickLinks.tsx`

### `brands`

CRUD de marcas.

Arquivos centrais:

- `BrandsPage.tsx`
- `hooks/useBrand.ts`
- `hooks/useBrandPageController.ts`
- `components/BrandDrawer.tsx`

### `products`

CRUD de produtos e consulta de estoque.

Arquivos centrais:

- `ProductsPage.tsx`
- `hooks/useProduct.ts`
- `hooks/useProductPageController.ts`
- `hooks/useProductDrawerController.ts`
- `components/ProductDrawer.tsx`
- `components/ProductCreateBrandModal.tsx`

### `opticalservices`

CRUD de servicos opticos.

Arquivos centrais:

- `OpticalServicesPage.tsx`
- `hooks/useOpticalService.ts`
- `hooks/useOpticalServicePageController.ts`
- `components/OpticalServiceDrawer.tsx`

### `clients`

Cadastro de clientes e receitas.

Arquivos centrais:

- `pages/ClientsPage.tsx`
- `pages/ClientPrescriptionsPage.tsx`
- `pages/ClientsBirthdaysPage.tsx`
- `pages/ExpiringPrescriptionsPage.tsx`
- `hooks/useClient.ts`
- `hooks/usePrescription.ts`
- `hooks/useClientDrawerController.ts`
- `hooks/usePrescriptionModalController.ts`
- `components/ClientDrawer.tsx`
- `components/prescriptionModal/*`

### `sales`

Fluxo de vendas em multiplas etapas.

Arquivos centrais:

- `pages/SalesPage.tsx`
- `pages/CreateSalePage.tsx`
- `pages/salesDetailsPage.tsx`
- `hooks/useSales.ts`
- `hooks/useSaleForm.tsx`
- `context/SaleFormContext.tsx`
- `utils/saleValidators.ts`
- `utils/salePayloadMapper.ts`

### `payments`

Gestao de pagamentos e parcelas.

Arquivos centrais:

- `pages/PaymentsPage.tsx`
- `hooks/usePayments.ts`
- `hooks/usePaymentPageController.ts`
- `hooks/usePaymentDrawerController.ts`
- `components/paymentDrawer.tsx`
- `components/PaymentMethodsBuilder.tsx`
- `components/InstallmentsTable.tsx`

### `expenses`

CRUD de despesas.

Arquivos centrais:

- `ExpensesPage.tsx`
- `hooks/useExpense.ts`
- `hooks/useExpensePageController.ts`
- `components/ExpenseDrawer.tsx`

### `dashboard`

Dashboard analitico.

Arquivos centrais:

- `DashboardPage.tsx`
- `hooks/useDashboard.ts`
- `hooks/useDashboardController.ts`
- `components/DashboardFilters.tsx`
- `components/DashboardMetricCards.tsx`

## Convencoes Observadas

As convencoes mais consistentes entre modulos sao:

- `Page.tsx` para composicao principal da tela
- `use<Entity>.ts` para hooks de dados
- `use<Entity>PageController.ts` para orquestracao da tela
- `Drawer`, `Modal` ou `Dialog` para create/edit/view
- `types/*.ts` para contratos locais
