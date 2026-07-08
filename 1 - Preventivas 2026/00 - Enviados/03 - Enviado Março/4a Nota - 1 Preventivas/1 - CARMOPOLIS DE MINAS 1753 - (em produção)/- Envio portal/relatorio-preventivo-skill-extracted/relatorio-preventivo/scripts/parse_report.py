"""
parse_report.py — shared parsing utilities for relatorio-preventivo skill.
Importado pelos outros scripts; não executar diretamente.
"""
import re
from collections import OrderedDict, defaultdict


def strip_bold(s):
    return re.sub(r'\*\*(.+?)\*\*', r'\1', s).strip()


def extract_code(title):
    m = re.search(r'\((?:ITEM\s+)?(\d+\.\d+)\)', title)
    return m.group(1) if m else None


def normalize_label(lbl):
    return re.sub(r'\s+[\d,\.]+\s*$', '', lbl).strip()


def extract_ref(row):
    m = re.match(r'^(Foto\s[\d\s,ae]+?)(?:\s{2,}|\s+\d+[,\.]\d+)', row.strip(), re.IGNORECASE)
    if m:
        return m.group(1).strip()
    m2 = re.match(r'^(.+?)(?:\s{3,}|\s+\d+[,\.]\d+)', row.strip())
    if m2:
        return m2.group(1).strip()
    return re.sub(r'[\d,\.]+.*', '', row).strip()


def fmt(v):
    return f"{v:.2f}".replace('.', ',')


def find_memorial_start(lines):
    """Retorna o índice da linha onde começa o memorial, ou None."""
    for i, line in enumerate(lines):
        if 'Memorial de cálculo' in line and i > 1000:
            return i
    return None


def parse_calc_occurrences(lines):
    """
    Extrai todas as tabelas de cálculo (com REFERÊNCIA) do markdown.
    Retorna lista de dicts com: title, code, htype, col1_label, total_unit,
    rows, total_label, total_value.
    """
    occurrences = []
    i = 0
    while i < len(lines):
        s = lines[i].rstrip().strip()
        stripped = strip_bold(s)
        if s.startswith('**') and s.endswith('**') and \
                '**REFERÊNCIA**' not in s and '**Itens**' not in s:
            code = extract_code(stripped)
            if code:
                title = stripped
                j = i + 1
                if j < len(lines) and lines[j].strip().startswith('---'):
                    j += 1
                if j < len(lines) and '**REFERÊNCIA**' in lines[j]:
                    hdr = lines[j].rstrip()
                    j += 1
                    if 'LARGURA' in hdr and 'DESCONTO' in hdr:
                        htype = 'full'
                    elif 'LARGURA' in hdr:
                        htype = 'nodiscount'
                    else:
                        htype = 'simple'
                    m = re.search(r'TOTAL\s*\(([^)]+)\)', hdr)
                    total_unit = m.group(1) if m else 'm²'
                    m2 = re.search(r'\*\*(LARGURA|COMPRIMENTO)\s*\(m\)\*\*', hdr)
                    col1_label = (m2.group(1) + ' (m)') if m2 else 'LARGURA (m)'
                    rows = []
                    total_label = 'Total'
                    total_value = None
                    while j < len(lines):
                        row = lines[j].rstrip()
                        rs = row.strip()
                        if not rs or rs.startswith('!') or rs.startswith('#') \
                                or rs.startswith('[') or rs.startswith('+'):
                            break
                        if rs.startswith('---'):
                            j += 1
                            continue
                        rc = strip_bold(rs)
                        nums = re.findall(r'\d+[,\.]\d+', rs)
                        if rc.startswith('Subtotal'):
                            j += 1
                            continue
                        if rc.startswith('Total'):
                            total_label = normalize_label(rc)
                            if nums:
                                total_value = float(nums[-1].replace(',', '.'))
                            j += 1
                            break
                        ref = extract_ref(rs)
                        if htype == 'full' and len(nums) >= 4:
                            rows.append({'ref': ref, 'w': nums[0], 'h': nums[1],
                                         'd': nums[2], 't': nums[3]})
                        elif htype == 'full' and len(nums) == 3:
                            rows.append({'ref': ref, 'w': nums[0], 'h': nums[1],
                                         'd': '0,00', 't': nums[2]})
                        elif htype == 'nodiscount' and len(nums) >= 3:
                            rows.append({'ref': ref, 'w': nums[0], 'h': nums[1],
                                         't': nums[2]})
                        elif len(nums) == 1:
                            rows.append({'ref': ref, 't': nums[0]})
                        j += 1
                    occurrences.append({
                        'title': title, 'code': code, 'htype': htype,
                        'col1_label': col1_label, 'total_unit': total_unit,
                        'rows': rows, 'total_label': total_label,
                        'total_value': total_value or 0.0
                    })
                    i = j
                    continue
        i += 1
    return occurrences


def parse_itens_tables(lines):
    """
    Extrai todas as tabelas 'Itens' do markdown.
    Retorna dict: code -> {'desc': str, 'unit': str, 'qty': float}
    (mantém apenas a primeira descrição encontrada por código)
    """
    items_info = {}
    items_total = defaultdict(float)
    i = 0
    while i < len(lines):
        if '**Itens**' in lines[i].strip():
            j = i + 1
            if j < len(lines) and lines[j].strip().startswith('---'):
                j += 1
            while j < len(lines):
                row = lines[j].strip()
                if not row or row.startswith('#') or row.startswith('**') \
                        or row.startswith('!') or row.startswith('-'):
                    break
                if row.startswith('---'):
                    j += 1
                    continue
                parts = row.split()
                if len(parts) >= 3 and re.match(r'^\d+\.\d+$', parts[0]):
                    try:
                        qty = float(parts[-2].replace(',', '.'))
                        unit = parts[-1]
                        desc = ' '.join(parts[1:-2])
                        code = parts[0]
                        if code not in items_info:
                            items_info[code] = {'desc': desc, 'unit': unit}
                        items_total[code] += qty
                    except Exception:
                        pass
                j += 1
        i += 1
    return items_info, items_total


def consolidate_occurrences(occurrences):
    """
    Agrupa ocorrências por código, acumulando rows e somando totais.
    Retorna OrderedDict mantendo ordem de primeira aparição.
    """
    consolidated = OrderedDict()
    for occ in occurrences:
        c = occ['code']
        if c not in consolidated:
            consolidated[c] = {
                'title': occ['title'], 'code': c,
                'htype': occ['htype'], 'col1_label': occ['col1_label'],
                'total_unit': occ['total_unit'],
                'rows': [], 'total_sum': 0.0, 'labels': set()
            }
        consolidated[c]['rows'].extend(occ['rows'])
        consolidated[c]['total_sum'] += occ['total_value']
        consolidated[c]['labels'].add(occ['total_label'])

    for c, d in consolidated.items():
        lbls = d['labels']
        if len(lbls) == 1:
            d['final_label'] = list(lbls)[0]
        elif all('DIVIDIDO POR 10' in l for l in lbls):
            d['final_label'] = 'Total (DIVIDIDO POR 10)'
        elif all('X3' in l.upper() for l in lbls):
            d['final_label'] = 'Total (X3)'
        elif all('X6' in l.upper() for l in lbls):
            d['final_label'] = 'Total (x6)'
        else:
            d['final_label'] = 'Total'

    return consolidated
