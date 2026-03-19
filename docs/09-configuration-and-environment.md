# Variaveis de Ambiente e Configuracao

## Variaveis de Ambiente

As variaveis de ambiente lidas pelo frontend sao injetadas via `import.meta.env`.

## Variaveis Identificadas

### `VITE_API_BASE_URL`

Uso:

- define a `baseURL` do cliente Axios

### `VITE_BIRTHDAY_MESSAGE_TEMPLATE`

Uso:

- template de mensagem para aniversariantes

### `VITE_EXPIRING_PRESCRIPTION_MESSAGE_TEMPLATE`

Uso:

- template de mensagem para receitas vencidas

Observacao:

- essa variavel aparece no codigo, mas nao esta no `.env.example` atual

## Arquivos de Configuracao

### `vite.config.ts`

Configuracoes relevantes:

- plugin React
- alias `@` para `src`
- `server.host = true`

### `tsconfig.app.json`

Configuracoes relevantes:

- `strict: true`
- `baseUrl: "."`
- path alias `@/* -> src/*`
- `moduleResolution: bundler`

### `package.json`

Define o conjunto de dependencias e scripts do projeto.

## Tema e UI

Arquivos principais:

- `src/theme/prismaTheme.ts`
- `src/theme/prismaDarkTheme.ts`
- `src/context/theme/*`

## Persistencia Local

Principais chaves:

- `authToken`
- `authUser`
- `tempAuthToken`
- `availableBranches`
- `theme-mode`
- `pf.remember`
- `pf.creds`
- `saleFormDraft`
- `pf.prescription.draft.<clientId>`

## Outras Convencoes

- alias `@` para imports absolutos internos
- `ApiResponse<T>` como contrato padrao de resposta
- `global.css` com reset simples
- arquivos em `src/config` como apoio a configuracoes de entidades, com uso parcial no estado atual
