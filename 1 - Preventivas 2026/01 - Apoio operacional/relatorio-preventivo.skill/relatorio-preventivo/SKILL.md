---
name: relatorio-preventivo
description: >
  Skill para automatizar as etapas do relatório fotográfico de vistoria preventiva (Caixa Econômica Federal / contratos de manutenção). Use este skill sempre que o usuário mencionar: relatório preventivo, memorial de cálculo, memorial final, memorial de itens, levantamento preventivo, extrair itens de relatório, verificar divergências de relatório, verificar legendas de fotos, ou qualquer etapa do fluxo de relatório fotográfico. Também ative quando o usuário carregar um .docx de relatório fotográfico e pedir qualquer processamento.

  Etapas cobertas pelo skill:
  1. Extrair lista de itens por código → Excel (.xlsx) com aba completa + aba consolidada
  2. Gerar memorial final → Word (.docx) com formatação padrão exata
  3. Verificar divergências → cruzar corpo do relatório vs memorial
  4. Verificar legendas de fotos → sequência e consistência com tabelas
---

# Relatório Fotográfico Preventivo — Skill de Automação

## Visão geral

Este skill automatiza o processamento de relatórios fotográficos de vistoria preventiva. O relatório é um arquivo `.docx` com fotos, descrições e tabelas de cálculo por item. O fluxo completo tem 4 etapas que podem ser executadas juntas ou individualmente.

**Dependências:** `pandoc`, `python-docx`, `openpyxl`, `lxml` (instalar com `pip install python-docx openpyxl lxml --break-system-packages` se ausentes).

---

## Etapa 0 — Preparar o arquivo

Sempre que receber um `.docx` de relatório:

```bash
pandoc "arquivo.docx" -o output_relatorio.md --track-changes=all
```

Salve o markdown em `/sessions/.../output_relatorio.md`. Todas as etapas seguintes leem esse arquivo.

Identifique a linha onde começa o memorial final (se já houver um):
```python
memorial_start = next((i for i, l in enumerate(lines) if 'Memorial de cálculo' in l and i > 2000), None)
body_lines = lines[:memorial_start] if memorial_start else lines
```

---

## Etapa 1 — Extrair lista de itens (Excel)

Execute `scripts/extrair_itens.py` passando o path do markdown:

```bash
python3 scripts/extrair_itens.py output_relatorio.md saida_itens.xlsx
```

O script gera duas abas:
- **Lista Completa**: todos os itens na ordem de aparição no relatório
- **Consolidado**: um item por código, com quantidades somadas

Salve o `.xlsx` na pasta do usuário.

---

## Etapa 2 — Gerar memorial final (Word)

Execute `scripts/gerar_memorial.py` passando o markdown e o path de saída:

```bash
python3 scripts/gerar_memorial.py output_relatorio.md Memorial_Final.docx
```

Depois, **sempre** execute o fixador de XML:

```bash
python3 scripts/fix_xml.py Memorial_Final.docx
```

E valide (se o validador estiver disponível):
```bash
python3 /path/to/docx/scripts/office/validate.py Memorial_Final.docx
```

Salve o `.docx` na pasta do usuário.

### Formatação padrão (não alterar)

| Elemento | Especificação |
|---|---|
| Fonte | Calibri 9pt nas tabelas de cálculo; Aptos Narrow na tabela Itens |
| Título da tabela (linha 0) | Fundo `808080`, texto preto bold, centralizado |
| Cabeçalho (REFERÊNCIA, LARGURA…) | Sem fundo, texto preto bold, centralizado |
| Linhas de dados | Sem fundo, texto preto normal, centralizado |
| Subtotal | Fundo `AEAAAA`, cols 0-2 mescladas (label) \| col DESCONTO branco `FFFFFF` \| col TOTAL sem fundo |
| Total | Fundo `AEAAAA` em todas as colunas, label + valor |
| Tabela Itens — cabeçalho "Itens" | Fundo `808080`, Aptos Narrow bold, células mescladas |
| Tabela Itens — linha de dados | Sem fundo, código centralizado, descrição centralizada |
| Altura linhas título/cabeçalho | 280 twips (14pt) |
| Altura linhas de dados | 240 twips (12pt) |
| Espaço entre tabela cálculo → Itens | Parágrafo: `before=40, after=40` twips |
| Espaço após tabela Itens | Parágrafo: `after=120` twips |

### Larguras de coluna

| Tipo de tabela | Larguras (cm) |
|---|---|
| 5 colunas (full: com DESCONTO) | 7,0 \| 2,0 \| 2,0 \| 2,5 \| 2,5 |
| 4 colunas (nodiscount: sem DESCONTO) | 8,5 \| 2,3 \| 2,3 \| 2,9 |
| 2 colunas (simple: por unidade) | 12,5 \| 3,5 |
| Tabela Itens | 1,5 \| 11,0 \| 2,0 \| 1,5 |

### Tipos de total (replicar fielmente do corpo)

- `Total` — padrão
- `Total (DIVIDIDO POR 10)` — itens de remoção com caçamba (2.18), retirada de piso (2.12), remoção de adesivos (29.24) etc.
- `Total (X3)` — quando há 3 unidades idênticas
- `Total (x6)` — quando há 6 unidades idênticas

### Consolidação por código

O memorial junta **todas as ocorrências** do mesmo código espalhadas pelo corpo do relatório em uma única tabela de cálculo. O total consolidado = soma de todos os totais individuais de cada ocorrência.

---

## Etapa 3 — Verificar divergências

Execute `scripts/verificar_divergencias.py` passando o markdown:

```bash
python3 scripts/verificar_divergencias.py output_relatorio.md
```

O script cruza três camadas:
1. Totais das tabelas de cálculo do corpo
2. Totais das tabelas Itens do corpo
3. Totais das tabelas Itens do memorial

Reporta qualquer diferença de quantidade (tolerância: 0,01) ou unidade.

---

## Etapa 4 — Verificar legendas de fotos

Execute `scripts/verificar_legendas.py` passando o markdown:

```bash
python3 scripts/verificar_legendas.py output_relatorio.md
```

O script verifica:
- Sequência contínua de Foto 1 a Foto N (sem lacunas)
- Ausência de legendas duplicadas
- Todas as fotos referenciadas nas tabelas possuem legenda no documento
- Todos os intervalos `Foto X a Y` nas tabelas estão cobertos

---

## Fluxo completo recomendado

```
1. Receber .docx do relatório
2. Converter para markdown (pandoc)
3. [Opcional] Extrair itens → Excel
4. Gerar memorial final → Word + fix_xml
5. Validar o .docx gerado
6. Verificar divergências
7. Verificar legendas de fotos
8. Salvar todos os arquivos na pasta do usuário
```

---

## Saída para o usuário

Sempre salve os arquivos na pasta montada do usuário (ex: `mnt/- Envio portal/`).
Apresente com `present_files` se disponível.
Reporte o resultado das verificações de forma clara:
- ✅ para itens sem problemas
- ❌ para divergências encontradas, com detalhe do que diverge
