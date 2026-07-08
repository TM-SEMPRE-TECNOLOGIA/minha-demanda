# PRD – Product Requirements Document
## TM Visão do Gestor

---

## 1. Visão Geral do Produto

**TM Visão do Gestor** é um dashboard executivo (Business Intelligence) que consolida dados de todos os módulos do ecossistema MAFFENG em visualizações analíticas intuitivas. O produto oferece KPIs em tempo real, gráficos de tendência, alertas proativos e relatórios executivos, permitindo que gestores tomem decisões baseadas em dados sem depender de relatórios manuais.

**Objetivo Principal**: Fornecer visibilidade completa e em tempo real da operação, permitindo que gestores identifiquem problemas, gargalos e oportunidades 40% mais rápido, através de dados consolidados e visualizações intuitivas.

**Valor para o Usuário**: Gestores têm acesso imediato a informações críticas para tomada de decisão, coordenadores ganham ferramenta para demonstrar resultados, e a empresa aumenta significativamente a capacidade de resposta a problemas operacionais.

---

## 2. Problema / Oportunidade

### Problema
Gestores executivos enfrentam:
- **Cegueira operacional**: Não sabem em tempo real o que está acontecendo na operação
- **Dados desatualizados**: Recebem relatórios manuais com dados de 3-5 dias atrás
- **Impossibilidade de identificar tendências**: Sem histórico visual, não conseguem ver padrões ou prever problemas
- **Decisões reativas**: Descobrem problemas tarde demais (SLA estourado, técnico sobrecarregado, cliente insatisfeito)
- **Perda de tempo**: Precisam solicitar relatórios customizados a cada dúvida, aguardar consolidação manual
- **Falta de comparabilidade**: Não conseguem comparar performance entre períodos, técnicos ou tipos de serviço
- **Reuniões improdutivas**: Gastam tempo pedindo atualizações em vez de discutir soluções

### Oportunidade
- Diferencial competitivo: Gestão data-driven vs gestão por "achismos"
- Aumento de produtividade: Decisões 40% mais rápidas
- Redução de custos: Identificar gargalos e otimizar alocação de recursos
- Melhoria de SLA: Alertas proativos evitam atrasos
- Preparação para escala: Dados estruturados permitem crescimento sustentável
- Potencial de licenciamento: Dashboard BI como produto standalone para outras empresas

---

## 3. Público-Alvo

### Persona 1: Roberto - Gestor Operacional
- **Idade**: 35-55 anos
- **Cargo**: Gerente de Operações / Diretor Técnico
- **Contexto**: Supervisiona 3 coordenadores e 15 técnicos, responsável por resultados da área
- **Dores**: 
  - Recebe relatórios desatualizados em Excel/PowerPoint
  - Não consegue identificar gargalos rapidamente
  - Toma decisões baseadas em "achismos" por falta de dados
  - Perde tempo em reuniões pedindo atualizações manuais
  - Descobre problemas tarde demais (cliente já reclamou)
- **Comportamento**: Acesso esporádico mas precisa de informações rápidas e precisas
- **Objetivo**: Visão macro de performance, identificar problemas antes que virem crises
- **Motivação**: Atingir metas de produtividade, reduzir custos, melhorar satisfação do cliente

### Persona 2: Carlos - Sócio/Proprietário
- **Idade**: 40-60 anos
- **Cargo**: Sócio-Diretor / CEO
- **Contexto**: Responsável pela estratégia e crescimento da empresa
- **Dores**: 
  - Não tem visão consolidada do negócio
  - Precisa de dados para apresentar a investidores/clientes
  - Não consegue avaliar ROI de investimentos em tecnologia
  - Falta de previsibilidade de receita e capacidade
- **Comportamento**: Acesso mensal/trimestral, precisa de visão macro e tendências
- **Objetivo**: Entender saúde do negócio, identificar oportunidades de crescimento
- **Motivação**: Crescimento sustentável, rentabilidade, escalabilidade

---

## 4. Objetivos do Produto

