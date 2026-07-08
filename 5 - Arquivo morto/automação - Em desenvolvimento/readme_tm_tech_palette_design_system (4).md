# TM Tech Palette Design System

Design system oficial da **TM – Sempre Tecnologia**.

> **Status:** Ativo (padrão atual)

---

## 1) Visão geral
O **TM Tech Palette Design System** define:

- **Tokens** (cores, tipografia, espaçamentos, radius, sombras)
- **Temas** (dark-first)
- **Padrões de UI** (componentes, estados, acessibilidade)
- **Regras de consistência** (nomenclatura e contribuição)

### Objetivos
- Aparência **tech e moderna**
- **Baixa fadiga visual** (uso prolongado)
- Hierarquia clara (background → surfaces → conteúdo → acentos)
- Implementação simples (CSS vars / Tailwind / tokens)

---

## 2) Princípios
1. **Dark-first**: o tema padrão é escuro.
2. **Acentos com moderação**: cores de marca aparecem em CTAs, foco, badges, estados.
3. **Sem hardcode**: usar tokens (CSS variables / theme mapping).
4. **Acessibilidade**: contraste consistente, foco visível, estados claros.

---

## 3) Paleta oficial (Core + Brand)
### Cores base
- **Background**: `#121212`
- **Surface / Card**: `#1E1E1E`
- **Border / Divider**: `#2A2A2A`
- **Text**: `#E8E8E8`
- **Muted**: `#A0A0A0`

### Cores de marca
- **Tech Green (Primary)**: `#00D9A3`
- **Tech Blue (Secondary)**: `#00A3D9`
- **Cyan Accent**: `#00C2B8`

---

## 4) Tokens
### 4.1) Convenções
- `--tm-*` → tokens do design system
- `--tm-color-*` → cores
- `--tm-radius-*` → raios
- `--tm-shadow-*` → sombras
- `--tm-space-*` → espaçamentos

### 4.2) Exemplo (CSS Variables)
```css
:root{
  /* Core */
  --tm-color-bg: #121212;
  --tm-color-surface: #1E1E1E;
  --tm-color-border: #2A2A2A;
  --tm-color-text: #E8E8E8;
  --tm-color-muted: #A0A0A0;

  /* Brand */
  --tm-color-primary: #00D9A3;
  --tm-color-secondary: #00A3D9;
  --tm-color-accent: #00C2B8;

  /* Radius */
  --tm-radius-sm: 10px;
  --tm-radius-md: 14px;
  --tm-radius-lg: 18px;

  /* Shadow (ajuste conforme stack) */
  --tm-shadow-sm: 0 6px 18px rgba(0,0,0,.35);
  --tm-shadow-md: 0 12px 40px rgba(0,0,0,.45);

  /* Spacing */
  --tm-space-1: 6px;
  --tm-space-2: 10px;
  --tm-space-3: 14px;
  --tm-space-4: 18px;
  --tm-space-5: 24px;
}
```

---

## 5) Semântica (recomendado)
Além dos tokens “core”, definir tokens **semânticos** melhora consistência:

- `--tm-surface-1` (cards)
- `--tm-surface-2` (headers/sidebars)
- `--tm-fg` (texto principal)
- `--tm-fg-muted` (texto secundário)
- `--tm-focus` (anel de foco)

Exemplo:
```css
:root{
  --tm-surface-1: var(--tm-color-surface);
  --tm-surface-2: #141414;
  --tm-fg: var(--tm-color-text);
  --tm-fg-muted: var(--tm-color-muted);
  --tm-focus: var(--tm-color-primary);
}
```

---

## 6) Tipografia
### Fontes recomendadas
- **Sans (UI):** `DM Sans`
- **Mono (dados/código):** `IBM Plex Mono`

### Escala sugerida
- `12` (labels)
- `14` (texto padrão)
- `16` (texto confortável)
- `20` (subtítulos)
- `24–32` (títulos)

---

## 7) Componentes (padrões mínimos)
### Botão
Estados obrigatórios:
- default
- hover
- active
- disabled
- focus (anel visível)
- loading (opcional)

Diretriz:
- **Primary** usa `--tm-color-primary`
- **Secondary** usa `--tm-color-secondary` (ou variante outline)
- **Danger** deve ser tokenizado (ex.: `--tm-color-danger`)

### Card
- Background: `--tm-surface-1`
- Border: `--tm-color-border`
- Radius: `--tm-radius-lg`
- Shadow: `--tm-shadow-sm` (aumenta em hover)

### Input
- `border` visível
- `focus ring` consistente
- `placeholder` com contraste adequado

---

## 8) Acessibilidade
Regras práticas:
- Foco sempre visível (ex.: `outline` + `box-shadow` com `--tm-focus`)
- Não depender só de cor (ex.: ícone + texto em estados)
- Contraste alto em textos e elementos críticos

---

## 9) Estrutura recomendada do repositório
```
/design-system
  /tokens
    colors.json
    typography.json
    radius.json
    shadow.json
    spacing.json
  /themes
    dark.css
  /components
    Button/
    Card/
    Input/
  /docs
    usage.md
    migration.md
README.md
```

---

## 10) Governança
### Regras
- Qualquer alteração de cor/tokens deve ser feita **no token**, não no componente.
- Componentes devem consumir **tokens semânticos** sempre que possível.

### Versionamento
- `MAJOR`: quebra visual ou mudança de tokens sem compatibilidade
- `MINOR`: novos tokens/novos componentes
- `PATCH`: ajustes pequenos (shadow, radius, correções)

---

## 11) Migração
- Remover hardcodes de cor
- Mapear para tokens (`--tm-color-*` / `--tm-*`)
- Validar foco/contraste em telas principais

---

## 12) Créditos
Criado e mantido por **TM – Sempre Tecnologia**.

