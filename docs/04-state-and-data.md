# Gerenciamento de Estado e Dados

## Visao Geral

O projeto combina tres camadas principais de estado:

- estado global leve com Context API
- estado remoto e cache com React Query
- estado local com hooks React e React Hook Form

## Estado Global

### `AuthContext`

Guarda:

- token JWT
- dados do usuario autenticado

Expõe:

- `setToken`
- `isAuthenticated`
- `useLogout`

Persistencia:

- `authToken`
- `authUser`

### `NotificationContext`

Guarda notificacoes em memoria e expõe:

- `addNotification(message, type)`
- `removeNotification(id)`

### `ThemeContext`

Guarda o modo de tema e expõe `toggleMode`.

Persistencia:

- `theme-mode`

## React Query

O projeto usa React Query como fonte de verdade para estado remoto.

Padroes observados:

- `useQuery` para leitura
- `useMutation` para escrita
- `invalidateQueries` apos mutacao
- `keepPreviousData` em listagens paginadas

## Chaves de Cache

Exemplos:

- `["brands", page, limit, search]`
- `["products", page, limit, search, category, brandId]`
- `["clients", page, limit, search, branchId]`
- `["payments", page, limit, ...filters]`
- `["payment", "details", id]`
- `["dashboard", "balance", filters]`

## Politicas Globais

Definidas no `QueryClient`:

- sem refetch ao focar a janela
- sem refetch ao reconectar
- `retry: 1`
- `staleTime: 5 minutos`

## Estado Local de Pagina

Cada page controller centraliza:

- pagina atual
- limite de itens
- busca e filtros
- item selecionado
- visibilidade de drawer e dialogs
- selecao em massa

Exemplos claros:

- `useProductPageController`
- `usePaymentPageController`
- `useSalesPageController`

## Estado de Fluxo Complexo

### `SaleFormContext`

O fluxo de vendas compartilha entre varios componentes:

- formulario principal
- step ativo
- cliente selecionado
- receita selecionada
- adicao e remocao de produtos e servicos
- rascunho
- submissao final

## Persistencia Local

O projeto usa `localStorage` para:

- autenticacao
- tema
- remember me do login
- rascunho de receita
- rascunho de venda

Chaves observadas:

- `authToken`
- `authUser`
- `theme-mode`
- `pf.remember`
- `pf.creds`
- `pf.prescription.draft.<clientId>`
- `saleFormDraft`
- `tempAuthToken`
- `availableBranches`
