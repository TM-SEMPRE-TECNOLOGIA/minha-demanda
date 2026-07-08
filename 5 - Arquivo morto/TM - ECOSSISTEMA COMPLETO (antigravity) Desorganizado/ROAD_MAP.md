# 🗺️ ROADMAP INTEGRADO - MAFFENG

Este documento consolida todos os próximos passos, prioridades e planejamentos futuros do ecossistema MAFFENG, centralizando informações anteriormente dispersas em diversos documentos do projeto.

---

## 🚀 FASE 2: DEFINIÇÃO DE REQUISITOS E FUNDAÇÃO (IMEDIATO - Q1 2026)

**Foco Estratégico:** "Como" vamos construir. Detalhamento técnico e funcional para desbloquear o desenvolvimento.

### 🔴 PRIORIDADE CRÍTICA (Semanas 1-2)
*Objetivo: Preparar terreno para desenvolvimento do MVP.*

1.  **Documentação & Planejamento**
    *   [ ] **PRD Final:** Aprovar formalmente o Product Requirements Document do Gerenciador de O.S.
    *   [ ] **FRD (Functional Requirements Document):** Criar especificação detalhada dos casos de uso.
    *   [ ] **Backlog:** Criar e priorizar User Stories para a Sprint 1.
    *   [ ] **Definição de Colunas e ENUMs:** Revisar tabelas e definir tipos faltantes (`tipo_servico`, `prioridade`) e valores padrão.

2.  **Infraestrutura & Setup**
    *   [ ] **Supabase:** Criar projeto, configurar ambiente e implementar schema inicial do banco de dados.
    *   [ ] **Repositório:** Configurar Git, ambiente de desenvolvimento e CI/CD básico.
    *   [ ] **Design System:** Revisar guia e marcar decisões tomadas.

3.  **Design**
    *   [ ] **Wireframes:** Criar wireframes de alta fidelidade navegáveis no Figma.

### 🟡 PRIORIDADE ALTA (Semanas 3-4)
*Objetivo: Início do desenvolvimento do Core.*

1.  **Backend (Supabase)**
    *   [ ] **RLS Policies:** Configurar segurança a nível de linha (Row Level Security).
    *   [ ] **API Endpoints:** Implementar endpoints principais (Upload, CRUD O.S.).
    *   [ ] **Autenticação:** Configurar JWT e proteção de rotas.

2.  **Frontend (Web & Mobile)**
    *   [ ] **MVP Importação:** Desenvolver fluxo de importação de O.S.
    *   [ ] **Upload de Pacotes:** Implementar endpoint e interface de upload.
    *   [ ] **Dashboard:** Criar visualização básica de KPIs.
    *   [ ] **Mobile Mock:** Testar integração básica com app mobile.

---

## 🛠️ FASE 3: DESENVOLVIMENTO E INTEGRAÇÃO (CURTO PRAZO - Q1/Q2 2026)

**Foco Estratégico:** Construção do fluxo principal: Levantamentos → Gerenciador → Relatórios.

### ✅ CHECKLIST DE IMPLEMENTAÇÃO (MVP)

#### Banco de Dados & Backend
*   [ ] Implementar lógica de cálculo de SLA.
*   [ ] Implementar validações de negócio e constraints.
*   [ ] Configurar upload de fotos (Storage) e webhooks para Auto Relatórios.
*   [ ] Implementar sistema de notificações.
*   [ ] Configurar logs de auditoria e monitoramento (Sentry).

#### Frontend (Gerenciador)
*   [ ] Implementar todas as telas conforme Figma.
*   [ ] Integrar com API REST e Realtime.
*   [ ] Implementar upload de arquivos (Excel, fotos) e validações.
*   [ ] Exportação de dados (Excel, PDF).

#### Mobile (Levantamentos)
*   [ ] Captura de fotos com metadados EXIF.
*   [ ] Funcionalidade offline e sincronização.
*   [ ] Upload de pacotes e Push Notifications.

#### Integrações
*   [ ] **Auto Relatórios:** Integrar geração de documentos e callbacks.
*   [ ] **Testes:** Executar testes E2E nos fluxos críticos.

---

## 🏗️ FASE 4: ARQUITETURA E ESCALABILIDADE (MÉDIO PRAZO - Q3/Q4 2026)

**Foco Estratégico:** Robustez, performance e preparação para escala.

### Melhorias Técnicas Planejadas
*   **Migração TypeScript:** Reduzir bugs e melhorar DX (Meta: Q2 2026).
*   **GraphQL API:** Otimizar queries e reduzir over-fetching (Meta: Q3 2026).
*   **Event-Driven Architecture:** Desacoplar serviços para maior escalabilidade (Meta: Q4 2026).
*   **Testes E2E:** Expandir cobertura para 80% dos fluxos (Meta: Q2 2026).

### Metas de Performance (Budget)
*   **Web:** FCP < 2s, TTI < 3.5s.
*   **Mobile:** App size < 30MB, Startup < 2s.
*   **API:** Response time < 500ms (p95).

---

## 🔮 FASE 5: EVOLUÇÃO E FUTURO (LONGO PRAZO - 2027+)

**Foco Estratégico:** Inteligência, Multi-tenancy e Expansão.

*   **Machine Learning:** Classificação automática de fotos.
*   **Multi-tenancy Completo:** Suporte a múltiplas empresas/clientes no mesmo ambiente.
*   **Database Sharding:** Escalabilidade horizontal do banco de dados.
*   **Expansão Administrativa:** Módulo financeiro e de patrimônio.

---

*Este documento é vivo e deve ser atualizado conforme o progresso do projeto.*
