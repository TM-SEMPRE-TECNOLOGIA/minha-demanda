# Skill: `relatorio-descricoes-placeholder`

## Plan de Criação: Skill + Discord Forum Post

> **Goal:** Criar skill Hermes para substituir placeholders `{Desc_top}` em relatórios .docx por descrições de um arquivo .txt, com mapeamento semântico por serviço.
>
> **Author:** TM-Curador (Hermes Agent)
> **Data:** 2026-06-30

---

## 1. Nova Skill: `relatorio-descricoes-placeholder`

### O que a skill faz

Substitui placeholders `{Desc_top}` em relatórios fotográficos .docx pelas descrições contidas em um arquivo .txt, mapeando cada descrição ao serviço correto via semântica (keywords de serviço + ambiente), aplicando formatação JUSTIFICADO + Calibri 11pt.

### Workflow

```
Arquivo .txt (descrições)   ──┐
                              ├──→ Mapeamento semântico (serviço → descrição)
Arquivo .docx (placeholder)  ──┘
                                    ↓
                              Substituição + Formatação (JUSTIFY, Calibri 11pt)
                                    ↓
                              Novo .docx salvo com sufixo "- COM DESCRICOES"
```

### Inputs

- Caminho do .docx (ex: `RELATÓRIO FOTOGRÁFICO - SABINOPOLIS - ...docx`)
- Caminho do .txt (ex: `descrições..txt`)
- Placeholder string (default: `{Desc_top}`)

### Outputs

- Novo arquivo `.docx` com sufixo `- COM DESCRICOES`
- Relatório de mapeamento (quantas descrições foram para qual serviço)

### Lógica de mapeamento semântico

```python
# Para cada {Desc_top} no documento:
# 1. Encontrar o heading ANTERIOR (serviço que este placeholder descreve)
# 2. Para cada descrição no arquivo .txt:
#    - Verificar keywords do serviço (ex: "pintura acrílica", "forro de gesso")
#    - Verificar keywords do ambiente (ex: "sala sem uso", "saa", "cozinha")
# 3. Matching: descrição com maior score de keywords → placeholder
# 4. Se score < threshold, usar descrição genérica automática
```

### Estrutura do Código

A ser incluído como script na skill:

```python
# scripts/substituir_descricoes.py
# - Lê .docx e .txt
# - Coleta todos headings + {Desc_top}
# - Mapeia cada placeholder ao serviço anterior
# - Match semântico com descrições do .txt
# - Substitui texto + formata JUSTIFY + Calibri 11pt
# - Salva novo arquivo
```

### Integração com `relatorio-preventivo`

- **Herda** a lógica de parsing de headings do `relatorio-preventivo`
- **Complementa** o pipeline: após gerar o .docx, pode executar a substituição de placeholders
- Pode ser chamado como step opcional no pipeline de formatação

### Tags da skill

- `relatorio`, `descricao`, `placeholder`, `docx`, `substituicao`, `preventivo`

---

## 2. Discord: Novo Fórum Post

### Onde postar

No fórum **`#projetos`** do Servidor TM (guild_id=1520295388387479563, forum_id a confirmar).

### Título do post

```
[Sistema] Skill: relatorio-descricoes-placeholder — Substituição semântica de placeholders em .docx
```

### Conteúdo do post

```markdown
## Skill: `relatorio-descricoes-placeholder`

### Framework
Hermes Agent (Nous Research) — Skill Engine

### Skill Name
`relatorio-descricoes-placeholder`

### O que faz
Substitui placeholders `{Desc_top}` em relatórios fotográficos .docx pelas descrições corretas de um arquivo .txt, usando mapeamento semântico para garantir que cada descrição vá para o serviço certo.

### Tags
`#AutoRelatorio` `#Preventivo` `#SkillDev` `#Pipeline`

### Fluxo
1. Lê .docx com placeholders + .txt com descrições
2. Mapeia cada placeholder ao heading de serviço anterior
3. Match semântico (keywords de serviço + ambiente)
4. Substitui com formatação JUSTIFICADO + Calibri 11pt
5. Salva novo .docx com sufixo "- COM DESCRICOES"

### Origem
Desenvolvido durante processamento do relatório Sabinópolis (2557) — 39 placeholders substituídos, 37 descrições originais + 2 genéricas geradas.
```

---

## 3. Tasks

### Task 1: Criar a skill `relatorio-descricoes-placeholder`
- **Arquivo:** `$HERMES_HOME/skills/relatorio-descricoes-placeholder/SKILL.md`
- **Scripts:** `scripts/substituir_descricoes.py` (versão limpa e parametrizada)

### Task 2: Postar no Discord
- **Fórum:** `#projetos` (ou criar novo fórum se necessário)
- **Conteúdo:** Resumo da skill com framework, nome e tags

### Task 3: Registrar no ecossistema
- Adicionar referência na skill `relatorio-preventivo` (references/)
- Salvar no memory como skill disponível

---

## Riscos e Abertos

- **Placeholder fixo `{Desc_top}`** — pode generalizar para qualquer placeholder configurável
- **Match semântico depende das keywords** — se mudar nomenclatura dos serviços, precisa atualizar
- **Performance em documentos grandes** — o .docx de Sabinópolis tem 28MB com 39 placeholders, processamento instantâneo

---

**Plan saved. Ready to execute.**
