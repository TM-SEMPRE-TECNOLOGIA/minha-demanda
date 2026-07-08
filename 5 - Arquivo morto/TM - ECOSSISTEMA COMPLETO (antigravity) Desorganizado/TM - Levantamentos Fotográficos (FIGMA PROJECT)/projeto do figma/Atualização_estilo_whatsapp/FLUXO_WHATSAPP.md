# FLUXO_WHATSAPP.md

## 1. Jornada de Chat (Conversational UI)

### Passo 1: Início (Dashboard to Chat)
- Técnico visualiza a lista de "conversas" (OSs).
- Ao clicar na conversa "OS-2025-001", a thread é aberta.
- O sistema já enviou uma mensagem inicial: *"Olá técnico! Pronto para o levantamento da Agência Centro? Digite o nome do gerente para começar."*

### Passo 2: Coleta de Dados (Setup)
- Técnico digita: "Carlos Silva".
- Sistema responde: *"Ótimo. E qual a matrícula dele?"*
- Técnico responde: "TEC-12345".
- Sistema envia um card interativo: *"Selecione os ambientes (clique em um ou mais):"*
  - [Botão: Sala de Autoatendimento]
  - [Botão: Recepção]
  - [Botão: Copa]
  - [Link: + Adicionar outro]

### Passo 3: Fluxo de Captura (Multimedia)
- Quando o técnico clica em um ambiente no chat, o sistema "entra" no modo de captura:
  - Sistema: *"Ambiente: Recepção. Envie a foto de Vista Ampla (opcional) ou clique na câmera para registrar um serviço."*
- Técnico anexa foto -> Aparece na conversa.
- Técnico digita: "Pintura de Parede" -> Sistema entende como novo serviço -> *"Registrando Pintura. Agora envie as fotos de detalhes e medidas."*

### Passo 4: Fechamento (Review)
- Técnico clica em um botão "Finalizar" no menu de ações do chat (ou digita /finalizar).
- Sistema envia um resumo visual:
  - *"Revisão do Levantamento: 3 ambientes, 12 fotos. Tudo ok?"*
  - [Botão: Confirmar e Enviar]
  - [Botão: Revisar Mídia]

---

## 2. Regras de Interface Chat
- **Digitando...**: Exibido no cabeçalho quando o sistema está processando uma foto enviada (ex: compressão).
- **Status de Entrega**:
  - `One check`: Foto salva localmente.
  - `Blue checks`: Sincronizado com o servidor.
- **Resposta Rápida**: Opções pré-definidas para ambientes aparecem como sugestões acima do teclado.
