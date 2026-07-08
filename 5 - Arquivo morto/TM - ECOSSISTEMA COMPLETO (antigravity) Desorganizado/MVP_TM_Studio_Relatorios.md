# MVP - TM Studio de Relatórios

## 1. Objetivo do MVP

Validar se a automação completa da geração de relatórios técnicos a partir de fotos estruturadas reduz em pelo menos 80% o tempo de produção de documentos, eliminando trabalho manual repetitivo. A hipótese principal é que um sistema baseado em templates + dados estruturados + processamento automático pode gerar relatórios profissionais em minutos, não horas.

## 2. Público-Alvo Inicial

### Perfil 1
- **Analistas técnicos** responsáveis por criar relatórios de levantamento fotográfico
- Atualmente gastam 2-4 horas por relatório fazendo trabalho manual no Word
- Necessitam de documentos padronizados e profissionais

### Perfil 2
- **Coordenadores técnicos** que revisam e aprovam relatórios antes de enviar ao cliente
- Precisam de agilidade sem perder qualidade
- Valorizam consistência visual e conformidade com normas

### Critérios de Exclusão
- Relatórios que não seguem estrutura padronizada
- Documentos que exigem análise técnica complexa não automatizável

## 3. Problema a Ser Resolvido

Analistas técnicos enfrentam:
- **Trabalho manual repetitivo**: Inserir centenas de fotos manualmente no Word, uma por uma
- **Inconsistência**: Cada analista formata de um jeito, gerando documentos heterogêneos
- **Lentidão**: 2-4 horas por relatório, criando gargalo operacional
- **Erros**: Fotos trocadas, legendas incorretas, formatação quebrada
- **Retrabalho**: Necessidade de ajustes após revisão do coordenador

## 4. Solução Proposta (Visão Geral)

Um sistema automatizado (Python + Web Interface) que:
- Recebe pacotes de fotos estruturados do Zap Levantamentos
- Aplica templates profissionais pré-configurados (Word/PDF)
- Gera automaticamente relatórios completos com fotos, legendas, metadados e análises básicas
- Permite revisão e ajustes mínimos antes da finalização
- Entrega documento final em formato Word/PDF pronto para envio ao cliente

## 5. Funcionalidades Essenciais (Escopo do MVP)

### Funcionalidade 1: Recepção de Pacotes de Fotos
- Webhook que recebe notificação quando técnico finaliza levantamento
- Download automático de fotos e metadados do Supabase Storage
- Validação de integridade (todas as fotos esperadas presentes)

### Funcionalidade 2: Processamento Automático
- Leitura de metadados EXIF (GPS, timestamp, categoria)
- Organização de fotos por ambiente/categoria
- Redimensionamento automático para otimizar tamanho do documento
- Geração de legendas automáticas baseadas em metadados

### Funcionalidade 3: Geração de Relatório
- Aplicação de template Word pré-definido (cabeçalho, rodapé, estilos)
- Inserção automática de fotos nas seções correspondentes
- Geração de sumário executivo com estatísticas (total de fotos, ambientes, data)
- Exportação para Word (.docx) e PDF

### Funcionalidade 4: Interface de Revisão (Web)
- Visualização de preview do relatório gerado
- Possibilidade de editar legendas e observações
- Reordenar fotos dentro de uma seção
- Regenerar documento após ajustes

### Funcionalidade 5: Entrega e Armazenamento
- Download do relatório final
- Armazenamento automático no Supabase Storage vinculado à O.S.
- Notificação ao coordenador de que relatório está pronto
- Atualização automática de status da O.S. no Controle de O.S.

## 6. Funcionalidades Fora do Escopo (Neste MVP)

- Análise técnica automatizada com IA (detecção de anomalias, classificação de problemas)
- Múltiplos templates customizáveis por cliente
- Edição visual avançada (tipo Canva/Figma)
- Assinatura digital integrada
- Versionamento de relatórios
- Colaboração em tempo real (múltiplos usuários editando)
- Integração com sistemas de clientes (envio automático por e-mail/API)
- Geração de relatórios em outros formatos (PowerPoint, HTML)
- OCR para leitura de texto em fotos
- Comparação automática com levantamentos anteriores

