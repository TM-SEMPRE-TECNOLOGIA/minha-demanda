# -*- coding: utf-8 -*-
"""Extrai o objeto DADOS (secoes/itens/prefixos) dos HTMLs originais dos memoriais
e gera um JSON consolidado para embutir no protótipo do Hub de Contratos."""
import json, os, re, sys

BASE = r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/01 - Apoio operacional/Itens por contrato - HTML (Pintura Destacada)"
OUT = r"C:/Users/thiag/Desktop/Minha Demanda/1 - Preventivas 2026/01 - Apoio operacional/HUB CONTRATOS - PROTOTIPOS/dados-contratos.json"

ARQUIVOS = [
    "0908_SAO_PAULO_memorial_itens.html",
    "1507_CUIABA_memorial_itens.html",
    "1565_SJRP_memorial_itens.html",
    "2056_DIVINOPOLIS_memorial_itens.html",
    "2057_VARGINHA_memorial_itens.html",
    "2626_SALINAS_memorial_itens.html",
    "2627_VALADARES_memorial_itens.html",
    "3575_TANGARA_memorial_itens.html",
    "6122_MS_memorial_itens.html",
]

def extrair_dados(texto):
    """Extrai o objeto JSON após 'const DADOS = ' com balanceamento de chaves,
    respeitando strings e escapes."""
    m = re.search(r"const\s+DADOS\s*=\s*\{", texto)
    if not m:
        raise ValueError("DADOS nao encontrado")
    i = m.end() - 1  # posicao da primeira '{'
    prof = 0
    j = i
    n = len(texto)
    in_str = False
    esc = False
    while j < n:
        c = texto[j]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == "{":
                prof += 1
            elif c == "}":
                prof -= 1
                if prof == 0:
                    break
        j += 1
    if prof != 0:
        raise ValueError("chaves nao balanceadas")
    bloco = texto[i:j+1]
    return json.loads(bloco)

def main():
    consolidado = {}
    resumo = []
    total_chars = 0
    for nome in ARQUIVOS:
        caminho = os.path.join(BASE, nome)
        raw = open(caminho, "r", encoding="utf-8", errors="replace").read()
        dados = extrair_dados(raw)
        codigo = dados.get("codigo", nome[:4])
        secoes = dados.get("secoes", [])
        prefixos = dados.get("prefixos", [])
        n_itens = sum(len(s.get("itens", [])) for s in secoes)
        # Compacta: mantém apenas campos essenciais
        compact = {
            "codigo": dados.get("codigo", codigo),
            "nome": dados.get("nome", ""),
            "lote": dados.get("lote", ""),
            "bdi": dados.get("bdi", ""),
            "desconto": dados.get("desconto", ""),
            "proponente": dados.get("proponente", ""),
            "secoes": [{ "codigo": s.get("codigo"), "nome": s.get("nome"),
                          "itens": [{"item": i.get("item"), "descricao": i.get("descricao"),
                                      "unidade": i.get("unidade")} for i in s.get("itens", [])] }
                        for s in secoes],
            "prefixos": prefixos,
        }
        consolidado[codigo] = compact
        total_chars += len(json.dumps(compact, ensure_ascii=False))
        resumo.append(f"{codigo} | {dados.get('nome','')} | secoes: {len(secoes)} | itens: {n_itens} | agencias: {len(prefixos)}")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(consolidado, f, ensure_ascii=False, separators=(",", ":"))

    print("\n".join(resumo))
    print(f"\nJSON: {OUT}  ({os.path.getsize(OUT)} bytes, ~{total_chars//1024} KB)")

if __name__ == "__main__":
    main()
