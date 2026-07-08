# PRD – Product Requirements Document
## TM Ajustes Administrativos

---

## 1. Visão Geral do Produto

**TM Ajustes Administrativos** é uma interface web administrativa que centraliza a gestão de configurações, usuários, cadastros auxiliares e parâmetros operacionais do ecossistema MAFFENG. O produto elimina a necessidade de acesso direto ao banco de dados para tarefas administrativas rotineiras, fornecendo uma interface amigável e segura para administradores e coordenadores com permissões elevadas.

**Objetivo Principal**: Reduzir em 70% o tempo gasto com ajustes manuais no banco de dados e eliminar completamente a necessidade de intervenção técnica (SQL direto) para operações administrativas rotineiras, aumentando autonomia e reduzindo riscos.

**Valor para o Usuário**: Administradores ganham autonomia para gerenciar usuários e configurações sem depender de TI, coordenadores podem fazer ajustes operacionais rapidamente, e a empresa reduz riscos de erros em alterações manuais no banco de dados.

---

## 2. Problema / Oportunidade

### Problema
Administradores do sistema enfrentam:
- **Falta de interface**: Necessidade de acessar banco de dados diretamente (Supabase Dashboard) para tarefas simples como cadastrar usuário
- **Risco de erros**: Alterações manuais em SQL podem quebrar o sistema, corromper dados ou violar constraints
- **Lentidão operacional**: Tarefas administrativas rotineiras levam tempo excessivo (15-30 minutos cada)
- **Falta de auditoria**: Difícil rastrear quem fez quais alterações, quando e por quê
- **Dependência técnica**: Coordenadores precisam solicitar suporte de TI para mudanças simples (ex: alterar SLA padrão)
- **Barreira de entrada**: Novos administradores precisam aprender SQL e estrutura do banco
- **Falta de validação**: Alterações manuais não passam por validações de negócio

### Oportunidade
- Democratização da administração: Coordenadores ganham autonomia
- Redução de custos: Menos tempo de TI gasto com tarefas operacionais
- Aumento de segurança: Validações automáticas previnem erros
- Melhoria de auditoria: Rastreamento completo de alterações
- Preparação para escala: Administração self-service para futuros clientes (SaaS)
- Redução de onboarding: Novos administradores produtivos em 1 dia vs 1 semana

---

## 3. Público-Alvo

### Persona 1: Thiago - Administrador do Sistema (TI)
- **Idade**: 25-40 anos
- **Cargo**: Desenvolvedor / Administrador de Sistemas
- **Contexto**: Responsável por manter o sistema funcionando, cadastrar usuários, configurar parâmetros
- **Dores**: 
  - Perde tempo com tarefas administrativas repetitivas
  - Risco de errar em alterações manuais no banco
  - Interrupções constantes para fazer cadastros simples
  - Falta de histórico de alterações
- **Comportamento**: Alta familiaridade com tecnologia, prefere interfaces eficientes
- **Objetivo**: Automatizar tarefas administrativas, ter auditoria completa
- **Motivação**: Focar em desenvolvimento, não em operações manuais

### Persona 2: Juliana - Coordenadora com Permissões Elevadas
- **Idade**: 28-40 anos
- **Cargo**: Coordenadora Técnica / Supervisora
- **Contexto**: Precisa cadastrar clientes, ajustar tipos de serviço, gerenciar técnicos
- **Dores**: 
  - Depende de TI para mudanças simples
  - Atrasos operacionais por falta de autonomia
  - Não consegue fazer ajustes urgentes fora do horário comercial
- **Comportamento**: Familiaridade média com tecnologia, precisa de interface intuitiva
- **Objetivo**: Ter autonomia para ajustes operacionais sem depender de TI
- **Motivação**: Agilidade operacional, resolver problemas rapidamente

---

## 4. Objetivos do Produto

### Objetivos de Negócio
1. **Reduzir custos operacionais** em 70% (menos tempo gasto com administração manual)
2. **Eliminar riscos** de erros em alterações manuais no banco de dados
3. **Aumentar autonomia** de coordenadores (80% das tarefas sem suporte de TI)
4. **Melhorar auditoria** (100% das alterações rastreadas)
5. **Reduzir tempo de onboarding** de novos administradores de 1 semana para 1 dia
6. **Preparar plataforma** para administração multi-tenant (SaaS)

