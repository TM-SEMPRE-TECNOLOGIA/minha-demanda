# PRD – Product Requirements Document
## TM Zap Levantamentos

---

## 1. Visão Geral do Produto

**TM Zap Levantamentos** é um aplicativo mobile nativo (Android/iOS) desenvolvido para técnicos de campo que realizam levantamentos fotográficos em instalações técnicas (elétricas, hidráulicas, prediais). O produto permite captura estruturada de fotos com categorização automática por ambiente, sincronização em nuvem e integração direta com o sistema central de gestão de O.S.

**Objetivo Principal**: Eliminar o retrabalho de organização manual de fotos pós-levantamento, reduzindo em 50% o tempo entre captura e disponibilização para geração de relatórios.

**Valor para o Usuário**: Técnicos economizam horas de trabalho administrativo, coordenadores recebem dados estruturados imediatamente, e a empresa acelera a entrega de relatórios aos clientes.

---

## 2. Problema / Oportunidade

### Problema
Técnicos de campo capturam centenas de fotos durante levantamentos, mas enfrentam:
- **Desorganização crônica**: Fotos misturadas na galeria do celular sem contexto ou nomenclatura padronizada
- **Retrabalho massivo**: 2-3 horas gastas após cada levantamento renomeando e organizando fotos manualmente
- **Perda de metadados críticos**: Falta de vinculação entre fotos e informações como localização GPS, timestamp preciso, ambiente específico
- **Atraso na cadeia de valor**: Tempo excessivo entre captura e disponibilização para geração de relatórios (média de 2 dias)
- **Erros humanos**: Fotos perdidas, duplicadas ou categorizadas incorretamente

### Oportunidade
- Mercado de serviços técnicos em crescimento (manutenção predial, inspeções, laudos)
- Concorrentes ainda dependem de processos manuais
- Diferencial competitivo: entrega de relatórios em 24h vs 5-7 dias do mercado
- Base instalada: 15 técnicos MAFFENG + potencial de licenciamento para outras empresas

---

## 3. Público-Alvo

### Persona 1: Carlos - Técnico de Campo Experiente
- **Idade**: 35-50 anos
- **Cargo**: Técnico Eletricista/Hidráulico
- **Contexto**: Realiza 5-8 levantamentos por semana, cada um com 50-150 fotos
- **Dores**: Perde tempo organizando fotos à noite, já cansado após trabalho de campo
- **Comportamento**: Usa smartphone básico, familiaridade média com apps
- **Objetivo**: Terminar o trabalho de campo e "esquecer" - sem tarefas administrativas posteriores
- **Motivação**: Mais tempo livre, menos estresse com organização

### Persona 2: Juliana - Coordenadora Técnica
- **Idade**: 28-40 anos
- **Cargo**: Coordenadora de Operações
- **Contexto**: Gerencia 10 técnicos, precisa validar pacotes de fotos antes de enviar para relatórios
- **Dores**: Recebe fotos desorganizadas, precisa cobrar técnicos, atrasos em cascata
- **Comportamento**: Usa sistema web, alta familiaridade com tecnologia
- **Objetivo**: Receber pacotes de fotos estruturados e completos no mesmo dia do levantamento
- **Motivação**: Cumprir SLA com clientes, reduzir retrabalho da equipe

---

## 4. Objetivos do Produto

### Objetivos de Negócio
1. **Reduzir custos operacionais** em 40% (menos horas gastas com organização manual)
2. **Aumentar capacidade de entrega** em 30% (mesma equipe processa mais O.S.)
3. **Melhorar SLA** de entrega de relatórios de 7 dias para 2 dias
4. **Criar diferencial competitivo** para captação de novos clientes
5. **Preparar produto para licenciamento** (SaaS) para outras empresas do setor

### Objetivos do Usuário
1. **Economizar tempo**: Reduzir de 3h para 30min o tempo de pós-processamento
2. **Eliminar estresse**: Não precisar se preocupar com organização após trabalho de campo
3. **Aumentar qualidade**: Garantir que todas as fotos tenham metadados completos
4. **Trabalhar offline**: Capturar fotos sem depender de conexão, sincronizar depois
5. **Ter visibilidade**: Saber exatamente quantas fotos foram capturadas por ambiente

---

## 5. Escopo Funcional

### 5.1 Funcionalidades Principais

#### F1 - Autenticação e Perfil
- Login com e-mail/senha (integrado com Supabase Auth)
- Manter sessão ativa (remember me)
- Logout manual
- Visualização de perfil básico (nome, foto, empresa)

