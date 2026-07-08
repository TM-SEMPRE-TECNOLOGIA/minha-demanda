# CLAUDE.md — Skill: Gerador de Descrições Técnicas MAFFENG

## Como usar este workspace

1. Cole o relatório `.docx` novo direto nesta pasta (raiz)
2. Abra o terminal aqui e chame o Claude
3. Claude detecta o arquivo novo, lê tudo e gera as descrições prontas

---

## O que Claude deve fazer ao ser invocado nesta pasta

Ao ser chamado aqui (sem instrução específica do usuário), Claude deve:

1. **Detectar** o arquivo `.docx` na raiz desta pasta (é o relatório novo para processar)
2. **Ler** o relatório: identificar **contrato**, agência, cidade, e cada item/área com suas medidas
3. **⚠️ Verificar o contrato ANTES de gerar:**
   - Se for contrato **1565** → seguir o fluxo especial descrito em `CONTRATO_1565_DESCRICOES.md` (formato narrativo por foto)
   - Para todos os outros contratos → seguir o fluxo padrão abaixo
4. **Cruzar** com os relatórios aprovados em `00 - Enviados/` — buscar exemplos do mesmo contrato ou tipo de serviço como few-shot
5. **Gerar** para cada item identificado as 3 variações de descrição prontas para copiar:
   - `Formal / Técnico` — detalhado com termos técnicos de patologia e execução
   - `Formal / Sucinto` — direto, telegráfico (padrão validado e mais usado)
   - `Humanizado` — para gerentes de agência, linguagem acessível

---

## Estrutura do workspace

```
Descrições (apoio skill)/
├── CLAUDE.md                        ← Este arquivo (instrução de operação)
├── CONTRATO_1565_DESCRICOES.md      ← Regras e formato especial do contrato 1565 (SP2)
├── [NOVO-RELATORIO.docx]            ← Cole aqui o novo relatório para processar
├── 00 - Enviados/                   ← BASE DE DADOS — relatórios aprovados reais
│   ├── 01 - Enviado Janeiro/        ← 16 projetos
│   ├── 02 - Enviado Fevereiro/      ← 5 projetos
│   ├── 03 - Enviado Março/          ← 4 projetos (inclui carmopolis e lorena em .md)
│   └── 05 - Enviado Maio/           ← 4 projetos (inclui 2 do contrato 1565)
├── Script de descrição/             ← Histórico de prompts (V3.md = vigente)
├── Planilhas/                       ← Orçamentos e memorial de cálculo
└── Diferença de uso/                ← HTML de referência de pinturas por contrato
```

---

## Regra de Ouro — Contratos × Itens de Pintura

| Contrato | Local | Paredes Brancas/Cinzas | Paredes Coloridas | Tetos/Forro | Muros |
|----------|-------|------------------------|-------------------|-------------|-------|
| **0908** | SP (S. J. Campos) | 17.4 | 17.4 | 17.6 | 17.4 |
| **6122** | MS (Campo Grande) | 17.4 | 17.11 | 17.4 | 17.10 |
| **1507/3575** | MT (Cuiabá/Sinop) | 17.4 | 17.11 | 17.6 | 17.4 |
| **2056/2626** | MG (Divinópolis/Salinas) | 17.11 (toda interna) | 17.11 | 17.6 ext | 17.6 ext |
| **2057/2627** | MG (Varginha/Valadares) | 17.11 (toda interna) | 17.11 | 17.6 ext | 17.10 (divisa) |
| **1565** | SP (S. J. Rio Preto / SP2) | **17.6** (interna) | **17.6** (interna) | **17.6** | **17.10** (muros) / **17.4** (ext) |

> **Contrato 1565** usa **formato diferente** — ver `CONTRATO_1565_DESCRICOES.md`. Não gerar as 3 versões.

Se o contrato não estiver na tabela, perguntar ao usuário antes de gerar.

---

## Regras Invioláveis de Formatação

| Regra | Detalhe |
|-------|---------|
| **Palavra proibida** | NUNCA usar "látex" — usar "tinta acrílica standard" (17.4/17.10) ou "tinta acrílica premium" (17.6/17.11) |
| **Início obrigatório** | Toda descrição começa com `- Prezados,` |
| **Uma linha só** | Sem quebras de parágrafo dentro do bloco de descrição |
| **Calhas** | Item 7.14 (m²) — NUNCA 7.8. Cálculo: comprimento (m) × 0,60 |
| **Medidas** | Usar valor exato do levantamento, nunca arredondar |
| **Mobiliário (13.12)** | Só mencionar se há obstáculo citado ou visível. Contrato 6122 = obrigatório quantificar (ex: "1,00 unidade") |
| **Placas de forro** | Se > 5 placas, adicionar folga (ex: 17 necessárias → lançar 21) |
| **Contrato 0908 (SP)** | Detalhes de paredes logo abaixo do tópico, não no final |
| **Fiscal Carol (MG)** | Contratos 2056/2057/2626/2627 — não lançar sujeira pontual como item |

---

## Formato de Saída para Cada Item

Para cada item/área identificado no relatório, gerar assim:

```
### [Nome da Área] — [Tipo de Serviço] ([m²]) — Item [X.X]

Formal / Técnico (detalhado)
‎```
- Prezados, [texto técnico corrido com patologias, causas e método executivo]
‎```

Formal / Sucinto (resumido)
‎```
- Prezados, [local] ([área]) apresenta [problema]. [solução] [+ mobiliário se houver]. (item X.X do contrato)
‎```

Humanizado (menos formal)
‎```
- Prezados, [texto acessível focado no benefício final]
‎```
```

---

## Como usar os exemplos de `00 - Enviados/`

Antes de gerar, buscar nos relatórios aprovados:
1. Relatórios do **mesmo contrato** → exemplos de itens idênticos com as medidas reais usadas
2. Relatórios do **mesmo tipo de serviço** em contratos diferentes → padrão de linguagem e vocabulário
3. Arquivos `.md` (carmopolis_relatorio.md, lorena_relatorio.md) → leitura rápida, já em markdown

Os `.docx` em `00 - Enviados/` são a fonte-verdade de como as descrições aprovadas ficaram. Usar como few-shot.

---

## Regras de Negócio por Contrato

- **0908 / SP**: Orçamento apenas em PDF assinado. Detalhes logo abaixo das paredes no relatório
- **6122 / MS**: Obrigatório quantificar mobiliário exato (ex: "1,00 unidade de mobiliário")
- **2056/2626 e 2057/2627 / MG**: Fiscal Carol é minuciosa. Não lançar item para sujeira pontual. Fotos obrigatórias para piso
- **1565 / SP2**: Formato narrativo por foto — ver `CONTRATO_1565_DESCRICOES.md`. Orçamento em PDF com assinatura digital + carimbo dos responsáveis técnicos. Planilha deve ocupar página inteira do PDF. Nunca enviar em Excel.