### Objetivos do Usuário
1. **Eliminar acesso direto ao banco**: Fazer 100% das tarefas administrativas via interface
2. **Economizar tempo**: Reduzir de 15min para 3min o tempo para tarefas rotineiras
3. **Ter autonomia**: Não depender de TI para mudanças simples
4. **Ter segurança**: Validações automáticas previnem erros
5. **Rastrear histórico**: Saber exatamente quem fez o quê e quando
6. **Ter confiança**: Interface intuitiva reduz curva de aprendizado

---

## 5. Escopo Funcional

### 5.1 Funcionalidades Principais

#### F1 - Gestão de Usuários
**Listagem de Usuários**:
- Tabela com todos os usuários do sistema
- Colunas: Nome, E-mail, Perfil, Status (Ativo/Inativo), Data de Criação, Último Acesso
- Busca por nome ou e-mail
- Filtro por perfil (Admin, Coordenador, Técnico, Gestor, Analista)
- Filtro por status (Ativo, Inativo)
- Ordenação por qualquer coluna
- Paginação (20 por página)

**Criação de Novo Usuário**:
- Formulário com campos:
  - Nome completo (obrigatório)
  - E-mail (obrigatório, validação de formato)
  - Senha temporária (gerada automaticamente ou manual)
  - Perfil (dropdown: Admin, Coordenador, Técnico, Gestor, Analista)
  - Telefone (opcional)
  - Especialidade (para técnicos)
- Validações:
  - E-mail único (não pode duplicar)
  - Senha com mínimo de 8 caracteres
- Envio automático de e-mail de boas-vindas com senha temporária
- Confirmação de criação

**Edição de Usuário**:
- Editar nome, e-mail, telefone, perfil, especialidade
- Não permitir edição de senha (apenas reset)
- Validações de campos obrigatórios
- Confirmação de alteração

**Desativação/Reativação de Usuário**:
- Soft delete (usuário não é excluído, apenas marcado como inativo)
- Confirmação antes de desativar
- Possibilidade de reativar usuário inativo
- Histórico de ativações/desativações

**Reset de Senha**:
- Gerar nova senha temporária
- Enviar por e-mail ao usuário
- Forçar troca de senha no próximo login

#### F2 - Gestão de Clientes
**Listagem de Clientes**:
- Tabela com todos os clientes cadastrados
- Colunas: Nome, CNPJ, Endereço, Contato, Status, Data de Cadastro
- Busca por nome ou CNPJ
- Filtro por status (Ativo, Inativo)
- Ordenação e paginação

**Cadastro de Novo Cliente**:
- Formulário com campos:
  - Nome/Razão Social (obrigatório)
  - CNPJ (obrigatório, validação de formato)
  - Endereço completo (obrigatório)
  - Telefone de contato (obrigatório)
  - E-mail de contato (opcional)
  - Observações (opcional)
- Validações:
  - CNPJ único e válido
  - Telefone em formato válido
- Confirmação de cadastro

**Edição de Cliente**:
- Editar todos os campos (exceto CNPJ após criação)
- Validações de campos obrigatórios
- Confirmação de alteração

**Desativação de Cliente**:
- Soft delete (cliente não é excluído)
- Confirmação antes de desativar
- Verificação: Não permitir desativar se houver O.S. ativas vinculadas

#### F3 - Configuração de Parâmetros Operacionais

**Gestão de Tipos de Serviço**:
- Listagem de tipos de serviço (ex: Levantamento Elétrico, Inspeção Hidráulica)
- Cadastro de novo tipo de serviço
- Edição de tipo existente
- Desativação de tipo (se não houver O.S. vinculadas)
- Associação de SLA padrão a cada tipo (em dias)

**Configuração de SLA Padrão**:
- Definir SLA padrão por tipo de serviço (em dias)
- Editar SLA existente
- Histórico de alterações de SLA

