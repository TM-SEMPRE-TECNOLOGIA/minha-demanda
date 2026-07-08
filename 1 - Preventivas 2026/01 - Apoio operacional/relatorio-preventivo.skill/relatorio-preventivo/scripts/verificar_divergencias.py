"""
verificar_divergencias.py — Etapa 3: verifica divergências entre corpo e memorial.
Uso: python3 verificar_divergencias.py <input.md>
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from parse_report import (parse_calc_occurrences, parse_itens_tables,
                           consolidate_occurrences, find_memorial_start)
from collections import defaultdict


def main(md_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    memorial_start = find_memorial_start(lines)
    if memorial_start is None:
        print('⚠️  Memorial final não encontrado no documento.')
        print('   Execute gerar_memorial.py primeiro e cole o memorial no relatório.')
        return

    body_lines     = lines[:memorial_start]
    memorial_lines = lines[memorial_start:]

    # Corpo: totais das tabelas de cálculo
    body_occs = parse_calc_occurrences(body_lines)
    body_calc  = defaultdict(float)
    for occ in body_occs:
        body_calc[occ['code']] += occ['total_value']

    # Corpo: totais das tabelas Itens
    _, body_itens_total = parse_itens_tables(body_lines)

    # Memorial: totais das tabelas Itens
    memorial_info, memorial_itens_total = parse_itens_tables(memorial_lines)

    all_codes = sorted(set(
        list(body_calc.keys()) +
        list(body_itens_total.keys()) +
        list(memorial_itens_total.keys())
    ))

    divergencias = []
    ok = []

    for code in all_codes:
        bc  = round(body_calc.get(code, 0), 2)
        bi  = round(float(body_itens_total.get(code, 0)), 2)
        mi  = round(float(memorial_itens_total.get(code, 0)), 2)
        unit = memorial_info.get(code, {}).get('unit', '')
        issues = []

        if abs(bc - bi) > 0.01:
            issues.append(f'Cálculo corpo ({bc}) ≠ Itens corpo ({bi})')
        if abs(bc - mi) > 0.01:
            issues.append(f'Cálculo corpo ({bc}) ≠ Itens memorial ({mi})')
        if bi > 0 and mi > 0 and abs(bi - mi) > 0.01:
            issues.append(f'Itens corpo ({bi}) ≠ Itens memorial ({mi})')

        if issues:
            divergencias.append({'code': code, 'unit': unit, 'issues': issues})
        else:
            ok.append((code, bc, unit))

    print('=' * 65)
    print('VERIFICAÇÃO DE DIVERGÊNCIAS')
    print('=' * 65)
    for code, val, unit in ok:
        print(f'✅ {code:8} | {val:>8} {unit}')
    if divergencias:
        print()
        for d in divergencias:
            print(f'❌ {d["code"]:8} ({d["unit"]})')
            for iss in d['issues']:
                print(f'   → {iss}')
    print('=' * 65)
    print(f'OK: {len(ok)} itens  |  Divergências: {len(divergencias)} itens')

    if not divergencias:
        print('✅ Nenhuma divergência encontrada.')
    else:
        print('❌ Corrija as divergências acima antes de finalizar o relatório.')


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Uso: python3 verificar_divergencias.py <input.md>')
        sys.exit(1)
    main(sys.argv[1])
