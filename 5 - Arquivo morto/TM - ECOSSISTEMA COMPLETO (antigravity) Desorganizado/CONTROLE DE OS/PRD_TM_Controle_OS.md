# PRD – Product Requirements Document
## TM Controle de O.S.

---

## 1. Visão Geral do Produto

**TM Controle de O.S.** é uma plataforma web responsiva que centraliza a gestão completa do ciclo de vida de ordens de serviço técnicas. O sistema permite importação em lote, rastreamento em tempo real, atribuição de responsáveis, monitoramento de SLA e geração de relatórios gerenciais, substituindo completamente planilhas Excel e controles manuais.

**Objetivo Principal**: Automatizar o fluxo de gestão de O.S. (importação → atribuição → acompanhamento → fechamento), reduzindo em 60% o tempo gasto com controles manuais e aumentando a visibilidade operacional.

**Valor para o Usuário**: Coordenadores ganham controle total sobre todas as O.S. em um único lugar, gestores têm visibilidade em tempo real, e a empresa melhora significativamente o cumprimento de SLA e a produtividade.

---

## 2. Problema / Oportunidade

### Problema
Coordenadores e gestores enfrentam:
- **Caos operacional**: Planilhas Excel desatualizadas, duplicadas, com versões conflitantes
- **Falta de visibilidade**: Impossível saber em tempo real quantas O.S. estão pendentes, em andamento ou atrasadas
- **Perda de SLA**: Descobrem atrasos tarde demais, sem alertas proativos
- **Comunicação fragmentada**: Informações espalhadas em WhatsApp, e-mail, telefone, papel
- **Retrabalho massivo**: Consolidar dados de múltiplas fontes manualmente para gerar relatórios
- **Falta de histórico**: Impossível rastrear quem fez o quê, quando e por quê
- **Gargalos invisíveis**: Não conseguem identificar técnicos sobrecarregados ou processos ineficientes

### Oportunidade
- Mercado de gestão de serviços técnicos em crescimento (facility management, manutenção predial)
- Concorrentes usam sistemas genéricos (não especializados) ou continuam em planilhas
- Diferencial: sistema especializado para levantamentos fotográficos + integração nativa com app mobile
- Potencial de licenciamento SaaS para empresas do setor (receita recorrente)
- Base inicial: MAFFENG (15 técnicos, 100-150 O.S./mês) + expansão para clientes externos

---

## 3. Público-Alvo

### Persona 1: Juliana - Coordenadora de Operações
- **Idade**: 28-40 anos
- **Cargo**: Coordenadora Técnica / Supervisora de Campo
- **Contexto**: Gerencia 10-15 técnicos, distribui 20-30 O.S. por semana
- **Dores**: 
  - Perde 10h/semana consolidando planilhas
  - Não sabe em tempo real o status de cada O.S.
  - Recebe cobranças de clientes sobre atrasos que desconhecia
  - Precisa ligar para cada técnico para saber andamento
- **Comportamento**: Alta familiaridade com tecnologia, usa múltiplos sistemas web diariamente
- **Objetivo**: Ter visão consolidada de todas as O.S., atribuir rapidamente, receber alertas de atrasos
- **Motivação**: Reduzir estresse, cumprir metas de SLA, ter mais tempo para atividades estratégicas

### Persona 2: Roberto - Gestor Operacional
- **Idade**: 35-55 anos
- **Cargo**: Gerente de Operações / Diretor Técnico
- **Contexto**: Supervisiona 3 coordenadores, responsável por resultados da área
- **Dores**: 
  - Recebe relatórios desatualizados (dados de 3-5 dias atrás)
  - Não consegue identificar gargalos rapidamente
  - Toma decisões baseadas em "achismos" por falta de dados
  - Perde tempo em reuniões pedindo atualizações manuais
- **Comportamento**: Acesso esporádico mas precisa de informações rápidas e precisas
- **Objetivo**: Visão macro de performance, identificar problemas antes que virem crises
- **Motivação**: Atingir metas de produtividade, reduzir custos operacionais, melhorar satisfação do cliente

---

## 4. Objetivos do Produto

