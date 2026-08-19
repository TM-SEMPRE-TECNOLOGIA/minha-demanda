# -*- coding: utf-8 -*-
"""Consulta card 14b16abc (login) e imprime apenas comentarios recentes."""
import json, os, urllib.request, urllib.error

API = "http://127.0.0.1:4000"
CARD_ID = "14b16abc-d1a6-4827-b30e-186fa51f9b96"

def get_token():
    cfg = os.path.expanduser("~/AppData/Local/hermes/profiles/tm-orquestrador/config.yaml")
    with open(cfg, encoding="utf-8", errors="replace") as f:
        lines = f.readlines()
    idx = None
    for i, line in enumerate(lines):
        if "tm-mission-control" in line and ":" in line:
            idx = i
            break
    if idx is None:
        raise SystemExit("ERRO: bloco tm-mission-control nao encontrado")
    for line in lines[idx:idx + 8]:
        if "Authorization" in line and ":" in line:
            raw = line.split(":", 1)[1].strip()
            parts = raw.split(None, 1)
            return parts[1] if len(parts) == 2 else raw
    raise SystemExit("ERRO: token nao encontrado")

def mcp_call(token, name, arguments):
    payload = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": name, "arguments": arguments}}).encode("utf-8")
    req = urllib.request.Request(API + "/api/mcp", data=payload, method="POST",
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json",
                 "Accept": "application/json, text/event-stream"})
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return resp.status, resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")

token = get_token()
st, corpo = mcp_call(token, "get_card", {"id": CARD_ID})
print("status:", st)
if st != 200:
    print(corpo[:500])
else:
    try:
        resp = json.loads(corpo)
        texto = resp["result"]["content"][0]["text"]
        data = json.loads(texto)
        card = data["card"]
        print("TITULO:", card["title"])
        print("COLUNA:", card["columnId"], "| pos:", card["position"])
        comments = data.get("comments", [])
        print("TOTAL COMENTARIOS:", len(comments))
        for c in comments[-12:]:
            print("\n---", c["createdAt"], "|", c.get("authorName"), "---")
            print(c["body"][:2000])
    except Exception as e:
        print("parse falhou:", e)
        print(corpo[:1500])