#### F2 - Criação de Pacote de Levantamento
- Criar novo levantamento vinculado a código de O.S.
- Escanear QR Code da O.S. (alternativa ao input manual)
- Definir nome/descrição do levantamento
- Definir data/hora de início
- Modo offline-first (funciona sem internet)

#### F3 - Captura Estruturada de Fotos
- Câmera nativa integrada com preview em tempo real
- Seleção de ambiente/categoria antes de cada foto (dropdown ou botões rápidos)
- Captura automática de metadados EXIF (GPS, timestamp, modelo do dispositivo)
- Contador visual de fotos por categoria
- Possibilidade de adicionar nota de voz ou texto curto por foto
- Visualização de thumbnail da última foto capturada

#### F4 - Gestão Local de Fotos
- Galeria das fotos capturadas no levantamento atual
- Visualização em grid e detalhada
- Exclusão de fotos antes do upload
- Visualização de metadados (categoria, hora, GPS)
- Indicador de status (pendente upload, sincronizada, erro)

#### F5 - Sincronização Automática
- Upload automático em background quando conectado (WiFi ou 4G)
- Fila de upload com priorização
- Retry automático em caso de falha (até 3 tentativas)
- Indicador de progresso (X de Y fotos enviadas)
- Notificação push de conclusão
- Compressão inteligente de fotos (manter qualidade, reduzir tamanho)

### 5.2 Funcionalidades Secundárias

#### F6 - Histórico de Levantamentos
- Lista dos últimos 10 levantamentos realizados
- Status de cada um (em andamento, sincronizado, erro)
- Possibilidade de reenviar levantamento com erro

#### F7 - Configurações do App
- Definir qualidade de foto (alta, média, econômica)
- Ativar/desativar GPS
- Ativar/desativar sincronização automática
- Definir uso de dados móveis (apenas WiFi ou permitir 4G)
- Limpar cache local

#### F8 - Notificações
- Alerta de nova O.S. atribuída ao técnico
- Confirmação de upload concluído
- Alerta de erro de sincronização
- Lembrete de levantamento pendente (se não finalizado em 24h)

### 5.3 Fora de Escopo

- ❌ Edição de fotos (crop, filtros, rotação, anotações visuais)
- ❌ Geração de relatórios no próprio app
- ❌ Chat ou comunicação com coordenadores
- ❌ Histórico completo de todos os levantamentos (apenas últimos 10)
- ❌ Assinatura digital ou aprovação de levantamentos
- ❌ Integração com GPS externo ou equipamentos de medição
- ❌ Suporte a vídeos ou gravação de áudio standalone
- ❌ Modo colaborativo (múltiplos técnicos no mesmo levantamento)
- ❌ Exportação de fotos para galeria do celular
- ❌ Backup local em cartão SD

---

## 6. Requisitos Detalhados

### 6.1 Requisitos Funcionais

**RF01** – O sistema deve permitir login com e-mail e senha, validando credenciais via Supabase Auth  
**RF02** – O sistema deve permitir criação de levantamento vinculado a código de O.S. existente  
**RF03** – O sistema deve permitir escanear QR Code para vincular O.S. automaticamente  
**RF04** – O sistema deve capturar fotos com câmera nativa e salvar localmente em formato JPEG  
**RF05** – O sistema deve permitir seleção de categoria/ambiente antes de cada captura  
**RF06** – O sistema deve capturar automaticamente metadados EXIF (GPS, timestamp, modelo)  
**RF07** – O sistema deve exibir contador de fotos por categoria em tempo real  
**RF08** – O sistema deve permitir visualização de galeria local das fotos capturadas  
**RF09** – O sistema deve permitir exclusão de fotos antes do upload  
**RF10** – O sistema deve sincronizar fotos automaticamente quando houver conexão  
**RF11** – O sistema deve comprimir fotos mantendo qualidade aceitável (redução de 40-60%)  
**RF12** – O sistema deve fazer retry automático em caso de falha de upload (até 3x)  
**RF13** – O sistema deve exibir notificação push quando upload for concluído  
**RF14** – O sistema deve funcionar completamente offline (exceto sincronização)  
**RF15** – O sistema deve armazenar até 500 fotos localmente antes de exigir sincronização  

### 6.2 Requisitos Não Funcionais

