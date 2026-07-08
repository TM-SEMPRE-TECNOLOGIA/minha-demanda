# PRD – Product Requirements Document
## TM Studio de Relatórios

---

## 1. Visão Geral do Produto

**TM Studio de Relatórios** é um sistema automatizado de geração de documentos técnicos que transforma pacotes de fotos estruturadas em relatórios profissionais formatados (Word/PDF). O sistema combina processamento de imagens (Python), templates pré-configurados e uma interface web de revisão para produzir documentos prontos para entrega ao cliente em minutos, não horas.

**Objetivo Principal**: Eliminar o trabalho manual repetitivo de criação de relatórios, reduzindo em 80% o tempo de produção (de 3 horas para 36 minutos) e garantindo 100% de consistência visual e conformidade com padrões.

**Valor para o Usuário**: Analistas técnicos economizam horas de trabalho tedioso, coordenadores recebem relatórios mais rápido, e a empresa aumenta significativamente a capacidade de entrega sem contratar mais pessoas.

---

## 2. Problema / Oportunidade

### Problema
Analistas técnicos enfrentam:
- **Trabalho manual massivo**: Inserir 50-200 fotos manualmente no Word, uma por uma, ajustando tamanho e posição
- **Lentidão crítica**: 2-4 horas por relatório, criando gargalo operacional (1 analista produz apenas 2-3 relatórios/dia)
- **Inconsistência visual**: Cada analista formata de um jeito, gerando documentos heterogêneos que prejudicam a imagem da empresa
- **Erros frequentes**: Fotos trocadas, legendas incorretas, formatação quebrada, numeração errada
- **Retrabalho após revisão**: Coordenador identifica erros, analista precisa refazer partes do documento
- **Impossibilidade de escalar**: Contratar mais analistas é caro e não resolve o problema de raiz

### Oportunidade
- Diferencial competitivo: Entregar relatórios em 24h vs 5-7 dias do mercado
- Redução de custos: Mesma equipe produz 4x mais relatórios
- Qualidade superior: Documentos padronizados, profissionais, sem erros
- Preparação para escala: Sistema suporta crescimento sem aumento proporcional de equipe
- Potencial de licenciamento: Vender solução para outras empresas do setor (SaaS)

---

## 3. Público-Alvo

### Persona 1: Amanda - Analista Técnica
- **Idade**: 24-35 anos
- **Cargo**: Analista de Relatórios Técnicos
- **Contexto**: Recebe pacotes de fotos de levantamentos e cria relatórios no Word
- **Dores**: 
  - Gasta 3-4 horas por relatório fazendo trabalho repetitivo
  - Sente que poderia estar fazendo análises mais complexas
  - Estresse com prazos apertados
  - Frustração com retrabalho após revisão
- **Comportamento**: Alta familiaridade com Word, Excel, ferramentas de edição
- **Objetivo**: Produzir relatórios rapidamente sem perder qualidade
- **Motivação**: Ter tempo para atividades mais estratégicas, reduzir estresse

### Persona 2: Juliana - Coordenadora Técnica
- **Idade**: 28-40 anos
- **Cargo**: Coordenadora de Operações
- **Contexto**: Revisa e aprova relatórios antes de enviar ao cliente
- **Dores**: 
  - Recebe relatórios com formatação inconsistente
  - Precisa devolver para correção, atrasando entrega
  - Não consegue prever quando relatório estará pronto
  - Pressão de clientes por agilidade
- **Comportamento**: Usa sistema web, alta familiaridade com tecnologia
- **Objetivo**: Receber relatórios padronizados e prontos para envio no mesmo dia
- **Motivação**: Cumprir SLA com clientes, reduzir retrabalho da equipe

---

## 4. Objetivos do Produto