### Objetivos de Negócio
1. **Aumentar velocidade de decisão** em 40% (identificação de problema → ação corretiva)
2. **Melhorar SLA** através de alertas proativos (reduzir atrasos em 30%)
3. **Otimizar alocação de recursos** (identificar técnicos sobrecarregados/ociosos)
4. **Reduzir custos** de produção de relatórios manuais em 80%
5. **Criar cultura data-driven** na empresa
6. **Preparar base para BI avançado** (preditivo, prescritivo)

### Objetivos do Usuário
1. **Ter visibilidade em tempo real**: Saber status da operação em <10 segundos
2. **Identificar problemas proativamente**: Receber alertas antes que virem crises
3. **Comparar performance**: Entender evolução temporal e benchmarks internos
4. **Tomar decisões baseadas em dados**: Ter acesso a KPIs confiáveis
5. **Economizar tempo**: Não precisar solicitar relatórios manuais
6. **Demonstrar resultados**: Ter dados para apresentar em reuniões/relatórios

---

## 5. Escopo Funcional

### 5.1 Funcionalidades Principais

#### F1 - Dashboard Principal com KPIs
**Cards de Métricas Principais** (atualizados em tempo real):
- **Total de O.S. Ativas**: Número de O.S. em andamento (status: Pendente, Atribuída, Em Campo, Fotos Recebidas)
- **O.S. Concluídas (Mês Atual)**: Total de O.S. finalizadas no mês corrente
- **O.S. Atrasadas**: Número de O.S. que ultrapassaram o prazo (SLA estourado)
- **Taxa de Cumprimento de SLA**: Percentual de O.S. concluídas dentro do prazo (últimos 30 dias)
- **Tempo Médio de Conclusão**: Média de dias entre criação e conclusão de O.S. (últimos 30 dias)
- **Produtividade Geral**: O.S. concluídas por técnico por semana (média)
- **Relatórios Gerados (Mês Atual)**: Total de relatórios produzidos pelo Studio
- **Relatórios Pendentes**: Número de relatórios aguardando revisão/aprovação

**Indicadores Visuais**:
- 🟢 Verde: Métrica acima da meta
- 🟡 Amarelo: Métrica próxima da meta (alerta)
- 🔴 Vermelho: Métrica abaixo da meta (crítico)

#### F2 - Gráficos de Tendência e Análise

**Gráfico 1: Evolução de O.S. Concluídas**
- Tipo: Gráfico de linha
- Eixo X: Tempo (últimas 8 semanas ou 6 meses)
- Eixo Y: Número de O.S. concluídas
- Comparação: Linha de meta (se definida)

**Gráfico 2: Distribuição de O.S. por Status**
- Tipo: Gráfico de pizza ou donut
- Segmentos: Pendente, Atribuída, Em Campo, Fotos Recebidas, Relatório Gerado, Concluída
- Percentuais e números absolutos

**Gráfico 3: Produtividade por Técnico**
- Tipo: Gráfico de barras horizontais
- Eixo X: Número de O.S. concluídas (período selecionado)
- Eixo Y: Nome do técnico
- Ordenação: Do mais produtivo para o menos
- Indicador de média (linha vertical)

**Gráfico 4: SLA ao Longo do Tempo**
- Tipo: Gráfico de área
- Eixo X: Tempo (últimas 8 semanas)
- Eixo Y: Taxa de cumprimento de SLA (%)
- Linha de meta (ex: 90%)
- Área preenchida: Verde se acima da meta, vermelho se abaixo

**Gráfico 5: Tempo Médio de Conclusão**
- Tipo: Gráfico de linha
- Eixo X: Tempo (últimas 8 semanas)
- Eixo Y: Dias médios para conclusão
- Tendência (linha de regressão)

#### F3 - Filtros Dinâmicos
- **Período**: Última semana, último mês, último trimestre, customizado (data início/fim)
- **Técnico**: Todos, ou técnico específico
- **Tipo de Serviço**: Todos, ou tipo específico (Levantamento Elétrico, Inspeção Hidráulica, etc.)
- **Cliente**: Todos, ou cliente específico
- **Status**: Todos, ou status específico

**Comportamento**: Ao aplicar filtro, todos os KPIs e gráficos são atualizados automaticamente

#### F4 - Alertas e Indicadores Críticos