### Objetivos de Negócio
1. **Reduzir custos operacionais** em 60% (menos horas gastas com controle manual)
2. **Melhorar SLA** de 75% para 95% de cumprimento de prazos
3. **Aumentar capacidade** de processamento em 40% (mesma equipe gerencia mais O.S.)
4. **Criar base de dados estruturada** para análises e inteligência de negócio
5. **Preparar plataforma SaaS** para licenciamento externo (receita recorrente)
6. **Reduzir tempo de onboarding** de novos coordenadores de 2 semanas para 3 dias

### Objetivos do Usuário
1. **Eliminar planilhas**: Migrar 100% do controle para plataforma web
2. **Ter visibilidade em tempo real**: Saber status de qualquer O.S. em <10 segundos
3. **Receber alertas proativos**: Ser notificado de O.S. próximas do vencimento ou atrasadas
4. **Economizar tempo**: Reduzir de 10h para 4h/semana o tempo gasto com controle
5. **Tomar decisões baseadas em dados**: Ter acesso a KPIs e relatórios confiáveis
6. **Rastrear histórico**: Saber exatamente o que aconteceu com cada O.S.

---

## 5. Escopo Funcional

### 5.1 Funcionalidades Principais

#### F1 - Autenticação e Controle de Acesso
- Login com e-mail/senha (Supabase Auth)
- Recuperação de senha via e-mail
- Perfis de usuário: Admin, Coordenador, Gestor, Visualizador
- Controle de permissões por perfil (RBAC)
- Logout e sessão com expiração configurável

#### F2 - Importação de O.S. em Lote
- Upload de arquivo Excel (.xlsx) com template padronizado
- Validação automática de campos obrigatórios (código O.S., cliente, endereço, tipo de serviço, prazo)
- Preview de dados antes de confirmar importação
- Feedback de erros linha a linha (com indicação de campo problemático)
- Importação incremental (adicionar novas O.S. sem duplicar existentes)
- Download de template Excel padrão

#### F3 - Dashboard de O.S.
- Listagem de todas as O.S. com paginação (20 por página)
- Colunas: Código, Cliente, Endereço, Tipo de Serviço, Status, Técnico, Prazo, SLA
- Filtros avançados:
  - Por status (Pendente, Atribuída, Em Campo, Fotos Recebidas, Relatório Gerado, Concluída)
  - Por técnico responsável
  - Por cliente
  - Por data (criação, prazo, conclusão)
  - Por prioridade (Baixa, Normal, Alta, Urgente)
- Busca por código de O.S., endereço ou cliente
- Ordenação por qualquer coluna
- Indicadores visuais de SLA:
  - 🟢 Verde: >48h até vencimento
  - 🟡 Amarelo: 24-48h até vencimento
  - 🔴 Vermelho: <24h ou atrasada
- Ações em lote (atribuir múltiplas O.S., exportar selecionadas)

#### F4 - Gestão Individual de O.S.
- Visualização detalhada de uma O.S. (modal ou página dedicada)
- Dados completos: Cliente, endereço, tipo de serviço, descrição, prazo, prioridade
- Histórico de alterações (timeline): criação, atribuição, mudanças de status, observações
- Atribuição/reatribuição de técnico responsável (dropdown com lista de técnicos)
- Alteração manual de status (com confirmação)
- Adição de observações/notas internas (com timestamp e autor)
- Visualização de anexos (fotos do levantamento, relatório gerado)
- Edição de dados básicos (prazo, prioridade, descrição)

#### F5 - Sistema de Notificações
- **Alertas de SLA**:
  - Notificação 48h antes do vencimento
  - Notificação 24h antes do vencimento
  - Alerta imediato quando O.S. atrasa
- **Notificações de eventos**:
  - Técnico enviou pacote de fotos
  - Relatório foi gerado
  - O.S. foi reatribuída
- **Tipos de notificação**:
  - In-app (badge no ícone de sino)
  - E-mail (configurável por usuário)
  - Push (se app mobile de coordenador for desenvolvido)
- Central de notificações com histórico
- Marcar como lida / limpar todas