### Objetivos de Negócio
1. **Reduzir custos operacionais** em 70% (menos horas gastas com produção manual)
2. **Aumentar capacidade de produção** em 300% (mesma equipe produz 4x mais)
3. **Melhorar SLA** de entrega de relatórios de 7 dias para 2 dias
4. **Garantir consistência** de 100% dos relatórios seguindo template padrão
5. **Eliminar erros** de formatação, legendas e organização
6. **Preparar produto para licenciamento** (SaaS) para outras empresas

### Objetivos do Usuário
1. **Economizar tempo**: Reduzir de 3h para 30min o tempo de produção por relatório
2. **Eliminar trabalho tedioso**: Não precisar inserir fotos manualmente
3. **Garantir qualidade**: Relatórios sempre padronizados e profissionais
4. **Reduzir retrabalho**: Taxa de rejeição <5% (vs 30% atual)
5. **Ter previsibilidade**: Saber exatamente quando relatório estará pronto
6. **Focar em análise**: Usar tempo economizado para atividades de maior valor

---

## 5. Escopo Funcional

### 5.1 Funcionalidades Principais

#### F1 - Recepção Automática de Pacotes de Fotos
- Webhook que recebe notificação quando técnico finaliza levantamento no Zap
- Download automático de fotos e metadados do Supabase Storage
- Validação de integridade (verificar se todas as fotos esperadas estão presentes)
- Criação de registro de "Relatório Pendente" no banco de dados
- Notificação ao analista de que novo pacote está disponível

#### F2 - Processamento Automático de Imagens
- Leitura de metadados EXIF (GPS, timestamp, categoria/ambiente)
- Organização de fotos por ambiente/categoria conforme metadados
- Redimensionamento automático para otimizar tamanho do documento (manter qualidade, reduzir peso)
- Compressão inteligente (JPEG quality 85%)
- Geração de legendas automáticas baseadas em metadados:
  - Formato: "Foto 01 - Quadro Elétrico - Térreo - 25/11/2025 14:30"
- Detecção de fotos duplicadas ou corrompidas
- Geração de thumbnail para preview

#### F3 - Geração Automática de Relatório
- Aplicação de template Word pré-definido (.docx)
- Inserção automática de:
  - Cabeçalho com logo e dados da empresa
  - Dados da O.S. (código, cliente, endereço, data)
  - Sumário executivo com estatísticas (total de fotos, ambientes documentados, data do levantamento)
  - Fotos organizadas por seção/ambiente
  - Legendas automáticas
  - Numeração de páginas
  - Rodapé com informações de contato
- Geração de índice/sumário automático
- Exportação para Word (.docx) e PDF

#### F4 - Interface Web de Revisão
- Listagem de relatórios pendentes de revisão
- Visualização de preview do relatório gerado (renderização do Word em HTML ou PDF)
- Possibilidade de editar:
  - Legendas de fotos
  - Observações/notas técnicas
  - Ordem das fotos dentro de uma seção
  - Adicionar/remover fotos
- Regeneração de documento após ajustes (botão "Regenerar")
- Aprovação final (botão "Aprovar e Finalizar")

#### F5 - Entrega e Armazenamento
- Download do relatório final (Word e PDF)
- Armazenamento automático no Supabase Storage vinculado à O.S.
- Notificação ao coordenador de que relatório está pronto
- Atualização automática de status da O.S. no Controle de O.S. para "Relatório Concluído"
- Envio de e-mail automático ao coordenador com link para download

### 5.2 Funcionalidades Secundárias

#### F6 - Gestão de Templates
- Upload de templates Word (.docx) customizados
- Definição de template padrão
- Associação de template a tipo de serviço específico
- Preview de template
- Versionamento de templates

#### F7 - Histórico de Relatórios
- Listagem de todos os relatórios gerados
- Filtro por data, cliente, técnico, status
- Busca por código de O.S.
- Reprocessamento de relatório (se necessário)
- Download de relatórios antigos

