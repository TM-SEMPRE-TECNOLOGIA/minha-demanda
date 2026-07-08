"""
Correções cirúrgicas no RELATÓRIO FOTOGRÁFICO - LAMBARI - FINAL.docx
Usa zipfile + lxml para operar direto no XML, com total visibilidade.

Correções:
  C1 — Apagar "Isso não deve entrar" (item 1.4 Tampa cega)
  C2 — Corrigir descrição errada do item 7.2 (Pintura esmalte em porta - Sala vigilantes)
  C3 — Corrigir "sala do gerente" → "corredor de abastecimento" (item 11.1)
  C4 — Corrigir "sala do gerente" → "copa" (item 12.1)
"""
import zipfile, shutil, os, re
from lxml import etree
from copy import deepcopy
from datetime import datetime

SRC  = "RELATÓRIO FOTOGRÁFICO - LAMBARI - FINAL.docx"
DEST = "RELATÓRIO FOTOGRÁFICO - LAMBARI - CORRIGIDO.docx"
NS_W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'

def tag(local): return '{%s}%s' % (NS_W, local)

def get_full_text(p):
    return ''.join((t.text or '') for t in p.findall('.//{%s}t' % NS_W))

def set_run_text(p, new_text):
    """
    Substitui o conteúdo de texto do parágrafo preservando o primeiro run e seu estilo.
    Remove runs extras depois de ajustar o primeiro.
    """
    runs = p.findall('.//{%s}r' % NS_W)
    if not runs:
        # Sem runs: cria um novo
        r = etree.SubElement(p, tag('r'))
        t = etree.SubElement(r, tag('t'))
        t.text = new_text
        t.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')
        return

    # Zera todos os w:t de todos os runs
    for run in runs:
        for t_el in run.findall(tag('t')):
            run.remove(t_el)

    # Coloca o novo texto no primeiro run
    first_run = runs[0]
    t_new = etree.SubElement(first_run, tag('t'))
    t_new.text = new_text
    t_new.set('{http://www.w3.org/XML/1998/namespace}space', 'preserve')

    # Remove runs excedentes (mantém só o primeiro)
    for run in runs[1:]:
        p.remove(run)

def apply_corrections(xml_bytes):
    root = etree.fromstring(xml_bytes)
    body = root.find('.//{%s}body' % NS_W)

    corrections_done = []
    c3_done = False  # flag para distinguir 11.1 vs 12.1 (mesmo texto)

    # Coletar todos os parágrafos do body (recursivo, inclui tabelas)
    all_paragraphs = body.findall('.//{%s}p' % NS_W)

    for p in all_paragraphs:
        txt = get_full_text(p)

        # C1 — Apagar "Isso não deve entrar"
        if 'Isso não deve entrar' in txt or 'Isso n' in txt and 'deve entrar' in txt:
            parent = p.getparent()
            if parent is not None:
                parent.remove(p)
                corrections_done.append('C1 ✅ Removido "Isso não deve entrar"')
            continue

        # C2 — Corrigir descrição errada do item 7.2 (Pintura esmalte em porta - vigilantes)
        # Identificador: menciona sala de vigilantes + pintura acrílica + 17.11 e 13.12
        # E está DEPOIS do heading 7.2 (não é a descrição do 7.1)
        if ('sala de vigilantes' in txt and '17.11' in txt and '13.12' in txt
                and 'C2' not in [c[:2] for c in corrections_done]):
            # Só corrige a segunda ocorrência (a do item 7.2)
            if any('C2' not in c for c in corrections_done):
                # Verifica se já corrigimos a primeira (que era correta - o 7.1)
                # A lógica: a primeira descrição de vigilantes que aparecer é o 7.1 (correto), a segunda é o 7.2 (errado)
                already = sum(1 for c in corrections_done if 'vigilant' in c.lower())
                if already == 0:
                    corrections_done.append('vigilant_skip')  # pula a primeira
                    continue
                else:
                    nova_desc = (
                        "- Prezados, a porta da sala de vigilantes apresenta pintura desgastada e descascando. "
                        "É necessária a pintura esmalte para restaurar o acabamento e conservar o elemento. "
                        "(item 17.7 do contrato)"
                    )
                    set_run_text(p, nova_desc)
                    corrections_done.append('C2 ✅ Corrigida descrição 7.2 Pintura esmalte em porta (Sala vigilantes)')
                    continue

        # C3 — "sala do gerente" → "corredor de abastecimento" (item 11.1 — primeira ocorrência depois do 7.1)
        # C4 — "sala do gerente" → "copa" (item 12.1 — segunda ocorrência)
        if 'sala do gerente' in txt and '17.11' in txt and '13.12' in txt:
            if not c3_done:
                nova = txt.replace('sala do gerente', 'corredor de abastecimento')
                set_run_text(p, nova)
                corrections_done.append('C3 ✅ Corrigido "sala do gerente" → "corredor de abastecimento" (item 11.1)')
                c3_done = True
            else:
                nova = txt.replace(
                    'as paredes da sala do gerente apresentam sujidades e marcas de uso. '
                    'É necessária a pintura acrílica e o remanejamento mobiliário para restaurar o acabamento. '
                    '(itens 17.11 e 13.12 do contrato)',
                    'as paredes da copa apresentam sujidades e marcas de uso. '
                    'É necessária a pintura acrílica e o remanejamento mobiliário para restaurar o acabamento. '
                    '(itens 17.11 e 13.12 do contrato)'
                )
                set_run_text(p, nova)
                corrections_done.append('C4 ✅ Corrigido "sala do gerente" → "copa" (item 12.1)')

    # Limpar flag auxiliar do log
    corrections_done = [c for c in corrections_done if not c.startswith('vigilant_')]

    return etree.tostring(root, xml_declaration=True, encoding='UTF-8', standalone=True), corrections_done

def run():
    print(f"\n{'='*55}")
    print(f"CORREÇÕES — LAMBARI FINAL")
    print(f"{'='*55}")
    print(f"Fonte  : {SRC}")
    print(f"Destino: {DEST}")
    print()

    # Copia o arquivo para não tocar no original
    shutil.copy2(SRC, DEST)
    print(f"✅ Cópia criada: {DEST}")

    # Lê o docx como ZIP, aplica correções no XML, salva de volta
    with zipfile.ZipFile(SRC, 'r') as zin:
        xml_bytes = zin.read('word/document.xml')
        new_xml, log = apply_corrections(xml_bytes)

        # Reescreve o ZIP com o XML corrigido
        with zipfile.ZipFile(DEST, 'w', compression=zipfile.ZIP_DEFLATED) as zout:
            for item in zin.infolist():
                if item.filename == 'word/document.xml':
                    zout.writestr(item, new_xml)
                else:
                    zout.writestr(item, zin.read(item.filename))

    print(f"\nCorreções aplicadas:")
    for entry in log:
        print(f"  {entry}")

    if len(log) < 4:
        print(f"\n⚠️  Esperadas 4 correções, aplicadas {len(log)}. Verifique o log acima.")
    else:
        print(f"\n✅ Todas as 4 correções aplicadas com sucesso!")
    print(f"\nArquivo corrigido: {DEST}")
    print(f"{'='*55}\n")

if __name__ == '__main__':
    run()
