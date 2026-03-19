# Visao Geral e Arquitetura

## Resumo

O projeto e uma aplicacao React 19 com TypeScript, Vite, Material UI, React Router, React Query e React Hook Form. O frontend esta organizado por dominios de negocio em `src/modules`, com uma camada compartilhada de layout, contexto, componentes reutilizaveis, utilitarios e configuracoes.

O app implementa uma arquitetura centrada em:

- bootstrap global em `src/main.tsx`
- decisao entre area publica e privada em `src/App.tsx`
- roteamento com `useRoutes` em `src/routes/section.tsx`
- providers globais para autenticacao, tema, notificacoes e cache de dados
- modulos de negocio desacoplados por entidade ou fluxo

## Stack Principal

- React 19
- TypeScript
- Vite
- Material UI 7
- React Router DOM 7
- TanStack React Query 5
- React Hook Form 7
- Axios
- Lucide React
- react-imask para entradas mascaradas

## Fluxo de Inicializacao

O bootstrap da aplicacao acontece em `src/main.tsx` nesta ordem:

1. `QueryClientProvider`
2. `BrowserRouter`
3. `AuthProvider`
4. `ThemeModeProvider`
5. `NotificationProvider`
6. `App`
7. `PFToast`
8. `ReactQueryDevtools`

Esse desenho garante que autenticacao, notificacoes, tema e cache estejam disponiveis para todas as rotas.

## Providers Globais

### QueryClientProvider

Define comportamento padrao de React Query:

- `refetchOnWindowFocus: false`
- `refetchOnReconnect: false`
- `retry: 1`
- `staleTime: 5 minutos`

### AuthProvider

Responsavel por:

- persistir `authToken` e `authUser` no `localStorage`
- validar expiracao do JWT com `jwt-decode`
- expor `isAuthenticated()`
- expor `setToken()` para login e branch selection
- expor `useLogout()` para logout e redirecionamento

### ThemeModeProvider

Responsavel por:

- escolher tema light ou dark
- persistir preferencia em `localStorage` com a chave `theme-mode`
- respeitar preferencia salva antes da preferencia do sistema
- aplicar `ThemeProvider` e `CssBaseline`

### NotificationProvider

Responsavel por:

- manter fila de notificacoes em memoria
- expor `addNotification()` e `removeNotification()`
- remover notificacoes automaticamente apos 5 segundos

## Decisao Entre Rotas Publicas e Privadas

`src/App.tsx` consulta `useAuth().isAuthenticated()`.

- `null`: exibe `LinearProgress` enquanto o estado de autenticacao ainda esta sendo resolvido
- `true`: renderiza `PrivateRouter`
- `false`: renderiza `PublicRouter`

## Layouts

### `DashboardLayout`

Layout principal da area autenticada:

- sidebar responsiva com `PFSidebar`
- header superior com `PFHeader`
- area central de conteudo
- padding lateral dinamico conforme largura da sidebar

### `BlankLayout`

Layout da area publica:

- centraliza o conteudo
- aplica background de imagem
- usado pelo login

## Estrutura Base de Pastas

```text
src/
  components/
  config/
  context/
  hooks/
  layout/
  mock/
  modules/
  routes/
  theme/
  utils/
```

## Padrao Arquitetural Predominante

O padrao mais recorrente no projeto e:

1. pagina importa um `pageController`
2. controller concentra estado de UI, eventos e integracao com hooks de dados
3. hooks de dados encapsulam React Query e chamadas Axios
4. drawers, dialogs e formularios usam React Hook Form
5. feedback para usuario passa por `NotificationContext`

Na pratica isso aproxima a camada de pagina de um papel declarativo, deixando a logica operacional em hooks dedicados.
