# Análise de compatibilidade entre `prismaflow-api` e `prismaflow-ui-react` no módulo `payments`

## Escopo analisado

- API: `prismaflow-api/src/modules/payments`
- Front-end: `prismaflow-ui-react/src/modules/payments`

## Resumo executivo

O fluxo principal atualmente usado pela tela de pagamentos do front continua funcional em grande parte:

- listagem de pagamentos
- busca de pagamento por ID
- atualização de métodos/desconto
- atualização de status
- pagamento de parcelas

Mesmo assim, encontrei **4 desalinhamentos relevantes** e **3 pontos de atenção de contrato/tipagem**.

O padrão geral é:

- a API está mais restrita e mais simples do que alguns tipos/hooks do front sugerem
- o front mantém compatibilidade por meio de mapeamentos locais e valores default
- existem hooks e tipos legados no front que já não correspondem mais aos endpoints reais

## O que está compatível

### 1. Fluxo principal da tela de pagamentos

Os endpoints que a tela principal usa hoje existem na API:

- `GET /api/payments`
- `GET /api/payments/:id`
- `PUT /api/payments/:id`
- `PATCH /api/payments/:id/status`
- endpoints de parcelas (`/api/payment-installments/...`)

Referência:

- `prismaflow-api/src/modules/payments/routes/payment.routes.ts:18`
- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:32`
- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:411`
- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:352`
- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:438`

### 2. Listagem de pagamentos

A listagem do front depende de:

- `id`
- `saleId`
- `status`
- `total`
- `paidAmount`
- `installmentsPaid`
- `methods`
- `sale.saleDate`
- `sale.client.name`

O backend fornece isso na consulta paginada:

- `prismaflow-api/src/modules/payments/repository/payment.repository.ts:6`
- `prismaflow-api/src/modules/payments/services/payment.service.ts:49`

O front ainda faz um mapeamento defensivo para normalizar `saleDate`, `clientName` e campos opcionais:

- `prismaflow-ui-react/src/modules/payments/hooks/usePaymentPageController.ts:53`

### 3. Configuração de métodos de pagamento

O fluxo de configuração do drawer está alinhado com as regras principais da API:

- no máximo 2 métodos
- apenas 1 método `INSTALLMENT`
- métodos à vista exigem `paidAt`
- método `INSTALLMENT` exige `installments >= 2` e `firstDueDate`

Referência:

- `prismaflow-api/src/modules/payments/services/payment-update.service.ts:103`
- `prismaflow-api/src/modules/payments/services/payment-update.service.ts:135`
- `prismaflow-ui-react/src/modules/payments/hooks/usePaymentDrawerController.ts:131`

## Ajustes necessários

### 1. Front envia `total` no payload de configuração, mas a API ignora esse campo

O payload do front para `PUT /payments/:id` inclui:

- `total`
- `discount`
- `methods`

Referência:

- `prismaflow-ui-react/src/modules/payments/types/paymentPayloads.ts:15`
- `prismaflow-ui-react/src/modules/payments/hooks/usePaymentDrawerController.ts:156`

Mas o service da API só lê:

- `discount`
- `methods`

Referência:

- `prismaflow-api/src/modules/payments/services/payment-update.service.ts:24`

### Impacto

Hoje isso não quebra o fluxo, mas cria um contrato implícito falso: o front sugere que `total` é configurável via API, quando na prática o backend recalcula/valida tudo com base no estado atual do pagamento.

### Recomendação

Alinhar o tipo/payload do front ao contrato real da API e tratar `total` no front como dado de apoio para validação local, não como campo efetivamente consumido pelo endpoint.

---

### 2. `useCreatePayment` e `useDeletePayment` não correspondem a endpoints existentes na API

No front existem hooks para:

- `POST /api/payments`
- `DELETE /api/payments/:id`

Referência:

- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:321`
- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:388`

Mas esses endpoints não existem nas rotas da API atual:

- `prismaflow-api/src/modules/payments/routes/payment.routes.ts:18`

### Impacto

O hook de exclusão está em uso real na tela:

- `prismaflow-ui-react/src/modules/payments/hooks/usePaymentPageController.ts:186`
- `prismaflow-ui-react/src/modules/payments/hooks/usePaymentPageController.ts:246`

Ou seja: a UI de exclusão hoje depende de um endpoint que não está exposto pelo módulo `payments` da API.

Já o hook de criação parece legado e não foi encontrado em uso no módulo.

### Recomendação

Escolher um dos caminhos:

1. expor `DELETE /api/payments/:id` e, se necessário, `POST /api/payments`
2. remover/desabilitar essas ações do front enquanto o backend não oferecer esse contrato

---

