from __future__ import annotations

import csv
import datetime as dt
import os
import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

import pandas as pd
from docx import Document


CODE_RE = re.compile(r"^\s*(\d{1,3}(?:\.\d{1,3})?)\s*$")
# number like 729,60 or 6.00 or 57
NUM_RE = re.compile(r"(?<!\d)(\d{1,9}(?:[\.,]\d{1,4})?)(?!\d)")


def _norm_header(s: str) -> str:
    s = str(s or "").strip().upper()
    s = re.sub(r"\s+", " ", s)
    s = s.replace(".", "")
    s = s.replace(":", "")
    return s


def _to_code(value) -> Optional[str]:
    if value is None:
        return None
    # Excel sometimes provides float for codes like 2.21
    if isinstance(value, (int, float)) and not pd.isna(value):
        # Keep as string with possible decimals, but avoid scientific notation
        s = f"{value}".strip()
    else:
        s = str(value).strip()
    if not s:
        return None
    # remove trailing .0 if present
    if re.fullmatch(r"\d+\.0", s):
        s = s[:-2]
    # normalize decimal separator in code is '.'
    s = s.replace(",", ".")
    m = CODE_RE.match(s)
    return m.group(1) if m else None


def _to_number(text: str) -> Optional[float]:
    if text is None:
        return None
    s = str(text).strip()
    if not s:
        return None
    m = NUM_RE.search(s)
    if not m:
        return None
    num = m.group(1).replace(".", "").replace(",", ".") if "," in m.group(1) else m.group(1)
    # If number contains both separators in weird ways, fallback simple replace
    try:
        return float(num)
    except ValueError:
        try:
            return float(m.group(1).replace(",", "."))
        except ValueError:
            return None


def detect_excel_header_row(excel_path: str, sheet_name: str = "RAT", scan_rows: int = 80) -> int:
    """Try to find the header row by scanning for a row containing something like ITEM and QTD."""
    preview = pd.read_excel(excel_path, sheet_name=sheet_name, header=None, nrows=scan_rows)
    for idx, row in preview.iterrows():
        cells = [_norm_header(c) for c in row.tolist()]
        has_item = any(c in {"ITEM", "ITENS", "COD", "CODIGO", "CÓD", "CÓDIGO"} or "ITEM" == c for c in cells)
        has_qtd = any("QTD" == c or "QTDE" == c or "QUANTIDADE" == c or c.startswith("QTD") for c in cells)
        if has_item and has_qtd:
            return int(idx)
    # fallback: many sheets use row 18 (skiprows=17)
    return 17


def find_budget_columns(df: pd.DataFrame) -> Tuple[str, str]:
    cols = list(df.columns)
    norm = {_norm_header(c): c for c in cols}

    # item column
    item_candidates = [
        "ITEM",
        "ITENS",
        "COD",
        "CODIGO",
        "CÓD",
        "CÓDIGO",
    ]
    item_col = None
    for cand in item_candidates:
        if cand in norm:
            item_col = norm[cand]
            break

    # quantity column
    qtd_candidates = [
        "QTD",
        "QTD ",
        "QTD.",
        "QTDE",
        "QUANTIDADE",
    ]
    qtd_col = None
    for cand in qtd_candidates:
        if cand in norm:
            qtd_col = norm[cand]
            break
    if qtd_col is None:
        # try partial match
        for k, v in norm.items():
            if k.startswith("QTD"):
                qtd_col = v
                break

    if item_col is None or qtd_col is None:
        # last resort: pick columns by content
        # item: column with most code-like values
        best_item = (None, -1)
        best_qtd = (None, -1)
        for c in cols:
            s = df[c].dropna().astype(str).head(200)
            code_hits = sum(1 for x in s if _to_code(x) is not None)
            num_hits = sum(1 for x in s if _to_number(x) is not None)
            if code_hits > best_item[1]:
                best_item = (c, code_hits)
            if num_hits > best_qtd[1]:
                best_qtd = (c, num_hits)
        item_col = item_col or best_item[0]
        qtd_col = qtd_col or best_qtd[0]

    if item_col is None or qtd_col is None:
        raise ValueError("Não foi possível identificar as colunas de ITEM e QTD no orçamento.")

    return item_col, qtd_col


