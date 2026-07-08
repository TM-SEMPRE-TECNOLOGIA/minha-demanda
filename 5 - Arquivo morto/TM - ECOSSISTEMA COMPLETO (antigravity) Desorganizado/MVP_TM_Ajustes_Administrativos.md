# MVP - TM Ajustes Administrativos

## 1. Objetivo do MVP

Validar se administradores do sistema necessitam de uma interface centralizada para gerenciar configurações, usuários e parâmetros operacionais do ecossistema MAFFENG, reduzindo em 70% o tempo gasto com ajustes manuais no banco de dados. A hipótese principal é que uma interface administrativa amigável elimina a necessidade de intervenção técnica (SQL direto) para operações rotineiras.

## 2. Público-Alvo Inicial

### Perfil 1
- **Administrador do sistema** (TI interno ou Thiago)
- Responsável por cadastrar usuários, definir permissões e configurar parâmetros
- Atualmente precisa acessar diretamente o Supabase ou rodar scripts SQL

### Perfil 2
- **Coordenador administrativo** com permissões elevadas
- Gerencia cadastros de clientes, tipos de serviço e templates
- Necessita de autonomia sem depender de TI

### Critérios de Exclusão
- Usuários operacionais (técnicos, analistas) que não precisam de acesso administrativo
- Configurações técnicas avançadas (infraestrutura, banco de dados) que devem permanecer restritas

## 3. Problema a Ser Resolvido

Administradores enfrentam:
- **Falta de interface**: Necessidade de acessar banco de dados diretamente para tarefas simples
- **Risco de erros**: Alterações manuais em SQL podem quebrar o sistema
- **Lentidão**: Tarefas administrativas rotineiras levam tempo excessivo
- **Falta de auditoria**: Difícil rastrear quem fez quais alterações
- **Dependência técnica**: Coordenadores precisam solicitar suporte de TI para mudanças simples

## 4. Solução Proposta (Visão Geral)

Uma interface web administrativa que permite:
- Gerenciar usuários (criar, editar, desativar, definir permissões)
- Configurar parâmetros do sistema (SLA padrão, tipos de serviço, prioridades)
- Gerenciar cadastros auxiliares (clientes, templates de relatório)
- Visualizar logs de auditoria (quem fez o quê e quando)
- Configurar notificações e alertas
- Realizar backups e manutenções básicas

## 5. Funcionalidades Essenciais (Escopo do MVP)

### Funcionalidade 1: Gestão de Usuários
- Listagem de todos os usuários do sistema
- Criação de novo usuário (nome, e-mail, senha temporária, perfil)
- Edição de dados de usuário
- Desativação/reativação de usuário
- Definição de perfil (Admin, Coordenador, Técnico, Gestor, Analista)
- Reset de senha

### Funcionalidade 2: Gestão de Clientes
- Cadastro de clientes (nome, CNPJ, endereço, contato)
- Edição de dados de cliente
- Desativação de cliente (soft delete)
- Busca e filtros

### Funcionalidade 3: Configuração de Parâmetros Operacionais
- Definição de tipos de serviço (ex: "Levantamento Elétrico", "Inspeção Hidráulica")
- Configuração de SLA padrão por tipo de serviço (em horas/dias)
- Definição de níveis de prioridade (Baixa, Normal, Alta, Urgente)
- Configuração de status personalizados de O.S. (se necessário)

### Funcionalidade 4: Gestão de Templates de Relatório
- Upload de templates Word (.docx)
- Definição de template padrão
- Associação de template a tipo de serviço específico
- Preview de template

### Funcionalidade 5: Logs de Auditoria
- Visualização de histórico de alterações administrativas
- Filtro por usuário, data, tipo de ação
- Exportação de logs para análise

### Funcionalidade 6: Configurações de Notificações
- Definir quando enviar alertas de SLA (ex: 48h antes do vencimento)
- Configurar destinatários de notificações críticas
- Ativar/desativar tipos de notificação

## 6. Funcionalidades Fora do Escopo (Neste MVP)

