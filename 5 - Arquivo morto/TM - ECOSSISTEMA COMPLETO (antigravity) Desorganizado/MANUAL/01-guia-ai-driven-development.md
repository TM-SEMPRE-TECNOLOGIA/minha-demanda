# 🤖 GUIA MANUAL - AI-Driven Development
## Projeto MAFFENG TM Gerenciador de O.S.

**Versão:** 1.0  
**Data:** 19 de Novembro de 2025  
**Autor:** Thiago Nascimento Barbosa

---

## 📋 Índice

1. [Definições de Banco de Dados](#1-definições-de-banco-de-dados)
2. [Permissões e RBAC](#2-permissões-e-rbac)
3. [Regras de Negócio](#3-regras-de-negócio)
4. [Validações e Constraints](#4-validações-e-constraints)
5. [Integrações e APIs](#5-integrações-e-apis)
6. [Configurações de Ambiente](#6-configurações-de-ambiente)

---

## 1. Definições de Banco de Dados

### 1.1 Tabelas Principais (Supabase PostgreSQL)

#### ✅ Tabela: `usuarios`
**Status:** ⚠️ REVISAR COLUNAS

| Coluna | Tipo | Obrigatório | Default | Descrição | **AÇÃO MANUAL** |
|--------|------|-------------|---------|-----------|-----------------|
| `id` | UUID | ✅ | `uuid_generate_v4()` | PK | ✅ Definido |
| `email` | VARCHAR(255) | ✅ | - | Email corporativo | ✅ Definido |
| `nome_completo` | VARCHAR(255) | ✅ | - | Nome do usuário | ✅ Definido |
| `perfil` | ENUM | ✅ | - | admin, gerente, tecnico, elaborador, diretor | ⚠️ **DEFINIR**: Adicionar `financeiro`? |
| `contrato_id` | UUID | ❌ | NULL | FK para contratos | ✅ Definido |
| `ativo` | BOOLEAN | ✅ | `true` | Status ativo/inativo | ✅ Definido |
| `telefone` | VARCHAR(20) | ❌ | NULL | Telefone de contato | ⚠️ **DEFINIR**: Obrigatório? |
| `avatar_url` | TEXT | ❌ | NULL | URL da foto de perfil | ✅ Definido |
| `created_at` | TIMESTAMPTZ | ✅ | `now()` | Data de criação | ✅ Definido |
| `updated_at` | TIMESTAMPTZ | ✅ | `now()` | Última atualização | ✅ Definido |

**🔴 AÇÕES MANUAIS NECESSÁRIAS:**
- [ ] Decidir se `telefone` é obrigatório
- [ ] Adicionar perfil `financeiro` ao ENUM?
- [ ] Definir se precisa campo `cpf` ou `matricula`
- [ ] Definir se precisa campo `departamento`

---

#### ✅ Tabela: `contratos`
**Status:** ⚠️ REVISAR COLUNAS

| Coluna | Tipo | Obrigatório | Default | Descrição | **AÇÃO MANUAL** |
|--------|------|-------------|---------|-----------|-----------------|
| `id` | UUID | ✅ | `uuid_generate_v4()` | PK | ✅ Definido |
| `numero_contrato` | VARCHAR(100) | ✅ | - | Nº do contrato | ✅ Definido |
| `cliente_nome` | VARCHAR(255) | ✅ | - | Nome do cliente | ✅ Definido |
| `cliente_cnpj` | VARCHAR(18) | ❌ | NULL | CNPJ do cliente | ⚠️ **DEFINIR**: Obrigatório? |
| `data_inicio` | DATE | ✅ | - | Data de início | ✅ Definido |
| `data_fim` | DATE | ❌ | NULL | Data de término | ✅ Definido |
| `valor_total` | DECIMAL(15,2) | ❌ | NULL | Valor do contrato | ⚠️ **DEFINIR**: Necessário? |
| `ativo` | BOOLEAN | ✅ | `true` | Status ativo/inativo | ✅ Definido |
| `created_at` | TIMESTAMPTZ | ✅ | `now()` | Data de criação | ✅ Definido |
| `updated_at` | TIMESTAMPTZ | ✅ | `now()` | Última atualização | ✅ Definido |

**🔴 AÇÕES MANUAIS NECESSÁRIAS:**
- [ ] Decidir se `cliente_cnpj` é obrigatório
- [ ] Definir se `valor_total` é necessário (pode ser sensível)
- [ ] Adicionar campo `tipo_servico` (enum)?
- [ ] Adicionar campo `sla_padrao_dias` (int)?

---

#### ✅ Tabela: `ordens_servico`
**Status:** ⚠️ REVISAR COLUNAS

| Coluna | Tipo | Obrigatório | Default | Descrição | **AÇÃO MANUAL** |
|--------|------|-------------|---------|-----------|-----------------|
| `id` | UUID | ✅ | `uuid_generate_v4()` | PK | ✅ Definido |
| `numero_os` | VARCHAR(50) | ✅ | - | Nº da O.S. | ✅ Definido |
| `contrato_id` | UUID | ✅ | - | FK para contratos | ✅ Definido |
| `endereco` | TEXT | ✅ | - | Endereço completo | ✅ Definido |
| `cep` | VARCHAR(9) | ✅ | - | CEP (00000-000) | ✅ Definido |
| `tipo_servico` | VARCHAR(100) | ✅ | - | Tipo de serviço | ⚠️ **DEFINIR**: Enum ou texto livre? |
| `status` | ENUM | ✅ | `'criada'` | criada, distribuida, em_campo, levantamento_enviado, validada, concluida, cancelada | ✅ Definido |
| `prioridade` | ENUM | ❌ | `'normal'` | baixa, normal, alta, urgente | ⚠️ **DEFINIR**: Necessário? |
| `tecnico_id` | UUID | ❌ | NULL | FK para usuarios | ✅ Definido |
| `data_criacao` | TIMESTAMPTZ | ✅ | `now()` | Data de criação | ✅ Definido |
| `prazo` | DATE | ❌ | NULL | Prazo de conclusão | ⚠️ **DEFINIR**: Calculado ou manual? |
| `observacoes` | TEXT | ❌ | NULL | Observações gerais | ✅ Definido |
| `criado_por` | UUID | ✅ | - | FK para usuarios | ✅ Definido |
| `deleted_at` | TIMESTAMPTZ | ❌ | NULL | Soft delete | ✅ Definido |
| `created_at` | TIMESTAMPTZ | ✅ | `now()` | Data de criação | ✅ Definido |
| `updated_at` | TIMESTAMPTZ | ✅ | `now()` | Última atualização | ✅ Definido |

**🔴 AÇÕES MANUAIS NECESSÁRIAS:**
- [ ] Definir se `tipo_servico` é ENUM ou texto livre
- [ ] Decidir se `prioridade` é necessário
- [ ] Definir como calcular `prazo` (manual ou automático via regra de negócio)
- [ ] Adicionar campo `latitude` e `longitude` (DECIMAL)?
- [ ] Adicionar campo `numero_agencia` ou `codigo_local` (VARCHAR)?

---

#### ✅ Tabela: `pacotes_levantamento`
**Status:** ⚠️ REVISAR COLUNAS

| Coluna | Tipo | Obrigatório | Default | Descrição | **AÇÃO MANUAL** |
|--------|------|-------------|---------|-----------|-----------------|
| `id` | UUID | ✅ | `uuid_generate_v4()` | PK | ✅ Definido |
| `os_id` | UUID | ✅ | - | FK para ordens_servico | ✅ Definido |
| `tecnico_id` | UUID | ✅ | - | FK para usuarios | ✅ Definido |
| `status` | ENUM | ✅ | `'pendente'` | pendente, validado, rejeitado | ✅ Definido |
| `data_upload` | TIMESTAMPTZ | ✅ | `now()` | Data do upload | ✅ Definido |
| `validado_por` | UUID | ❌ | NULL | FK para usuarios | ✅ Definido |
| `validado_em` | TIMESTAMPTZ | ❌ | NULL | Data da validação | ✅ Definido |
| `feedback_validacao` | TEXT | ❌ | NULL | Feedback do gerente | ✅ Definido |
| `metadados_json` | JSONB | ❌ | NULL | Dados adicionais do mobile | ⚠️ **DEFINIR**: Estrutura do JSON |
| `created_at` | TIMESTAMPTZ | ✅ | `now()` | Data de criação | ✅ Definido |
| `updated_at` | TIMESTAMPTZ | ✅ | `now()` | Última atualização | ✅ Definido |

**🔴 AÇÕES MANUAIS NECESSÁRIAS:**
- [ ] Definir estrutura do `metadados_json` (device_info, app_version, etc.)
- [ ] Adicionar campo `numero_fotos` (INT) para validação rápida?
- [ ] Adicionar campo `tamanho_total_mb` (DECIMAL)?

---

#### ✅ Tabela: `fotos_levantamento`
**Status:** ⚠️ REVISAR COLUNAS

| Coluna | Tipo | Obrigatório | Default | Descrição | **AÇÃO MANUAL** |
|--------|------|-------------|---------|-----------|-----------------|
| `id` | UUID | ✅ | `uuid_generate_v4()` | PK | ✅ Definido |
| `pacote_id` | UUID | ✅ | - | FK para pacotes_levantamento | ✅ Definido |
| `storage_path` | TEXT | ✅ | - | Caminho no Supabase Storage | ✅ Definido |
| `url_publica` | TEXT | ✅ | - | URL pública da foto | ✅ Definido |
| `ordem` | INT | ❌ | NULL | Ordem de exibição | ⚠️ **DEFINIR**: Necessário? |
| `latitude` | DECIMAL(10,8) | ❌ | NULL | Coordenada GPS | ✅ Definido |
| `longitude` | DECIMAL(11,8) | ❌ | NULL | Coordenada GPS | ✅ Definido |
| `metadados_exif` | JSONB | ❌ | NULL | Metadados EXIF da foto | ⚠️ **DEFINIR**: Estrutura |
| `created_at` | TIMESTAMPTZ | ✅ | `now()` | Data de criação | ✅ Definido |

**🔴 AÇÕES MANUAIS NECESSÁRIAS:**
- [ ] Decidir se `ordem` é necessário
- [ ] Definir estrutura do `metadados_exif` (timestamp, device, resolution, etc.)
- [ ] Adicionar campo `descricao` ou `legenda` (TEXT)?
- [ ] Adicionar campo `tamanho_bytes` (BIGINT)?

---

#### ✅ Tabela: `status_os`
**Status:** ✅ COMPLETA

| Coluna | Tipo | Obrigatório | Default | Descrição | **AÇÃO MANUAL** |
|--------|------|-------------|---------|-----------|-----------------|
| `id` | UUID | ✅ | `uuid_generate_v4()` | PK | ✅ Definido |
| `os_id` | UUID | ✅ | - | FK para ordens_servico | ✅ Definido |
| `status_anterior` | VARCHAR(50) | ❌ | NULL | Status anterior | ✅ Definido |
| `status_novo` | VARCHAR(50) | ✅ | - | Novo status | ✅ Definido |
| `alterado_por` | UUID | ✅ | - | FK para usuarios | ✅ Definido |
| `observacao` | TEXT | ❌ | NULL | Observação da mudança | ✅ Definido |
| `created_at` | TIMESTAMPTZ | ✅ | `now()` | Data da mudança | ✅ Definido |

**✅ NENHUMA AÇÃO MANUAL NECESSÁRIA**

---

### 1.2 Índices e Performance

**🔴 DEFINIR MANUALMENTE:**

```sql
-- Índices sugeridos (REVISAR E AJUSTAR)

-- usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX idx_usuarios_contrato ON usuarios(contrato_id);

-- ordens_servico
CREATE INDEX idx_os_numero ON ordens_servico(numero_os);
CREATE INDEX idx_os_contrato ON ordens_servico(contrato_id);
CREATE INDEX idx_os_status ON ordens_servico(status);
CREATE INDEX idx_os_tecnico ON ordens_servico(tecnico_id);
CREATE INDEX idx_os_prazo ON ordens_servico(prazo) WHERE deleted_at IS NULL;

-- pacotes_levantamento
CREATE INDEX idx_pacotes_os ON pacotes_levantamento(os_id);
CREATE INDEX idx_pacotes_status ON pacotes_levantamento(status);
CREATE INDEX idx_pacotes_tecnico ON pacotes_levantamento(tecnico_id);

-- fotos_levantamento
CREATE INDEX idx_fotos_pacote ON fotos_levantamento(pacote_id);

-- status_os
CREATE INDEX idx_status_os ON status_os(os_id);
CREATE INDEX idx_status_created ON status_os(created_at DESC);
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Revisar se todos os índices são necessários
- [ ] Adicionar índices compostos se houver queries frequentes (ex: `status + prazo`)
- [ ] Considerar índices GIN para campos JSONB se houver buscas

---

## 2. Permissões e RBAC

### 2.1 Perfis de Usuário

**Status:** ✅ Definidos no documento `09-permissions-matrix.html`

| Perfil | Código | Descrição |
|--------|--------|-----------|
| Admin | `admin` | Acesso total |
| Gerente | `gerente` | Gestão de O.S. do contrato |
| Técnico | `tecnico` | Execução de levantamentos |
| Elaborador | `elaborador` | Criação de relatórios |
| Diretor | `diretor` | Visualização executiva |

**🔴 DEFINIR MANUALMENTE:**
- [ ] Adicionar perfil `financeiro` para módulo Admin/Financeiro?
- [ ] Definir hierarquia de perfis (quem pode criar quem)?

---

### 2.2 Políticas RLS (Row Level Security)

**Status:** ⚠️ REVISAR E AJUSTAR

#### Política: Técnico vê apenas suas O.S.

```sql
CREATE POLICY "tecnico_ve_suas_os"
ON ordens_servico
FOR SELECT
USING (
  tecnico_id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND perfil IN ('gerente', 'admin')
  )
);
```

**🔴 AÇÕES MANUAIS:**
- [ ] Revisar se gerente deve ver TODAS as O.S. ou apenas do seu contrato
- [ ] Definir se elaborador precisa ver O.S. (provavelmente sim, para gerar relatórios)
- [ ] Definir se diretor vê todas ou apenas do seu contrato

---

#### Política: Isolamento por Contrato

```sql
CREATE POLICY "isolamento_contrato"
ON ordens_servico
FOR ALL
USING (
  contrato_id IN (
    SELECT contrato_id FROM usuarios
    WHERE id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE id = auth.uid()
    AND perfil = 'admin'
  )
);
```

**🔴 AÇÕES MANUAIS:**
- [ ] Confirmar se admin vê TODOS os contratos
- [ ] Definir se diretor vê apenas seu contrato ou todos

---

### 2.3 Permissões de CRUD

**Status:** ✅ Definidas no documento `09-permissions-matrix.html`

**🔴 AÇÕES MANUAIS:**
- [ ] Revisar matriz de permissões e confirmar cada ação
- [ ] Definir permissões para módulo Admin/Financeiro (novo)
- [ ] Definir permissões para Painel do Diretor (novo)

---

## 3. Regras de Negócio

### 3.1 Cálculo de SLA

**Status:** ✅ Definido no documento `08-business-rules.html` (BR-001, BR-002, BR-003)

**🔴 DEFINIR MANUALMENTE:**

```javascript
// Função de cálculo de prazo (IMPLEMENTAR NO BACKEND)
function calcularPrazo(dataCriacao, tipoServico) {
  const diasUteis = obterDiasUteisPorTipo(tipoServico); // DEFINIR TABELA
  return adicionarDiasUteis(dataCriacao, diasUteis);
}

// TABELA DE DIAS ÚTEIS POR TIPO (DEFINIR VALORES)
const DIAS_UTEIS_POR_TIPO = {
  'levantamento_fotografico': 5,
  'vistoria_tecnica': 7,
  'inspecao_predial': 10,
  // ADICIONAR OUTROS TIPOS
};
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Definir todos os tipos de serviço e seus prazos padrão
- [ ] Decidir se feriados são considerados (precisa tabela de feriados?)
- [ ] Definir regra de extensão de prazo (máximo +7 dias?)

---

### 3.2 Validação de Campos

**Status:** ✅ Definido no documento `08-business-rules.html` (BR-010, BR-011, BR-012)

**🔴 DEFINIR MANUALMENTE:**

```javascript
// Regex de validação (CONFIRMAR)
const VALIDACOES = {
  cep: /^\d{5}-?\d{3}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefone: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,  // DEFINIR FORMATO
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, // DEFINIR SE OBRIGATÓRIO
};

// Campos obrigatórios na importação (CONFIRMAR LISTA)
const CAMPOS_OBRIGATORIOS_IMPORTACAO = [
  'numero_os',
  'endereco',
  'cep',
  'tipo_servico',
  // ADICIONAR OUTROS?
];
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Confirmar formato de telefone (com/sem DDD, com/sem 9º dígito)
- [ ] Definir se CNPJ é obrigatório na importação
- [ ] Adicionar outros campos obrigatórios (agência, código local, etc.)?

---

### 3.3 Atribuição de O.S.

**Status:** ✅ Definido no documento `08-business-rules.html` (BR-020, BR-021, BR-022)

**🔴 DEFINIR MANUALMENTE:**

```javascript
// Limite de O.S. por técnico (CONFIRMAR VALOR)
const MAX_OS_POR_TECNICO = 10;

// Regra de reatribuição (CONFIRMAR LÓGICA)
function podeReatribuir(os) {
  const statusPermitidos = ['distribuida', 'em_campo'];
  return statusPermitidos.includes(os.status);
}
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Confirmar limite de 10 O.S. por técnico
- [ ] Definir se limite varia por tipo de serviço
- [ ] Definir regra de distribuição automática (se houver)

---

### 3.4 Validação de Pacotes

**Status:** ✅ Definido no documento `08-business-rules.html` (BR-030, BR-031, BR-032)

**🔴 DEFINIR MANUALMENTE:**

```javascript
// Validações de pacote (CONFIRMAR VALORES)
const VALIDACOES_PACOTE = {
  minFotos: 3,
  maxFotoSizeMB: 5,
  maxPacoteSizeMB: 50, // DEFINIR
  feedbackMinimoChars: 20,
};

// Formatos de foto aceitos (DEFINIR)
const FORMATOS_FOTO_ACEITOS = ['jpg', 'jpeg', 'png', 'heic']; // HEIC?
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Confirmar número mínimo de fotos (3 ou outro valor?)
- [ ] Definir tamanho máximo do pacote completo
- [ ] Decidir se aceita HEIC (formato iOS)
- [ ] Definir se precisa validar resolução mínima das fotos

---

## 4. Validações e Constraints

### 4.1 Constraints de Banco

**🔴 DEFINIR MANUALMENTE:**

```sql
-- Constraints sugeridas (REVISAR)

-- usuarios
ALTER TABLE usuarios
  ADD CONSTRAINT chk_email_formato CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  ADD CONSTRAINT chk_perfil_valido CHECK (perfil IN ('admin', 'gerente', 'tecnico', 'elaborador', 'diretor'));

-- ordens_servico
ALTER TABLE ordens_servico
  ADD CONSTRAINT chk_cep_formato CHECK (cep ~ '^\d{5}-?\d{3}$'),
  ADD CONSTRAINT chk_status_valido CHECK (status IN ('criada', 'distribuida', 'em_campo', 'levantamento_enviado', 'validada', 'concluida', 'cancelada')),
  ADD CONSTRAINT chk_prazo_futuro CHECK (prazo IS NULL OR prazo >= data_criacao::date);

-- pacotes_levantamento
ALTER TABLE pacotes_levantamento
  ADD CONSTRAINT chk_status_pacote CHECK (status IN ('pendente', 'validado', 'rejeitado')),
  ADD CONSTRAINT chk_feedback_obrigatorio CHECK (
    (status = 'rejeitado' AND feedback_validacao IS NOT NULL AND length(feedback_validacao) >= 20)
    OR status != 'rejeitado'
  );
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Revisar todos os constraints
- [ ] Adicionar constraint de unicidade `(numero_os, contrato_id)`
- [ ] Adicionar outros constraints de validação

---

## 5. Integrações e APIs

### 5.1 Endpoints REST

**Status:** ✅ Definidos no documento `06-api-specifications.html`

**🔴 DEFINIR MANUALMENTE:**

**Endpoints Faltantes:**
- [ ] `POST /usuarios` - Criar usuário (apenas admin)
- [ ] `PUT /usuarios/{id}` - Editar usuário
- [ ] `DELETE /usuarios/{id}` - Desativar usuário (soft delete)
- [ ] `GET /contratos` - Listar contratos
- [ ] `POST /contratos` - Criar contrato
- [ ] `GET /relatorios/gerar` - Gerar relatório (integração com Auto Relatórios)
- [ ] `GET /metricas/dashboard` - Métricas para Painel do Diretor

**⚠️ AÇÕES MANUAIS:**
- [ ] Definir todos os endpoints necessários
- [ ] Documentar request/response de cada endpoint
- [ ] Definir códigos de erro customizados

---

### 5.2 Webhooks e Callbacks

**🔴 DEFINIR MANUALMENTE:**

```javascript
// Webhooks para Auto Relatórios (DEFINIR ESTRUTURA)
const WEBHOOK_AUTO_RELATORIOS = {
  url: process.env.AUTO_RELATORIOS_WEBHOOK_URL,
  events: [
    'pacote.validado',  // Quando pacote é validado
    'relatorio.solicitado', // Quando gerente solicita relatório
  ],
  payload: {
    event: 'pacote.validado',
    pacote_id: 'uuid',
    os_id: 'uuid',
    timestamp: 'ISO8601',
  },
};

// Callback esperado do Auto Relatórios (DEFINIR)
const CALLBACK_AUTO_RELATORIOS = {
  url: '/api/relatorios/callback',
  method: 'POST',
  payload: {
    pacote_id: 'uuid',
    relatorio_url: 'https://storage.../relatorio.docx',
    status: 'concluido' | 'erro',
    erro_mensagem: 'string (se erro)',
  },
};
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Definir estrutura completa de webhooks
- [ ] Definir autenticação dos webhooks (HMAC, JWT?)
- [ ] Definir retry policy (quantas tentativas?)

---

## 6. Configurações de Ambiente

### 6.1 Variáveis de Ambiente

**🔴 DEFINIR MANUALMENTE:**

```bash
# .env.example (PREENCHER VALORES)

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # APENAS BACKEND

# Auto Relatórios
AUTO_RELATORIOS_API_URL=https://auto-relatorios.exemplo.com
AUTO_RELATORIOS_API_KEY=xxx  # DEFINIR

# Storage
SUPABASE_STORAGE_BUCKET=fotos-levantamento  # CONFIRMAR NOME

# Notificações
SENDGRID_API_KEY=xxx  # OU RESEND
EMAIL_FROM=noreply@maffeng.com  # DEFINIR

# Push Notifications (Mobile)
FCM_SERVER_KEY=xxx  # Firebase Cloud Messaging

# Analytics
MIXPANEL_TOKEN=xxx  # OPCIONAL
SENTRY_DSN=xxx  # OPCIONAL

# Outros
NODE_ENV=development | staging | production
PORT=3000
LOG_LEVEL=debug | info | warn | error
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Criar projeto no Supabase e pegar credenciais
- [ ] Definir URL do Auto Relatórios (onde vai rodar?)
- [ ] Escolher serviço de email (SendGrid, Resend, AWS SES?)
- [ ] Configurar Firebase para push notifications
- [ ] Decidir se usa Mixpanel/Sentry

---

### 6.2 Configurações de Deploy

**🔴 DEFINIR MANUALMENTE:**

```yaml
# vercel.json (Frontend - AJUSTAR)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}

# railway.toml (Backend Python - AJUSTAR)
[build]
builder = "NIXPACKS"
buildCommand = "pip install -r requirements.txt"

[deploy]
startCommand = "uvicorn main:app --host 0.0.0.0 --port $PORT"
healthcheckPath = "/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
```

**⚠️ AÇÕES MANUAIS:**
- [ ] Escolher plataforma de deploy frontend (Vercel, Netlify, Cloudflare Pages?)
- [ ] Escolher plataforma de deploy backend Python (Railway, Render, Fly.io?)
- [ ] Configurar CI/CD (GitHub Actions?)
- [ ] Definir estratégia de ambientes (dev, staging, prod)

---

## 7. Checklist de Implementação

### 7.1 Banco de Dados

- [ ] Revisar e ajustar todas as colunas das tabelas
- [ ] Definir ENUMs faltantes (`tipo_servico`, `prioridade`)
- [ ] Criar índices necessários
- [ ] Implementar constraints de validação
- [ ] Configurar políticas RLS no Supabase
- [ ] Criar tabela de feriados (se necessário para SLA)
- [ ] Popular dados de seed (contratos, usuários de teste)

### 7.2 Backend

- [ ] Implementar todos os endpoints REST
- [ ] Implementar lógica de cálculo de SLA
- [ ] Implementar validações de negócio
- [ ] Configurar autenticação JWT (Supabase Auth)
- [ ] Implementar webhooks para Auto Relatórios
- [ ] Configurar upload de fotos (Supabase Storage)
- [ ] Implementar sistema de notificações
- [ ] Configurar logs e monitoramento (Sentry)

### 7.3 Frontend

- [ ] Implementar todas as telas do Figma
- [ ] Integrar com API REST
- [ ] Implementar autenticação e proteção de rotas
- [ ] Implementar upload de arquivos (Excel, fotos)
- [ ] Implementar validações de formulário
- [ ] Implementar notificações em tempo real (Supabase Realtime)
- [ ] Implementar exportação de dados (Excel, PDF)
- [ ] Testes de usabilidade

### 7.4 Mobile

- [ ] Implementar captura de fotos com metadados EXIF
- [ ] Implementar funcionalidade offline
- [ ] Implementar sincronização de dados
- [ ] Implementar upload de pacotes
- [ ] Implementar push notifications
- [ ] Testes em dispositivos reais (iOS + Android)

### 7.5 Integrações

- [ ] Integrar com Auto Relatórios (webhooks + callbacks)
- [ ] Integrar com serviço de email
- [ ] Integrar com FCM (push notifications)
- [ ] Integrar com analytics (Mixpanel/Amplitude)
- [ ] Configurar Sentry para error tracking

### 7.6 Testes

- [ ] Testes unitários (backend)
- [ ] Testes de integração (API)
- [ ] Testes E2E (Playwright)
- [ ] Testes de carga (K6, Artillery)
- [ ] Testes de segurança (OWASP)
- [ ] Testes de acessibilidade (WCAG AA)

### 7.7 Documentação

- [ ] Documentar API (Swagger/OpenAPI)
- [ ] Criar guia de usuário
- [ ] Criar guia de desenvolvedor
- [ ] Documentar fluxos de deploy
- [ ] Criar FAQ

### 7.8 Conformidade

- [ ] Finalizar Política de Privacidade
- [ ] Finalizar Termos de Uso
- [ ] Implementar banner de cookies
- [ ] Implementar exportação de dados (LGPD)
- [ ] Implementar exclusão de dados (direito ao esquecimento)

---



---

**Documento criado em:** 19 de Novembro de 2025  
**Última atualização:** 19 de Novembro de 2025  
**Versão:** 1.0  
**Status:** 🔴 AGUARDANDO DEFINIÇÕES MANUAIS
