# FIGMA_SYSTEM.md

## 1. Design Tokens

### Paleta de Cores (Dark Mode - Default)
- **Background Principal**: `#0a192f`
- **Background Secundário / Cards**: `#112240`
- **Bordas / Divisores**: `#1a365d`
- **Primária (Destaque)**: `#64ffda` (Neon Green)
- **Secundária (Acento)**: `#00d4ff` (Cyan Vibrant)
- **Texto Primário (High Emphasis)**: `#e6f1ff`
- **Texto Secundário (Medium Emphasis)**: `#8892b0`
- **Erro**: `#ff4d4d`
- **Aviso**: `#ffa500`

### Tipografia
- **Títulos (Headings)**: Font Family `"Exo 2"`. Pesos: 600, 700.
- **Corpo (Body)**: Font Family `"Inter"`. Pesos: 400, 500, 600. Base size: `14px` (UI) / `16px` (Web).
- **Dados Técnicos (Mono)**: Font Family `"Roboto Mono"`. Pesos: 400, 500.

### Espaçamento e Grid
- **Escala Base**: 8px (4, 8, 16, 24, 32, 48, 64).
- **Paddings Internos**: `16px` padrão para containers.
- **Margins entre Elementos**: `24px` para seções principais.

### Formas e Efeitos
- **Raio de Borda (Radius)**:
  - `8px` para Buttons e Inputs.
  - `16px` para Cards e Modais.
- **Sombras (Shadows)**: Sutis, baseadas em opacidade da cor primária (ex: `box-shadow: 0 0 20px rgba(100, 255, 218, 0.3)`).

---

## 2. Componentes e Variantes

### Botões (Buttons)
- **Primário**: Background `#64ffda`, Texto `#0a192f`. Label em UPPERCASE. Ícone à esquerda.
- **Secundário**: Outline `#64ffda`, Texto `#64ffda`, Fundo Transparente.
- **Terciário**: Sem borda/fundo. Texto `#00d4ff`.

### Inputs
- **Base**: Fundo `#0a192f`, Borda `#1a365d`.
- **Focus**: Borda `#64ffda`.
- **Error**: Borda `#ff4d4d`.

### Card
- **Fundo**: `#112240`.
- **Borda**: `#1a365d` (ou cor de status se aplicável).
- **Conteúdo**: Título em `#e6f1ff`, subtítulo em `#8892b0`.

### Módulo de Fotografia
- **Layout**: Grid 2x2 para miniaturas.
- **Thumbnails**: Aspect Ratio `4:3` ou `1:1`.
- **Status Overlay**: Indica se a foto foi validada ou está pendente.

---

## 3. Estados Visuais
- **Hover/Active**: Escurecimento ou aumento de brilho (glow) de 10-15%.
- **Disabled**: Opacidade `0.5`, Cursor `not-allowed`.
- **Loading**: Skeleton screens baseados no background secundário.