- Gestão financeira (faturamento, contas a pagar/receber)
- Gestão de contratos e propostas comerciais
- Configuração avançada de infraestrutura (servidores, banco de dados)
- Backup automático agendado (apenas manual no MVP)
- Integração com sistemas externos (ERP, CRM)
- Customização de interface por usuário
- Gestão de estoque ou patrimônio
- Relatórios administrativos complexos (isso é função da Visão do Gestor)
- Sistema de tickets/suporte interno
- Gestão de documentos e arquivos corporativos

## 7. Jornada Simplificada do Usuário

1. **O administrador faz login** com credenciais de admin
2. **Acessa seção "Usuários"** e cadastra um novo técnico
3. **Define perfil e permissões** do novo usuário
4. **Acessa "Configurações"** e ajusta SLA padrão de um tipo de serviço
5. **Faz upload** de novo template de relatório
6. **Visualiza logs de auditoria** para verificar alterações recentes
7. **Recebe confirmação** de que todas as alterações foram salvas com sucesso

## 8. Critérios de Sucesso (Métricas do MVP)

### Métrica 1: Redução de Intervenção Técnica
- **Meta**: Redução de 70% em acessos diretos ao banco de dados para tarefas administrativas
- **Meta**: 100% dos cadastros de usuários feitos via interface (zero via SQL)

### Métrica 2: Velocidade de Execução
- **Meta**: Redução de 60% no tempo para realizar tarefas administrativas rotineiras (baseline: 15min → objetivo: 6min)

### Métrica 3: Autonomia
- **Meta**: Coordenadores conseguem realizar 80% das tarefas administrativas sem suporte de TI

### Métrica 4: Qualidade e Segurança
- **Meta**: Zero erros de configuração causados por alterações manuais
- **Meta**: 100% das alterações registradas em logs de auditoria

### Métrica 5: Satisfação
- **Meta**: NPS ≥60 entre administradores
- **Meta**: Redução de 50% em reclamações sobre dificuldade de configuração

### Meta Mínima Aceitável
- 1 administrador usando regularmente por 8 semanas
- Pelo menos 30 operações administrativas realizadas via interface
- Zero necessidade de acesso direto ao banco para tarefas cobertas pelo MVP

## 9. Premissas e Restrições

### Premissas
- Administrador tem conhecimento básico do negócio e dos processos
- Número de usuários é gerenciável manualmente (não há necessidade de importação em massa no MVP)
- Alterações administrativas são relativamente pouco frequentes (não é operação crítica de alta frequência)
- Existe processo definido de quem pode ter acesso administrativo
- Administrador tem acesso a computador com navegador moderno

### Restrições
- **Técnicas**: Frontend React, Backend Supabase com RLS rigoroso (apenas perfil Admin)
- **Orçamento**: Desenvolvimento solo
- **Tempo**: 4-5 semanas para MVP funcional
- **Segurança**: Acesso CRÍTICO - deve ter autenticação forte e logs completos
- **Performance**: Não é crítica (operações administrativas são pouco frequentes)
- **Usabilidade**: Interface deve ser intuitiva para não-técnicos

## 10. Prazo Estimado de Entrega

### Início
**15/05/2026** (Q2 2026)

### Fim
**15/06/2026** (4 semanas)

### Marcos Importantes

| Data | Marco | Entregável |
|------|-------|------------|
| 22/05/2026 | M1 - Autenticação | Sistema de login e controle de acesso admin implementado |
| 29/05/2026 | M2 - Usuários | CRUD completo de usuários funcionando |
| 05/06/2026 | M3 - Configurações | Gestão de parâmetros operacionais e clientes |
| 10/06/2026 | M4 - Templates | Upload e gestão de templates de relatório |
| 12/06/2026 | M5 - Auditoria | Logs de auditoria implementados |
| 15/06/2026 | M6 - Release | Lançamento para uso em produção |

---

**Versão**: 1.0  
**Data de Criação**: 25/11/2025  
**Responsável**: Thiago Nascimento Barbosa  
**Status**: 🟢 Baixa Prioridade (Após MVP Core)  
**Dependências**: 
- TM Controle de O.S. (compartilha base de usuários e configurações)
- TM Studio de Relatórios (gestão de templates)
