#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Inspeciona estrutura do JSON interno do card de46866b."""
import json

PATH = r"C:\Users\thiag\AppData\Local\hermes\profiles\design-tm\cache\terminal\hermes-results\call_01_hBuxAlqrdwYf41XaN7lb3366.txt"

with open(PATH, encoding="utf-8") as f:
    txt = f.read()

outer = json.loads(txt)
inner = json.loads(outer["result"])
print("INNER KEYS:", list(inner.keys()))
card = inner.get("card", {})
print("CARD KEYS:", list(card.keys()))
print("commentCount:", card.get("commentCount"))
c = inner.get("comments")
print("comments type:", type(c), "len:", len(c) if isinstance(c, list) else "n/a")
if isinstance(c, list) and c:
    print("first comment keys:", list(c[0].keys()))