**Gestão de Níveis de Prioridade**:
- Listagem de prioridades (Baixa, Normal, Alta, Urgente)
- Edição de nome e cor associada
- Não permitir exclusão (apenas edição)

**Configuração de Status de O.S.** (Opcional no MVP):
- Listagem de status possíveis (Pendente, Atribuída, Em Campo, etc.)
- Edição de nome e cor
- Definição de ordem de exibição

#### F4 - Gestão de Templates de Relatório

**Listagem de Templates**:
- Tabela com templates Word cadastrados
- Colunas: Nome, Tipo de Serviço Associado, Data de Upload, Status (Ativo/Inativo)
- Indicador de template padrão

**Upload de Template**:
- Upload de arquivo Word (.docx)
- Definir nome do template
- Associar a tipo de serviço específico (ou "Geral")
- Marcar como template padrão (opcional)
- Validação: Apenas arquivos .docx

**Preview de Template**:
- Visualização do template (renderização básica ou download para preview local)

**Definição de Template Padrão**:
- Marcar template como padrão para tipo de serviço
- Apenas 1 template padrão por tipo

**Desativação de Template**:
- Soft delete
- Não permitir desativar se for o único template ativo

#### F5 - Logs de Auditoria

**Visualização de Histórico**:
- Listagem de todas as alterações administrativas
- Colunas: Data/Hora, Usuário, Ação (Criação, Edição, Exclusão), Entidade (Usuário, Cliente, Tipo de Serviço), Detalhes
- Filtros:
  - Por usuário (quem fez a alteração)
  - Por data (período)
  - Por tipo de ação (Criação, Edição, Exclusão)
  - Por entidade (Usuário, Cliente, etc.)
- Ordenação por data (mais recente primeiro)
- Paginação

**Exportação de Logs**:
- Exportar logs filtrados para Excel
- Exportar logs para CSV (para análise externa)

#### F6 - Configurações de Notificações

**Configuração de Alertas de SLA**:
- Definir quando enviar alertas (ex: 48h antes do vencimento, 24h antes)
- Ativar/desativar alertas por tipo
- Definir destinatários padrão (e-mails)

**Configuração de Notificações de Eventos**:
- Ativar/desativar notificações de eventos (fotos recebidas, relatório gerado, etc.)
- Definir canais (in-app, e-mail)

### 5.2 Funcionalidades Secundárias

#### F7 - Gestão de Técnicos (Detalhada)
- Visualização de O.S. atribuídas a cada técnico
- Indicador de carga de trabalho (número de O.S. ativas)
- Histórico de produtividade (O.S. concluídas por período)

#### F8 - Dashboard Administrativo
- Resumo de estatísticas:
  - Total de usuários ativos
  - Total de clientes ativos
  - Total de tipos de serviço cadastrados
  - Últimas alterações (log resumido)

#### F9 - Backup Manual
- Botão para gerar backup do banco de dados
- Download de arquivo SQL
- Histórico de backups realizados

#### F10 - Configurações Avançadas
- Definição de tempo de expiração de sessão
- Configuração de complexidade de senha
- Ativação/desativação de funcionalidades (feature flags)

### 5.3 Fora de Escopo

- ❌ Gestão financeira (faturamento, contas a pagar/receber, custos)
- ❌ Gestão de contratos e propostas comerciais
- ❌ Configuração avançada de infraestrutura (servidores, banco de dados, escalabilidade)
- ❌ Backup automático agendado (apenas manual no MVP)
- ❌ Integração com sistemas externos (ERP, CRM, Active Directory)
- ❌ Customização de interface por usuário (temas, layouts)
- ❌ Gestão de estoque ou patrimônio
- ❌ Relatórios administrativos complexos (isso é função da Visão do Gestor)
- ❌ Sistema de tickets/suporte interno
- ❌ Gestão de documentos e arquivos corporativos
- ❌ Workflow de aprovação de alterações
- ❌ Versionamento de configurações (rollback)

---

## 6. Requisitos Detalhados

### 6.1 Requisitos Funcionais

