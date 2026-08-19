# -*- coding: utf-8 -*-
"""PUT do hub-contratos-v2-maffeng.html no storage + register_file via MCP HTTP."""
import json, os, re, sys, urllib.request, urllib.error

API = "http://127.0.0.1:4000"
OBJECT = "/objects/23eaa0a6-aef8-40fd-8902-4a5e40b33153"
ARQUIVO = r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/01 - Apoio operacional/HUB CONTRATOS - PROTOTIPOS/hub-contratos-v2-maffeng.html"

def get_token():
    cfg = os.path.expanduser("~/AppData/Local/hermes/profiles/tm-orquestrador/config.yaml")
    with open(cfg, encoding="utf-8", errors="replace") as f:
        texto = f.read()
    m = re.search(r"tm-mission-control:.*?Authorization:\s*Bearer\s*([^\s]+)", texto, re.S)
    if not m:
        raise SystemExit("ERRO: token nao encontrado")
    return m.group(1)

def http(method, url, dados=None, headers=None, timeout=180):
    req = urllib.request.Request(url, data=dados, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")

def main():
    token = get_token()
    dados = open(ARQUIVO, "rb").read()

    # 1) PUT binário (capability pela URL — sem auth no putObject)
    st, corpo = http("PUT", API + "/api/storage" + OBJECT, dados, {"Content-Type": "text/html"})
    print("PUT:", st, corpo[:120])
    if st != 200:
        sys.exit(1)

    # 2) register_file via MCP HTTP (mesmo fluxo do mcp_call.sh)
    payload = json.dumps({
        "jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": "register_file", "arguments": {
            "name": "hub-contratos-v2-maffeng.html",
            "mimeType": "text/html",
            "sizeBytes": len(dados),
            "objectPath": OBJECT,
            "folder": "Hub Contratos - Protótipos",
            "cardId": "de46866b-584f-4633-a3db-b38eac83a2a2",
        }},
    }).encode("utf-8")
    st, corpo = http("POST", API + "/api/mcp", payload, {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }, timeout=90)
    print("REGISTER status:", st)
    print("REGISTER body:", corpo[:600])

if __name__ == "__main__":
    main()
