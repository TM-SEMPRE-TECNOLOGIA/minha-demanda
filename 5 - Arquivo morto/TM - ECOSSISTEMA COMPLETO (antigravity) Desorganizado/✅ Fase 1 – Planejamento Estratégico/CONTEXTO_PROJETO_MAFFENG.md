# CONTEXTO DO PROJETO: ECOSSISTEMA MAFFENG

### 1. Visão-Geral
- **Objetivo principal**: Estruturar um ecossistema modular e integrado de aplicativos técnicos, administrativos e gerenciais que automatize completamente o ciclo de vida de ordens de serviço técnicas (SaaS).
- **Stakeholders / Responsáveis**:
  - Thiago Nascimento Barbosa (Fundador/Dev Lead)
  - MAFFENG (Cliente/Marca Proprietária)
  - TM - Sempre Tecnologia (Desenvolvedora)
- **Escopo atual**: 5 módulos definidos:
  1. **TM – Zap Levantamentos** (Mobile - Campo)
  2. **TM – Controle de O.S** (Web - Núcleo de Gestão)
  3. **TM – Studio de Relatórios** (Web/Python - Automação)
  4. **TM – Visão do Gestor** (Dashboard BI)
  5. **TM Ajustes Administrativos** (Gestão Interna)
- **Alterações recentes ou interrupções**: Conclusão da Fase 1 (Planejamento) e avanço nas Fases 2 (Requisitos) e 3 (Design). Atualização da nomenclatura dos módulos.

### 2. Status Atual
- **Entregas concluídas**:
  - [x] Entrega A — Fase 1: Planejamento Estratégico (5 documentos: Canvas, Personas, Mercado, SWOT, Visão)
  - [x] Entrega B — Design System TM (Baseado em Ocean Breeze/Dark Mode)
  - [x] Entrega C — Protótipo Front-end (12 telas HTML implementadas: Login, Dashboard, Listas, Configurações)
  - [x] Entrega D — PRD v2.0 (Documento de Requisitos do Produto atualizado)
- **Entregas em andamento**:
  - [ ] Entrega E — Fase 2: Definição de Requisitos Detalhados (FRD, NFRD, Schema, APIs) — % concluído: 90%
  - [ ] Entrega F — Fase 3: Design e UX (Refinamento de telas e fluxos) — % concluído: 80%
  - [ ] Entrega G — Desenvolvimento do MVP (TM – Controle de O.S) — % concluído: 0%
- **Entregas ainda pendentes / bloqueadas**:
  - [ ] Entrega H — Integração TM – Studio de Relatórios — motivo do bloqueio: Aguarda backend do Controle de O.S.
  - [ ] Entrega I — TM – Visão do Gestor — motivo do bloqueio: Aguarda dados reais validados pelo núcleo.

### 3. Recursos & Orçamento
- **Orçamento total previsto**: Modelo bootstrap (custo variável).
- **Valor gasto até agora**: Não informado (foco em horas de desenvolvimento).
- **Recursos em uso (humanos, tecnológicos)**:
  - Humanos: 1 Dev Lead (Thiago) + AI Assistants.
  - Tecnológicos: Supabase (Backend), React/Vite (Frontend), Python (Processamento), Figma (Design).
- **Gargalos ou falta de recursos**: Time reduzido (projeto solo) limita velocidade de desenvolvimento paralelo. Dependência crítica do módulo "Controle de O.S" para destravar os demais.

### 4. Riscos & Problemas
- **Riscos identificados**:
  - Risco 1: Atraso no desenvolvimento do núcleo (Controle de O.S) — Probabilidade: MÉDIA — Impacto: CRÍTICO — Ação mitigação: Priorização absoluta e MVP mínimo.
  - Risco 2: Baixa adoção inicial pelos técnicos — Probabilidade: MÉDIA — Impacto: ALTO — Ação mitigação: Beta privado com onboarding assistido.
  - Risco 3: Complexidade de integração (Mobile <-> Web <-> Python) — Probabilidade: MÉDIA — Impacto: MÉDIO — Ação mitigação: Documentação rigorosa de APIs.
- **Problemas reais em curso**:
  - Problema A: Validação de mercado ainda teórica — Status: A RESOLVER — Responsável: Thiago (Planejado Beta Privado).



### 6. Observações & Histórico
- **Decisões recentes relevantes**:
  - Atualização dos nomes dos módulos para reforçar branding (Zap, Studio, Visão do Gestor).
  - Generalização do Design System para ser agnóstico a funcionalidades específicas.
- **Mudanças de equipe ou tecnologia**: Nenhuma mudança recente na stack (mantido Supabase + React).
- **Lições aprendidas até agora**: A documentação estratégica (Fase 1) foi crucial para clareza, mas agora é necessário acelerar a execução técnica (código) para não paralisar em "analysis paralysis".