**RF01** – O sistema deve permitir login exclusivo para perfis Admin e Coordenador (com permissões elevadas)  
**RF02** – O sistema deve listar todos os usuários com busca, filtros e paginação  
**RF03** – O sistema deve permitir criação de novo usuário com validação de campos obrigatórios  
**RF04** – O sistema deve validar unicidade de e-mail ao criar usuário  
**RF05** – O sistema deve gerar senha temporária automaticamente ou permitir definição manual  
**RF06** – O sistema deve enviar e-mail de boas-vindas com senha temporária  
**RF07** – O sistema deve permitir edição de dados de usuário (exceto senha)  
**RF08** – O sistema deve permitir desativação/reativação de usuário (soft delete)  
**RF09** – O sistema deve permitir reset de senha com envio por e-mail  
**RF10** – O sistema deve listar todos os clientes com busca, filtros e paginação  
**RF11** – O sistema deve permitir cadastro de novo cliente com validação de CNPJ  
**RF12** – O sistema deve permitir edição de dados de cliente  
**RF13** – O sistema deve permitir desativação de cliente (com validação de O.S. ativas)  
**RF14** – O sistema deve permitir gestão de tipos de serviço (CRUD)  
**RF15** – O sistema deve permitir configuração de SLA padrão por tipo de serviço  
**RF16** – O sistema deve permitir gestão de níveis de prioridade (edição apenas)  
**RF17** – O sistema deve permitir upload de templates Word (.docx)  
**RF18** – O sistema deve permitir associação de template a tipo de serviço  
**RF19** – O sistema deve permitir definição de template padrão  
**RF20** – O sistema deve registrar todas as alterações administrativas em log de auditoria  
**RF21** – O sistema deve permitir visualização de logs com filtros (usuário, data, ação, entidade)  
**RF22** – O sistema deve permitir exportação de logs para Excel/CSV  
**RF23** – O sistema deve permitir configuração de alertas de SLA  
**RF24** – O sistema deve permitir configuração de notificações de eventos  
**RF25** – O sistema deve validar permissões antes de permitir qualquer alteração  

### 6.2 Requisitos Não Funcionais

**RNF01 – Segurança**
- Acesso CRÍTICO: Apenas perfis Admin e Coordenador (com flag especial)
- Autenticação via JWT com expiração de 7 dias
- RLS (Row Level Security) rigoroso no Supabase
- Logs de auditoria para TODAS as operações (sem exceção)
- Sanitização de inputs para prevenir SQL Injection e XSS
- Confirmação obrigatória para ações destrutivas (desativação, exclusão)
- Criptografia de dados sensíveis (senhas, tokens)

**RNF02 – Performance**
- Tempo de carregamento de listagens: <2 segundos
- Tempo de resposta de formulários: <1 segundo
- Tempo de geração de backup: <30 segundos (para banco com 10.000 registros)
- Não é crítica (operações administrativas são pouco frequentes)

**RNF03 – Usabilidade**
- Interface intuitiva para não-técnicos (coordenadores)
- Feedback visual imediato para todas as ações
- Mensagens de erro claras e acionáveis
- Confirmações antes de ações destrutivas
- Formulários com validação em tempo real
- Textos em português brasileiro

**RNF04 – Compatibilidade**
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Resoluções: 1366x768 até 4K
- Funcionar em tablets (iPad, Android tablets)

**RNF05 – Disponibilidade**
- Uptime: 99% (Supabase SLA)
- Backup manual disponível 24/7
- Recuperação de desastres: RPO 24h, RTO 4h

**RNF06 – Auditoria**
- 100% das alterações registradas em log
- Logs imutáveis (não podem ser editados ou excluídos)
- Retenção de logs: Mínimo 12 meses

**RNF07 – Validação**
- Validação de campos obrigatórios em todos os formulários
- Validação de formato (e-mail, CNPJ, telefone)
- Validação de regras de negócio (ex: não desativar cliente com O.S. ativas)
- Feedback de validação em tempo real

---

## 7. Fluxo do Usuário / Jornada

### Fluxo Principal: Cadastrar Novo Técnico

