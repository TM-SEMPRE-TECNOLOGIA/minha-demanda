# TELAS_WHATSAPP.md

---

## TELA: Lista de Conversas (Dashboard)
- **Visual**: Lista vertical idêntica ao WhatsApp.
- **Item**: 
  - Título: Número da OS.
  - Subtítulo: "Local: Agência Centro..."
  - Lado direito: Horário da última atividade e Badge de status (Pendente/Andamento).
  - Avatar: Logo da MAFFENG ou ícone de construção.
- **Ação**: Clicar em uma conversa abre o fluxo de levantamento.

---

## TELA: Conversa do Levantamento (Fluxo Core)
- **Visual**: Thread de chat com wallpaper padrão.
- **Header**: Título (OS-2025-001), Status (Online), Foto da Agência.
- **Mensagens do Sistema (Receiver)**: 
  - "Olá! Vamos iniciar o levantamento para a [Agência]. Por favor, preencha os dados abaixo."
  - "Qual o nome do gerente responsável?"
  - (Após resposta) "Agora, selecione os ambientes que você vai fotografar:"
- **Mensagens do Usuário (Sender)**:
  - Respostas de texto com os dados solicitados.
  - Fotos enviadas (aparecem como thumbnails no chat).
- **Barra Inferior (Input)**: Botão de anexo (+), Campo de texto, Ícone de Câmera (Fixo).

---

## TELA: Selector de Ambientes (Interactive Message)
- **Visual**: Uma mensagem do sistema contendo botões ou uma lista clicável dentro do chat.
- **Interação**: Usuário clica no ambiente desejado -> O chat responde "Ambiente [X] selecionado. Por favor, envie a foto de Vista Ampla."

---

## TELA: Visualizador de Fotos (Review)
- **Visual**: Grid de mídia similar à "Mídia do Grupo" do WhatsApp.
- **Interação**: Ao clicar em "Finalizar", o sistema gera um card de resumo:
  - "Levantamento concluído com sucesso!"
  - Botão: "Ver Resumo Completo".
- **Dados**: Mostra contagem de fotos e serviços anexados à conversa.

---

## TELA: Configurações (Settings)
- **Visual**: Página de configurações padrão do WhatsApp (Perfil, Conta, Conversas, Tema).
- **Ação**: Trocar tema Dark/Light e Foto de Perfil.