#### F6 - Relatórios e Exportação
- **Exportação de lista filtrada**:
  - Excel (.xlsx) com todas as colunas
  - CSV para análises externas
  - PDF para impressão
- **Dashboard de KPIs**:
  - Cards com métricas principais:
    - Total de O.S. (ativas)
    - O.S. concluídas (mês atual)
    - O.S. atrasadas
    - Taxa de cumprimento de SLA (%)
    - Tempo médio de conclusão
  - Gráfico de barras: O.S. por status
  - Gráfico de linha: Evolução de O.S. concluídas (últimas 4 semanas)
  - Gráfico de barras: Produtividade por técnico (O.S. concluídas/semana)
- Filtro de período para relatórios (última semana, mês, trimestre, customizado)

### 5.2 Funcionalidades Secundárias

#### F7 - Gestão de Técnicos
- Listagem de técnicos cadastrados
- Cadastro de novo técnico (nome, e-mail, telefone, especialidade)
- Edição de dados de técnico
- Desativação de técnico (soft delete)
- Visualização de O.S. atribuídas a cada técnico
- Indicador de carga de trabalho (número de O.S. ativas)

#### F8 - Gestão de Clientes
- Listagem de clientes cadastrados
- Cadastro de novo cliente (nome, CNPJ, endereço, contato)
- Edição de dados de cliente
- Desativação de cliente
- Visualização de O.S. de cada cliente

#### F9 - Configurações do Sistema
- Definição de tipos de serviço (ex: Levantamento Elétrico, Inspeção Hidráulica)
- Configuração de SLA padrão por tipo de serviço (em dias)
- Definição de níveis de prioridade
- Configuração de status personalizados (se necessário)
- Preferências de notificação por usuário

#### F10 - Logs de Auditoria
- Registro de todas as alterações críticas (criação, edição, exclusão)
- Visualização de histórico por O.S.
- Filtro por usuário, data, tipo de ação
- Exportação de logs para análise

### 5.3 Fora de Escopo

- ❌ Criação manual de O.S. uma a uma (apenas importação em lote no MVP)
- ❌ Integração com sistemas ERP externos (SAP, TOTVS, etc.)
- ❌ Geração de relatórios técnicos finais (função do TM Studio de Relatórios)
- ❌ Chat integrado ou sistema de mensagens em tempo real
- ❌ Gestão financeira (faturamento, custos, pagamentos)
- ❌ Agendamento automático de O.S. (IA para otimizar distribuição)
- ❌ Mapa geográfico de O.S. (visualização em mapa)
- ❌ Assinatura digital de clientes
- ❌ Gestão de contratos e propostas comerciais
- ❌ Customização de campos por cliente (campos fixos no MVP)
- ❌ API pública para integrações externas
- ❌ App mobile para coordenadores (apenas web responsivo)

---

## 6. Requisitos Detalhados

### 6.1 Requisitos Funcionais

**RF01** – O sistema deve permitir login com e-mail e senha, validando credenciais via Supabase Auth  
**RF02** – O sistema deve implementar controle de acesso baseado em perfis (Admin, Coordenador, Gestor, Visualizador)  
**RF03** – O sistema deve permitir upload de arquivo Excel para importação de O.S. em lote  
**RF04** – O sistema deve validar campos obrigatórios do Excel (código, cliente, endereço, tipo, prazo)  
**RF05** – O sistema deve exibir preview de dados antes de confirmar importação  
**RF06** – O sistema deve exibir feedback de erros linha a linha em caso de validação falhar  
**RF07** – O sistema deve listar todas as O.S. com paginação (20 por página)  
**RF08** – O sistema deve permitir filtrar O.S. por status, técnico, cliente, data e prioridade  
**RF09** – O sistema deve permitir busca por código de O.S., endereço ou cliente  
**RF10** – O sistema deve exibir indicadores visuais de SLA (verde, amarelo, vermelho)  
**RF11** – O sistema deve permitir visualização detalhada de uma O.S. individual  
**RF12** – O sistema deve permitir atribuição/reatribuição de técnico responsável  
**RF13** – O sistema deve permitir alteração manual de status de O.S.  
**RF14** – O sistema deve permitir adição de observações/notas internas com timestamp  
**RF15** – O sistema deve registrar histórico completo de alterações de cada O.S.  
**RF16** – O sistema deve enviar notificação 48h antes do vencimento de O.S.  
**RF17** – O sistema deve enviar notificação 24h antes do vencimento de O.S.  
**RF18** – O sistema deve enviar alerta imediato quando O.S. atrasa  
**RF19** – O sistema deve notificar quando técnico envia pacote de fotos  
**RF20** – O sistema deve permitir exportação de lista de O.S. para Excel, CSV e PDF  
**RF21** – O sistema deve exibir dashboard com KPIs principais (total, concluídas, atrasadas, SLA)  
**RF22** – O sistema deve exibir gráficos de evolução temporal e produtividade por técnico  
**RF23** – O sistema deve permitir cadastro, edição e desativação de técnicos  
**RF24** – O sistema deve permitir cadastro, edição e desativação de clientes  
**RF25** – O sistema deve permitir configuração de tipos de serviço e SLA padrão  

