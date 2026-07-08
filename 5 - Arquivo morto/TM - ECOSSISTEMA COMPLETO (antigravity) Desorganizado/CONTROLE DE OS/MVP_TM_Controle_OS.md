# MVP - TM Controle de O.S.

## 1. Objetivo do MVP

Validar se gestores e coordenadores estão dispostos a usar uma plataforma web centralizada que organiza, rastreia e gerencia o ciclo de vida completo de ordens de serviço técnicas, reduzindo em pelo menos 60% o tempo gasto com controles manuais em planilhas. A hipótese principal é que a automação do fluxo (importação → atribuição → acompanhamento → fechamento) aumenta significativamente a produtividade operacional.

## 2. Público-Alvo Inicial

### Perfil 1
- **Coordenadores técnicos** responsáveis por distribuir e acompanhar O.S. para equipes de campo
- Gerenciam de 20 a 100 O.S. simultaneamente
- Atualmente usam planilhas Excel e comunicação via WhatsApp

### Perfil 2
- **Gestores operacionais** que precisam de visibilidade sobre SLA, produtividade e gargalos
- Tomam decisões baseadas em KPIs de performance
- Necessitam de relatórios executivos rápidos

### Critérios de Exclusão
- Empresas que não trabalham com modelo de ordens de serviço estruturadas
- Operações com menos de 10 O.S./mês (não justifica automação)

## 3. Problema a Ser Resolvido

Coordenadores e gestores enfrentam:
- **Falta de visibilidade**: Não sabem em tempo real o status de cada O.S.
- **Controle manual caótico**: Planilhas desatualizadas, duplicadas e com erros
- **Perda de SLA**: Dificuldade em identificar O.S. atrasadas ou próximas do vencimento
- **Retrabalho**: Necessidade de consolidar informações de múltiplas fontes (WhatsApp, e-mail, planilhas)
- **Falta de histórico**: Impossibilidade de rastrear quem fez o quê e quando

## 4. Solução Proposta (Visão Geral)

Uma plataforma web responsiva que permite:
- Importar O.S. em lote via Excel ou API
- Visualizar todas as O.S. em um dashboard centralizado com filtros avançados
- Atribuir O.S. a técnicos específicos com notificações automáticas
- Acompanhar status em tempo real (Pendente → Em Campo → Concluída)
- Receber alertas de SLA e gerar relatórios gerenciais
- Integrar com o app mobile (Zap Levantamentos) e o Studio de Relatórios

## 5. Funcionalidades Essenciais (Escopo do MVP)

### Funcionalidade 1: Importação de O.S. em Lote
- Upload de arquivo Excel com template padronizado
- Validação automática de campos obrigatórios
- Preview antes de confirmar importação
- Feedback de erros linha a linha

### Funcionalidade 2: Dashboard de O.S.
- Listagem de todas as O.S. com paginação
- Filtros por status, técnico, cliente, data, prioridade
- Busca por código de O.S. ou endereço
- Indicadores visuais de SLA (verde/amarelo/vermelho)

### Funcionalidade 3: Gestão Individual de O.S.
- Visualização detalhada de uma O.S. (dados, histórico, anexos)
- Atribuição/reatribuição de técnico responsável
- Alteração manual de status
- Adição de observações e notas internas

### Funcionalidade 4: Sistema de Notificações
- Alertas de O.S. próximas do vencimento (48h antes)
- Notificação quando técnico envia pacote de fotos
- Alertas de O.S. atrasadas (SLA estourado)

### Funcionalidade 5: Relatórios Básicos
- Exportação de lista de O.S. filtradas para Excel
- Dashboard com KPIs principais (total, concluídas, atrasadas, em andamento)
- Gráfico de produtividade por técnico (O.S. concluídas/semana)

### Funcionalidade 6: Autenticação e Controle de Acesso
- Login com e-mail/senha
- Perfis de usuário (Admin, Coordenador, Visualizador)
- Logout e recuperação de senha

## 6. Funcionalidades Fora do Escopo (Neste MVP)

