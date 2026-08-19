# -*- coding: utf-8 -*-
"""Upload do hub-contratos-v2-maffeng.html com fluxo correto:
request_upload_url -> PUT binario -> register_file (intent valida)."""
import json, os, re, sys, urllib.request, urllib.error

API = "http://127.0.0.1:4000"
ARQUIVO = r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/01 - Apoio operacional/HUB CONTRATOS - PROTOTIPOS/hub-contratos-v2-maffeng.html"
CARD_ID = "de46866b-584f-4633-a3db-b38eac83a2a2"
PASTA = "Hub Contratos - Protótipos"

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
            if len(parts) == 2:
                return parts[1]
            return raw
    raise SystemExit("ERRO: token nao encontrado no bloco tm-mission-control")

def http(method, url, dados=None, headers=None, timeout=180):
    req = urllib.request.Request(url, data=dados, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")

def mcp_call(token, name, arguments):
    payload = json.dumps({
        "jsonrpc": "2.0", "id": 1, "method": "tools/call",
        "params": {"name": name, "arguments": arguments},
    }).encode("utf-8")
    return http("POST", API + "/api/mcp", payload, {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }, timeout=90)

def main():
    token = get_token()
    dados = open(ARQUIVO, "rb").read()
    print("Arquivo:", ARQUIVO, "| bytes:", len(dados))

    # 1) request_upload_url — cria a intent do actor
    st, corpo = mcp_call(token, "request_upload_url", {})
    print("REQUEST status:", st)
    if st != 200:
        print("REQUEST body:", corpo[:500])
        sys.exit(1)
    resp = json.loads(corpo)
    try:
        texto = resp["result"]["content"][0]["text"]
        info = json.loads(texto)
    except Exception:
        print("REQUEST parse falhou:", corpo[:800])
        sys.exit(1)
    upload_url = info.get("uploadURL") or info.get("uploadUrl")
    object_path = info.get("objectPath")
    print("uploadURL:", upload_url)
    print("objectPath:", object_path)
    if not upload_url or not object_path:
        print("REQUEST retorno inesperado:", texto[:800])
        sys.exit(1)

    # 2) PUT binario no uploadURL
    st, corpo = http("PUT", API + upload_url, dados, {"Content-Type": "text/html"})
    print("PUT:", st, corpo[:120])
    if st != 200:
        sys.exit(1)

    # 3) register_file com a intent valida
    st, corpo = mcp_call(token, "register_file", {
        "name": "hub-contratos-v2-maffeng.html",
        "mimeType": "text/html",
        "sizeBytes": len(dados),
        "objectPath": object_path,
        "folder": PASTA,
        "cardId": CARD_ID,
    })
    print("REGISTER status:", st)
    print("REGISTER body:", corpo[:800])
    if st != 200 or '"error"' in corpo:
        sys.exit(1)
    print("OK: arquivo registrado no card")

if __name__ == "__main__":
    main()