1. **Coordenadora Juliana faz login** com credenciais de admin
2. **Sistema autentica** e redireciona para dashboard administrativo
3. **Juliana clica** em "Gestão de Usuários" no menu lateral
4. **Sistema exibe** listagem de usuários existentes
5. **Juliana clica** em "Novo Usuário"
6. **Sistema exibe** formulário de cadastro
7. **Juliana preenche**:
   - Nome: "Carlos Silva"
   - E-mail: "carlos.silva@maffeng.com"
   - Perfil: "Técnico"
   - Telefone: "(11) 98765-4321"
   - Especialidade: "Elétrica"
8. **Sistema gera** senha temporária automaticamente: "Temp@2025"
9. **Juliana clica** em "Salvar"
10. **Sistema valida** dados (e-mail único, formato correto)
11. **Sistema cria** usuário no banco de dados
12. **Sistema envia** e-mail para carlos.silva@maffeng.com com senha temporária
13. **Sistema registra** log de auditoria: "Juliana criou usuário Carlos Silva em 25/11/2025 10:30"
14. **Sistema exibe** mensagem de sucesso: "✅ Usuário Carlos Silva criado com sucesso! E-mail enviado."
15. **Sistema redireciona** para listagem de usuários (Carlos aparece na lista)

**Tempo total**: 2 minutos (vs 15 minutos via SQL manual)

### Fluxo Alternativo: Ajustar SLA Padrão

1. Administrador Thiago acessa "Configurações" → "Tipos de Serviço"
2. Visualiza lista de tipos: "Levantamento Elétrico (SLA: 5 dias)"
3. Clica em "Editar" no tipo "Levantamento Elétrico"
4. Altera SLA de 5 para 7 dias
5. Clica em "Salvar"
6. Sistema valida e confirma alteração
7. Sistema registra log: "Thiago alterou SLA de Levantamento Elétrico de 5 para 7 dias"
8. Sistema exibe mensagem: "✅ SLA atualizado com sucesso!"

---

## 8. Critérios de Sucesso / Métricas

### KPIs Primários

**KPI 1 - Redução de Intervenção Técnica**
- Meta: Redução de 70% em acessos diretos ao banco de dados para tarefas administrativas
- Meta: 100% dos cadastros de usuários feitos via interface (zero via SQL)
- Medição: Logs de acesso ao Supabase Dashboard + auditoria de alterações

**KPI 2 - Velocidade de Execução**
- Meta: Redução de 60% no tempo para realizar tarefas administrativas rotineiras (baseline: 15min → objetivo: 6min)
- Medição: Time tracking antes/depois + pesquisa com administradores

**KPI 3 - Autonomia**
- Meta: Coordenadores conseguem realizar 80% das tarefas administrativas sem suporte de TI
- Medição: Tickets de suporte antes/depois

**KPI 4 - Qualidade e Segurança**
- Meta: Zero erros de configuração causados por alterações manuais
- Meta: 100% das alterações registradas em logs de auditoria
- Medição: Auditoria de logs + monitoramento de erros

### KPIs Secundários

**KPI 5 - Adoção**
- Meta: 100% das tarefas administrativas feitas via interface após 30 dias
- Medição: Auditoria de processos

**KPI 6 - Satisfação**
- Meta: NPS ≥60 entre administradores
- Meta: Redução de 50% em reclamações sobre dificuldade de configuração
- Medição: Pesquisa in-app trimestral

**KPI 7 - Onboarding**
- Meta: Redução de 70% no tempo de onboarding de novos administradores (7 dias → 2 dias)
- Medição: Tempo até primeira tarefa administrativa completa

### Meta Mínima Aceitável (Go/No-Go)
- ✅ 1 administrador usando regularmente por 8 semanas
- ✅ Pelo menos 30 operações administrativas realizadas via interface
- ✅ Zero necessidade de acesso direto ao banco para tarefas cobertas pelo MVP
- ✅ 100% das alterações registradas em logs
- ✅ Zero erros críticos causados por validações inadequadas

---

## 📌 9. Plano de Implementação (por etapas)

### Etapa 1 – Planejamento (Semana 1: 15/05 - 22/05/2026)