**RNF01 – Performance**
- Tempo de abertura da câmera: <1 segundo
- Tempo de salvamento de foto: <500ms
- Tempo de carregamento da galeria (100 fotos): <2 segundos
- Upload de foto (2MB): <5 segundos em 4G

**RNF02 – Segurança**
- Comunicação via HTTPS obrigatório
- Token JWT com expiração de 7 dias
- Fotos criptografadas durante upload (TLS 1.3)
- Armazenamento local criptografado (AES-256)
- Logout automático após 30 dias de inatividade

**RNF03 – Usabilidade**
- Interface intuitiva (técnico consegue usar sem treinamento formal)
- Máximo de 3 toques para capturar foto categorizada
- Feedback visual imediato para todas as ações
- Suporte a modo escuro (economia de bateria)
- Textos em português brasileiro

**RNF04 – Compatibilidade**
- Android 8.0+ (API level 26)
- iOS 13.0+
- Suporte a resoluções de 4" a 7" (smartphones)
- Funcionar em dispositivos com 2GB+ RAM

**RNF05 – Disponibilidade**
- Funcionalidade offline: 100% (exceto sincronização)
- Uptime do backend: 99% (Supabase SLA)
- Recuperação automática de falhas de rede

**RNF06 – Escalabilidade**
- Suportar até 50 técnicos simultâneos
- Suportar levantamentos com até 500 fotos
- Banco de dados: até 100.000 fotos armazenadas

---

## 7. Fluxo do Usuário / Jornada

### Fluxo Principal: Realizar Levantamento Completo

1. **O usuário abre o app** e faz login (primeira vez) ou é autenticado automaticamente
2. **O usuário toca em "Novo Levantamento"**
3. **O sistema solicita código da O.S.** (input manual ou QR Code)
4. **O usuário escaneia QR Code** da ordem de serviço
5. **O sistema valida O.S.** e exibe dados básicos (cliente, endereço, tipo de serviço)
6. **O usuário confirma** e o levantamento é criado localmente
7. **O usuário seleciona categoria** "Quadro Elétrico - Térreo"
8. **O usuário toca em "Capturar Foto"**
9. **O sistema abre câmera nativa** com overlay mostrando categoria selecionada
10. **O usuário captura foto**
11. **O sistema salva foto** localmente com metadados e exibe thumbnail
12. **O usuário repete passos 7-11** para diferentes categorias/ambientes
13. **O usuário visualiza galeria** e exclui 2 fotos duplicadas
14. **O usuário toca em "Finalizar Levantamento"**
15. **O sistema confirma** e inicia sincronização automática em background
16. **O sistema exibe notificação** "Sincronizando 47 fotos..."
17. **O sistema conclui upload** e exibe notificação "Levantamento enviado com sucesso!"
18. **O sistema atualiza status** da O.S. no backend para "Fotos Recebidas"

### Fluxo Alternativo: Trabalho Offline

1. Usuário realiza levantamento sem conexão (passos 1-14 do fluxo principal)
2. Sistema armazena fotos localmente e marca como "Pendente Sincronização"
3. Usuário conecta-se a WiFi posteriormente
4. Sistema detecta conexão e inicia upload automático
5. Sistema notifica conclusão

---

## 8. Critérios de Sucesso / Métricas

### KPIs Primários

**KPI 1 - Taxa de Adoção**
- Meta: 80% dos técnicos completam pelo menos 3 levantamentos no primeiro mês
- Medição: Analytics do app (eventos de "levantamento_finalizado")

**KPI 2 - Redução de Tempo**
- Meta: Redução de 50% no tempo entre captura e disponibilização (baseline: 2h → objetivo: 1h)
- Medição: Timestamp de finalização do levantamento vs timestamp de disponibilização no sistema

**KPI 3 - Qualidade dos Dados**
- Meta: 95% das fotos contêm metadados completos (categoria, GPS, timestamp)
- Medição: Query no banco de dados validando campos obrigatórios

### KPIs Secundários

**KPI 4 - Satisfação do Usuário**
- Meta: NPS ≥ 40 após 30 dias de uso
- Medição: Pesquisa in-app (modal após 10 levantamentos)

**KPI 5 - Retenção**
- Meta: Taxa de retenção semanal ≥ 70%
- Medição: Usuários ativos semana N / Usuários ativos semana N-1

**KPI 6 - Performance Técnica**
- Meta: Taxa de sucesso de upload ≥ 98%
- Medição: Uploads bem-sucedidos / Total de tentativas