- Criação manual de O.S. uma a uma (apenas importação em lote)
- Integração com sistemas ERP externos
- Geração de relatórios técnicos finais (isso é função do Studio)
- Chat integrado ou sistema de mensagens
- Gestão financeira (faturamento, custos)
- Agendamento automático de O.S.
- Mapa geográfico de O.S.
- Assinatura digital de clientes
- Histórico completo de alterações (audit log detalhado)
- Customização de campos por cliente

## 7. Jornada Simplificada do Usuário

1. **O usuário faz login** na plataforma web
2. **Importa um lote de O.S.** fazendo upload de um arquivo Excel
3. **Visualiza o dashboard** com todas as O.S. importadas e seus status
4. **Filtra O.S. pendentes** e atribui cada uma a um técnico específico
5. **Acompanha em tempo real** conforme técnicos atualizam status via mobile
6. **Recebe alertas** de O.S. próximas do vencimento
7. **Gera relatório semanal** de produtividade e exporta para Excel
8. **Revisa O.S. concluídas** e encaminha para geração de relatório final

## 8. Critérios de Sucesso (Métricas do MVP)

### Métrica 1: Adoção e Uso Regular
- **Meta**: 100% dos coordenadores migram de planilhas para a plataforma em 30 dias
- **Meta**: Pelo menos 80% das O.S. são gerenciadas exclusivamente pela plataforma

### Métrica 2: Redução de Tempo Operacional
- **Meta**: Redução de 60% no tempo gasto com controle manual (baseline: 10h/semana → objetivo: 4h/semana)

### Métrica 3: Melhoria de SLA
- **Meta**: Redução de 30% no número de O.S. atrasadas no primeiro trimestre

### Métrica 4: Qualidade dos Dados
- **Meta**: 95% das O.S. importadas sem erros de validação
- **Meta**: 100% das O.S. possuem técnico atribuído em até 24h

### Métrica 5: Satisfação do Usuário
- **Meta**: NPS ≥ 50 após 60 dias de uso
- **Meta**: Taxa de retenção mensal ≥ 90%

### Meta Mínima Aceitável
- 3 coordenadores usando ativamente por 8 semanas consecutivas
- Pelo menos 200 O.S. gerenciadas com sucesso no período

## 9. Premissas e Restrições

### Premissas
- Coordenadores têm acesso a computador/tablet com navegador moderno
- O.S. podem ser padronizadas em um template Excel único
- Técnicos já usam (ou usarão) o app mobile Zap Levantamentos
- Existe processo definido de SLA por tipo de serviço
- Internet estável disponível no escritório/central de operações

### Restrições
- **Técnicas**: Frontend React/Vite, Backend Supabase (PostgreSQL + Auth + Storage)
- **Orçamento**: Desenvolvimento solo com suporte de IA
- **Tempo**: 8-10 semanas para MVP funcional
- **Infraestrutura**: Limite de 5GB de storage no plano gratuito Supabase (upgrade necessário em produção)
- **Segurança**: RLS (Row Level Security) obrigatório, dados sensíveis de clientes devem ser protegidos
- **Performance**: Suportar até 1000 O.S. simultâneas sem degradação (<3s de carregamento)

## 10. Prazo Estimado de Entrega

### Início
**15/01/2026** (Q1 2026)

### Fim
**25/03/2026** (10 semanas)

### Marcos Importantes

| Data | Marco | Entregável |
|------|-------|------------|
| 22/01/2026 | M1 - Infraestrutura | Supabase configurado, schema de banco implementado, autenticação funcionando |
| 05/02/2026 | M2 - Importação | Funcionalidade de upload e validação de Excel completa |
| 19/02/2026 | M3 - Dashboard | Interface de listagem, filtros e busca implementados |
| 05/03/2026 | M4 - Gestão | Atribuição, alteração de status e notificações funcionando |
| 12/03/2026 | M5 - Relatórios | Exportação e KPIs básicos implementados |
| 19/03/2026 | M6 - Beta Interno | Testes com 2 coordenadores e dados reais |
| 25/03/2026 | M7 - Release MVP | Lançamento para operação completa (3-5 coordenadores) |

---

**Versão**: 1.0  
**Data de Criação**: 25/11/2025  
**Responsável**: Thiago Nascimento Barbosa  
**Status**: 🔴 Prioridade Crítica  
**Dependências**: Nenhuma (módulo central do ecossistema)