def load_budget_items(excel_path: str, sheet_name: str = "RAT") -> Dict[str, float]:
    header_row = detect_excel_header_row(excel_path, sheet_name=sheet_name)
    df = pd.read_excel(excel_path, sheet_name=sheet_name, header=header_row)
    item_col, qtd_col = find_budget_columns(df)

    items: Dict[str, float] = {}
    for _, row in df.iterrows():
        code = _to_code(row.get(item_col))
        if not code:
            continue
        qty_raw = row.get(qtd_col)
        if qty_raw is None or (isinstance(qty_raw, float) and pd.isna(qty_raw)):
            continue
        try:
            qty = float(qty_raw)
        except Exception:
            qty = _to_number(str(qty_raw))
            if qty is None:
                continue
        items[code] = float(qty)

    return items


def _choose_code_and_qty_columns(rows: List[List[str]]) -> Tuple[int, int]:
    """Given a list of rows (already split into columns), infer which col is code and which col is quantity."""
    if not rows:
        return 0, 0
    ncols = max(len(r) for r in rows)
    scores_code = [0] * ncols
    scores_qty = [0] * ncols

    for r in rows:
        for i in range(ncols):
            val = r[i] if i < len(r) else ""
            if _to_code(val) is not None:
                scores_code[i] += 1
            # quantity: prefer cells that are basically a number (not many extra chars)
            m = NUM_RE.fullmatch(val.strip().replace(" ", ""))
            if m:
                scores_qty[i] += 2
            elif _to_number(val) is not None:
                scores_qty[i] += 1

    code_col = int(max(range(ncols), key=lambda i: scores_code[i]))
    qty_col = int(max(range(ncols), key=lambda i: scores_qty[i]))
    # avoid picking same column
    if qty_col == code_col and ncols > 1:
        # pick next best qty col
        ranked = sorted(range(ncols), key=lambda i: scores_qty[i], reverse=True)
        for i in ranked:
            if i != code_col:
                qty_col = int(i)
                break
    return code_col, qty_col


def load_report_items(docx_path: str) -> Dict[str, float]:
    """Extract items ONLY from the 'Itens' tables in the report docx."""
    doc = Document(docx_path)
    agg: Dict[str, float] = {}

    for table in doc.tables:
        # capture raw table rows
        raw_rows: List[List[str]] = []
        for row in table.rows:
            raw_rows.append([cell.text.strip() for cell in row.cells])

        # Identify item tables: first row contains 'Itens' (merged header) or any cell equals 'Itens'
        header_text = " ".join(raw_rows[0]).strip().lower() if raw_rows else ""
        if "itens" not in header_text:
            continue

        # ignore header rows (those containing only 'itens')
        data_rows = [r for r in raw_rows[1:] if any(x.strip() for x in r)]
        if not data_rows:
            continue

        code_col, qty_col = _choose_code_and_qty_columns(data_rows)

        for r in data_rows:
            code = _to_code(r[code_col]) if code_col < len(r) else None
            if not code:
                # sometimes code is in another column due to merges; try any cell
                for cell in r:
                    code = _to_code(cell)
                    if code:
                        break
            if not code:
                continue

            qty_cell = r[qty_col] if qty_col < len(r) else ""
            qty = _to_number(qty_cell)
            if qty is None:
                # fallback: find a good numeric in the row that is not the code
                candidates = []
                for j, cell in enumerate(r):
                    if j == code_col:
                        continue
                    val = _to_number(cell)
                    if val is not None:
                        candidates.append(val)
                qty = candidates[-1] if candidates else None
            if qty is None:
                continue

            agg[code] = float(agg.get(code, 0.0) + float(qty))

    return agg


@dataclass
class CompareRow:
    item: str
    qtd_relatorio: Optional[float]
    qtd_orcamento: Optional[float]
    status: str
    diferenca: Optional[float]


