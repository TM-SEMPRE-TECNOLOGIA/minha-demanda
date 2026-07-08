# MAPEAMENTO_FUNCIONAL.md

## 1. LoginScreen
- **Objetivo**: Autenticar o técnico no sistema.
- **Usuário**: Técnico de campo.
- **Ações**: Inserir credenciais (simulado), alternar visibilidade de senha, submeter login.
- **Validações**: Campos obrigatórios (implícito).
- **Regras**: Redireciona para a tela `home` após sucesso.
- **Estados**: `showPassword` (boolean), `loginData` (email/password).

## 2. HomeScreen
- **Objetivo**: Ponto de partida para as principais jornadas.
- **Usuário**: Técnico de campo.
- **Ações**: Navegar para Dashboard (Iniciar Levantamento), Enviados ou Configurações.
- **Regras**: Exibe foto do usuário se disponível.

## 3. DashboardScreen
- **Objetivo**: Listar Ordens de Serviço (OS) pendentes ou em andamento.
- **Ações**: Buscar OS (texto), selecionar OS para iniciar/continuar.
- **Validações**: Filtra apenas OS com status diferente de "Concluído".
- **Regras**: Exibe progresso visual se a OS estiver "Em Andamento".
- **Estados**: `searchTerm`.

## 4. OSDetailsScreen
- **Objetivo**: Confirmar e complementar dados da OS antes de iniciar a coleta física.
- **Ações**: Editar nome do local, código da agência, nome do gerente, inserir matrícula do técnico.
- **Validações**: Todos os campos são obrigatórios para habilitar "Iniciar Levantamento".
- **Regras**: Atualiza o estado global `levantamentoData` com os dados do formulário.

## 5. EnvironmentSelectionScreen
- **Objetivo**: Definir o escopo de ambientes do levantamento.
- **Ações**: Selecionar ambientes prévios, adicionar ambientes customizados, remover ambientes customizados, navegar para captura de um ambiente, finalizar levantamento.
- **Validações**: Botão "Finalizar" só habilita se todos os ambientes selecionados estiverem com status "Concluído".
- **Regras**: Ambientes podem ter status "Pendente" ou "Concluído" baseado na regra da tela de captura.
- **Estados**: `showAddDialog` (modal), `newEnvironmentName`.

## 6. CaptureScreen
- **Objetivo**: Coletar evidências macro (vista ampla) e listar serviços do ambiente.
- **Ações**: Tirar foto de vista ampla, remover foto, adicionar novo serviço, remover serviço, navegar para captura de serviço, salvar ambiente.
- **Validações**: Ambiente é considerado "Completo" se tiver pelo menos um serviço com fotos de detalhe registradas.
- **Regras**: Foto de vista ampla é opcional.
- **Estados**: `newServiceName`.

## 7. ServiceCaptureScreen
- **Objetivo**: Detalhar tecnicamente um serviço executado.
- **Ações**: Capturar fotos gerais do serviço, fotos de detalhes (macro), inserir observações, inserir medidas.
- **Validações**: Requer pelo menos uma foto de detalhe para marcar o serviço como concluído.
- **Regras**: Permite múltiplas fotos por categoria.

## 8. ReviewScreen
- **Objetivo**: Auditoria final pelo técnico antes do envio.
- **Ações**: Revisar dados da OS, conferir contagem de fotos por ambiente, verificar status de conclusão, enviar levantamento.
- **Validações**: Impede o envio se houver ambientes incompletos.
- **Regras**: Consolida estatísticas de todos os ambientes selecionados.

## 9. SuccessScreen
- **Objetivo**: Confirmar o sucesso da operação e fornecer feedback de processamento.
- **Ações**: Voltar ao Dashboard.
- **Regras**: Exibe checklist visual de etapas de backend concluídas (simulado).