### 6.2 Requisitos Não Funcionais

**RNF01 – Performance**
- Tempo de carregamento da lista de O.S. (100 registros): <2 segundos
- Tempo de importação de Excel (500 O.S.): <10 segundos
- Tempo de resposta de filtros/busca: <1 segundo
- Tempo de carregamento do dashboard: <3 segundos
- Suportar até 1000 O.S. simultâneas sem degradação

**RNF02 – Segurança**
- Comunicação via HTTPS obrigatório (TLS 1.3)
- Autenticação via JWT com expiração de 7 dias
- Row Level Security (RLS) no Supabase para isolamento de dados
- Sanitização de inputs para prevenir SQL Injection e XSS
- Logs de auditoria para todas as operações críticas
- Backup automático diário do banco de dados
- Criptografia de dados sensíveis em repouso

**RNF03 – Usabilidade**
- Interface intuitiva (coordenador consegue usar após 1h de treinamento)
- Design responsivo (funciona em desktop, tablet e smartphone)
- Feedback visual imediato para todas as ações
- Mensagens de erro claras e acionáveis
- Máximo de 3 cliques para ações principais
- Suporte a atalhos de teclado para power users
- Textos em português brasileiro

**RNF04 – Compatibilidade**
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Resoluções: 1366x768 até 4K
- Funcionar em tablets (iPad, Android tablets)
- Funcionar em smartphones (modo responsivo)

**RNF05 – Disponibilidade**
- Uptime: 99% (Supabase SLA)
- Backup diário automático
- Recuperação de desastres: RPO 24h, RTO 4h
- Manutenção programada: fora do horário comercial

**RNF06 – Escalabilidade**
- Suportar até 50 usuários simultâneos
- Suportar até 10.000 O.S. no banco de dados
- Suportar até 100.000 fotos armazenadas (via Supabase Storage)
- Arquitetura preparada para multi-tenancy (futura)

**RNF07 – Manutenibilidade**
- Código modular e bem documentado
- Testes automatizados (cobertura mínima de 60%)
- Logs estruturados para debugging
- Versionamento semântico (SemVer)

---

## 7. Fluxo do Usuário / Jornada

### Fluxo Principal: Importar e Gerenciar O.S.

1. **O coordenador faz login** na plataforma web com e-mail e senha
2. **O sistema autentica** e redireciona para dashboard principal
3. **O coordenador visualiza** resumo de O.S. (30 ativas, 5 atrasadas, 85% SLA)
4. **O coordenador clica** em "Importar O.S."
5. **O sistema exibe** modal de upload com link para download de template Excel
6. **O coordenador faz upload** de arquivo Excel com 50 novas O.S.
7. **O sistema valida** dados e exibe preview com 48 O.S. válidas e 2 com erros
8. **O sistema destaca** erros: "Linha 15: Campo 'Prazo' inválido (formato esperado: DD/MM/AAAA)"
9. **O coordenador corrige** Excel e faz novo upload
10. **O sistema valida** novamente: 50 O.S. válidas
11. **O coordenador confirma** importação
12. **O sistema processa** e exibe mensagem "50 O.S. importadas com sucesso!"
13. **O coordenador visualiza** lista atualizada com novas O.S. (status: Pendente)
14. **O coordenador filtra** O.S. pendentes e seleciona 10
15. **O coordenador clica** em "Atribuir em Lote" e seleciona técnico "Carlos Silva"
16. **O sistema atribui** e envia notificação para Carlos via app mobile
17. **O coordenador visualiza** dashboard atualizado (40 ativas, 10 atribuídas hoje)

