# -*- coding: utf-8 -*-
"""Inspeciona os HTMLs de itens por contrato: area de alerta, refs locais."""
import re, os, sys

base = r"C:\Users\thiag\Desktop\Minha Demanda\1 - Preventivas 2026\01 - Apoio operacional\Itens por contrato - HTML (Pintura Destacada)"
files = sorted(f for f in os.listdir(base) if f.endswith(".html"))
print("ARQUIVOS:", len(files))
for fn in files:
    path = os.path.join(base, fn)
    with open(path, encoding="utf-8", errors="replace") as f:
        html = f.read()
    alerts = re.findall(r'(?i)(alerta|alert|aviso|observa)', html)
    banners = re.findall(r'class="([^"]*(?:alert|aviso|banner|notice|warning)[^"]*)"', html, re.I)
    locais = re.findall(r'C:[/\\]Users', html)
    print(f"== {fn} | tam={len(html)} | alert_ocorr={len(alerts)} | classes_alert={sorted(set(banners))[:8]} | refs_locais={len(locais)}")
