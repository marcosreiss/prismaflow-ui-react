# Componentes e Responsabilidades

## Layout e Navegacao

### `PFHeader`

Responsavel por:

- exibir avatar e dados do usuario autenticado
- acionar logout
- alternar tema claro/escuro
- exibir botao hamburguer no mobile

### `PFSidebar`

Responsavel por:

- renderizar menu lateral com base em `navData`
- suportar drawer temporario no mobile e permanente no desktop
- marcar item ativo conforme `pathname`

Subcomponentes relacionados:

- `PFSidebarLogo`
- `PFSidebarItem`
- `PFSidebarSubItem`

## Feedback e Resiliencia

### `PFToast`

Responsavel por renderizar os toasts produzidos por `NotificationContext`.

### `PFErrorBoundary`

Responsavel por capturar erros de renderizacao abaixo de `App`.

### `PFConfirmDialog`

Responsavel por confirmacoes padronizadas de exclusao e outras acoes destrutivas.

### `ConfirmCloseDialog`

Responsavel por proteger o fechamento de fluxos com alteracoes nao salvas.

## CRUD Compartilhado

### `PFTable`

Componente generico de tabela responsiva com:

- modo tabela para desktop
- modo card para mobile
- paginação
- acoes por linha
- selecao individual e em massa
- loading e estado vazio

### `PFTopToolbar`

Padroniza:

- titulo da tela
- busca com debounce
- refresh
- criacao
- filtros customizados
- acoes extras

### `PFRowActionsMenu`

Encapsula acoes de visualizar, editar e excluir por linha.

### `PFDrawerModal`

Componente generico para formularios em drawer com React Hook Form. O projeto tambem usa drawers especificos quando ha regras ou layouts mais complexos.

## Inputs e Mascaras

Em `src/components/imask` o projeto padroniza campos como:

- moeda
- percentual
- CPF, CNPJ, CEP e telefone
- campos opticos como eixo, esferico, adicao e DNP

Esses componentes reduzem codigo repetido e ajudam a garantir formato consistente.

## Fluxos Especificos

### Vendas

Componentes principais:

- `SaleFormManager`
- `SaleFormHeader`
- `SaleFormActions`
- `SaleSummary`
- `StepperNavigation`
- steps `ClientStep`, `ProductsStep`, `ProtocolStep`, `ReviewStep`

### Pagamentos

Componentes principais:

- `paymentDrawer`
- `PaymentView`
- `PaymentMethodsBuilder`
- `PaymentFilters`
- `InstallmentsTable`
- dialogs de pagamento e edicao de parcela

### Clientes e Receitas

Componentes principais:

- `ClientDrawer`
- `PrescriptionModal`
- `PrescriptionForm`
- `PrescriptionEyeFields`
- `PrescriptionView`
- modais de mensagens operacionais

## Regra Geral de Responsabilidade

O projeto segue, em geral, esta divisao:

- pagina compoe a tela
- controller orquestra estado e eventos
- hook de dados fala com a API
- componente compartilhado resolve padrao recorrente
- drawer ou dialog especifico executa o caso de uso da feature
