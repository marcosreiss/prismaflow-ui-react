# Análise de compatibilidade entre `prismaflow-api` e `prismaflow-ui-react` no módulo `sales`

## Escopo analisado

- API: `prismaflow-api/src/modules/sales`
- Front-end: `prismaflow-ui-react/src/modules/sales`

## Resumo executivo

O contrato principal de `create sale`, `get sale by id` e `list sales` continua, em geral, compatível com o consumo atual do front-end. O payload montado pelo front segue o formato esperado pela API refatorada para:

- `clientId`
- `saleDate`
- `prescriptionId`
- `productItems`
- `serviceItems`
- `discount`
- `notes`
- `protocol`

Mesmo assim, encontrei **4 pontos que merecem ajuste no front-end** e **2 pontos de atenção no contrato de resposta**.

## O que está compatível

### Criação de venda

O payload montado em `prismaflow-ui-react/src/modules/sales/utils/salePayloadMapper.ts` permanece alinhado com os DTOs da API:

- `productItems[]` envia `productId`, `quantity` e `frameDetails`
- `serviceItems[]` envia `serviceId`
- `protocol` envia `book`, `page` e `os`

Isso está compatível com:

- `prismaflow-api/src/modules/sales/dtos/sale.dto.ts`
- `prismaflow-api/src/modules/sales/dtos/item-product.dto.ts`
- `prismaflow-api/src/modules/sales/dtos/item-optical-service.dto.ts`
- `prismaflow-api/src/modules/sales/dtos/protocol.dto.ts`

### Resposta detalhada de venda

O `findById` da API ainda retorna os blocos principais esperados pelo front:

- `client`
- `protocol`
- `prescription`
- `productItems`
- `serviceItems`

Referência:

- `prismaflow-api/src/modules/sales/sale.repository.ts:47`

## Ajustes necessários no front-end

### 1. Edição de venda não envia `clientId`

No hook de update, o front remove `clientId` antes de fazer o `PUT`:

- `prismaflow-ui-react/src/modules/sales/hooks/useSales.ts:87`

Trecho atual:

```ts
const { clientId, id, ...updatePayload } = payload;
```

Isso conflita com a API refatorada, que aceita atualização de `clientId`:

- `prismaflow-api/src/modules/sales/dtos/sale.dto.ts`
- `prismaflow-api/src/modules/sales/sale.service.ts` no fluxo `update`

### Impacto

Se o usuário trocar o cliente no modo edição, o back-end nunca receberá essa mudança.

### Recomendação

No front, parar de remover `clientId` do payload de update.

---

### 2. Hidratação do formulário de edição está ignorando o mapper já existente

Existe um mapper específico para converter a resposta da API em `SalePayload`:

- `prismaflow-ui-react/src/modules/sales/utils/mapSaleApiToFormData.ts:16`

Mas o `SaleFormProvider` não usa esse mapper. Hoje ele faz:

- `prismaflow-ui-react/src/modules/sales/context/SaleFormContext.tsx:89`

```ts
resetForm(existingSale as unknown as SalePayload);
```

### Impacto

Isso deixa o formulário dependente da estrutura completa retornada pela API, em vez de depender do formato esperado pelo form. Depois da refatoração da API, esse acoplamento ficou mais arriscado.

Também há um efeito colateral importante:

- o cálculo automático do formulário usa `item.product?.salePrice` e `item.service?.price`
- o mapper atual reduz os itens para `productId` e `serviceId`
- se o front passar a usar o mapper como está, os totais do formulário em edição podem zerar, porque o preço fica apenas na resposta original

### Recomendação

Se o front for desacoplar corretamente o formulário da resposta da API, o ideal é:

1. usar `mapSaleApiToFormData(existingSale)` na hidratação
2. ajustar o mapper para preservar os objetos `product` e `service` necessários para cálculo e exibição no modo edição

---

### 3. Tela de detalhes espera `payment`, mas a API não retorna `payment`

Na página de detalhes, o front tenta ler:

- `prismaflow-ui-react/src/modules/sales/pages/salesDetailsPage.tsx:233`

```ts
sale.payment?.status
```

Mas `payment` não está no `saleIncludeFull` da API:

- `prismaflow-api/src/modules/sales/sale.repository.ts:47`

### Impacto

O campo "Status de Pagamento" sempre tende a aparecer como `"Não informado"` mesmo quando existe pagamento.

### Recomendação

Escolher um dos caminhos:

1. incluir `payment` no `findById` da API
2. remover esse consumo do front se ele não fizer mais parte do contrato do módulo `sales`

---

### 4. Tela de detalhes espera `client.cpf`, mas a API não seleciona esse campo

Na página de detalhes, o front lê:

- `prismaflow-ui-react/src/modules/sales/pages/salesDetailsPage.tsx:293`

```ts
sale?.client?.cpf
```

Mas a API só retorna no cliente:

- `id`
- `name`
- `email`
- `phone01`

Referência:

- `prismaflow-api/src/modules/sales/sale.repository.ts:48`

### Impacto

O CPF tende a aparecer sempre como `"Não informado"` mesmo quando existe na base.

### Recomendação

Escolher um dos caminhos:

1. incluir `cpf` no `select` do cliente no back-end
2. remover esse campo da UI de detalhes

## Pontos de atenção adicionais

### 1. Tipagem do front está mais ampla do que o contrato real retornado pela API

O tipo `Sale` do front permite:

- `payment?: Payment | null`
- `client?: Client | null`

Referência:

- `prismaflow-ui-react/src/modules/sales/types/salesTypes.ts:11`

Mas o contrato real de `findById` hoje não garante `payment`, e o objeto `client` vem parcial.

### Risco

O tipo sugere para quem consome que mais campos existem do que realmente vêm do endpoint.

### Recomendação

Criar tipos específicos por cenário, por exemplo:

- `SaleListItem`
- `SaleDetailsResponse`
- `SaleFormData`

---

### 2. Logs de debug ainda estão presentes no fluxo

Encontrei `console.log` em:

- `prismaflow-ui-react/src/modules/sales/hooks/useSales.ts:68`
- `prismaflow-ui-react/src/modules/sales/hooks/useSales.ts:88`
- `prismaflow-ui-react/src/modules/sales/pages/salesDetailsPage.tsx:102`
- `prismaflow-ui-react/src/modules/sales/context/SaleFormContext.tsx:178`

### Impacto

Não quebra integração, mas polui diagnóstico e pode esconder problemas reais em produção.

## Conclusão

### Precisa ajustar algo no front?

Sim.

Os ajustes com maior prioridade são:

1. enviar `clientId` no `update`
2. revisar a hidratação do formulário de edição para usar um mapper compatível com o contrato atual
3. alinhar a tela de detalhes com o que a API realmente retorna para `payment` e `client.cpf`

### Prioridade sugerida

1. `useUpdateSale` enviar `clientId`
2. `SaleFormProvider` hidratar com mapper adequado
3. alinhar `salesDetailsPage` com o contrato atual da API

## Decisão prática

Se o objetivo é apenas manter o módulo funcionando após a refatoração da API, o front **não parece exigir uma reescrita grande**, mas **exige correções pontuais** para evitar inconsistências no modo edição e na tela de detalhes.
