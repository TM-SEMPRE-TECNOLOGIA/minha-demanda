# interface.py — v4.2 “Estilo Profissional”
# Miniatura grande visível (como no layout antigo) + ferramentas na lateral da linha + checkbox.
# Mantém todo o conteúdo visível (sem ocultar/colapsar) e scroll fluido. Compatível com Python 3.13/Windows 11.

import os
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk


# -------------------- Seletores de caminho --------------------
def selecionar_pasta():
    root = tk.Tk()
    root.withdraw()
    return filedialog.askdirectory(title="Selecione a pasta de fotos")


def selecionar_modelo():
    root = tk.Tk()
    root.withdraw()
    return filedialog.askopenfilename(
        title="Selecione o modelo do Word",
        filetypes=[("Documentos Word", "*.docx")]
    )


def selecionar_caminho_saida():
    root = tk.Tk()
    root.withdraw()
    return filedialog.askdirectory(title="Selecione a pasta para salvar o relatório")


# -------------------- Utilidades de imagem --------------------
def gerar_thumbnail(path, master=None, altura=140):
    """
    Cria miniatura proporcional vinculada ao mesmo contexto de janela (master).
    Sempre retorna um PhotoImage válido (com placeholder se falhar).
    """
    try:
        img = Image.open(path)
        w, h = img.size
        if h <= 0 or w <= 0:
            raise ValueError("Dimensões inválidas")
        fator = altura / float(h)
        nova_largura = max(1, int(w * fator))
        img = img.resize((nova_largura, altura))
    except Exception:
        # placeholder cinza
        img = Image.new("RGB", (altura, altura), (210, 210, 210))
    return ImageTk.PhotoImage(img, master=master)