### Meta Mínima Aceitável (Go/No-Go)
- ✅ 5 técnicos ativos usando o app regularmente por 4 semanas consecutivas
- ✅ Pelo menos 20 levantamentos completos enviados com sucesso
- ✅ Taxa de erro de upload <5%
- ✅ NPS ≥ 0 (não negativo)

---

## 📌 9. Plano de Implementação (por etapas)

### Etapa 1 – Planejamento (Semana 1: 01/01 - 08/01/2026)
**Atividades:**
- Definição final do escopo e priorização de funcionalidades
- Escolha de stack técnico (React Native vs Flutter)
- Identificação de dependências (Supabase Storage, Auth, Database)
- Criação de wireframes de alta fidelidade (Figma)
- Estimativas de esforço por funcionalidade
- Preparação do backlog inicial no formato User Stories
- Setup de repositório Git e CI/CD básico

**Entrega:** 
- ✅ Documento de Arquitetura Técnica
- ✅ Wireframes aprovados
- ✅ Backlog priorizado (Sprint 1 definida)

---

### Etapa 2 – Desenvolvimento do MVP (Semanas 2-5: 08/01 - 05/02/2026)

#### Sprint 1 (Semana 2: 08/01 - 15/01)
- Setup do projeto (React Native + Expo ou Flutter)
- Implementação de autenticação (Supabase Auth)
- Tela de login e splash screen
- Navegação básica (bottom tabs)

#### Sprint 2 (Semana 3: 15/01 - 22/01)
- Implementação de criação de levantamento
- Integração com câmera nativa
- Captura de fotos com metadados EXIF
- Armazenamento local (SQLite ou AsyncStorage)

#### Sprint 3 (Semana 4: 22/01 - 29/01)
- Implementação de categorização de fotos
- Galeria local com visualização
- Exclusão de fotos
- Contador de fotos por categoria

#### Sprint 4 (Semana 5: 29/01 - 05/02)
- Implementação de sincronização (Supabase Storage)
- Upload em background
- Retry automático
- Notificações push (Firebase Cloud Messaging)

**Entrega:** 
- ✅ MVP funcional com funcionalidades principais
- ✅ Build de desenvolvimento (APK/IPA para testes internos)

---

### Etapa 3 – Testes e Iterações (Semanas 6-7: 05/02 - 19/02/2026)

#### Semana 6 (05/02 - 12/02)
- Testes internos com 3 técnicos (beta fechado)
- Coleta de feedback via formulário e sessões de observação
- Identificação de bugs críticos
- Correções de alta prioridade

#### Semana 7 (12/02 - 19/02)
- Implementação de melhorias baseadas em feedback
- Testes de performance (upload de 100+ fotos)
- Testes de compatibilidade (diferentes modelos de smartphone)
- Ajustes de UX (textos, ícones, fluxos)
- Preparação de documentação de usuário (tutorial in-app)

**Entrega:** 
- ✅ Versão estável para lançamento público
- ✅ Relatório de testes com bugs resolvidos
- ✅ Tutorial in-app implementado

---

### Etapa 4 – Lançamento (Semana 8: 19/02 - 26/02/2026)

**Atividades:**
- Publicação na Google Play Store (Android)
- Publicação na Apple App Store (iOS) - se aplicável
- Comunicação aos técnicos (e-mail, reunião de onboarding)
- Treinamento presencial (2h) com demonstração prática
- Monitoramento ativo via Firebase Analytics e Crashlytics
- Coleta de métricas iniciais (downloads, levantamentos criados)
- Suporte dedicado via WhatsApp (primeiros 15 dias)

**Entrega:** 
- ✅ App publicado nas lojas
- ✅ 100% dos técnicos com app instalado
- ✅ Dashboard de monitoramento configurado

---

### Etapa 5 – Evolução Pós-Lançamento (A partir de 26/02/2026)

**Mês 1 (Mar/2026):**
- Análise de métricas de uso
- Correção de bugs reportados
- Otimizações de performance
- Implementação de funcionalidades secundárias (histórico, configurações)

**Mês 2 (Abr/2026):**
- Implementação de melhorias baseadas em NPS
- Adição de novas categorias de ambiente (customizáveis)
- Integração com módulo de relatórios (Studio)

**Mês 3+ (Mai/2026+):**
- Funcionalidades avançadas (edição de fotos, modo colaborativo)
- Preparação para licenciamento (multi-tenant)

**Entrega:** 
- ✅ Versão 2.0 com funcionalidades expandidas
- ✅ Roadmap atualizado para próximos 6 meses

