# Formularios e Validacoes

## Visao Geral

React Hook Form e a base de todos os formularios relevantes do sistema. O projeto combina:

- `useForm`
- `FormProvider`
- `useFormContext`
- `Controller`
- `useFieldArray`
- `useWatch`

## Padrao Base

O padrao mais comum e:

1. controller cria `useForm`
2. formulario usa `FormProvider`
3. campos MUI controlados usam `Controller`
4. submit chama mutation assicrona
5. notificacoes informam sucesso, erro ou aviso

## CRUDs Simples

Exemplos:

- `BrandDrawer`
- `OpticalServiceDrawer`
- `ExpenseDrawer`
- `ClientDrawer`
- `ProductDrawer`

Caracteristicas:

- `defaultValues` locais
- `reset` ao abrir ou trocar modo
- foco automatico no primeiro campo
- tratamento de erro padronizado

## Receitas

O fluxo de receitas e o mais rico do projeto.

Arquivos principais:

- `usePrescriptionModalController.ts`
- `usePrescriptionValidation.ts`
- `usePrescriptionFormBehavior.ts`
- `PrescriptionForm.tsx`
- `PrescriptionEyeFields.tsx`

Regras observadas:

- data obrigatoria, nao futura e limitada a 5 anos
- CRM com faixa de digitos
- validacao dinamica de eixo, adicao, DNP e centro optico
- exibicao condicional de campos conforme `lensType`
- autofill de campos de perto para certos tipos de lente
- salvamento de rascunho em `localStorage`

## Vendas

Arquivos principais:

- `useSaleForm.tsx`
- `SaleFormContext.tsx`
- `saleValidators.ts`
- `salePayloadMapper.ts`

Regras observadas:

- formulario em etapas
- subtotal e total recalculados com `useWatch`
- validacao de estoque antes de adicionar produto
- protocolo habilitado quando ha lente
- validacao final dos steps antes do submit
- normalizacao do payload para API

## Pagamentos

Arquivos principais:

- `usePaymentDrawerController.ts`
- `PaymentMethodsBuilder.tsx`

Regras observadas:

- `useFieldArray` para `methods[]`
- no maximo 2 metodos de pagamento
- soma dos metodos deve bater com total menos desconto
- `paidAt` obrigatorio para metodos a vista
- `firstDueDate` obrigatorio para parcelamento

## Login

`useLoginPageController.ts` usa React Hook Form para:

- email
- senha
- remember me

Tambem hidrata credenciais descriptografadas quando o recurso foi usado anteriormente.
