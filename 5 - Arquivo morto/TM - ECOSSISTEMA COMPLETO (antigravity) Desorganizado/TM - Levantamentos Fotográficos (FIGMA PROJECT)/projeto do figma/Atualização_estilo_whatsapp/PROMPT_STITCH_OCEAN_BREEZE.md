# PROMPT_STITCH_OCEAN_BREEZE.md

## Prompt para Reprodução: TMS Chat-Survey (Ocean Breeze + WhatsApp)

**CONTEXTO:**
Crie um aplicativo de levantamentos fotográficos técnicos com interface de chat **idêntica ao WhatsApp**, mas utilizando a paleta visual e tokens do **Ocean Breeze Design System v2.0**.

**STACK TÉCNICA:**
- Vite + React + Tailwind CSS
- Componentes: Chat bubbles, Chat list, Floating input bar
- Estado: Zustand para armazenar mensagens e dados da OS

**DESIGN SYSTEM (OCEAN BREEZE + WHATSAPP HYBRID):**

### Cores (Modo Claro)
- Background Principal: `#f0f8ff`
- Bolha do Usuário (Sender): `#22c55e` (Verde Ocean Breeze)
- Bolha do Sistema (Receiver): `#ffffff` com borda `#e5e7eb`
- Header: `#ffffff` com sombra suave
- Input Bar: `#ffffff` com borda `#e5e7eb`

### Cores (Modo Escuro)
- Background: `#0f172a`
- Bolha do Usuário: `#34d399`
- Bolha do Sistema: `#1e293b` com borda `#4b5563`
- Header: `#1e293b`

### Tipografia
- Font Family: `"DM Sans", sans-serif`
- Font Mono: `"IBM Plex Mono", monospace`
- Tamanhos: 14px (mensagens), 11px (timestamps)

### Componentes Visuais
- **Radius**: `var(--TM-radius-lg)` (0.5rem) para bolhas
- **Shadows**: `var(--TM-shadow-sm)` para cards, `var(--TM-shadow-md)` para bolhas do usuário
- **Transitions**: `all 0.2s ease` para hover states

**FLUXO DE INTERAÇÃO:**
1. **Lista de Conversas**: Exibe OSs pendentes como conversas do WhatsApp (avatar, título, última mensagem, timestamp)
2. **Thread de Chat**: Sistema envia mensagens perguntando dados (gerente, matrícula, etc)
3. **Respostas do Usuário**: Aparecem como bolhas verdes alinhadas à direita
4. **Anexo de Fotos**: Ícone de câmera na input bar. Fotos aparecem como thumbnails no chat
5. **Interactive Buttons**: Seleção de ambientes via botões dentro de mensagens do sistema

**REGRAS DE NEGÓCIO:**
- Validação de campos obrigatórios antes de avançar
- Fotos de detalhe obrigatórias para marcar serviço como completo
- Status checks (✓ cinza = salvo local, ✓✓ verde = sincronizado)

**OBJETIVO:**
Gere uma interface de chat profissional e moderna que combine a familiaridade do WhatsApp com a identidade visual clean e oceânica do Ocean Breeze.