## 7. Jornada Simplificada do Usuário

1. **O sistema recebe notificação** de que técnico finalizou levantamento no Zap
2. **Processa automaticamente** as fotos e metadados em background
3. **Gera relatório** aplicando template padrão
4. **Notifica o analista** de que relatório está pronto para revisão
5. **Analista acessa interface web**, visualiza preview e faz ajustes mínimos (se necessário)
6. **Regenera documento** com alterações
7. **Baixa relatório final** em Word/PDF
8. **Sistema atualiza status** da O.S. para "Relatório Concluído"

## 8. Critérios de Sucesso (Métricas do MVP)

### Métrica 1: Redução de Tempo
- **Meta**: Redução de 80% no tempo de produção (baseline: 3h → objetivo: 36min)
- **Meta**: 90% dos relatórios gerados sem necessidade de ajustes manuais

### Métrica 2: Qualidade e Consistência
- **Meta**: 100% dos relatórios seguem template padrão
- **Meta**: Taxa de rejeição por erros <5%

### Métrica 3: Adoção
- **Meta**: 100% dos relatórios gerados via automação após 60 dias
- **Meta**: Zero relatórios criados manualmente no Word

### Métrica 4: Performance Técnica
- **Meta**: Tempo de processamento <5min para levantamentos com até 100 fotos
- **Meta**: Taxa de sucesso de geração ≥95% (sem falhas técnicas)

### Métrica 5: Satisfação
- **Meta**: NPS ≥60 entre analistas técnicos
- **Meta**: Redução de 70% em reclamações sobre retrabalho

### Meta Mínima Aceitável
- 20 relatórios gerados com sucesso em ambiente de produção
- 2 analistas usando regularmente por 4 semanas

## 9. Premissas e Restrições

### Premissas
- Fotos já vêm estruturadas e categorizadas do Zap Levantamentos
- Existe um template Word padrão aprovado pela MAFFENG
- Analistas têm acesso à interface web para revisão
- Relatórios seguem estrutura previsível (não há variações radicais por projeto)
- Servidor/ambiente tem capacidade de processar imagens (CPU/RAM suficientes)

### Restrições
- **Técnicas**: Backend Python (python-docx, Pillow), Frontend React, Webhooks Supabase
- **Orçamento**: Desenvolvimento solo
- **Tempo**: 6-8 semanas para MVP funcional
- **Infraestrutura**: Processamento pode ser lento em plano gratuito (considerar serverless functions)
- **Segurança**: Relatórios contêm dados sensíveis de clientes (criptografia obrigatória)
- **Performance**: Limite de 200 fotos por relatório no MVP

## 10. Prazo Estimado de Entrega

### Início
**01/03/2026** (Q1 2026)

### Fim
**20/04/2026** (7 semanas)

### Marcos Importantes

| Data | Marco | Entregável |
|------|-------|------------|
| 08/03/2026 | M1 - Integração | Webhook recebendo pacotes do Zap funcionando |
| 15/03/2026 | M2 - Processamento | Engine de processamento de fotos e metadados completo |
| 29/03/2026 | M3 - Geração | Geração de Word/PDF com template básico funcionando |
| 05/04/2026 | M4 - Interface | Tela de revisão e ajustes implementada |
| 12/04/2026 | M5 - Integração Final | Atualização automática de status no Controle de O.S. |
| 17/04/2026 | M6 - Beta | Testes com 2 analistas e 10 relatórios reais |
| 20/04/2026 | M7 - Release | Lançamento para produção |

---

**Versão**: 1.0  
**Data de Criação**: 25/11/2025  
**Responsável**: Thiago Nascimento Barbosa  
**Status**: 🟡 Aguardando Controle de O.S.  
**Dependências**: 
- TM Zap Levantamentos (fonte de fotos)
- TM Controle de O.S. (atualização de status)
