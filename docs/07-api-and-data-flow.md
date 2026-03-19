# Fluxo de Dados e Chamadas a API

## Cliente HTTP

Toda a comunicacao HTTP do frontend parte de `src/utils/axios.ts`.

Configuracao atual:

- `baseURL = import.meta.env.VITE_API_BASE_URL`
- `Content-Type: application/json`
- `timeout: 20000`

Interceptador de request:

- le `authToken` do `localStorage`
- injeta `Authorization: Bearer <token>`

## Contrato Base da API

O tipo generico `ApiResponse<T>` define a forma de resposta esperada:

- `status`
- `message`
- `data`
- `timestamp`
- `path`

## Fluxo Geral

Padrao dominante:

1. pagina ou drawer aciona um handler
2. controller organiza parametros e regras de UI
3. hook React Query executa `get/post/put/patch/delete`
4. mutacao invalida queries relacionadas
5. notificacao informa o resultado

## Endpoints por Dominio

### Autenticacao

- `POST /api/auth/login`
- `POST /api/auth/branch-selection`
- `POST /api/auth/register-user`

### Filiais

- `GET /api/branches/select`

### Marcas

- `GET /api/brands`
- `GET /api/brands/:id`
- `POST /api/brands`
- `PUT /api/brands/:id`
- `DELETE /api/brands/:id`

### Produtos

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/:id/stock`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Servicos opticos

- `GET /api/optical-services`
- `GET /api/optical-services/:id`
- `POST /api/optical-services`
- `PUT /api/optical-services/:id`
- `DELETE /api/optical-services/:id`

### Clientes e receitas

- `GET /api/clients`
- `GET /api/clients/:id`
- `GET /api/clients/select`
- `GET /api/clients/birthdays`
- `POST /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`
- `GET /api/prescriptions`
- `GET /api/prescriptions/:id`
- `GET /api/prescriptions/expired`
- `GET /api/clients/:clientId/prescriptions`
- `POST /api/prescriptions`
- `PUT /api/prescriptions/:id`
- `DELETE /api/prescriptions/:id`

### Vendas

- `GET /api/sales`
- `GET /api/sales/:id`
- `POST /api/sales`
- `PUT /api/sales/:id`
- `DELETE /api/sales/:id`

### Pagamentos

- `GET /api/payments`
- `GET /api/payments/:id`
- `GET /api/payments/:id/validate`
- `GET /api/payments/by-sale/:saleId`
- `POST /api/payments`
- `PUT /api/payments/:id`
- `PATCH /api/payments/:id/status`
- `DELETE /api/payments/:id`
- `GET /api/payment-installments/by-payment/:paymentId`
- `GET /api/payment-installments/:id`
- `GET /api/payment-installments/overdue`
- `PATCH /api/payment-installments/:id/pay`
- `PUT /api/payment-installments/:id`

### Despesas

- `GET /api/expenses`
- `GET /api/expenses/:id`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`

### Dashboard

- `GET /api/dashboard/balance`
- `GET /api/dashboard/sales-summary`
- `GET /api/dashboard/payments-status`
- `GET /api/dashboard/top-products`
- `GET /api/dashboard/top-clients`
- `GET /api/dashboard/overdue-installments`

## Transformacoes

Alguns fluxos aplicam normalizacao antes ou depois da API.

Exemplos:

- `buildSalePayload`
- `cleanPayload`
- mapeamento de `PaymentDetails` em `useGetPaymentById`
- formatacao de datas no fluxo de receitas

## Fluxo Especial de Login com Filial

Quando o login exige selecao de filial:

1. backend devolve `branches` e `tempToken`
2. frontend salva `tempAuthToken`
3. usuario escolhe a filial
4. frontend chama `/api/auth/branch-selection`
5. resposta final define token e usuario autenticado