### Fluxo Alternativo: Acompanhar O.S. Crítica

1. Coordenador recebe notificação in-app: "🔴 O.S. #1234 vence em 12 horas"
2. Coordenador clica na notificação
3. Sistema abre detalhes da O.S. #1234
4. Coordenador visualiza: Status "Atribuída", Técnico "João Santos", Prazo "25/11/2025 18:00"
5. Coordenador adiciona observação: "Cliente ligou cobrando. Priorizar!"
6. Coordenador altera prioridade de "Normal" para "Urgente"
7. Sistema envia notificação push para técnico João
8. Técnico João finaliza levantamento e envia fotos via app mobile
9. Sistema atualiza status para "Fotos Recebidas" automaticamente
10. Coordenador recebe notificação: "✅ Fotos recebidas da O.S. #1234"
11. Coordenador encaminha para geração de relatório (integração com Studio)

---

## 8. Critérios de Sucesso / Métricas

### KPIs Primários

**KPI 1 - Migração Completa de Planilhas**
- Meta: 100% dos coordenadores migram de Excel para plataforma em 30 dias
- Meta: 100% das O.S. gerenciadas exclusivamente pela plataforma após 60 dias
- Medição: Auditoria de uso (zero planilhas Excel em circulação)

**KPI 2 - Redução de Tempo Operacional**
- Meta: Redução de 60% no tempo gasto com controle manual (baseline: 10h/semana → objetivo: 4h/semana)
- Medição: Time tracking antes/depois + pesquisa com coordenadores

**KPI 3 - Melhoria de SLA**
- Meta: Redução de 30% no número de O.S. atrasadas no primeiro trimestre
- Meta: Taxa de cumprimento de SLA ≥90% após 90 dias
- Medição: Relatório automático do sistema (O.S. concluídas dentro do prazo / Total)

**KPI 4 - Qualidade dos Dados**
- Meta: 95% das O.S. importadas sem erros de validação
- Meta: 100% das O.S. possuem técnico atribuído em até 24h
- Medição: Logs de importação + query no banco de dados

### KPIs Secundários

**KPI 5 - Adoção e Engajamento**
- Meta: 100% dos coordenadores acessam o sistema pelo menos 1x por dia
- Meta: Média de 5+ ações por sessão (filtros, atribuições, visualizações)
- Medição: Google Analytics / Mixpanel

**KPI 6 - Satisfação do Usuário**
- Meta: NPS ≥ 50 após 60 dias de uso
- Meta: CSAT ≥ 4.0/5.0 (pesquisa de satisfação)
- Medição: Pesquisa in-app mensal

**KPI 7 - Performance Técnica**
- Meta: Tempo de carregamento médio <2s
- Meta: Taxa de erro <1% (erros de sistema, não de usuário)
- Meta: Uptime ≥99%
- Medição: Monitoring (Sentry, Uptime Robot)

### Meta Mínima Aceitável (Go/No-Go)
- ✅ 3 coordenadores usando ativamente por 8 semanas consecutivas
- ✅ Pelo menos 200 O.S. gerenciadas com sucesso no período
- ✅ Taxa de cumprimento de SLA ≥80% (melhoria vs baseline de 75%)
- ✅ Zero uso de planilhas Excel paralelas
- ✅ NPS ≥ 0 (não negativo)

---

## 📌 9. Plano de Implementação (por etapas)

### Etapa 1 – Planejamento (Semana 1: 15/01 - 22/01/2026)

