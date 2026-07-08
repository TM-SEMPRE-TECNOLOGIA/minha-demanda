# auto.py — Fluxo principal estável (sem alterar sua lógica de geração)
# Mantém compatibilidade com o preview v4.2 e prepara ambiente para futuros recursos.
import os
import subprocess
import sys
import tkinter as tk
from tkinter import messagebox
from interface import (
    selecionar_pasta,
    selecionar_modelo,
    selecionar_caminho_saida,
    preview_conteudo,
)
from word_utils import inserir_conteudo

ORDEM_PASTAS = ["- Área externa", "- Área interna", "- Segundo piso"]


def ensure_dependency(pkg: str):
    """(Opcional) Preparação para recursos futuros. Não interrompe o fluxo se falhar."""
    try:
        __import__(pkg)
    except Exception:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", pkg, "--quiet"])
        except Exception:
            print(f"⚠ Não foi possível instalar automaticamente o pacote: {pkg}")


def criar_relatorio():
    print(">>> Iniciando criação do relatório...")

    root = tk.Tk()
    root.withdraw()

    # Preparação para próximo passo (drag & drop) — por enquanto não usado.
    ensure_dependency("tkinterdnd2")

    pasta_raiz = selecionar_pasta()
    if not pasta_raiz:
        print("Nenhuma pasta selecionada.")
        root.destroy()
        return

    modelo_path = selecionar_modelo()
    if not modelo_path:
        print("Nenhum modelo selecionado.")
        root.destroy()
        return

    caminho_saida = selecionar_caminho_saida()
    if not caminho_saida:
        print("Nenhum caminho de saída selecionado.")
        root.destroy()
        return

    nome_pasta_raiz = os.path.basename(pasta_raiz.strip(os.sep))
    os.makedirs(caminho_saida, exist_ok=True)
    nome_arquivo_saida = os.path.join(
        caminho_saida,
        f"RELATÓRIO FOTOGRÁFICO - {nome_pasta_raiz} - LEVANTAMENTO PREVENTIVO.docx"
    )

    conteudo = []

    print(">>> Lendo estrutura de pastas e imagens...")
    for root_dir, dirs, files in os.walk(pasta_raiz):
        if root_dir == pasta_raiz:
            dirs.sort(key=lambda x: (
                ORDEM_PASTAS.index(x) if x in ORDEM_PASTAS else len(ORDEM_PASTAS),
                x
            ))

        path_parts = os.path.relpath(root_dir, pasta_raiz).split(os.sep)
        nome = path_parts[-1]

        if nome != ".":
            nivel = len(path_parts)
            if nivel == 1:
                conteudo.append(nome)
            elif nivel == 2:
                conteudo.append(f"»{nome}")
            elif nivel == 3:
                conteudo.append(f"»»{nome}")
            else:
                prefixo = "»»»"
                nome_strip = nome.lstrip()
                if nome_strip.startswith("-"):
                    conteudo.append(f"{prefixo}{nome_strip}")
                else:
                    conteudo.append(f"{prefixo}- {nome_strip}")

        arquivos_imagens = [
            os.path.join(root_dir, f)
            for f in files
            if f.lower().endswith(('.png', '.jpg', '.jpeg'))
        ]
        try:
            arquivos_imagens.sort(key=os.path.getctime)
        except Exception:
            arquivos_imagens.sort()

        for imagem_path in arquivos_imagens:
            conteudo.append({"imagem": imagem_path})

        conteudo.append({"quebra_pagina": True})

    print(">>> Exibindo pré-visualização para o usuário...")
    conteudo_editado = preview_conteudo(conteudo)

    if conteudo_editado is None:
        print("⚠ Geração cancelada pelo usuário.")
        messagebox.showinfo("Cancelado", "A geração do relatório foi cancelada.")
        root.destroy()
        return

    print(">>> Pré-visualização confirmada, gerando relatório...")

    try:
        contador_imagens = inserir_conteudo(modelo_path, conteudo_editado, nome_arquivo_saida)
        print(f"✔ Relatório gerado com sucesso: {nome_arquivo_saida}")
        print(f"✔ Total de imagens inseridas: {contador_imagens}")

        messagebox.showinfo(
            "Sucesso",
            f"Relatório gerado com sucesso!\n\n"
            f"{contador_imagens} imagens inseridas.\n\n"
            f"Arquivo salvo em:\n{nome_arquivo_saida}"
        )

    except Exception as e:
        print(f"❌ Erro durante a geração: {e}")
        messagebox.showerror("Erro", f"Ocorreu um erro ao gerar o relatório:\n\n{e}")

    finally:
        root.destroy()
        print(">>> Processo concluído.")


if __name__ == "__main__":
    criar_relatorio()