**Atividades:**
- Revisão final do PRD com stakeholders (administradores, coordenadores)
- Definição de permissões e controle de acesso (RBAC detalhado)
- Criação de wireframes de alta fidelidade (Figma)
- Definição de schema de logs de auditoria
- Estimativas de esforço por funcionalidade
- Preparação do backlog inicial
- Setup de repositório Git (se não compartilhado)

**Entrega:** 
- ✅ Wireframes aprovados
- ✅ Schema de logs de auditoria implementado
- ✅ Backlog priorizado
- ✅ Matriz de permissões definida

---

### Etapa 2 – Desenvolvimento do MVP (Semanas 2-5: 22/05 - 15/06/2026)

#### Sprint 1 (Semana 2: 22/05 - 29/05)
**Foco: Autenticação e Gestão de Usuários**
- Setup do projeto (integração com Controle de O.S. ou standalone)
- Implementação de autenticação com controle de acesso admin
- Tela de listagem de usuários (busca, filtros, paginação)
- Formulário de criação de usuário
- Validações de campos
- Envio de e-mail de boas-vindas

#### Sprint 2 (Semana 3: 29/05 - 05/06)
**Foco: Gestão de Clientes e Configurações**
- CRUD completo de clientes
- Gestão de tipos de serviço
- Configuração de SLA padrão
- Gestão de níveis de prioridade
- Validações de regras de negócio

#### Sprint 3 (Semana 4: 05/06 - 12/06)
**Foco: Templates e Logs**
- Upload e gestão de templates Word
- Preview de templates
- Definição de template padrão
- Implementação de logs de auditoria (registro automático)
- Tela de visualização de logs com filtros

#### Sprint 4 (Semana 5: 12/06 - 15/06)
**Foco: Polimento e Testes**
- Configurações de notificações
- Dashboard administrativo
- Exportação de logs
- Correção de bugs
- Testes de segurança (validações, permissões)
- Testes de usabilidade

**Entrega:** 
- ✅ MVP funcional com funcionalidades principais
- ✅ Deploy em ambiente de staging
- ✅ Documentação técnica

---

### Etapa 3 – Testes e Iterações (Semana 6: 15/06 - 22/06/2026)

**Atividades:**
- Testes com 1 administrador e 1 coordenador (beta fechado)
- Validação de permissões e segurança
- Coleta de feedback sobre usabilidade
- Identificação de bugs e melhorias de UX
- Testes de validações (tentar quebrar o sistema)
- Preparação de documentação de usuário (manual)
- Treinamento de administradores (sessão de 1h)

**Entrega:** 
- ✅ Versão estável para lançamento
- ✅ Relatório de testes de segurança
- ✅ Manual de usuário
- ✅ Administradores treinados

---

### Etapa 4 – Lançamento (Semana 7: 22/06 - 29/06/2026)

**Atividades:**
- Deploy em ambiente de produção
- Comunicação oficial aos administradores
- Onboarding assistido (primeiros 3 dias)
- Monitoramento ativo de uso e logs
- Coleta de métricas iniciais (operações realizadas, tempo economizado)
- Suporte dedicado (primeiros 15 dias)
- Desativação de acesso direto ao banco para tarefas cobertas

**Entrega:** 
- ✅ Sistema em produção e acessível
- ✅ 100% dos administradores com acesso e treinados
- ✅ Dashboard de monitoramento configurado
- ✅ Acesso direto ao banco restrito

---

### Etapa 5 – Evolução Pós-Lançamento (A partir de 29/06/2026)

**Mês 1 (Jul/2026):**
- Análise de métricas de uso
- Correção de bugs reportados
- Implementação de melhorias baseadas em feedback
- Adição de funcionalidades secundárias (dashboard administrativo, backup manual)

**Mês 2 (Ago/2026):**
- Implementação de funcionalidades avançadas (workflow de aprovação, versionamento)
- Otimizações de performance
- Pesquisa de satisfação (NPS)

**Mês 3+ (Set/2026+):**
- Backup automático agendado
- Integração com Active Directory (SSO)
- Customização de interface
- Preparação para multi-tenancy

