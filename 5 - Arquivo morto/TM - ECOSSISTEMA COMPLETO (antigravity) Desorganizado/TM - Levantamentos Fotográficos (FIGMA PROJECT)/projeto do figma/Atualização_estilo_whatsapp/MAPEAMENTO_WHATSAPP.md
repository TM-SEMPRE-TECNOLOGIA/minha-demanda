# MAPEAMENTO_WHATSAPP.md

Este documento adapta as regras de negócio originais para a lógica de um Chat Bot / Conversa.

## 1. Regras de Entrada (Setup)
- **Original**: Formulário de 4 campos.
- **WhatsApp**: O bot da MAFFENG envia 4 mensagens sequenciais. A OS só é marcada como "Em Andamento" na store após o técnico responder a última pergunta (Matrícula).

## 2. Regras de Captura (Ambientes)
- **Original**: Grid de seleção.
- **WhatsApp**: Mensagem de "Lista" (estilo WhatsApp API). 
- **Lógica**: Ao clicar em um ambiente, a conversa "foca" nele. O bot envia as instruções específicas do ambiente selecionado.

## 3. Regras de Validação Técnica
- **Validação de Foto**: Quando o usuário envia uma imagem, o sistema analisa os metadados (simulado). 
  - Se for foto de serviço, o bot pergunta: *"Esta foto possui medidas visíveis?"* 
  - Se o usuário disser "Sim", o bot exibe o `double check` azul na bolha.
- **Ambiente Completo**: O bot mantém uma contagem interna. Se o usuário tentar mudar de ambiente sem enviar a foto de detalhe obrigatória, o bot envia um aviso: *"Atenção: A Recepção ainda não possui foto de detalhe. Deseja enviar agora ou continuar depois?"*

## 4. Finalização
- **Comando**: Botão fixo no menu de anexo ou comando de texto `/enviar`.
- **Ação**: O bot gera um "Relatório de Chat" em PDF (simulado) e envia o pacote de dados para o servidor MAFFENG. Uma animação de "Lendo..." seguida de check duplo azul confirma o envio.
