# Uso e Padronizacao do MUI

## Tema

O projeto possui dois temas em `src/theme`:

- `prismaTheme.ts`
- `prismaDarkTheme.ts`

O tema ativo e decidido por `ThemeModeProvider`.

## Paleta e Tipografia

Padroes principais:

- azul principal `#2563eb`
- tipografia baseada em `Inter`
- uso pontual de `Poppins`
- textos secundarios em tons de cinza
- `button.textTransform = "none"`

## Overrides Globais

### `MuiButton`

- cantos arredondados
- sem sombra
- hover sem elevacao adicional

### `MuiTextField`

- `OutlinedInput` com raio 8
- bordas em cinza
- foco em azul

### `MuiIconButton`

- cor coerente com o tema
- hover suave por fundo

### `MuiTypography`

- cor base sincronizada com o tema

## Convencoes de UI

Padroes visuais recorrentes:

- `Paper` como container principal de pagina
- `Drawer` para CRUDs e detalhes
- `Dialog` para confirmacoes e fluxos pontuais
- uso intenso da prop `sx`
- responsividade por `xs`, `sm`, `md`, `lg`

## Responsividade

O projeto aplica responsividade em varios pontos:

- `PFTable` muda para cards no mobile
- toolbar vira coluna no mobile
- sidebar e temporaria no mobile e permanente no desktop
- drawers usam largura adaptativa

## Componentes Base de UI

Os componentes compartilhados que materializam o padrao visual sao:

- `PFTable`
- `PFTopToolbar`
- `PFConfirmDialog`
- `PFToast`
- `PFHeader`
- `PFSidebar`

## Observacoes

- parte da UI esta bem padronizada
- drawers especificos repetem algumas estruturas por necessidade de negocio
- `PFDrawerModal` existe como alternativa generica, mas nao e a unica estrategia adotada
