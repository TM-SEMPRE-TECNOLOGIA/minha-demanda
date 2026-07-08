# BACKLOG.md

| ID | Tela | Título | Descrição | Prioridade | Critério de Aceite |
| :--- | :--- | :--- | :--- | :--- | :--- |
| TASK-001 | Global | Configuração do Design System | Implementar tokens CSS, fontes e componentes base (Button, Card, Input) seguindo o `DESIGN_SYSTEM_FINAL.md`. | P0 - Crítica | Componentes renderizando com cores e fontes corretas em Dark/Light mode. |
| TASK-002 | Login | Recriar Tela de Login | Implementar interface de login com animação de gradiente e validação de campos. | P1 - Alta | Redireciona para /home após submissão válida. |
| TASK-003 | Global | Store de Levantamento (Zustand) | Criar store centralizada para gerenciar o estado do levantamento (`levantamentoData`) com persistência local. | P0 - Crítica | Dados não são perdidos ao recarregar a página. |
| TASK-004 | Dashboard| Lista de OS (Vite/TanStack Query) | Implementar listagem de OS com filtros de busca e indicadores de progresso realistas. | P1 - Alta | Filtra por número/agência em tempo real. |
| TASK-005 | Setup | OS Details Form | Criar formulário de dados técnicos com validação Zod e integração com a store. | P1 - Alta | Habilita botão "Iniciar" apenas com todos os campos preenchidos. |
| TASK-006 | Ambientes| Seleção e Checklist de Ambientes | Implementar grid de ambientes com checkmarks de conclusão e modal para novos ambientes. | P1 - Alta | Permite adicionar ambientes customizados e navegar para captura. |
| TASK-007 | Captura | Fluxo de Captura de Ambiente | Implementar módulo de fotos de vista ampla e lista de serviços pendentes. | P0 - Crítica | Exibe badge de "Ambiente Completo" quando atingir requisitos. |
| TASK-008 | Captura | Fluxo de Captura de Serviço | Criar tela de detalhes do serviço com múltiplos grids de fotos, obs e medidas. | P0 - Crítica | Requer 1 foto de detalhe para validar o serviço. |
| TASK-009 | Revisão | Auditoria Final | Tela de revisão consolidada com estatísticas de fotos e alertas de pendência. | P1 - Alta | Bloqueia envio se houver ambientes declarados como incompletos. |
| TASK-010 | Sucesso | Tela de Fechamento | Interface de confirmação com resumo dos dados enviados e link de retorno. | P2 - Média | Exibe animação de sucesso e limpa a store de levantamento após conclusão. |
