# PROMPT_STITCH_WHATSAPP.md

Abaixo está o prompt otimizado para gerar o aplicativo com a interface **idêntica ao WhatsApp**.

---

## Prompt para Reprodução WhatsApp Style (TMS Chat-Survey)

**CONTEXTO:**
Crie um aplicativo de levantamentos fotográficos técnicos chamado "TMS Conversacional". A interface deve ser **indistinguível da interface do WhatsApp (Web/Mobile)**. O aplicativo transforma um formulário rígido em uma conversa fluida entre o sistema (Auditor) e o técnico de campo.

**STACK TÉCNICA:**
- Vite + React + Tailwind CSS
- Componentes: Chat bubbles, Chat list, Floating input bar.
- Estado: Zustand para armazenar as "mensagens" (que são os dados da OS).

**DESIGN SYSTEM (WHATSAPP SPEC):**
- **Cores (Dark Mode):** BG Principal `#111b21`, Header `#202c33`, Bolha Usuário `#005c4b`, Bolha Sistema `#202c33`.
- **UI Patterns:** 
  - Lista de conversas com avatars circulares e badges de status.
  - Wallpaper de chat (doodle clássico do WA) ao abrir a OS.
  - Data de envio e "check duplo" (azul/cinza) nas bolhas de resposta.
  - Barra inferior com ícone de clipe (+), emoji (opcional), barra de digitação e Ícone de Câmera realçado.

**FLUXO DE INTERAÇÃO:**
1. **Home:** Carregue uma lista de "conversas" que representam as OS pendentes.
2. **Conversation:** Ao entrar, o sistema envia: "Olá! Vamos iniciar o levantamento da [Agência]. Qual o nome do gerente?"
3. **Data Entry:** O usuário responde via chat. O sistema valida e avança para a próxima pergunta.
4. **Photo Capture:** Quando o sistema pede uma foto, o usuário clica no ícone de câmera na barra de input. A foto capturada aparece como uma mensagem de imagem enviada no chat.
5. **Interactive Controls:** Use "Interactive Messages" (botões dentro do chat) para seleção de ambientes (ex: [Sala de Máquinas], [Recepção]).

**OBJETIVO DO CÓDIGO:**
Foque na experiência de "Chat-Bot" humanizado. Garanta que todas as regras de negócio do levantamento técnico (necessidade de foto de detalhe, matrícula obrigatória, etc) sejam orquestradas via mensagens de sistema na thread.
