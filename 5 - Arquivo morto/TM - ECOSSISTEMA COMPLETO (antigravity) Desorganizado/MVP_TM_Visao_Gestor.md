# MVP - TM Visão do Gestor

## 1. Objetivo do MVP

Validar se gestores executivos estão dispostos a usar um dashboard analítico que consolida KPIs operacionais em tempo real, permitindo tomada de decisão baseada em dados sem depender de relatórios manuais. A hipótese principal é que visibilidade imediata de métricas críticas (SLA, produtividade, gargalos) aumenta em 40% a velocidade de resposta a problemas operacionais.

## 2. Público-Alvo Inicial

### Perfil 1
- **Gestores operacionais** (Gerentes, Diretores) que supervisionam múltiplas equipes técnicas
- Tomam decisões estratégicas baseadas em performance
- Atualmente dependem de relatórios semanais/mensais em Excel ou PowerPoint

### Perfil 2
- **Sócios/Proprietários** que precisam de visão macro do negócio
- Interessados em tendências, crescimento e eficiência operacional
- Acesso esporádico mas necessitam de informações consolidadas rapidamente

### Critérios de Exclusão
- Usuários que necessitam de acesso operacional detalhado (esses usam o Controle de O.S.)
- Empresas com menos de 50 O.S./mês (volume insuficiente para análises significativas)

## 3. Problema a Ser Resolvido

Gestores enfrentam:
- **Falta de visibilidade em tempo real**: Dados desatualizados, consolidados manualmente
- **Decisões reativas**: Descobrem problemas tarde demais (SLA estourado, técnico sobrecarregado)
- **Perda de tempo**: Precisam solicitar relatórios customizados a cada dúvida
- **Dificuldade em identificar tendências**: Sem histórico visual, impossível ver padrões
- **Falta de comparabilidade**: Não conseguem comparar performance entre períodos ou equipes

## 4. Solução Proposta (Visão Geral)

Um dashboard executivo (BI) que:
- Consolida dados de todos os módulos (Controle de O.S., Zap, Studio)
- Apresenta KPIs críticos em cards visuais (total de O.S., taxa de conclusão, SLA médio)
- Exibe gráficos de tendência (evolução temporal, comparações)
- Permite filtros por período, técnico, tipo de serviço, cliente
- Atualiza automaticamente em tempo real (ou near real-time)
- Exporta relatórios executivos em PDF/Excel

## 5. Funcionalidades Essenciais (Escopo do MVP)

### Funcionalidade 1: Dashboard Principal com KPIs
- **Cards de métricas principais**:
  - Total de O.S. (ativas, concluídas, atrasadas)
  - Taxa de cumprimento de SLA (%)
  - Tempo médio de conclusão
  - Produtividade por técnico (O.S./semana)
  - Relatórios gerados (total, pendentes)

### Funcionalidade 2: Gráficos de Tendência
- **Gráfico de linha**: Evolução de O.S. concluídas por semana/mês
- **Gráfico de barras**: Comparação de produtividade entre técnicos
- **Gráfico de pizza**: Distribuição de O.S. por status
- **Gráfico de área**: SLA ao longo do tempo

### Funcionalidade 3: Filtros Dinâmicos
- Seleção de período (última semana, mês, trimestre, customizado)
- Filtro por técnico específico ou equipe
- Filtro por tipo de serviço
- Filtro por cliente (se aplicável)

### Funcionalidade 4: Alertas e Indicadores
- Destaque visual de KPIs críticos (vermelho se SLA <80%, verde se >95%)
- Lista de "Top 5 O.S. atrasadas"
- Indicador de técnicos com carga acima da média

### Funcionalidade 5: Exportação de Relatórios
- Download de relatório executivo em PDF (snapshot do dashboard)
- Exportação de dados brutos para Excel (para análises customizadas)

### Funcionalidade 6: Autenticação e Acesso Restrito
- Login exclusivo para perfil "Gestor"
- Dados agregados (sem acesso a detalhes operacionais sensíveis)

## 6. Funcionalidades Fora do Escopo (Neste MVP)