### 3. Tipagem de `PaymentDetails` não reflete o retorno real de `GET /payments/:id`

O tipo `PaymentApiDetailResponse` do front espera, dentro de `sale`:

- `subtotal`
- `discount`
- `notes`
- `clientName`

Referência:

- `prismaflow-ui-react/src/modules/payments/types/paymentDetails.ts:38`

Mas o `paymentInclude` da API retorna na `sale` apenas:

- `id`
- `saleDate`
- `clientId`
- `total`
- `client { id, name }`

Referência:

- `prismaflow-api/src/modules/payments/repository/payment.repository.ts:6`

### Impacto

O front não quebra porque já usa fallback e mapeamento defensivo:

- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:477`

Mas o tipo atual continua mais rico do que a resposta real do endpoint.

### Recomendação

Ajustar `PaymentApiDetailResponse` e `PaymentDetails` para refletirem o contrato real da API ou então ampliar conscientemente o `findById` da API para entregar esses campos.

---

### 4. Tipagem de validação de pagamento não corresponde ao retorno do backend

O front tipa a resposta de validação esperando:

- `stats.sumOfMethods`
- `stats.sumOfInstallments`
- `installments[]`

Referência:

- `prismaflow-ui-react/src/modules/payments/types/paymentValidation.ts:13`

Mas o backend retorna:

- `stats.sumMethods`
- `stats.instantMethodsPaid`
- `methods[]` com `installmentItems[]`

Referência:

- `prismaflow-api/src/modules/payments/services/payment.service.ts:135`
- `prismaflow-api/src/modules/payments/services/payment.service.ts:151`

### Impacto

Hoje isso não apareceu como erro funcional porque não encontrei uso desse hook na UI principal, mas o contrato tipado está incorreto.

### Recomendação

Corrigir a tipagem do front antes de reutilizar `useValidatePayment` em tela real.

## Pontos de atenção

### 1. A API combina filtros sobrescrevendo `where.methods`

No repositório da API, estes filtros escrevem no mesmo campo:

- `method`
- `hasOverdueInstallments`
- `dueDaysAhead`

Referência:

- `prismaflow-api/src/modules/payments/repository/payment.repository.ts:72`
- `prismaflow-api/src/modules/payments/repository/payment.repository.ts:93`
- `prismaflow-api/src/modules/payments/repository/payment.repository.ts:103`

### Risco

Se mais de um desses filtros vier ao mesmo tempo, um pode sobrescrever o outro em vez de combinar as condições.

### Observação

Isso é mais um ponto de regra de consulta do backend do que de consumo do front, mas vale ser registrado porque o front já oferece filtros combináveis.

---

### 2. Respostas de parcelas retornam shape mais rico do que o tipo base `PaymentInstallmentItem`

Os endpoints de parcelas retornam dados enriquecidos com:

- `method`
- `isPaid`
- `isPartiallyPaid`
- `isOverdue`
- `daysOverdue`
- `remainingAmount`

Referência:

- `prismaflow-api/src/modules/payments/services/payment-installment.service.ts:15`

Mas as mutations do front tipam retorno de atualização/pagamento como `PaymentInstallmentItem` simples:

- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:235`
- `prismaflow-ui-react/src/modules/payments/hooks/usePayments.ts:279`

### Impacto

O front usa pouco do payload retornado nessas mutations, então não quebra agora, mas a tipagem não representa bem a resposta real.

---

### 3. Existem duas fontes de verdade para tipos de listagem

O módulo tem tipos muito parecidos em:

- `types/paymentListTypes.ts`
- `types/paymentTypes.ts`

Referência:

- `prismaflow-ui-react/src/modules/payments/types/paymentListTypes.ts:5`
- `prismaflow-ui-react/src/modules/payments/types/paymentTypes.ts:6`

### Risco

Duplicação de tipos facilita drift de contrato. No caso atual, os dois arquivos já são praticamente redundantes.

## Conclusão

### Precisa ajustar algo no front?

Sim, principalmente no alinhamento de contrato e na remoção de expectativas que a API atual não cumpre.

Os pontos mais importantes são:

1. alinhar o payload de configuração para não sugerir que `total` é campo consumido pelo backend
2. revisar exclusão/criação de pagamento no front porque a API atual não expõe esses endpoints
3. corrigir as tipagens de `payment details` e `payment validation` para refletirem o retorno real da API

### Decisão prática

O módulo `payments` não parece quebrado no fluxo principal de visualização/configuração, mas ele está sustentado por:

- mapeamentos defensivos
- tipos mais amplos do que o contrato real
- hooks legados que apontam para endpoints inexistentes

Se a meta for manter o módulo previsível, o próximo passo ideal é consolidar o contrato do front em torno do que a API realmente entrega hoje.
