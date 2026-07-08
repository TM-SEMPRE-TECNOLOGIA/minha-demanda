"""
Scanner XML completo do .docx — enxerga imagens em tabelas, cells e parágrafos
Usa zipfile + lxml, sem depender das abstrações do python-docx
"""
import zipfile
import json
from lxml import etree

DOCX_PATH = "RELATÓRIO FOTOGRÁFICO - LAMBARI - FINAL.docx"

# Namespaces do OOXML
NS = {
    'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
    'wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
    'a':  'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r':  'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'v':  'urn:schemas-microsoft-com:vml',
}

def has_image(element):
    """Retorna True se o elemento contém qualquer imagem (inline, anchor, vml)."""
    return (
        element.find('.//{%s}drawing' % NS['w']) is not None or
        element.find('.//{%s}pict'    % NS['w']) is not None or
        element.find('.//{%s}object'  % NS['w']) is not None
    )

def get_text(element):
    """Extrai texto de todos os w:t dentro do elemento."""
    parts = []
    for t in element.findall('.//{%s}t' % NS['w']):
        parts.append(t.text or '')
    return ''.join(parts).strip()

def classify(element, tag_local):
    """Retorna o tipo do elemento raiz."""
    if tag_local == 'p':
        if has_image(element):
            return 'IMAGE'
        txt = get_text(element)
        return 'TEXT' if txt else 'EMPTY'
    elif tag_local == 'tbl':
        return 'TABLE'
    elif tag_local == 'sdt':
        return 'SDT'
    return 'OTHER'

def walk_body(body):
    """Percorre todos os elementos do body, incluindo dentro de tabelas."""
    results = []
    idx = 0

    def process_paragraph(p, context=''):
        nonlocal idx
        kind = classify(p, 'p')
        txt = get_text(p) if kind == 'TEXT' else ''
        results.append({
            'idx': idx,
            'type': kind,
            'context': context,
            'text': txt[:120] if txt else '',
            'tag': 'w:p'
        })
        idx += 1

    def process_table(tbl, depth=0):
        nonlocal idx
        results.append({
            'idx': idx,
            'type': 'TABLE_START',
            'context': f'depth={depth}',
            'text': '',
            'tag': 'w:tbl'
        })
        idx += 1
        for row in tbl.findall('{%s}tr' % NS['w']):
            for cell in row.findall('{%s}tc' % NS['w']):
                for child in cell:
                    local = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                    if local == 'p':
                        process_paragraph(child, context=f'cell(depth={depth})')
                    elif local == 'tbl':
                        process_table(child, depth=depth+1)
        results.append({
            'idx': idx,
            'type': 'TABLE_END',
            'context': f'depth={depth}',
            'text': '',
            'tag': 'w:tbl'
        })
        idx += 1

    for child in body:
        local = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        if local == 'p':
            process_paragraph(child, context='body')
        elif local == 'tbl':
            process_table(child, depth=0)
        elif local == 'sdt':
            # structured document tag — processar conteúdo interno
            content = child.find('.//{%s}sdtContent' % NS['w'])
            if content is not None:
                for sc in content:
                    sl = sc.tag.split('}')[-1] if '}' in sc.tag else sc.tag
                    if sl == 'p':
                        process_paragraph(sc, context='sdt')
                    elif sl == 'tbl':
                        process_table(sc, depth=0)

    return results

def scan(docx_path):
    with zipfile.ZipFile(docx_path, 'r') as z:
        xml_bytes = z.read('word/document.xml')

    root = etree.fromstring(xml_bytes)
    body = root.find('.//{%s}body' % NS['w'])
    if body is None:
        raise ValueError("Não encontrei w:body no document.xml")

    return walk_body(body)

def print_map(results, filter_context=None, only_types=None):
    for r in results:
        if filter_context and filter_context not in r['context']:
            continue
        if only_types and r['type'] not in only_types:
            continue
        icon = {
            'IMAGE':       '📷',
            'TEXT':        '📝',
            'EMPTY':       '·',
            'TABLE_START': '┌─TABLE',
            'TABLE_END':   '└─/TABLE',
            'SDT':         '§',
            'OTHER':       '?',
        }.get(r['type'], '?')
        ctx = f" [{r['context']}]" if r['context'] not in ('body', '') else ''
        txt = f"  {r['text'][:80]}" if r['text'] else ''
        print(f"[{r['idx']:04d}] {icon}{ctx}{txt}")

if __name__ == '__main__':
    import sys
    results = scan(DOCX_PATH)

    total_imgs  = sum(1 for r in results if r['type'] == 'IMAGE')
    total_text  = sum(1 for r in results if r['type'] == 'TEXT')
    total_table = sum(1 for r in results if r['type'] == 'TABLE_START')
    total_empty = sum(1 for r in results if r['type'] == 'EMPTY')

    print(f"\n{'='*60}")
    print(f"SCANNER XML — LAMBARI FINAL")
    print(f"{'='*60}")
    print(f"Total elementos : {len(results)}")
    print(f"Imagens         : {total_imgs}")
    print(f"Textos          : {total_text}")
    print(f"Tabelas         : {total_table}")
    print(f"Vazios          : {total_empty}")
    print(f"{'='*60}\n")

    # Mostrar estrutura do segundo piso + áreas problemáticas
    in_scope = False
    for r in results:
        txt = r['text']
        if 'Segundo piso' in txt or 'vigilant' in txt or 'Copa 1' in txt or 'Corredor de abas' in txt:
            in_scope = True
        if in_scope:
            icon = {'IMAGE':'📷','TEXT':'📝','EMPTY':'·','TABLE_START':'┌TABLE','TABLE_END':'└TABLE'}.get(r['type'],'?')
            ctx = f"[{r['context']}]" if r['context'] != 'body' else ''
            txt_show = f"  {txt[:90]}" if txt else ''
            print(f"[{r['idx']:04d}] {icon} {ctx}{txt_show}")
        if in_scope and 'Resumo Geral' in r['text']:
            break

    # Salvar mapa completo em JSON
    with open('scanner_map.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n✅ Mapa completo salvo em scanner_map.json")