- Análise preditiva com Machine Learning (previsão de atrasos)
- Dashboards customizáveis por usuário (drag-and-drop de widgets)
- Drill-down completo até nível de O.S. individual (isso é função do Controle de O.S.)
- Integração com ferramentas de BI externas (Power BI, Tableau)
- Alertas automáticos via e-mail/SMS
- Comparação com benchmarks de mercado
- Análise financeira (custos, receitas, margens)
- Gestão de metas e OKRs
- Comentários e anotações em gráficos
- Histórico de mais de 12 meses (no MVP)

## 7. Jornada Simplificada do Usuário

1. **O usuário faz login** com credenciais de gestor
2. **Visualiza dashboard principal** com KPIs atualizados do dia/semana
3. **Identifica alerta** de SLA abaixo da meta (ex: 75% vs meta de 90%)
4. **Aplica filtro** para ver apenas O.S. atrasadas
5. **Analisa gráfico** de produtividade por técnico e identifica gargalo
6. **Exporta relatório** em PDF para apresentar em reunião executiva
7. **Toma decisão** de realocar recursos ou revisar processos

## 8. Critérios de Sucesso (Métricas do MVP)

### Métrica 1: Adoção
- **Meta**: 100% dos gestores acessam o dashboard pelo menos 2x por semana
- **Meta**: Redução de 80% em solicitações de relatórios manuais

### Métrica 2: Velocidade de Decisão
- **Meta**: Redução de 40% no tempo entre identificação de problema e ação corretiva (baseline: 3 dias → objetivo: 1.8 dias)

### Métrica 3: Precisão dos Dados
- **Meta**: 100% de acurácia entre dados do dashboard e dados do Controle de O.S.
- **Meta**: Latência de atualização <5 minutos

### Métrica 4: Satisfação
- **Meta**: NPS ≥70 entre gestores
- **Meta**: 90% dos gestores consideram o dashboard "essencial" ou "muito útil"

### Meta Mínima Aceitável
- 2 gestores usando ativamente por 6 semanas
- Pelo menos 15 acessos ao dashboard por semana (total)
- 5 relatórios executivos exportados

## 9. Premissas e Restrições

### Premissas
- Dados do Controle de O.S. estão estruturados e acessíveis via API/banco
- Gestores têm acesso a computador/tablet com navegador moderno
- Volume de dados é suficiente para gerar insights (mínimo 50 O.S./mês)
- Métricas de SLA e produtividade estão previamente definidas
- Atualização near real-time é aceitável (não precisa ser instantânea)

### Restrições
- **Técnicas**: Frontend React com biblioteca de gráficos (Chart.js ou Recharts), Backend Supabase com views/queries otimizadas
- **Orçamento**: Desenvolvimento solo
- **Tempo**: 4-6 semanas para MVP funcional
- **Performance**: Queries devem retornar em <2s mesmo com 1000+ O.S.
- **Infraestrutura**: Pode exigir índices de banco de dados otimizados
- **Segurança**: Dados agregados apenas, sem exposição de informações sensíveis de clientes

## 10. Prazo Estimado de Entrega

### Início
**01/04/2026** (Q2 2026)

### Fim
**15/05/2026** (6 semanas)

### Marcos Importantes

| Data | Marco | Entregável |
|------|-------|------------|
| 08/04/2026 | M1 - Queries | Views e queries de agregação no banco implementadas |
| 15/04/2026 | M2 - KPIs | Cards de métricas principais funcionando |
| 25/04/2026 | M3 - Gráficos | Gráficos de tendência implementados |
| 02/05/2026 | M4 - Filtros | Sistema de filtros dinâmicos completo |
| 08/05/2026 | M5 - Exportação | Geração de PDF/Excel funcionando |
| 12/05/2026 | M6 - Beta | Testes com 2 gestores e dados reais |
| 15/05/2026 | M7 - Release | Lançamento para todos os gestores |

---

**Versão**: 1.0  
**Data de Criação**: 25/11/2025  
**Responsável**: Thiago Nascimento Barbosa  
**Status**: 🟡 Aguardando Dados Reais  
**Dependências**: 
- TM Controle de O.S. (fonte primária de dados)
- TM Studio de Relatórios (dados de relatórios gerados)
- TM Zap Levantamentos (dados de campo)