**Seção "Atenção Necessária"** (destaque visual):
- **Top 5 O.S. Atrasadas**: Lista com código, cliente, dias de atraso, técnico responsável
- **Técnicos com Carga Acima da Média**: Lista de técnicos com >20% mais O.S. ativas que a média
- **Clientes com Múltiplas O.S. Atrasadas**: Clientes com ≥3 O.S. atrasadas (risco de insatisfação)
- **Tendência Negativa de SLA**: Alerta se SLA caiu >10% nas últimas 4 semanas

#### F5 - Exportação de Relatórios

**Relatório Executivo em PDF**:
- Snapshot do dashboard (KPIs + gráficos principais)
- Período selecionado
- Gerado automaticamente com formatação profissional
- Logo da empresa, data de geração, assinatura digital

**Exportação de Dados Brutos**:
- Excel (.xlsx) com dados detalhados para análises customizadas
- Colunas: Todas as métricas disponíveis
- Filtros aplicados são mantidos

#### F6 - Autenticação e Controle de Acesso
- Login exclusivo para perfil "Gestor" ou "Admin"
- Dados agregados (sem acesso a detalhes operacionais sensíveis no MVP)
- Logout e sessão com expiração configurável

### 5.2 Funcionalidades Secundárias

#### F7 - Comparação de Períodos
- Comparar métricas de dois períodos (ex: Mês atual vs mês anterior)
- Indicador de variação (% de aumento/redução)
- Visualização lado a lado

#### F8 - Metas e Objetivos
- Definição de metas para KPIs principais (SLA, produtividade, tempo médio)
- Visualização de progresso em relação à meta
- Alertas quando meta não está sendo atingida

#### F9 - Favoritos e Personalização
- Salvar filtros favoritos (ex: "Últimos 30 dias - Técnico Carlos")
- Definir dashboard padrão ao fazer login
- Ocultar/exibir gráficos específicos

#### F10 - Histórico de Acesso
- Log de acessos ao dashboard (quem, quando)
- Relatórios mais exportados
- Filtros mais utilizados

### 5.3 Fora de Escopo

- ❌ Análise preditiva com Machine Learning (previsão de atrasos, demanda futura)
- ❌ Dashboards customizáveis por usuário (drag-and-drop de widgets)
- ❌ Drill-down completo até nível de O.S. individual (isso é função do Controle de O.S.)
- ❌ Integração com ferramentas de BI externas (Power BI, Tableau, Looker)
- ❌ Alertas automáticos via e-mail/SMS (apenas in-app no MVP)
- ❌ Comparação com benchmarks de mercado (dados externos)
- ❌ Análise financeira (custos, receitas, margens, ROI)
- ❌ Gestão de metas e OKRs (framework completo)
- ❌ Comentários e anotações em gráficos
- ❌ Histórico de mais de 12 meses (no MVP)
- ❌ Dashboards para outros perfis (técnicos, analistas)
- ❌ Visualizações geográficas (mapa de calor, clusters)

---

## 6. Requisitos Detalhados

### 6.1 Requisitos Funcionais

**RF01** – O sistema deve exibir cards com KPIs principais (total O.S., concluídas, atrasadas, SLA, tempo médio)  
**RF02** – O sistema deve atualizar KPIs automaticamente (refresh a cada 5 minutos ou manual)  
**RF03** – O sistema deve exibir indicadores visuais de status (verde, amarelo, vermelho)  
**RF04** – O sistema deve exibir gráfico de evolução de O.S. concluídas ao longo do tempo  
**RF05** – O sistema deve exibir gráfico de distribuição de O.S. por status  
**RF06** – O sistema deve exibir gráfico de produtividade por técnico  
**RF07** – O sistema deve exibir gráfico de SLA ao longo do tempo  
**RF08** – O sistema deve permitir filtrar dados por período (última semana, mês, trimestre, customizado)  
**RF09** – O sistema deve permitir filtrar dados por técnico, tipo de serviço, cliente, status  
**RF10** – O sistema deve atualizar todos os gráficos e KPIs ao aplicar filtros  
**RF11** – O sistema deve exibir seção "Atenção Necessária" com alertas críticos  
**RF12** – O sistema deve listar Top 5 O.S. atrasadas com detalhes  
**RF13** – O sistema deve identificar técnicos com carga acima da média  
**RF14** – O sistema deve identificar clientes com múltiplas O.S. atrasadas  
**RF15** – O sistema deve permitir exportação de relatório executivo em PDF  
**RF16** – O sistema deve permitir exportação de dados brutos em Excel  
**RF17** – O sistema deve implementar controle de acesso (apenas perfil Gestor/Admin)  
**RF18** – O sistema deve calcular métricas a partir de dados do Controle de O.S., Zap e Studio  
**RF19** – O sistema deve exibir timestamp de última atualização de dados  
**RF20** – O sistema deve permitir refresh manual de dados (botão "Atualizar")  

