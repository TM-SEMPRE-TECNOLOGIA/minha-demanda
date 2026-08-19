# -*- coding: utf-8 -*-
"""Consulta card 14b16abc e imprime os PRIMEIROS comentarios (contexto inicial)."""
import json, os, urllib.request

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
    for line in lines[idx:idx + 8]:
        if "Authorization" in line and ":" in line:
            raw = line.split(":", 1)[1].strip()
            parts = raw.split(None, 1)
            return parts[1] if len(parts) == 2 else raw

def mcp_call(token, name, arguments):
    payload = json.dumps({"jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": name, "arguments": arguments}}).encode("utf-8")
    req = urllib.request.Request(API + "/api/mcp", data=payload, method="POST",
        headers={"Authorization": "Bearer " + token, "Content-Type": "application/json",
                 "Accept": "application/json, text/event-stream"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        return resp.status, resp.read().decode("utf-8", "replace")

token = get_token()
st, corpo = mcp_call(token, "get_card", {"id": CARD_ID})
resp = json.loads(corpo)
data = json.loads(resp["result"]["content"][0]["text"])
comments = data.get("comments", [])
print("TOTAL COMENTARIOS:", len(comments))
for c in comments[:10]:
    print("\n---", c["createdAt"], "|", c.get("authorName"), "---")
    print(c["body"][:1800])