**Atividades:**
- Revisão final do PRD com stakeholders (coordenadores, gestor)
- Definição detalhada do schema de banco de dados (tabelas, relações, índices)
- Criação de wireframes de alta fidelidade (Figma) para todas as telas principais
- Definição de arquitetura técnica (frontend React/Vite, backend Supabase)
- Identificação de dependências (Supabase Auth, Database, Storage, Realtime)
- Estimativas de esforço por funcionalidade (planning poker)
- Preparação do backlog inicial (User Stories priorizadas)
- Setup de repositório Git, CI/CD básico, ambientes (dev, staging, prod)
- Configuração de ferramentas de monitoramento (Sentry, Google Analytics)

**Entrega:** 
- ✅ Schema de banco de dados aprovado e implementado no Supabase
- ✅ Wireframes de alta fidelidade aprovados
- ✅ Backlog priorizado (Sprints 1-4 definidas)
- ✅ Repositório configurado com CI/CD

---

### Etapa 2 – Desenvolvimento do MVP (Semanas 2-9: 22/01 - 25/03/2026)

#### Sprint 1 (Semana 2-3: 22/01 - 05/02)
**Foco: Infraestrutura e Autenticação**
- Setup do projeto React + Vite
- Implementação de autenticação (Supabase Auth)
- Telas de login, recuperação de senha, logout
- Layout base (header, sidebar, footer)
- Navegação (React Router)
- Implementação de RLS (Row Level Security) no Supabase

#### Sprint 2 (Semana 4-5: 05/02 - 19/02)
**Foco: Importação de O.S.**
- Tela de importação com upload de Excel
- Parser de Excel (biblioteca XLSX)
- Validação de campos obrigatórios
- Preview de dados com destaque de erros
- Inserção em lote no banco de dados
- Feedback de sucesso/erro

#### Sprint 3 (Semana 6-7: 19/02 - 05/03)
**Foco: Dashboard e Listagem**
- Tela de dashboard com listagem de O.S.
- Paginação (20 por página)
- Filtros avançados (status, técnico, cliente, data, prioridade)
- Busca por código/endereço/cliente
- Ordenação por colunas
- Indicadores visuais de SLA (cores)
- Exportação para Excel/CSV/PDF

#### Sprint 4 (Semana 8: 05/03 - 12/03)
**Foco: Gestão Individual de O.S.**
- Modal/página de detalhes de O.S.
- Visualização de dados completos
- Atribuição/reatribuição de técnico
- Alteração de status
- Adição de observações
- Histórico de alterações (timeline)
- Edição de dados básicos

#### Sprint 5 (Semana 9: 12/03 - 19/03)
**Foco: Notificações e Relatórios**
- Sistema de notificações in-app
- Alertas de SLA (48h, 24h, atrasada)
- Notificações de eventos (fotos recebidas, relatório gerado)
- Central de notificações
- Dashboard de KPIs (cards, gráficos)
- Relatórios de produtividade

#### Sprint 6 (Semana 10: 19/03 - 25/03)
**Foco: Funcionalidades Secundárias**
- Gestão de técnicos (CRUD)
- Gestão de clientes (CRUD)
- Configurações do sistema
- Logs de auditoria
- Polimento de UX
- Correção de bugs

**Entrega:** 
- ✅ MVP funcional com todas as funcionalidades principais
- ✅ Deploy em ambiente de staging
- ✅ Documentação técnica básica

---

### Etapa 3 – Testes e Iterações (Semanas 10-11: 25/03 - 08/04/2026)

#### Semana 10 (25/03 - 01/04)
**Testes Internos**
- Testes com 2 coordenadores (beta fechado)
- Importação de dados reais (100 O.S. históricas)
- Testes de fluxos completos (importação → atribuição → acompanhamento)
- Coleta de feedback via formulário e sessões de observação
- Identificação de bugs críticos e melhorias de UX
- Testes de performance (1000 O.S., 50 usuários simultâneos)

#### Semana 11 (01/04 - 08/04)
**Correções e Melhorias**
- Correção de bugs críticos
- Implementação de melhorias de UX baseadas em feedback
- Otimizações de performance (queries, índices de banco)
- Testes de compatibilidade (navegadores, resoluções)
- Testes de segurança (penetration testing básico)
- Preparação de documentação de usuário (manual, vídeos tutoriais)
- Treinamento de coordenadores (sessão de 2h)