### 6.2 Requisitos Não Funcionais

**RNF01 – Performance**
- Tempo de carregamento inicial do dashboard: <3 segundos
- Tempo de atualização após aplicar filtros: <1 segundo
- Tempo de geração de PDF: <5 segundos
- Queries de agregação: <2 segundos (mesmo com 10.000+ O.S.)
- Suportar até 20 usuários simultâneos sem degradação

**RNF02 – Segurança**
- Comunicação via HTTPS obrigatório
- Autenticação via JWT
- RLS (Row Level Security) para isolamento de dados
- Dados agregados apenas (sem exposição de informações sensíveis de clientes)
- Logs de acesso para auditoria

**RNF03 – Usabilidade**
- Interface intuitiva (gestor consegue usar sem treinamento formal)
- Design responsivo (funciona em desktop, tablet, smartphone)
- Gráficos interativos (hover para detalhes, zoom, pan)
- Cores acessíveis (contraste adequado, suporte a daltonismo)
- Textos em português brasileiro

**RNF04 – Compatibilidade**
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Resoluções: 1366x768 até 4K
- Funcionar em tablets (iPad, Android tablets)

**RNF05 – Disponibilidade**
- Uptime: 99% (Supabase SLA)
- Dados atualizados em near real-time (<5 minutos de latência)
- Fallback gracioso em caso de falha de query (exibir dados em cache)

**RNF06 – Escalabilidade**
- Suportar até 10.000 O.S. no banco de dados sem degradação
- Queries otimizadas com índices e views materializadas
- Cache de queries frequentes (Redis ou similar)

**RNF07 – Precisão**
- 100% de acurácia entre dados do dashboard e dados do Controle de O.S.
- Cálculos de métricas validados e testados
- Timestamps precisos de última atualização

---

## 7. Fluxo do Usuário / Jornada

### Fluxo Principal: Análise Semanal de Performance

1. **Gestor Roberto faz login** na segunda-feira de manhã
2. **Sistema exibe dashboard** com dados da última semana (padrão)
3. **Roberto visualiza KPIs**:
   - 🟢 Total de O.S. Ativas: 42
   - 🟢 O.S. Concluídas (Mês): 87
   - 🔴 O.S. Atrasadas: 8 (alerta!)
   - 🟡 Taxa de SLA: 82% (meta: 90%)
   - 🟢 Tempo Médio: 4.2 dias
4. **Roberto identifica problema**: SLA abaixo da meta
5. **Roberto visualiza seção "Atenção Necessária"**:
   - Top 5 O.S. Atrasadas: Cliente XYZ aparece 3 vezes
   - Técnico João com 12 O.S. ativas (média: 7)
6. **Roberto clica em gráfico de produtividade por técnico**:
   - João: 3 O.S. concluídas (última semana)
   - Carlos: 8 O.S. concluídas
   - Maria: 7 O.S. concluídas
7. **Roberto identifica gargalo**: João está sobrecarregado
8. **Roberto aplica filtro**: "Técnico: João" + "Últimos 30 dias"
9. **Sistema atualiza dashboard** com dados específicos de João
10. **Roberto visualiza** que João tem 5 O.S. do Cliente XYZ atrasadas
11. **Roberto toma decisão**: Realocar 4 O.S. de João para Carlos
12. **Roberto exporta relatório** em PDF para apresentar em reunião
13. **Roberto acessa Controle de O.S.** (link direto) para reatribuir O.S.

**Tempo total**: 5 minutos (vs 30 minutos solicitando relatórios manuais)

