#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extrai comentários do card de46866b (JSON aninhado)."""
import json

PATH = r"C:\Users\thiag\AppData\Local\hermes\profiles\design-tm\cache\terminal\hermes-results\call_01_hBuxAlqrdwYf41XaN7lb3366.txt"

with open(PATH, encoding="utf-8") as f:
    txt = f.read()

outer = json.loads(txt)
inner = json.loads(outer["result"])
comments = inner.get("comments", [])
print("TOTAL:", len(comments))
for c in comments[-10:]:
    print("---", c.get("createdAt"), "|", c.get("authorName"))
    print(c.get("body", "")[:1100])
    print()