#### F8 - Estatísticas e Métricas
- Dashboard com KPIs:
  - Total de relatórios gerados (mês atual)
  - Tempo médio de processamento
  - Taxa de aprovação sem ajustes
  - Taxa de erro de geração
- Gráfico de evolução temporal

#### F9 - Configurações
- Definição de qualidade de compressão de imagens
- Configuração de legendas (formato, informações incluídas)
- Configuração de notificações
- Definição de regras de organização de fotos

### 5.3 Fora de Escopo

- ❌ Análise técnica automatizada com IA (detecção de anomalias, classificação de problemas)
- ❌ Múltiplos templates customizáveis por cliente (apenas 1 template padrão no MVP)
- ❌ Edição visual avançada tipo Canva/Figma (apenas ajustes de texto)
- ❌ Assinatura digital integrada
- ❌ Versionamento de relatórios (histórico de alterações)
- ❌ Colaboração em tempo real (múltiplos usuários editando)
- ❌ Integração com sistemas de clientes (envio automático por e-mail/API)
- ❌ Geração de relatórios em outros formatos (PowerPoint, HTML interativo)
- ❌ OCR para leitura de texto em fotos
- ❌ Comparação automática com levantamentos anteriores
- ❌ Geração de gráficos e análises estatísticas automáticas
- ❌ Tradução automática para outros idiomas

---

## 6. Requisitos Detalhados

### 6.1 Requisitos Funcionais

**RF01** – O sistema deve receber webhook quando levantamento for finalizado no Zap  
**RF02** – O sistema deve fazer download automático de fotos e metadados do Supabase Storage  
**RF03** – O sistema deve validar integridade do pacote (fotos presentes, metadados completos)  
**RF04** – O sistema deve ler metadados EXIF de cada foto (GPS, timestamp, categoria)  
**RF05** – O sistema deve organizar fotos por ambiente/categoria automaticamente  
**RF06** – O sistema deve redimensionar fotos mantendo aspect ratio (max 1920px largura)  
**RF07** – O sistema deve comprimir fotos (JPEG quality 85%) para otimizar tamanho do documento  
**RF08** – O sistema deve gerar legendas automáticas baseadas em metadados  
**RF09** – O sistema deve aplicar template Word pré-definido  
**RF10** – O sistema deve inserir fotos nas seções correspondentes do template  
**RF11** – O sistema deve gerar sumário executivo com estatísticas do levantamento  
**RF12** – O sistema deve exportar relatório para Word (.docx) e PDF  
**RF13** – O sistema deve permitir visualização de preview do relatório gerado  
**RF14** – O sistema deve permitir edição de legendas e observações  
**RF15** – O sistema deve permitir reordenar fotos dentro de uma seção  
**RF16** – O sistema deve permitir regeneração de documento após ajustes  
**RF17** – O sistema deve armazenar relatório final no Supabase Storage  
**RF18** – O sistema deve atualizar status da O.S. no Controle de O.S. para "Relatório Concluído"  
**RF19** – O sistema deve notificar coordenador quando relatório estiver pronto  
**RF20** – O sistema deve permitir download de relatório final (Word e PDF)  

### 6.2 Requisitos Não Funcionais

**RNF01 – Performance**
- Tempo de processamento de pacote (100 fotos): <5 minutos
- Tempo de geração de documento Word: <2 minutos
- Tempo de conversão para PDF: <1 minuto
- Tempo de carregamento de preview: <3 segundos
- Tempo de regeneração após ajustes: <1 minuto

**RNF02 – Segurança**
- Comunicação via HTTPS obrigatório
- Webhook com autenticação (secret token)
- Acesso a relatórios restrito por RLS (Row Level Security)
- Criptografia de documentos em repouso
- Logs de auditoria para todas as operações

**RNF03 – Qualidade**
- Qualidade de imagens no documento: Mínimo 150 DPI
- Tamanho máximo do documento final: 50MB (para 200 fotos)
- Taxa de sucesso de geração: ≥95%
- Precisão de legendas: 100% (baseadas em metadados corretos)

