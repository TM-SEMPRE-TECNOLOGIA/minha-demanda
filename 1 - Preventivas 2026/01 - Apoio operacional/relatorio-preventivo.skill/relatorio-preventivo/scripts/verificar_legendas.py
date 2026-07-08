"""
verificar_legendas.py — Etapa 4: verifica sequência e consistência das legendas.
Uso: python3 verificar_legendas.py <input.md>
"""
import sys
import os
import re
sys.path.insert(0, os.path.dirname(__file__))

from parse_report import find_memorial_start


def expand_range(ref):
    """'Foto 2 a 5' -> {2,3,4,5} | 'Foto 3 e 7' -> {3,7} | 'Foto 5' -> {5}"""
    nums = re.findall(r'\d+', ref)
    if not nums:
        return set()
    if len(nums) == 1:
        return {int(nums[0])}
    if ' a ' in ref.lower():
        return set(range(int(nums[0]), int(nums[-1]) + 1))
    return {int(n) for n in nums}


def main(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix: skip TOC entry, find the real section
    idx = 0
    while True:
        pos = content.find("- Memorial de cálculo e itens:", idx)
        if pos == -1: break
        if pos > 50000: memorial_pos = pos; break
        idx = pos + 1
    else:
        memorial_pos = -1
    # memorial_pos = content.find('- Memorial de cálculo e itens:')
    body = content[:memorial_pos] if memorial_pos > 0 else content
    body_lines = body.split('\n')

    # Todas as ocorrências de "Foto N" no corpo
    all_fotos = set()
    for m in re.finditer(r'Foto\s+(\d+)', body):
        all_fotos.add(int(m.group(1)))

    if not all_fotos:
        print('⚠️  Nenhuma legenda de foto encontrada no corpo do relatório.')
        return

    max_foto = max(all_fotos)

    # Verifica sequência contínua
    expected = set(range(1, max_foto + 1))
    missing  = expected - all_fotos

    # Legendas standalone duplicadas
    standalone = {}
    for i, line in enumerate(body_lines, 1):
        if re.match(r'^\s*Foto\s+\d+\s*$', line):
            n = int(re.search(r'\d+', line).group())
            standalone.setdefault(n, []).append(i)
    duplicates = {n: ls for n, ls in standalone.items() if len(ls) > 1}

    # Fotos referenciadas nas tabelas de cálculo
    table_fotos = set()
    range_issues = []
    for m in re.finditer(r'Foto\s+([\d\s,ae]+?)(?:\s{2,}|\s+\d+[,\.]\d+|\n)', body):
        ref = 'Foto ' + m.group(1).strip()
        fotos = expand_range(ref)
        table_fotos.update(fotos)

    # Intervalos "Foto X a Y" nas tabelas — verificar todos os números cobertos
    for m in re.finditer(r'Foto\s+(\d+)\s+a\s+(\d+)', body):
        start, end = int(m.group(1)), int(m.group(2))
        missing_in_range = [n for n in range(start, end + 1) if n not in all_fotos]
        if missing_in_range:
            range_issues.append((start, end, missing_in_range))

    table_fotos.discard(0)  # Foto 0 não existe
    not_captioned = table_fotos - all_fotos

    print('=' * 65)
    print('VERIFICAÇÃO DE LEGENDAS DE FOTOS')
    print('=' * 65)
    print(f'Total de fotos únicas: {len(all_fotos)} (Foto 1 a Foto {max_foto})')

    if missing:
        print(f'\n⚠️  Lacunas na sequência ({len(missing)} fotos):')
        print(f'   {sorted(missing)}')
    else:
        print(f'✅ Sequência completa de 1 a {max_foto} — sem lacunas')

    if duplicates:
        print(f'\n❌ Legendas DUPLICADAS ({len(duplicates)} fotos):')
        for n, ls in sorted(duplicates.items()):
            print(f'   Foto {n} aparece nas linhas {ls}')
    else:
        print('✅ Nenhuma legenda duplicada')

    if not_captioned:
        print(f'\n❌ Fotos referenciadas em tabelas MAS sem legenda ({len(not_captioned)}):')
        print(f'   {sorted(not_captioned)}')
    else:
        print('✅ Todas as fotos de tabelas possuem legenda no documento')

    if range_issues:
        print(f'\n❌ Intervalos com fotos faltando:')
        for start, end, miss in range_issues:
            print(f'   Foto {start} a {end}: faltam {miss}')
    else:
        print('✅ Todos os intervalos (Foto X a Y) estão cobertos')

    print('=' * 65)
    total_issues = len(missing) + len(duplicates) + len(not_captioned) + len(range_issues)
    if total_issues == 0:
        print('✅ Legendas OK — nenhum problema encontrado.')
    else:
        print(f'❌ {total_issues} tipo(s) de problema encontrado(s). Corrija antes de finalizar.')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Uso: python3 verificar_legendas.py <input.md>')
        sys.exit(1)
    main(sys.argv[1])
