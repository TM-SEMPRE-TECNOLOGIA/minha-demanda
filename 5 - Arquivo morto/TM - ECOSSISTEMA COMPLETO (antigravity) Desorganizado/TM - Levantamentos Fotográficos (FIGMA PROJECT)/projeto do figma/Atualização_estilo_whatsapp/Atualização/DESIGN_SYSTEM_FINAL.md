# DESIGN_SYSTEM_FINAL.md

## 1. Tokens Canônicos (CSS Variables)

### Cores Base (HSL para manipulação dinâmica)
- `--p`: `168 100% 70%` (Primary Neon Green)
- `--s`: `190 100% 50%` (Secondary Cyan)
- `--b1`: `217 65% 12%` (Background Deep Navy)
- `--b2`: `217 58% 16%` (Card/Medium Navy)
- `--er`: `0 100% 65%` (Error Red)

### Tipografia
- **Heading**: `"Exo 2", sans-serif` (700 bold para títulos de página)
- **Body**: `"Inter", sans-serif` (400 regular, 600 semibold)
- **Status/Data**: `"Roboto Mono", monospace` (400 para labels técnicos)

### Spacing & Radius
- **Gap Unit**: `4px`
- **Radius S`: `4px` (Small widgets)
- **Radius M**: `8px` (Buttons, Inputs)
- **Radius L**: `16px` (Cards, Modals)

---

## 2. Componentes de Identidade (Core Components)

### TmsButton
- **Primary**: High contrast, shadow glow neon.
- **Ghost**: Apenas texto e ícone, hover com background sutil.
- **Action Bar**: Botão de largura total, fixo no bottom (sticky/fixed).

### TmsCard
- Bordas sutis (`1px solid var(--tms-navy-light)`).
- Padding: `1.5rem` (24px).
- Click feedback: leve escala (`scale: 0.98`) e mudança de cor da borda para primary.

### TmsInput
- Floating label pattern (opcional, preferencialmente label fixo como no original).
- Ícone de contexto obrigatório (MapPin para local, User para gerente).

---

## 3. Padrões de Layout (Guidelines)

### Tela Mobile Centralizada
- Largura máxima recomendada: `480px`.
- Centralização horizontal em viewports maiores (Desktop).

### Fluxo de Etapas (Step Progress)
- Indicador visual de progresso (`Passo X de Y`) fixo no header.
- Barra de progresso linear abaixo do título da página.

### Grid de Imagens
- Layout flexível: `grid-cols-2` para visualização rápida; `grid-cols-1` com detalhes para revisão.

---

## 4. UX Patterns (Regras de Interação)

### Validação em Tempo Real
- Botões de "Avançar" ou "Salvar" devem permanecer em estado `disabled` visual até que os critérios de aceite (vide `MAPEAMENTO_FUNCIONAL.md`) sejam atingidos.

### Feedback de Sucesso
- Uso de `Haptic Feedback` (se PWA) e animações de check-mark (`Lottie` ou CSS) para confirmar capturas.

### Tratamento de Erro
- Toast notifications para falhas de conexão ou upload.
- Inline validation (border red) em formulários de dados.
