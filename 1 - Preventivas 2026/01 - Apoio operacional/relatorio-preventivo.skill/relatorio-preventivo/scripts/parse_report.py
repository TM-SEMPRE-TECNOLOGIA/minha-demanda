import re
import os
from collections import OrderedDict, defaultdict


def strip_bold(s):
    return re.sub(r'\*\*(.+?)\*\*', r'\1', s).strip()


def extract_code(title):
    m = re.search(r'(?:ITEM\s+)?(\d+\.\d+)', title, re.IGNORECASE)
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


def load_standard_items(path):
    """Lê Itens Reorganizado.md e retorna dict: code -> {'desc': str, 'unit': str}"""
    standards = {}
    if not os.path.exists(path):
        return standards
    try:
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                if '|' in line and not line.startswith('| ITEM') and '---' not in line:
                    parts = [p.strip() for p in line.split('|')]
                    if len(parts) >= 5:
                        code = parts[1]
                        desc = parts[2]
                        unit = parts[4]
                        if re.match(r'^\d+\.\d+$', code):
                            standards[code] = {'desc': desc, 'unit': unit}
    except Exception:
        pass
    return standards


def parse_calc_occurrences(lines):
    """
    Extrai todas as tabelas de cálculo do markdown (suporta grid tables).
    """
    occurrences = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if 'REFERÊNCIA' in line.upper() or 'REFERNCIA' in line.upper():
            # Cabeçalho da tabela encontrado
            # 1. Achar o título (subindo)
            title = ""
            code = None
            j = i - 1
            while j >= 0:
                row = lines[j].strip()
                if row.startswith('+') and (':' in row or '=' in row):
                    pass # separadores
                elif row.startswith('|'):
                    content = row.strip('|').strip()
                    if content and not ('REFER' in content.upper() or 'REFERN' in content.upper()):
                        title = content + " " + title
                        if not code: code = extract_code(content)
                elif not row:
                    if title: break # fim do bloco de título
                else:
                    # Pode ser um título fora da tabela
                    if not title:
                        title = row
                        code = extract_code(row)
                    break
                j -= 1
            
            title = strip_bold(title.strip())
            if not code: code = extract_code(title)
            
            if code:
                # 2. Identificar htype e col1_label
                hdr_parts = [strip_bold(c.strip()) for c in line.strip('|').split('|')]
                if 'DESCONTO' in line.upper():
                    htype = 'full'
                elif 'LARGURA' in line.upper() or 'COMPRIMENTO' in line.upper():
                    htype = 'nodiscount'
                else:
                    htype = 'simple'
                
                m = re.search(r'TOTAL\s*\(([^)]+)\)', line, re.IGNORECASE)
                total_unit = m.group(1) if m else 'm²'
                
                col1_label = 'LARGURA (m)'
                for p in hdr_parts:
                    if 'LARGURA' in p.upper() or 'COMPRIMENTO' in p.upper():
                        col1_label = p
                        break

                # 3. Extrair linhas de dados (descendo)
                rows = []
                total_label = 'Total'
                total_value = 0.0
                k = i + 1
                while k < len(lines):
                    r = lines[k].strip()
                    if not r: 
                        k += 1
                        continue
                    if r.startswith('+'):
                        if k + 1 < len(lines) and not lines[k+1].startswith('|'):
                            break
                        k += 1
                        continue
                    if r.startswith('|'):
                        row_parts = [strip_bold(c.strip()) for c in r.strip('|').split('|')]
                        # Limpar partes vazias no final se houver
                        while row_parts and not row_parts[-1]: row_parts.pop()
                        
                        if not row_parts:
                            k += 1
                            continue
                            
                        if row_parts[0].startswith('Total'):
                            total_label = normalize_label(row_parts[0])
                            # O valor total geralmente está na última coluna preenchida
                            nums = re.findall(r'\d+[,\.]\d+', r)
                            if nums:
                                total_value = float(nums[-1].replace(',', '.'))
                            k += 1
                            break
                        
                        if row_parts[0].startswith('Subtotal'):
                            k += 1
                            continue
                        
                        # Extrair valores numéricos da linha
                        nums = re.findall(r'\d+[,\.]\d+', r)
                        ref = row_parts[0]
                        
                        if htype == 'full' and len(nums) >= 4:
                            rows.append({'ref': ref, 'w': nums[0], 'h': nums[1],
                                         'd': nums[2], 't': nums[3]})
                        elif htype == 'full' and len(nums) == 3:
                            rows.append({'ref': ref, 'w': nums[0], 'h': nums[1],
                                         'd': '0,00', 't': nums[2]})
                        elif htype == 'nodiscount' and len(nums) >= 3:
                            rows.append({'ref': ref, 'w': nums[0], 'h': nums[1],
                                         't': nums[2]})
                        elif len(nums) >= 1:
                            rows.append({'ref': ref, 't': nums[-1]})
                    k += 1
                
                occurrences.append({
                    'title': title, 'code': code, 'htype': htype,
                    'col1_label': col1_label, 'total_unit': total_unit,
                    'rows': rows, 'total_label': total_label,
                    'total_value': total_value
                })
                i = k
                continue
        i += 1
    return occurrences


def parse_itens_tables(lines):
    """
    Extrai todas as tabelas 'Itens' do markdown.
    """
    items_info = {}
    items_total = defaultdict(float)
    i = 0
    while i < len(lines):
        if 'Itens' in strip_bold(lines[i]):
            j = i + 1
            while j < len(lines):
                row = lines[j].strip()
                if not row:
                    j += 1
                    continue
                if row.startswith('+'):
                    if j + 1 < len(lines) and not lines[j+1].startswith('|'):
                        break
                    j += 1
                    continue
                if row.startswith('|'):
                    parts = [strip_bold(c.strip()) for c in row.strip('|').split('|')]
                    if len(parts) >= 3 and re.match(r'^\d+\.\d+$', parts[0]):
                        code = parts[0]
                        desc = parts[1]
                        # Tentar pegar qty e unit das últimas colunas
                        try:
                            # Achar o primeiro valor numérico de trás pra frente
                            qty_idx = -2 if len(parts) >= 4 else -1
                            qty_str = parts[qty_idx]
                            nums = re.findall(r'\d+[,\.]\d+', qty_str)
                            qty = float(nums[0].replace(',', '.')) if nums else 0.0
                            unit = parts[-1] if len(parts) >= 4 else ""
                            
                            if code not in items_info or not items_info[code]['desc']:
                                items_info[code] = {'desc': desc, 'unit': unit}
                            items_total[code] += qty
                        except Exception:
                            pass
                j += 1
            i = j
            continue
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