**Entrega:** 
- ✅ Versão estável para lançamento público
- ✅ Relatório de testes com bugs resolvidos
- ✅ Manual de usuário e vídeos tutoriais
- ✅ Coordenadores treinados

---

### Etapa 4 – Lançamento (Semana 12: 08/04 - 15/04/2026)

**Atividades:**
- Migração de dados históricos (últimos 6 meses de O.S.)
- Deploy em ambiente de produção
- Configuração de domínio e SSL
- Comunicação oficial aos usuários (e-mail, reunião de kick-off)
- Onboarding assistido (primeiros 3 dias)
- Monitoramento ativo 24/7 (primeiros 7 dias)
- Coleta de métricas iniciais (acessos, ações, tempo de uso)
- Suporte dedicado via WhatsApp/Slack (primeiros 15 dias)
- Desativação gradual de planilhas Excel (migração completa)

**Entrega:** 
- ✅ Sistema em produção e acessível
- ✅ 100% dos coordenadores com acesso e treinados
- ✅ Dados históricos migrados
- ✅ Dashboard de monitoramento configurado
- ✅ Planilhas Excel descontinuadas

---

### Etapa 5 – Evolução Pós-Lançamento (A partir de 15/04/2026)

**Mês 1 (Abr/2026):**
- Análise de métricas de uso (Google Analytics, Mixpanel)
- Correção de bugs reportados (hotfixes)
- Otimizações de performance baseadas em dados reais
- Implementação de funcionalidades secundárias (se não concluídas)
- Pesquisa de satisfação (NPS, CSAT)

**Mês 2 (Mai/2026):**
- Implementação de melhorias baseadas em feedback
- Adição de funcionalidades solicitadas (quick wins)
- Integração com TM Zap Levantamentos (atualização automática de status)
- Integração com TM Studio de Relatórios (trigger de geração)
- Testes de carga (preparação para escala)

**Mês 3+ (Jun/2026+):**
- Funcionalidades avançadas (criação manual de O.S., mapa geográfico, agendamento automático)
- Preparação para multi-tenancy (SaaS)
- API pública para integrações externas
- App mobile para coordenadores (opcional)

**Entrega:** 
- ✅ Versão 2.0 com funcionalidades expandidas
- ✅ Roadmap atualizado para próximos 12 meses
- ✅ Plano de licenciamento SaaS definido

---

## 10. Riscos e Dependências

### Riscos

**R1 - Resistência à mudança (coordenadores preferem planilhas)**
- **Probabilidade:** MÉDIA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - Envolver coordenadores desde o planejamento (co-criação)
  - Demonstrar economia de tempo com dados reais (piloto de 1 semana)
  - Treinamento presencial obrigatório
  - Suporte dedicado nos primeiros 30 dias
  - Desativar acesso a planilhas antigas após migração

**R2 - Qualidade de dados na importação (Excel mal formatado)**
- **Probabilidade:** ALTA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Template Excel muito claro com exemplos
  - Validação rigorosa com feedback detalhado
  - Importação incremental (corrigir erros sem perder dados válidos)
  - Treinamento específico sobre preenchimento de Excel
  - Suporte para revisão de arquivos antes de importação

**R3 - Performance com grande volume de dados**
- **Probabilidade:** MÉDIA
- **Impacto:** ALTO
- **Mitigação:** 
  - Índices de banco de dados otimizados
  - Paginação obrigatória (não carregar tudo de uma vez)
  - Lazy loading de dados
  - Cache de queries frequentes
  - Testes de carga antes do lançamento

**R4 - Dependência de Supabase (vendor lock-in)**
- **Probabilidade:** BAIXA
- **Impacto:** ALTO
- **Mitigação:** 
  - Arquitetura desacoplada (fácil migração de backend)
  - Backup diário de dados (export para PostgreSQL puro)
  - Plano B: Migração para backend próprio (Node.js + PostgreSQL)
  - Monitorar SLA e custos do Supabase