def compare_items(
    report_items: Dict[str, float],
    budget_items: Dict[str, float],
    tolerance: float = 0.01,
) -> List[CompareRow]:
    codes = sorted(set(report_items) | set(budget_items), key=_sort_code)
    out: List[CompareRow] = []

    for code in codes:
        r = report_items.get(code)
        b = budget_items.get(code)

        if r is None and b is not None:
            out.append(CompareRow(code, None, b, "Não citado no relatório", None))
            continue
        if r is not None and b is None:
            out.append(CompareRow(code, r, None, "Não previsto no orçamento", None))
            continue

        # both present
        assert r is not None and b is not None
        diff = float(r - b)
        status = "Compatível" if abs(diff) <= tolerance else "Divergente"
        out.append(CompareRow(code, r, b, status, diff))

    return out


def _sort_code(code: str) -> Tuple[int, int, str]:
    # Sort numerically: 2.12 < 11.3 < 17.1 < 29.6 etc.
    parts = code.split(".")
    a = int(parts[0]) if parts[0].isdigit() else 10**9
    b = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else -1
    return (a, b, code)


def summarize(rows: List[CompareRow]) -> Dict[str, int]:
    summary = {
        "total": len(rows),
        "compatível": 0,
        "divergente": 0,
        "não citado no relatório": 0,
        "não previsto no orçamento": 0,
    }
    for r in rows:
        s = r.status.lower()
        if "compat" in s:
            summary["compatível"] += 1
        elif "diverg" in s:
            summary["divergente"] += 1
        elif "não citado" in s:
            summary["não citado no relatório"] += 1
        elif "não previsto" in s:
            summary["não previsto no orçamento"] += 1
    return summary


def write_outputs(
    output_dir: str,
    report_path: str,
    budget_path: str,
    rows: List[CompareRow],
) -> Tuple[str, str]:
    os.makedirs(output_dir, exist_ok=True)
    stamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    log_path = os.path.join(output_dir, f"comparacao_{stamp}.log.txt")
    csv_path = os.path.join(output_dir, f"comparacao_{stamp}.csv")

    summ = summarize(rows)

    # TXT log
    with open(log_path, "w", encoding="utf-8") as f:
        f.write("COMPARAÇÃO DE ITENS (RELATÓRIO x ORÇAMENTO)\n")
        f.write(f"Data/Hora: {dt.datetime.now().isoformat(sep=' ', timespec='seconds')}\n")
        f.write(f"Relatório: {report_path}\n")
        f.write(f"Orçamento: {budget_path}\n")
        f.write("\nRESUMO\n")
        f.write(f"- Total de linhas comparadas: {summ['total']}\n")
        f.write(f"- Compatíveis: {summ['compatível']}\n")
        f.write(f"- Divergentes: {summ['divergente']}\n")
        f.write(f"- Só no orçamento (não citado no relatório): {summ['não citado no relatório']}\n")
        f.write(f"- Só no relatório (não previsto no orçamento): {summ['não previsto no orçamento']}\n")

        f.write("\nDETALHAMENTO\n")
        f.write("Item\tQtdRelatorio\tQtdOrcamento\tDiferenca\tStatus\n")
        for r in rows:
            qr = "" if r.qtd_relatorio is None else f"{r.qtd_relatorio:.2f}".replace(".", ",")
            qb = "" if r.qtd_orcamento is None else f"{r.qtd_orcamento:.2f}".replace(".", ",")
            df = "" if r.diferenca is None else f"{r.diferenca:.2f}".replace(".", ",")
            f.write(f"{r.item}\t{qr}\t{qb}\t{df}\t{r.status}\n")

    # CSV
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["Item", "Qtd_relatorio", "Qtd_orcamento", "Diferenca", "Status"])
        for r in rows:
            w.writerow([
                r.item,
                "" if r.qtd_relatorio is None else f"{r.qtd_relatorio:.2f}".replace(".", ","),
                "" if r.qtd_orcamento is None else f"{r.qtd_orcamento:.2f}".replace(".", ","),
                "" if r.diferenca is None else f"{r.diferenca:.2f}".replace(".", ","),
                r.status,
            ])

    return log_path, csv_path
