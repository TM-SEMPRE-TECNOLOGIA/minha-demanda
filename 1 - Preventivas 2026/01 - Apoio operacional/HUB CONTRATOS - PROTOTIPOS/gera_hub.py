# -*- coding: utf-8 -*-
"""Gera hub-contratos-v2-maffeng.html: template + dados reais dos 9 contratos."""
import json, os

PASTA = r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/01 - Apoio operacional/HUB CONTRATOS - PROTOTIPOS"
TEMPLATE = os.path.join(PASTA, "template_hub.html")
DADOS = os.path.join(PASTA, "dados-contratos.json")
SAIDA = os.path.join(PASTA, "hub-contratos-v2-maffeng.html")

with open(TEMPLATE, "r", encoding="utf-8") as f:
    html = f.read()
with open(DADOS, "r", encoding="utf-8") as f:
    dados = json.load(f)

# Segurança: escapa </ dentro de strings para não quebrar o <script>
blob = json.dumps(dados, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")

if "__DADOS_REAIS__" not in html:
    raise SystemExit("ERRO: placeholder __DADOS_REAIS__ nao encontrado no template")

html = html.replace("__DADOS_REAIS__", blob)

with open(SAIDA, "w", encoding="utf-8") as f:
    f.write(html)

print(f"OK: {SAIDA} ({os.path.getsize(SAIDA)} bytes)")