**RNF04 – Usabilidade**
- Interface intuitiva (analista consegue usar após 30min de treinamento)
- Feedback visual de progresso durante processamento
- Mensagens de erro claras e acionáveis
- Preview fiel ao documento final (WYSIWYG)

**RNF05 – Compatibilidade**
- Documentos compatíveis com Word 2016+
- PDFs compatíveis com Adobe Reader 10+
- Interface web compatível com Chrome 90+, Firefox 88+, Safari 14+

**RNF06 – Disponibilidade**
- Uptime: 99% (Supabase SLA)
- Processamento assíncrono (não bloquear interface)
- Retry automático em caso de falha (até 3 tentativas)
- Fila de processamento (suportar múltiplos relatórios simultâneos)

**RNF07 – Escalabilidade**
- Suportar até 50 relatórios em fila simultâneos
- Suportar levantamentos com até 500 fotos
- Processamento paralelo (múltiplos workers)

---

## 7. Fluxo do Usuário / Jornada

### Fluxo Principal: Geração Automática de Relatório

1. **Técnico finaliza levantamento** no app Zap Levantamentos
2. **Sistema Zap envia webhook** para Studio de Relatórios
3. **Studio recebe notificação** e cria registro de "Relatório Pendente"
4. **Sistema inicia processamento** em background:
   - Faz download de 87 fotos do Supabase Storage
   - Lê metadados EXIF de cada foto
   - Organiza fotos por ambiente (Quadro Elétrico: 23, Sala Técnica: 31, Corredor: 33)
   - Redimensiona e comprime fotos
   - Gera legendas automáticas
5. **Sistema aplica template Word** e insere fotos nas seções correspondentes
6. **Sistema gera sumário executivo**: "Levantamento realizado em 25/11/2025, 87 fotos capturadas em 3 ambientes"
7. **Sistema exporta** para Word e PDF
8. **Sistema armazena** documentos no Supabase Storage
9. **Sistema notifica analista Amanda**: "✅ Relatório da O.S. #1234 pronto para revisão"
10. **Amanda acessa interface web** e visualiza preview do relatório
11. **Amanda identifica** que 2 fotos estão com legenda genérica
12. **Amanda edita** legendas: "Quadro Elétrico Principal - Vista Frontal"
13. **Amanda clica** em "Regenerar"
14. **Sistema regenera** documento em 45 segundos
15. **Amanda visualiza** novo preview e aprova
16. **Amanda clica** em "Aprovar e Finalizar"
17. **Sistema atualiza** status da O.S. para "Relatório Concluído"
18. **Sistema notifica coordenadora Juliana**: "📄 Relatório da O.S. #1234 aprovado e disponível para download"
19. **Juliana faz download** do PDF e envia ao cliente

**Tempo total**: 36 minutos (vs 3 horas manual)

### Fluxo Alternativo: Erro de Processamento

1. Sistema tenta processar pacote mas detecta fotos corrompidas
2. Sistema marca relatório como "Erro de Processamento"
3. Sistema notifica analista com detalhes do erro
4. Analista verifica pacote de fotos no Zap Levantamentos
5. Analista solicita reenvio de fotos ao técnico
6. Técnico reenvia fotos
7. Sistema reprocessa automaticamente

---

## 8. Critérios de Sucesso / Métricas

### KPIs Primários

**KPI 1 - Redução de Tempo**
- Meta: Redução de 80% no tempo de produção (baseline: 3h → objetivo: 36min)
- Meta: 90% dos relatórios gerados sem necessidade de ajustes manuais
- Medição: Timestamp de início de processamento vs timestamp de aprovação final

**KPI 2 - Qualidade e Consistência**
- Meta: 100% dos relatórios seguem template padrão
- Meta: Taxa de rejeição por erros <5% (vs 30% atual)
- Medição: Relatórios rejeitados / Total de relatórios gerados

