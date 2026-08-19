# -*- coding: utf-8 -*-
"""Valida referencias .xlsx do hub em disco (strings completas)."""
import re, os

hub_path = r"C:\Users\thiag\Desktop\Minha Demanda\1 - Preventivas 2026\01 - Apoio operacional\HUB CONTRATOS - PROTOTIPOS\hub-contratos-v2-maffeng.html"
with open(hub_path, encoding='utf-8') as f:
    content = f.read()

# captura strings entre aspas que terminam em .xlsx
refs = sorted(set(re.findall(r'["\']([^"\']*\.xlsx)["\']', content)))
print("TOTAL REFS XLSX (strings completas):", len(refs))
for r in refs:
    print(" -", r)

docs = r"C:\Users\thiag\Desktop\Minha Demanda\1 - Preventivas 2026\02 - Documentos Preventivas"
print("\n=== EXISTENCIA EM DISCO ===")
for r in refs:
    base = r.replace("\\", "/").split("/")[-1].lower()
    found = None
    for root, dirs, files in os.walk(docs):
        for f in files:
            if f.lower().endswith('.xlsx') and base in f.lower():
                found = f
                break
        if found:
            break
    print((" OK  " if found else " FALTA"), r, "->", found if found else "")

# tambem arquivos mencionados fora de aspas (concatenados no JS) - pegar qualquer trecho com xlsx
all_tokens = re.findall(r'([^\s"\']+\.xlsx)', content)
print("\n=== TOKENS XLSX FORA DE ASPAS (amostra) ===")
for t in sorted(set(all_tokens))[:20]:
    print(" -", t)