### Fluxo Alternativo: Monitoramento Mensal para Reunião Executiva

1. Sócio Carlos acessa dashboard no final do mês
2. Aplica filtro: "Último Mês"
3. Visualiza evolução de O.S. concluídas (gráfico de linha): Tendência de crescimento
4. Compara com mês anterior: +15% de produtividade
5. Exporta relatório executivo em PDF
6. Apresenta em reunião de diretoria

---

## 8. Critérios de Sucesso / Métricas

### KPIs Primários

**KPI 1 - Adoção**
- Meta: 100% dos gestores acessam o dashboard pelo menos 2x por semana
- Meta: Redução de 80% em solicitações de relatórios manuais
- Medição: Google Analytics (acessos, frequência)

**KPI 2 - Velocidade de Decisão**
- Meta: Redução de 40% no tempo entre identificação de problema e ação corretiva (baseline: 3 dias → objetivo: 1.8 dias)
- Medição: Pesquisa com gestores + análise de casos

**KPI 3 - Precisão dos Dados**
- Meta: 100% de acurácia entre dados do dashboard e dados do Controle de O.S.
- Meta: Latência de atualização <5 minutos
- Medição: Testes automatizados de validação de queries

**KPI 4 - Satisfação**
- Meta: NPS ≥70 entre gestores
- Meta: 90% dos gestores consideram o dashboard "essencial" ou "muito útil"
- Medição: Pesquisa in-app trimestral

### KPIs Secundários

**KPI 5 - Uso de Funcionalidades**
- Meta: 80% dos gestores usam filtros regularmente
- Meta: 50% exportam relatórios pelo menos 1x por mês
- Medição: Analytics de eventos

**KPI 6 - Performance Técnica**
- Meta: Tempo de carregamento médio <3s
- Meta: Taxa de erro <1%
- Medição: Monitoring (Sentry, Google Analytics)

**KPI 7 - Impacto no Negócio**
- Meta: Melhoria de 10% no SLA geral após 90 dias de uso
- Meta: Redução de 20% em O.S. atrasadas
- Medição: Comparação de métricas antes/depois

### Meta Mínima Aceitável (Go/No-Go)
- ✅ 2 gestores usando ativamente por 6 semanas
- ✅ Pelo menos 15 acessos ao dashboard por semana (total)
- ✅ 5 relatórios executivos exportados
- ✅ Acurácia de dados 100% (zero discrepâncias)
- ✅ NPS ≥ 0 (não negativo)

---

## 📌 9. Plano de Implementação (por etapas)

### Etapa 1 – Planejamento (Semana 1: 01/04 - 08/04/2026)

**Atividades:**
- Revisão final do PRD com stakeholders (gestores)
- Definição de queries de agregação e views materializadas no banco
- Escolha de biblioteca de gráficos (Recharts, Chart.js, D3.js)
- Criação de wireframes de alta fidelidade (Figma)
- Definição de paleta de cores e design system para gráficos
- Estimativas de esforço por funcionalidade
- Preparação do backlog inicial
- Setup de repositório Git (se não compartilhado com Controle de O.S.)

**Entrega:** 
- ✅ Queries e views de agregação implementadas no Supabase
- ✅ Wireframes aprovados
- ✅ Backlog priorizado
- ✅ Design system de gráficos definido

---

### Etapa 2 – Desenvolvimento do MVP (Semanas 2-6: 08/04 - 15/05/2026)

#### Sprint 1 (Semana 2: 08/04 - 15/04)
**Foco: Infraestrutura e KPIs**
- Setup do projeto React (se standalone) ou integração com Controle de O.S.
- Implementação de autenticação e controle de acesso (perfil Gestor)
- Layout base do dashboard
- Implementação de cards de KPIs principais
- Integração com queries de agregação

#### Sprint 2 (Semana 3: 15/04 - 22/04)
**Foco: Gráficos Principais**
- Implementação de gráfico de evolução de O.S. concluídas (linha)
- Implementação de gráfico de distribuição por status (pizza)
- Implementação de gráfico de produtividade por técnico (barras)
- Interatividade básica (hover, tooltips)

