# Comparador de Itens (Relatório x Orçamento) — Tkinter

Aplicativo local (Windows) para **comparar diretamente `ITEM` e `QTD`**:
- **Relatório (DOCX):** lê **somente as tabelas “Itens”** do relatório e extrai `código do item` + `quantidade`.
- **Orçamento (XLSX):** lê a aba `RAT` e extrai `ITEM` + `QTD.` (detecta automaticamente a linha de cabeçalho).
- Gera a mesma saída em tabela (Item | Qtd. relatório | Qtd. orçamento | Status) e cria:
  - **LOG detalhado** (`output/comparacao_YYYYMMDD_HHMMSS.log.txt`)
  - **CSV** (`output/comparacao_YYYYMMDD_HHMMSS.csv`)

## Requisitos
- Windows 10/11
- Python 3.10+ instalado e no PATH

## Como executar
1. Extraia a pasta do projeto.
2. Dê duplo clique em **`run_app.bat`**.
   - Ele cria um ambiente virtual (`.venv`) na primeira execução.
   - Instala dependências e abre o app.
3. No app:
   - Selecione o **Relatório (DOCX)**
   - Selecione o **Orçamento (XLSX)**
   - Clique em **Comparar**

A saída aparece em tabela e os arquivos ficam em `output/`.

## Como o comparador decide o que é “tabela de itens” no relatório
O app percorre as tabelas do DOCX e só considera aquelas em que a primeira linha contém o texto **“Itens”**.
Dentro de cada tabela, ele identifica automaticamente:
- a coluna com mais valores do tipo **código de item** (ex.: `17.11`, `2.21`, `29.6`)
- a coluna com mais valores numéricos (quantidade)

## Status
- **Compatível**: as quantidades batem (tolerância ±0,01)
- **Divergente**: quantidades diferentes
- **Não citado no relatório**: item existe no orçamento mas não aparece nas tabelas de itens do relatório
- **Não previsto no orçamento**: item existe no relatório mas não está no orçamento

## Estrutura
- `app.py` — Interface Tkinter (seleção de arquivos, tabela de resultados)
- `comparer.py` — Extração/normalização/comparação + geração de log e CSV
- `requirements.txt` — Dependências
- `run_app.bat` — Execução simples (cria venv + instala deps + roda)

## Notas
- Se o Excel tiver nomes diferentes para as colunas, o app tenta inferir automaticamente.
- Se o relatório tiver itens com números na **descrição** (ex.: `1,5 x 1,5`), o app prioriza a coluna inferida como quantidade.