**KPI 3 - Adoção**
- Meta: 100% dos relatórios gerados via automação após 60 dias
- Meta: Zero relatórios criados manualmente no Word
- Medição: Auditoria de processos

**KPI 4 - Performance Técnica**
- Meta: Tempo de processamento <5min para levantamentos com até 100 fotos
- Meta: Taxa de sucesso de geração ≥95% (sem falhas técnicas)
- Medição: Logs de processamento

### KPIs Secundários

**KPI 5 - Produtividade**
- Meta: Aumento de 300% na capacidade de produção (1 analista produz 8-10 relatórios/dia vs 2-3 atual)
- Medição: Relatórios aprovados por analista por dia

**KPI 6 - Satisfação**
- Meta: NPS ≥60 entre analistas técnicos
- Meta: Redução de 70% em reclamações sobre retrabalho
- Medição: Pesquisa in-app mensal

**KPI 7 - Impacto no Negócio**
- Meta: Redução de 50% no tempo de entrega de relatórios ao cliente (7 dias → 3.5 dias)
- Medição: Timestamp de finalização de levantamento vs timestamp de envio ao cliente

### Meta Mínima Aceitável (Go/No-Go)
- ✅ 20 relatórios gerados com sucesso em ambiente de produção
- ✅ 2 analistas usando regularmente por 4 semanas
- ✅ Taxa de sucesso de geração ≥90%
- ✅ Tempo médio de produção ≤1h (vs 3h baseline)
- ✅ NPS ≥ 0 (não negativo)

---

## 📌 9. Plano de Implementação (por etapas)

### Etapa 1 – Planejamento (Semana 1: 01/03 - 08/03/2026)

**Atividades:**
- Revisão final do PRD com stakeholders (analistas, coordenadores)
- Definição de arquitetura técnica (Backend Python, Frontend React, Webhooks)
- Escolha de bibliotecas:
  - `python-docx` para manipulação de Word
  - `Pillow` para processamento de imagens
  - `PyPDF2` ou `reportlab` para geração de PDF
- Criação de template Word padrão (aprovado pela MAFFENG)
- Definição de schema de banco de dados (tabela `relatorios`)
- Estimativas de esforço por funcionalidade
- Preparação do backlog inicial
- Setup de repositório Git e CI/CD

**Entrega:** 
- ✅ Arquitetura técnica documentada
- ✅ Template Word aprovado
- ✅ Backlog priorizado
- ✅ Repositório configurado

---

### Etapa 2 – Desenvolvimento do MVP (Semanas 2-6: 08/03 - 20/04/2026)

#### Sprint 1 (Semana 2: 08/03 - 15/03)
**Foco: Integração e Recepção**
- Setup do projeto Python (FastAPI ou Flask)
- Implementação de webhook para receber notificações do Zap
- Download de fotos do Supabase Storage
- Validação de integridade de pacote
- Armazenamento de registro no banco de dados

#### Sprint 2 (Semana 3: 15/03 - 22/03)
**Foco: Processamento de Imagens**
- Leitura de metadados EXIF
- Organização de fotos por categoria
- Redimensionamento e compressão
- Geração de legendas automáticas
- Detecção de fotos duplicadas/corrompidas

#### Sprint 3 (Semana 4: 22/03 - 29/03)
**Foco: Geração de Documento**
- Implementação de engine de geração Word (`python-docx`)
- Aplicação de template
- Inserção de fotos e legendas
- Geração de sumário executivo
- Exportação para Word (.docx)

#### Sprint 4 (Semana 5: 29/03 - 05/04)
**Foco: Interface de Revisão**
- Tela de listagem de relatórios pendentes
- Visualização de preview (renderização de Word em HTML ou PDF)
- Edição de legendas e observações
- Reordenação de fotos
- Regeneração de documento