#### Sprint 3 (Semana 4: 22/04 - 29/04)
**Foco: Gráficos Secundários e Filtros**
- Implementação de gráfico de SLA ao longo do tempo (área)
- Implementação de gráfico de tempo médio de conclusão (linha)
- Sistema de filtros dinâmicos (período, técnico, tipo de serviço)
- Atualização automática de gráficos ao aplicar filtros

#### Sprint 4 (Semana 5: 29/04 - 06/05)
**Foco: Alertas e Exportação**
- Seção "Atenção Necessária" com alertas críticos
- Top 5 O.S. atrasadas
- Identificação de técnicos sobrecarregados
- Geração de relatório executivo em PDF
- Exportação de dados brutos em Excel

#### Sprint 5 (Semana 6: 06/05 - 13/05)
**Foco: Polimento e Otimização**
- Implementação de funcionalidades secundárias (comparação de períodos, metas)
- Otimizações de performance (cache, lazy loading)
- Design responsivo (tablet, mobile)
- Correção de bugs
- Testes de carga

**Entrega:** 
- ✅ MVP funcional com funcionalidades principais
- ✅ Deploy em ambiente de staging
- ✅ Documentação técnica

---

### Etapa 3 – Testes e Iterações (Semana 7: 13/05 - 20/05/2026)

**Atividades:**
- Testes com 2 gestores (beta fechado)
- Validação de acurácia de dados (comparação manual)
- Coleta de feedback sobre usabilidade e utilidade
- Identificação de bugs e melhorias de UX
- Testes de performance (queries com 10.000+ O.S.)
- Testes de compatibilidade (navegadores, resoluções)
- Ajustes de design e cores
- Preparação de documentação de usuário (guia rápido)

**Entrega:** 
- ✅ Versão estável para lançamento
- ✅ Relatório de testes com validação de acurácia
- ✅ Guia rápido de uso

---

### Etapa 4 – Lançamento (Semana 8: 20/05 - 27/05/2026)

**Atividades:**
- Deploy em ambiente de produção
- Comunicação oficial aos gestores (e-mail, reunião de apresentação)
- Demonstração ao vivo (30 minutos)
- Configuração de acesso para todos os gestores
- Monitoramento ativo de uso e performance
- Coleta de métricas iniciais (acessos, tempo de uso, funcionalidades mais usadas)
- Suporte dedicado (primeiros 15 dias)

**Entrega:** 
- ✅ Dashboard em produção e acessível
- ✅ 100% dos gestores com acesso
- ✅ Dashboard de monitoramento configurado

---

### Etapa 5 – Evolução Pós-Lançamento (A partir de 27/05/2026)

**Mês 1 (Jun/2026):**
- Análise de métricas de uso
- Correção de bugs reportados
- Implementação de melhorias baseadas em feedback
- Adição de novos gráficos solicitados

**Mês 2 (Jul/2026):**
- Implementação de funcionalidades avançadas (comparação de períodos, metas)
- Otimizações de performance
- Pesquisa de satisfação (NPS)

**Mês 3+ (Ago/2026+):**
- Análise preditiva com Machine Learning
- Dashboards customizáveis
- Integração com ferramentas de BI externas
- Alertas automáticos via e-mail/SMS

**Entrega:** 
- ✅ Versão 2.0 com funcionalidades expandidas
- ✅ Roadmap atualizado

---

## 10. Riscos e Dependências

### Riscos

**R1 - Baixa adoção por gestores (preferem relatórios manuais)**
- **Probabilidade:** BAIXA
- **Impacto:** ALTO
- **Mitigação:** 
  - Demonstração ao vivo com dados reais
  - Destacar economia de tempo (5 min vs 30 min)
  - Treinamento personalizado
  - Coleta de feedback e implementação rápida de melhorias

**R2 - Discrepância de dados (dashboard vs realidade)**
- **Probabilidade:** MÉDIA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - Validação rigorosa de queries de agregação
  - Testes automatizados de acurácia
  - Comparação manual com dados do Controle de O.S.
  - Timestamp claro de última atualização

**R3 - Performance de queries (lentidão com grande volume de dados)**
- **Probabilidade:** MÉDIA
- **Impacto:** ALTO
- **Mitigação:** 
  - Índices de banco de dados otimizados
  - Views materializadas para agregações complexas
  - Cache de queries frequentes
  - Lazy loading de gráficos
  - Testes de carga antes do lançamento