---

## 10. Riscos e Dependências

### Riscos

**R1 - Baixa adoção pelos técnicos (resistência a mudança)**
- **Probabilidade:** MÉDIA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - Onboarding presencial obrigatório
  - Gamificação (ranking de fotos capturadas)
  - Incentivo financeiro (bônus por uso consistente no primeiro mês)
  - Demonstrar economia de tempo com dados reais

**R2 - Problemas de conectividade em campo**
- **Probabilidade:** ALTA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Modo offline robusto (prioridade máxima)
  - Sincronização inteligente (apenas WiFi por padrão)
  - Compressão agressiva de fotos
  - Feedback claro de status de sincronização

**R3 - Consumo excessivo de bateria/dados**
- **Probabilidade:** MÉDIA
- **Impacto:** ALTO
- **Mitigação:** 
  - Otimização de uso de GPS (desligar quando não necessário)
  - Upload apenas em WiFi (configurável)
  - Modo econômico de bateria
  - Testes de consumo em diferentes dispositivos

**R4 - Incompatibilidade com dispositivos antigos**
- **Probabilidade:** MÉDIA
- **Impacto:** MÉDIO
- **Mitigação:** 
  - Definir requisitos mínimos claros (Android 8+, iOS 13+)
  - Fornecer smartphones corporativos se necessário
  - Testes em dispositivos de baixo custo

**R5 - Falhas de upload (perda de fotos)**
- **Probabilidade:** BAIXA
- **Impacto:** CRÍTICO
- **Mitigação:** 
  - Retry automático com backoff exponencial
  - Armazenamento local persistente (não deletar após upload)
  - Logs detalhados de erros
  - Alerta ao coordenador se upload falhar após 24h

### Dependências

**D1 - Supabase (Backend as a Service)**
- Dependência crítica para autenticação, storage e banco de dados
- Risco: Downtime ou mudanças de pricing
- Plano B: Migração para Firebase ou backend próprio (Node.js)

**D2 - Integração com TM Controle de O.S.**
- Necessário para validar códigos de O.S. e atualizar status
- Risco: Controle de O.S. ainda não estar pronto
- Plano B: Mock de API para desenvolvimento paralelo

**D3 - Smartphones dos técnicos**
- Dependência de hardware adequado
- Risco: Dispositivos muito antigos ou sem espaço
- Plano B: Fornecimento de smartphones corporativos (investimento)

**D4 - Conectividade em campo**
- Necessária para sincronização (não para captura)
- Risco: Áreas sem cobertura 4G
- Plano B: Modo offline robusto + sincronização posterior

---

## 11. Anexos

### Links de Referência
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Camera](https://github.com/react-native-camera/react-native-camera)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Design System TM - Ocean Breeze](d:\DATABASE\TM\Design System TM – Atualizado com Ocean Breeze.docx)

### Wireframes
- **Tela de Login**: `d:\DATABASE\TM - Levantamentos Fotográficos (FIGMA PROJECT)\project\wireframes\login.png`
- **Dashboard**: `d:\DATABASE\TM - Levantamentos Fotográficos (FIGMA PROJECT)\project\wireframes\dashboard.png`
- **Captura de Foto**: `d:\DATABASE\TM - Levantamentos Fotográficos (FIGMA PROJECT)\project\wireframes\camera.png`
- **Galeria**: `d:\DATABASE\TM - Levantamentos Fotográficos (FIGMA PROJECT)\project\wireframes\gallery.png`

### Documentos de Referência
- [MVP - TM Zap Levantamentos](d:\DATABASE\MVP_TM_Zap_Levantamentos.md)
- [Contexto do Projeto MAFFENG](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\CONTEXTO_PROJETO_MAFFENG.md)
- [Roadmap Integrado](d:\DATABASE\ROAD_MAP.md)
- [Personas e Jornada](d:\DATABASE\✅ Fase 1 – Planejamento Estratégico\03 - personas-jornada-tm.html)

### Diagramas Técnicos
- **Arquitetura de Sistema**: A ser criado na Etapa 1
- **Fluxo de Dados**: A ser criado na Etapa 1
- **Modelo de Dados**: A ser criado na Etapa 1

---

**Versão:** 1.0  
**Data de Criação:** 25/11/2025  
**Autor:** Thiago Nascimento Barbosa  
**Aprovadores:** [Pendente]  
**Status:** 📋 Em Revisão  
**Próxima Revisão:** 01/12/2025