#### Sprint 5 (Semana 6: 05/04 - 12/04)
**Foco: Entrega e Integração**
- Geração de PDF
- Armazenamento no Supabase Storage
- Atualização de status no Controle de O.S. (webhook ou API call)
- Notificações (e-mail, in-app)
- Download de relatório final

#### Sprint 6 (Semana 7: 12/04 - 20/04)
**Foco: Polimento e Testes**
- Implementação de funcionalidades secundárias (histórico, estatísticas)
- Otimizações de performance
- Correção de bugs
- Testes de carga (50 relatórios simultâneos)

**Entrega:** 
- ✅ MVP funcional com funcionalidades principais
- ✅ Deploy em ambiente de staging
- ✅ Documentação técnica

---

### Etapa 3 – Testes e Iterações (Semanas 7-8: 20/04 - 04/05/2026)

#### Semana 7 (20/04 - 27/04)
**Testes Internos**
- Testes com 2 analistas (beta fechado)
- Processamento de 10 levantamentos reais
- Coleta de feedback sobre qualidade de relatórios gerados
- Identificação de bugs e melhorias de template
- Testes de performance (100+ fotos, múltiplos relatórios simultâneos)

#### Semana 8 (27/04 - 04/05)
**Correções e Melhorias**
- Ajustes no template Word baseados em feedback
- Correção de bugs críticos
- Otimizações de processamento de imagens
- Melhorias de UX na interface de revisão
- Preparação de documentação de usuário (manual, vídeo tutorial)
- Treinamento de analistas (sessão de 1h)

**Entrega:** 
- ✅ Versão estável para lançamento
- ✅ Template Word otimizado
- ✅ Manual de usuário
- ✅ Analistas treinados

---

### Etapa 4 – Lançamento (Semana 9: 04/05 - 11/05/2026)

**Atividades:**
- Deploy em ambiente de produção
- Configuração de webhook no Zap Levantamentos
- Comunicação oficial aos usuários (e-mail, reunião de kick-off)
- Onboarding assistido (primeiros 3 dias)
- Monitoramento ativo de processamentos
- Coleta de métricas iniciais (tempo de processamento, taxa de sucesso)
- Suporte dedicado via WhatsApp/Slack (primeiros 15 dias)

**Entrega:** 
- ✅ Sistema em produção e integrado
- ✅ 100% dos analistas com acesso e treinados
- ✅ Dashboard de monitoramento configurado
- ✅ Processo manual de relatórios descontinuado

---

### Etapa 5 – Evolução Pós-Lançamento (A partir de 11/05/2026)

**Mês 1 (Mai/2026):**
- Análise de métricas de uso e performance
- Correção de bugs reportados
- Otimizações de template baseadas em feedback
- Implementação de funcionalidades secundárias (gestão de templates, histórico)

**Mês 2 (Jun/2026):**
- Implementação de melhorias solicitadas
- Adição de novos tipos de template (por tipo de serviço)
- Testes de carga para preparação de escala
- Pesquisa de satisfação (NPS)

**Mês 3+ (Jul/2026+):**
- Funcionalidades avançadas (análise com IA, múltiplos templates customizáveis)
- Preparação para multi-tenancy (SaaS)
- Integração com sistemas de clientes (envio automático)

**Entrega:** 
- ✅ Versão 2.0 com funcionalidades expandidas
- ✅ Roadmap atualizado

---

## 10. Riscos e Dependências

### Riscos

**R1 - Qualidade de fotos recebidas (fotos corrompidas, metadados incompletos)**
- **Probabilidade:** MÉDIA
- **Impacto:** ALTO
- **Mitigação:** 
  - Validação rigorosa no Zap Levantamentos (não permitir envio de fotos sem metadados)
  - Detecção de fotos corrompidas com retry automático
  - Notificação clara ao analista em caso de erro
  - Processo de reenvio de fotos simplificado