**R4 - Complexidade de visualizações (gráficos confusos)**
- **Probabilidade:** BAIXA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Design simples e intuitivo
  - Tooltips explicativos
  - Testes de usabilidade com gestores
  - Guia rápido de uso

**R5 - Dependência de dados de outros módulos**
- **Probabilidade:** BAIXA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - Visão do Gestor é o último módulo a ser desenvolvido (dados já existem)
  - Queries diretas no banco (não depende de APIs)
  - Fallback gracioso em caso de dados incompletos

### Dependências

**D1 - TM Controle de O.S. (fonte primária de dados)**
- Dependência crítica para dados de O.S., técnicos, status, SLA
- Risco: Controle de O.S. não estar completo ou com dados inconsistentes
- Plano B: Dados sintéticos para desenvolvimento, validação posterior

**D2 - TM Studio de Relatórios (dados de relatórios gerados)**
- Necessário para métricas de relatórios gerados e pendentes
- Risco: Studio atrasar ou não ter dados estruturados
- Plano B: Omitir métricas de relatórios no MVP, adicionar posteriormente

**D3 - TM Zap Levantamentos (dados de campo)**
- Necessário para métricas de levantamentos realizados
- Risco: Zap atrasar ou não ter dados estruturados
- Plano B: Omitir métricas de levantamentos no MVP, focar em O.S.

**D4 - Supabase (banco de dados e queries)**
- Dependência crítica para agregações e views
- Risco: Limitações de performance em plano gratuito
- Plano B: Upgrade para plano pago, otimização de queries

**D5 - Biblioteca de gráficos (Recharts, Chart.js)**
- Dependência técnica para visualizações
- Risco: Bugs, limitações de funcionalidades
- Plano B: Biblioteca alternativa (D3.js, ApexCharts)

---

## 11. Anexos

### Links de Referência
- [Recharts Documentation](https://recharts.org)
- [Chart.js Documentation](https://www.chartjs.org)
- [D3.js Documentation](https://d3js.org)
- [Supabase Views](https://supabase.com/docs/guides/database/views)
- [Design System TM](d:\DATABASE\TM\Design System TM – Atualizado com Ocean Breeze.docx)

### Wireframes
- **Dashboard Principal**: A ser criado na Etapa 1
- **Filtros e Exportação**: A ser criado na Etapa 1
- **Relatório Executivo (PDF)**: A ser criado na Etapa 1

### Documentos de Referência
- [MVP - TM Visão do Gestor](d:\DATABASE\MVP_TM_Visao_Gestor.md)
- [Contexto do Projeto MAFFENG](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\CONTEXTO_PROJETO_MAFFENG.md)
- [Roadmap Integrado](d:\DATABASE\ROAD_MAP.md)
- [Personas e Jornada](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\03 - personas-jornada-tm.html)

### Queries de Agregação (Exemplos)
```sql
-- Total de O.S. Ativas
SELECT COUNT(*) FROM ordens_servico 
WHERE status IN ('Pendente', 'Atribuída', 'Em Campo', 'Fotos Recebidas');

-- Taxa de Cumprimento de SLA (últimos 30 dias)
SELECT 
  (COUNT(*) FILTER (WHERE data_conclusao <= prazo) * 100.0 / COUNT(*)) AS taxa_sla
FROM ordens_servico 
WHERE data_conclusao >= NOW() - INTERVAL '30 days';

-- Produtividade por Técnico (última semana)
SELECT 
  tecnico_id, 
  tecnico_nome, 
  COUNT(*) AS os_concluidas
FROM ordens_servico 
WHERE status = 'Concluída' 
  AND data_conclusao >= NOW() - INTERVAL '7 days'
GROUP BY tecnico_id, tecnico_nome
ORDER BY os_concluidas DESC;
```

---

**Versão:** 1.0  
**Data de Criação:** 25/11/2025  
**Autor:** Thiago Nascimento Barbosa  
**Aprovadores:** [Pendente]  
**Status:** 🟡 Aguardando Dados Reais - Em Revisão  
**Próxima Revisão:** 01/12/2025
