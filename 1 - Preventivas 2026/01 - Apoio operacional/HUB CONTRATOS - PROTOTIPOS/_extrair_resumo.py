#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrai resumo dos contratos do dados-contratos.json para o protótipo Biblioteca de Apps."""
import json, sys, os

BASE = r"C:\Users\thiag\Desktop\Minha Demanda\1 - Preventivas 2026\01 - Apoio operacional\HUB CONTRATOS - PROTOTIPOS"
SRC = os.path.join(BASE, "dados-contratos.json")

with open(SRC, encoding="utf-8") as f:
    data = json.load(f)

contratos = []
for cod in ["0908", "1507", "1565", "2056", "2057", "2626", "2627", "3575", "6122"]:
    c = data.get(cod)
    if not c:
        print(f"MISSING {cod}", file=sys.stderr)
        continue
    secoes = c.get("secoes", [])
    n_itens = sum(len(s.get("itens", [])) for s in secoes)
    contratos.append({
        "codigo": c.get("codigo", cod),
        "nome": c.get("nome", ""),
        "lote": c.get("lote", ""),
        "bdi": c.get("bdi"),
        "desconto": c.get("desconto"),
        "proponente": c.get("proponente", ""),
        "secoes": len(secoes),
        "itens": n_itens,
    })

out = {"_fonte": "dados-contratos.json (não inventado)", "contratos": contratos}
dest = os.path.join(BASE, "_resumo-contratos-prototipo.json")
with open(dest, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

for c in contratos:
    print(f"{c['codigo']} | {c['nome']} | lote={c['lote']!r} | secoes={c['secoes']} | itens={c['itens']}")
print("SALVO:", dest)