**R2 - Complexidade de template Word (formatação quebrada)**
- **Probabilidade:** MÉDIA
- **Impacto:** ALTO
- **Mitigação:** 
  - Template simples e robusto (evitar formatação complexa)
  - Testes extensivos com diferentes volumes de fotos
  - Biblioteca `python-docx` bem documentada e estável
  - Plano B: Geração de PDF diretamente (sem passar por Word)

**R3 - Performance de processamento (lentidão com muitas fotos)**
- **Probabilidade:** MÉDIA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Processamento assíncrono (não bloquear interface)
  - Compressão agressiva de imagens
  - Processamento paralelo (múltiplos workers)
  - Limite de 500 fotos por levantamento no MVP

**R4 - Resistência de analistas (preferem controle manual)**
- **Probabilidade:** BAIXA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Demonstrar economia de tempo com dados reais
  - Permitir ajustes manuais (não é 100% automático)
  - Treinamento presencial
  - Coleta de feedback e implementação de melhorias

**R5 - Dependência de integração com Zap e Controle de O.S.**
- **Probabilidade:** MÉDIA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Studio funciona standalone (pode receber fotos manualmente no MVP)
  - Webhooks desacoplados (não bloqueiam funcionalidade principal)
  - Mocks de API para desenvolvimento paralelo

### Dependências

**D1 - TM Zap Levantamentos (fonte de fotos)**
- Dependência crítica para receber pacotes de fotos estruturados
- Risco: Zap atrasar ou não enviar metadados completos
- Plano B: Upload manual de fotos via interface web (temporário)

**D2 - TM Controle de O.S. (atualização de status)**
- Necessário para atualizar status de O.S. automaticamente
- Risco: Controle de O.S. não ter webhook/API pronta
- Plano B: Atualização manual de status (temporário)

**D3 - Supabase Storage (armazenamento de fotos e documentos)**
- Dependência crítica para download de fotos e armazenamento de relatórios
- Risco: Downtime, limitações de plano gratuito
- Plano B: Armazenamento local temporário + migração para S3

**D4 - Template Word aprovado**
- Necessário para geração de relatórios
- Risco: Atraso na aprovação, mudanças frequentes
- Plano B: Template genérico para desenvolvimento, customização posterior

**D5 - Bibliotecas Python (python-docx, Pillow)**
- Dependência técnica para processamento
- Risco: Bugs, limitações de funcionalidades
- Plano B: Bibliotecas alternativas (docxtpl, reportlab)

---

## 11. Anexos

### Links de Referência
- [python-docx Documentation](https://python-docx.readthedocs.io)
- [Pillow Documentation](https://pillow.readthedocs.io)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Design System TM](d:\DATABASE\TM\Design System TM – Atualizado com Ocean Breeze.docx)

### Template Word
- **Template Padrão**: A ser criado na Etapa 1
- **Seções**: Capa, Sumário Executivo, Fotos por Ambiente, Conclusão
- **Elementos**: Logo MAFFENG, cabeçalho, rodapé, numeração

### Documentos de Referência
- [MVP - TM Studio de Relatórios](d:\DATABASE\MVP_TM_Studio_Relatorios.md)
- [Contexto do Projeto MAFFENG](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\CONTEXTO_PROJETO_MAFFENG.md)
- [Roadmap Integrado](d:\DATABASE\ROAD_MAP.md)

### Diagramas Técnicos
- **Arquitetura de Sistema**: A ser criado na Etapa 1
- **Fluxo de Processamento**: A ser criado na Etapa 1
- **Diagrama de Sequência (Webhook)**: A ser criado na Etapa 1

---

**Versão:** 1.0  
**Data de Criação:** 25/11/2025  
**Autor:** Thiago Nascimento Barbosa  
**Aprovadores:** [Pendente]  
**Status:** 🟡 Aguardando Controle de O.S. - Em Revisão  
**Próxima Revisão:** 01/12/2025
