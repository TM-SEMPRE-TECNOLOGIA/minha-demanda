"""
fix_xml.py — Corrige ordenação de elementos XML no .docx gerado pelo python-docx.
Deve ser executado APÓS gerar_memorial.py.
Uso: python3 fix_xml.py <arquivo.docx>
"""
import sys
import os
import zipfile
from lxml import etree

W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

# Ordem correta dos filhos de <w:tcPr> segundo o schema OOXML
TCPR_ORDER = [
    'cnfStyle', 'tcW', 'gridSpan', 'hMerge', 'vMerge',
    'tcBorders', 'shd', 'noWrap', 'tcMar', 'textDirection',
    'tcFitText', 'vAlign', 'hideMark'
]


def reorder_tcPr(tcPr):
    children = list(tcPr)
    ordered = []
    for name in TCPR_ORDER:
        for child in children:
            tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
            if tag == name:
                ordered.append(child)
    known = set(TCPR_ORDER)
    for child in children:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        if tag not in known:
            ordered.append(child)
    for child in children:
        tcPr.remove(child)
    for child in ordered:
        tcPr.append(child)


def fix_docx(path):
    tmp = path + '.tmp'
    with zipfile.ZipFile(path, 'r') as zin, \
         zipfile.ZipFile(tmp, 'w', zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)

            if item.filename == 'word/settings.xml':
                # Corrige atributo zoom ausente
                data = data.replace(
                    b'<w:zoom w:val="bestFit"/>',
                    b'<w:zoom w:percent="100"/>'
                )

            if item.filename == 'word/document.xml':
                root = etree.fromstring(data)
                for tcPr in root.iter(f'{{{W}}}tcPr'):
                    reorder_tcPr(tcPr)
                data = etree.tostring(
                    root, xml_declaration=True,
                    encoding='UTF-8', standalone=True
                )

            zout.writestr(item, data)

    os.replace(tmp, path)
    print(f'✅ XML corrigido: {path}')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Uso: python3 fix_xml.py <arquivo.docx>')
        sys.exit(1)
    fix_docx(sys.argv[1])