**Entrega:** 
- ✅ Versão 2.0 com funcionalidades expandidas
- ✅ Roadmap atualizado

---

## 10. Riscos e Dependências

### Riscos

**R1 - Erro de validação (permitir alterações inválidas)**
- **Probabilidade:** MÉDIA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - Validações rigorosas em frontend e backend
  - Testes extensivos de validações
  - Confirmações antes de ações destrutivas
  - Logs de auditoria para rastreamento

**R2 - Falha de segurança (acesso não autorizado)**
- **Probabilidade:** BAIXA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - RLS rigoroso no Supabase
  - Testes de penetração
  - Auditoria de permissões
  - Monitoramento de acessos suspeitos

**R3 - Complexidade de interface (coordenadores não conseguem usar)**
- **Probabilidade:** BAIXA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Design intuitivo
  - Testes de usabilidade com coordenadores
  - Treinamento presencial
  - Manual de usuário claro

**R4 - Perda de dados (backup inadequado)**
- **Probabilidade:** BAIXA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - Backup manual disponível
  - Backup automático do Supabase (diário)
  - Testes de recuperação
  - Logs imutáveis

**R5 - Resistência de administradores (preferem SQL direto)**
- **Probabilidade:** BAIXA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Demonstrar economia de tempo
  - Destacar redução de riscos
  - Restringir acesso direto ao banco após migração

### Dependências

**D1 - TM Controle de O.S. (compartilha base de usuários e configurações)**
- Dependência de schema de banco de dados
- Risco: Alterações no schema do Controle de O.S. podem quebrar Admin
- Plano B: Versionamento de schema, testes de integração

**D2 - TM Studio de Relatórios (gestão de templates)**
- Necessário para upload e associação de templates
- Risco: Studio atrasar ou ter estrutura de templates incompatível
- Plano B: Gestão de templates standalone, integração posterior

**D3 - Supabase (banco de dados e autenticação)**
- Dependência crítica para RLS e controle de acesso
- Risco: Limitações de permissões no plano gratuito
- Plano B: Upgrade para plano pago

**D4 - Serviço de e-mail (envio de senhas temporárias)**
- Necessário para envio de e-mails de boas-vindas
- Risco: Falha de serviço de e-mail (SMTP)
- Plano B: Exibir senha temporária na tela (copiar manualmente)

---

## 11. Anexos

### Links de Referência
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [React Hook Form](https://react-hook-form.com)
- [Design System TM](d:\DATABASE\TM\Design System TM – Atualizado com Ocean Breeze.docx)

### Wireframes
- **Listagem de Usuários**: A ser criado na Etapa 1
- **Formulário de Cadastro**: A ser criado na Etapa 1
- **Logs de Auditoria**: A ser criado na Etapa 1

### Documentos de Referência
- [MVP - TM Ajustes Administrativos](d:\DATABASE\MVP_TM_Ajustes_Administrativos.md)
- [Contexto do Projeto MAFFENG](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\CONTEXTO_PROJETO_MAFFENG.md)
- [Roadmap Integrado](d:\DATABASE\ROAD_MAP.md)

### Matriz de Permissões

| Funcionalidade | Admin | Coordenador | Gestor | Técnico | Analista |
|----------------|-------|-------------|--------|---------|----------|
| Gestão de Usuários | ✅ | ✅ (limitado) | ❌ | ❌ | ❌ |
| Gestão de Clientes | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configuração de SLA | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gestão de Templates | ✅ | ✅ | ❌ | ❌ | ❌ |
| Logs de Auditoria | ✅ | ✅ (apenas leitura) | ❌ | ❌ | ❌ |
| Configurações Avançadas | ✅ | ❌ | ❌ | ❌ | ❌ |

---

**Versão:** 1.0  
**Data de Criação:** 25/11/2025  
**Autor:** Thiago Nascimento Barbosa  
**Aprovadores:** [Pendente]  
**Status:** 🟢 Baixa Prioridade (Após MVP Core) - Em Revisão  
**Próxima Revisão:** 01/12/2025
