# Planejamento Técnico – Bot RAG Orquestrado (Closed-Book)

**Nome do sistema:** `bot_rag_closedbook_orchestrator`

---

## Visão Geral

Este documento descreve o planejamento técnico para construção de um **bot RAG (Retrieval‑Augmented Generation) com orquestração de agentes**, operando em modo **closed‑book**. O sistema responde **exclusivamente** com base em documentos fornecidos (contratos e relatórios técnicos), garantindo rastreabilidade, evidência documental e mitigação de alucinações.

---

## 0. Regra‑Mãe do Sistema (Closed‑Book)

- O bot **somente responde com base nos documentos indexados**.
- Caso não exista evidência recuperável, a resposta padrão será:

> **“Não encontrado nos documentos.”**

- Não é permitido uso de conhecimento externo, inferências livres ou complementações não documentadas.

---

## 1. Organização das Fontes Documentais

### Estrutura de Entrada (Fonte Bruta)

```
/data_fonte/
 ├─ contratos/   # PDFs de contratos
 └─ relatorios/  # PDFs de relatórios técnicos e fotográficos
```

> **Nota:** As pastas acima não constituem a base RAG. A base é formada **após** a ingestão, chunking e indexação vetorial do conteúdo dos PDFs.

---

## 2. Bases Vetoriais Separadas

O sistema utiliza **dois índices vetoriais independentes**, garantindo separação semântica e controle rigoroso de contexto:

- **`contracts_index`**
  - Conteúdo: contratos
  - Estratégia de chunk: **por cláusula ou seção normativa**

- **`reports_index`**
  - Conteúdo: relatórios técnicos
  - Estratégia de chunk: **por serviço completo** (seção + descrição + tabelas + itens vinculados ao contrato)

Essa separação evita contaminação de contexto e facilita auditoria e depuração.

---

## 3. Metadados Mínimos por Chunk

### Contratos

```json
{
  "tipo": "contrato",
  "contrato_id": "string",
  "pagina": "number",
  "clausula_secao": "string",
  "arquivo": "string"
}
```

### Relatórios

```json
{
  "tipo": "relatorio",
  "contrato_id": "string",
  "os": "string",
  "agencia": "string",
  "ambiente": "string",
  "servico": "string",
  "itens_contrato": ["string"],
  "pagina_inicio": "number",
  "arquivo": "string"
}
```

Metadados são obrigatórios para rastreabilidade, filtragem e validação pelo auditor.

---

## 4. Arquitetura de Agentes (Orquestração)

### Agente 1 — Classificador (Router)

- **Entrada:** pergunta do usuário
- **Saída (JSON):**

```json
{
  "rota": "contrato" | "relatorio" | "geral_negado",
  "confianca": 0.0
}
```

- **Regra:** Como o sistema é closed‑book, qualquer intenção genérica não documental resulta em `geral_negado`.

---

### Agente 2 — Buscador (RAG)

- **Entrada:**

```json
{
  "rota": "contrato|relatorio",
  "pergunta_normalizada": "string",
  "filtros": {}
}
```

- **Ação:** consulta **exclusivamente** o índice vetorial correspondente à rota.
- **Saída (JSON):**

```json
{
  "trechos": [
    {
      "texto": "string",
      "pagina": "number",
      "arquivo": "string",
      "score": 0.0,
      "metadados": {}
    }
  ]
}
```

---

### Agente 3 — Respondedor

- **Entrada:** pergunta + trechos recuperados
- **Regra:** resposta deve ser construída **somente** a partir dos trechos fornecidos, com citação explícita.
- **Saída (JSON):**

```json
{
  "resposta": "string",
  "citacoes": [
    {
      "arquivo": "string",
      "pagina": "number"
    }
  ]
}
```

---

### Agente 4 — Auditor (Opcional, Recomendado)

- **Entrada:** resposta, citações e trechos
- **Regras de validação:**
  - Se `citacoes` estiver vazio → reprovação
  - Se houver afirmações sem suporte explícito → reprovação

- **Saída (JSON):**

```json
{
  "ok": true,
  "problemas": [],
  "acao": "rebUSCAR" | "reduzir_resposta" | "nao_encontrado"
}
```

---

## 5. Loop de Correção (Anti‑Alucinação)

Quando o Auditor reprovar a resposta:

1. **Tentativa 1:** reformular a query (query rewrite) e aumentar `topK`.
2. **Tentativa 2:** aplicar filtros mais restritivos via metadados (ex.: agência, OS, contrato).
3. **Falha final:** retornar resposta padrão:

> **“Não encontrado nos documentos.”**

---

## 6. Ambiente de Desenvolvimento

### Estrutura do Repositório

```
/ingest   # ingestão, chunking e indexação
/api      # pipeline dos agentes e orquestrador
/ui       # interface de chat
```

### Ferramentas

- **Replit**
  - Execução rápida do backend e UI
  - Testes interativos do pipeline

- **Antigravity**
  - Aceleração de tarefas complexas (refatorações, criação de módulos, testes)
  - Uso sempre acompanhado de logs, versionamento e revisão humana

---

## 7. Critérios de Pronto (Acceptance Criteria)

O sistema será considerado funcional quando:

- 5 perguntas de validação forem respondidas corretamente:
  - 2 perguntas sobre **contrato** (ex.: vigência, pagamento)
  - 3 perguntas sobre **relatório** (ex.: itens citados, quantitativos, ambiente)
- Todas as respostas apresentarem **citações válidas**.
- Em caso de ausência de evidência, o sistema retornar **“Não encontrado nos documentos.”**

---

## Encerramento

Este planejamento serve como **documento-base** para início do desenvolvimento técnico do `bot_rag_closedbook_orchestrator`. A partir dele, serão definidos:

- o stack tecnológico,
- a documentação técnica necessária,
- e o plano de implementação incremental.