**R5 - Integração com outros módulos (Zap, Studio) atrasar**
- **Probabilidade:** MÉDIA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Controle de O.S. funciona standalone (não depende de integrações)
  - Integrações são incrementais (não bloqueiam MVP)
  - Mocks de API para desenvolvimento paralelo
  - Webhooks e eventos para desacoplamento

### Dependências

**D1 - Supabase (Backend as a Service)**
- Dependência crítica para autenticação, banco de dados, storage e realtime
- Risco: Downtime, mudanças de pricing, limitações de plano gratuito
- Plano B: Migração para Firebase ou backend próprio (Node.js + PostgreSQL)

**D2 - Dados históricos de O.S. (planilhas Excel)**
- Necessário para migração inicial e testes com dados reais
- Risco: Dados incompletos, mal formatados, inconsistentes
- Plano B: Criar dados sintéticos para testes, migração gradual

**D3 - Disponibilidade de coordenadores para testes**
- Necessário para validação de usabilidade e coleta de feedback
- Risco: Coordenadores muito ocupados, resistência a participar
- Plano B: Testes com usuários substitutos (Thiago simulando coordenador)

**D4 - Integração com TM Zap Levantamentos (futura)**
- Necessária para atualização automática de status quando técnico envia fotos
- Risco: Zap Levantamentos atrasar ou ter API incompatível
- Plano B: Atualização manual de status no MVP, integração posterior

**D5 - Integração com TM Studio de Relatórios (futura)**
- Necessária para trigger automático de geração de relatórios
- Risco: Studio atrasar ou ter webhook incompatível
- Plano B: Processo manual de solicitação de relatório no MVP

---

## 11. Anexos

### Links de Referência
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [SheetJS (XLSX Parser)](https://sheetjs.com)
- [Recharts (Gráficos)](https://recharts.org)
- [Design System TM - Ocean Breeze](d:\DATABASE\TM\Design System TM – Atualizado com Ocean Breeze.docx)

### Wireframes
- **Login**: `d:\DATABASE\TM - Levantamentos Fotográficos (FIGMA PROJECT)\project\wireframes\login.png`
- **Dashboard**: `d:\DATABASE\TM - Levantamentos Fotográficos (FIGMA PROJECT)\project\wireframes\dashboard.png`
- **Importação de O.S.**: A ser criado na Etapa 1
- **Detalhes de O.S.**: A ser criado na Etapa 1
- **Relatórios**: A ser criado na Etapa 1

### Documentos de Referência
- [MVP - TM Controle de O.S.](d:\DATABASE\MVP_TM_Controle_OS.md)
- [Contexto do Projeto MAFFENG](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\CONTEXTO_PROJETO_MAFFENG.md)
- [Roadmap Integrado](d:\DATABASE\ROAD_MAP.md)
- [DER - Diagrama de Entidade e Relacionamento](d:\DATABASE\02 - maffeng_Diagrama de Entidade e Relacionamento (DER).mermaid)
- [Personas e Jornada](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\03 - personas-jornada-tm.html)

### Diagramas Técnicos
- **Arquitetura de Sistema**: A ser criado na Etapa 1
- **Fluxo de Dados**: A ser criado na Etapa 1
- **Modelo de Dados (DER)**: Já existe em `02 - maffeng_Diagrama de Entidade e Relacionamento (DER).mermaid`
- **Diagrama de Sequência (Importação)**: A ser criado na Etapa 1

### Template Excel para Importação
- **Colunas obrigatórias**: 
  - Código O.S. (texto, único)
  - Cliente (texto)
  - Endereço (texto)
  - Tipo de Serviço (texto, valores permitidos: "Levantamento Elétrico", "Inspeção Hidráulica", etc.)
  - Prazo (data, formato DD/MM/AAAA)
  - Prioridade (texto, valores permitidos: "Baixa", "Normal", "Alta", "Urgente")
  - Descrição (texto, opcional)
- **Arquivo de exemplo**: A ser criado na Etapa 1

---

**Versão:** 1.0  
**Data de Criação:** 25/11/2025  
**Autor:** Thiago Nascimento Barbosa  
**Aprovadores:** [Pendente]  
**Status:** 🔴 Prioridade Crítica - Em Revisão  
**Próxima Revisão:** 01/12/2025