# -------------------- Preview Interativo --------------------
def preview_conteudo(conteudo):
    """
    Preview com:
      - Miniaturas grandes à esquerda (como no layout antigo)
      - Checkbox por item (seleção múltipla)
      - Ferramentas na lateral direita da linha: ❌ ✏️ ▲ ▼
      - Barra superior: Mover Selecionados / Excluir Selecionados
      - Scroll fluido na área inteira
      - Nenhum conteúdo ocultado (tudo que vem em 'conteudo' aparece)
    Retorna a lista possivelmente editada, ou None se usuário cancelar.
    """
    # Garante root
    if not tk._default_root:
        root = tk.Tk()
        root.withdraw()
    else:
        root = tk._default_root

    win = tk.Toplevel(root)
    win.title("Pré-visualização do Relatório Fotográfico")
    win.geometry("1180x720")
    win.configure(bg="#f4f4f4")
    win.minsize(980, 600)

    # Estado
    state = {
        "conteudo": list(conteudo),
        "confirmado": False,
        "selecionados": set(),
        "thumb_refs": {}  # idx -> PhotoImage (referência forte)
    }

    # Paleta suave
    COLOR_TOPIC = "#f7f7f7"      # linhas de tópicos (qualquer nível)
    COLOR_IMAGE = "#ffffff"      # linhas de imagem
    COLOR_BREAK = "#fff9db"      # quebra de página
    COLOR_BORDER = "#e5e7eb"

    # Cabeçalho
    header = tk.Frame(win, bg="#f4f4f4")
    header.pack(fill=tk.X, pady=(12, 6))
    tk.Label(
        header,
        text="Revise e edite o relatório antes da geração final:",
        bg="#f4f4f4",
        font=("Arial", 14, "bold")
    ).pack(side=tk.LEFT, padx=14)

    # Barra de ações superior
    bar = tk.Frame(win, bg="#f4f4f4")
    bar.pack(fill=tk.X, padx=12, pady=(0, 8))

    def on_confirmar():
        state["confirmado"] = True
        win.destroy()

    def on_cancelar():
        state["confirmado"] = False
        win.destroy()

    def mover_selecionados(direcao):
        if not state["selecionados"]:
            messagebox.showinfo("Aviso", "Nenhum item selecionado.")
            return
        conteudo_local = state["conteudo"]
        indices = sorted(state["selecionados"])
        if direcao < 0:
            for i in indices:
                if i > 0:
                    conteudo_local[i], conteudo_local[i - 1] = conteudo_local[i - 1], conteudo_local[i]
            state["selecionados"] = {i - 1 for i in indices if i > 0}
        else:
            for i in reversed(indices):
                if i < len(conteudo_local) - 1:
                    conteudo_local[i], conteudo_local[i + 1] = conteudo_local[i + 1], conteudo_local[i]
            state["selecionados"] = {i + 1 for i in indices if i < len(conteudo_local) - 1}
        render()

    def excluir_selecionados():
        if not state["selecionados"]:
            messagebox.showinfo("Aviso", "Nenhum item selecionado para exclusão.")
            return
        if not messagebox.askyesno("Confirmar", "Remover todos os itens selecionados?"):
            return
        state["conteudo"] = [v for i, v in enumerate(state["conteudo"]) if i not in state["selecionados"]]
        state["selecionados"].clear()
        render()

    # Botões lado esquerdo (ações em lote)
    tk.Button(bar, text="▲ Mover Selecionados", command=lambda: mover_selecionados(-1),
              bg="#2563eb", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=4)
    tk.Button(bar, text="▼ Mover Selecionados", command=lambda: mover_selecionados(1),
              bg="#2563eb", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=4)
    tk.Button(bar, text="❌ Excluir Selecionados", command=excluir_selecionados,
              bg="#ef4444", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=4)

    # Botões lado direito (flow)
    tk.Button(bar, text="Confirmar e Gerar Relatório", command=on_confirmar,
              bg="#16a34a", fg="white", font=("Arial", 10, "bold"),
              padx=10, pady=4).pack(side=tk.RIGHT, padx=4)
    tk.Button(bar, text="Cancelar", command=on_cancelar,
              bg="#f43f5e", fg="white", font=("Arial", 10, "bold"),
              padx=10, pady=4).pack(side=tk.RIGHT, padx=4)

    # Área scrollável
    outer = tk.Frame(win, bg="#e5e7eb")
    outer.pack(fill=tk.BOTH, expand=True, padx=10, pady=8)

    canvas = tk.Canvas(outer, bg="#ffffff", highlightthickness=0)
    vbar = tk.Scrollbar(outer, orient="vertical", command=canvas.yview)
    canvas.configure(yscrollcommand=vbar.set)

    vbar.pack(side=tk.RIGHT, fill=tk.Y)
    canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    content = tk.Frame(canvas, bg="#ffffff")
    canvas_window = canvas.create_window((0, 0), window=content, anchor="nw")

    def on_configure(_=None):
        canvas.configure(scrollregion=canvas.bbox("all"))
        canvas.itemconfigure(canvas_window, width=canvas.winfo_width())

    content.bind("<Configure>", on_configure)
    canvas.bind("<Configure>", on_configure)

    def on_wheel(e):
        canvas.yview_scroll(int(-1 * (e.delta / 120) * 3), "units")

    for w in (win, canvas, content):
        w.bind_all("<MouseWheel>", on_wheel)

    # -------------------- Funções linha-a-linha --------------------
    def editar(idx):
        item = state["conteudo"][idx]
        if isinstance(item, str):
            top = tk.Toplevel(win)
            top.title("Editar Tópico")
            tk.Label(top, text="Novo nome do tópico:").pack(pady=6, padx=10)
            entrada = tk.Entry(top, width=80)
            entrada.insert(0, item)
            entrada.pack(pady=6, padx=10)

            def salvar():
                state["conteudo"][idx] = entrada.get()
                top.destroy()
                render()

            tk.Button(top, text="Salvar", command=salvar, bg="#16a34a", fg="white").pack(pady=6)
            top.transient(win)
            top.grab_set()
            win.wait_window(top)

    def mover_uma_linha(idx, d):
        nova = idx + d
        if 0 <= nova < len(state["conteudo"]):
            state["conteudo"][idx], state["conteudo"][nova] = state["conteudo"][nova], state["conteudo"][idx]
            render()

    def remover_uma_linha(idx):
        if messagebox.askyesno("Remover", "Remover este item?"):
            state["conteudo"].pop(idx)
            # limpa qualquer seleção baseada no índice antigo
            state["selecionados"] = {i if i < idx else i - 1 for i in state["selecionados"] if i != idx}
            render()

    # -------------------- Renderização --------------------
    def render():
        for c in content.winfo_children():
            c.destroy()
        state["thumb_refs"].clear()

        for idx, item in enumerate(state["conteudo"]):
            # Define cor por tipo
            if isinstance(item, dict) and "imagem" in item:
                bg = COLOR_IMAGE
                icon = "🖼️"
            elif isinstance(item, dict) and "quebra_pagina" in item:
                bg = COLOR_BREAK
                icon = "⤴"
            elif isinstance(item, str):
                bg = COLOR_TOPIC
                icon = "📁" if "»" not in item else "🔹"
            else:
                bg = COLOR_IMAGE
                icon = "•"

            # Linha: borda e leve sombra
            row = tk.Frame(content, bg=bg, bd=1, relief=tk.SOLID, highlightbackground=COLOR_BORDER)
            row.pack(fill=tk.X, pady=3, padx=4)

            # Coluna 0 — checkbox (seleção múltipla)
            col_check = tk.Frame(row, width=32, bg=bg)
            col_check.pack(side=tk.LEFT, padx=(6, 2), pady=6)
            col_check.pack_propagate(False)

            var_sel = tk.BooleanVar(value=(idx in state["selecionados"]))

            def toggle_sel(i=idx, var=var_sel):
                if var.get():
                    state["selecionados"].add(i)
                else:
                    state["selecionados"].discard(i)

            tk.Checkbutton(col_check, variable=var_sel, bg=bg, command=toggle_sel).pack(anchor="center")

            # Coluna 1 — miniatura grande (ou ícone)
            col_thumb = tk.Frame(row, width=170, height=150, bg=bg)
            col_thumb.pack(side=tk.LEFT, padx=(6, 10), pady=6)
            col_thumb.pack_propagate(False)

            if isinstance(item, dict) and "imagem" in item:
                thumb = gerar_thumbnail(item["imagem"], master=win, altura=140)
                state["thumb_refs"][idx] = thumb  # referência forte
                lbl_img = tk.Label(col_thumb, image=thumb, bg=bg)
                lbl_img.image = thumb
                lbl_img.pack(fill=tk.BOTH, expand=True)
            else:
                tk.Label(col_thumb, text=icon, bg=bg, font=("Arial", 20)).pack(expand=True)

            # Coluna 2 — texto completo (sem truncar)
            if isinstance(item, dict) and "imagem" in item:
                texto = item["imagem"]
            elif isinstance(item, dict) and "quebra_pagina" in item:
                texto = "[Quebra de página]"
            elif isinstance(item, str):
                texto = item
            else:
                texto = str(item)

            col_text = tk.Frame(row, bg=bg)
            col_text.pack(side=tk.LEFT, fill=tk.X, expand=True)
            tk.Label(col_text, text=texto, bg=bg, anchor="w", font=("Arial", 11)).pack(
                fill=tk.X, padx=(4, 6), pady=6
            )

            # Coluna 3 — ferramentas na lateral (como no layout antigo)
            tools = tk.Frame(row, bg=bg)
            tools.pack(side=tk.RIGHT, padx=10, pady=6)

            # Caixa com botão estilo mais “chapado” e compacto
            def mk_btn(txt, cmd):
                return tk.Button(tools, text=txt, command=cmd, width=3, relief=tk.RAISED)

            mk_btn("❌", lambda i=idx: remover_uma_linha(i)).pack(side=tk.LEFT, padx=2)
            mk_btn("✏️", lambda i=idx: editar(i)).pack(side=tk.LEFT, padx=2)
            mk_btn("▲", lambda i=idx: mover_uma_linha(i, -1)).pack(side=tk.LEFT, padx=2)
            mk_btn("▼", lambda i=idx: mover_uma_linha(i, 1)).pack(side=tk.LEFT, padx=2)

            # mantém a referência viva no próprio frame da linha
            row.image = state["thumb_refs"].get(idx)

    # Render inicial e modal
    render()
    win.update_idletasks()
    win.deiconify()
    win.grab_set()
    root.wait_window(win)

    return state["conteudo"] if state["confirmado"] else None
