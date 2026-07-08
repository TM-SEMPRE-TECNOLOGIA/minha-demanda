import os
import math
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk

ITENS_POR_PAGINA = 100  # ✅ quantidade por página


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


def gerar_thumbnail(path, master=None, altura=140):
    try:
        img = Image.open(path)
        w, h = img.size
        fator = altura / float(h)
        nova_largura = max(1, int(w * fator))
        img = img.resize((nova_largura, altura))
    except Exception:
        img = Image.new("RGB", (altura, altura), (210, 210, 210))
    return ImageTk.PhotoImage(img, master=master)


def preview_conteudo(conteudo):
    if not tk._default_root:
        root = tk.Tk()
        root.withdraw()
    else:
        root = tk._default_root

    win = tk.Toplevel(root)
    win.title("Pré-visualização do Relatório Fotográfico")
    win.geometry("1180x720")
    win.configure(bg="#f4f4f4")

    state = {
        "conteudo": list(conteudo),
        "confirmado": False,
        "selecionados": set(),
        "thumb_refs": {},
        "pagina": 1
    }

    COLOR_TOPIC = "#f7f7f7"
    COLOR_IMAGE = "#ffffff"
    COLOR_BREAK = "#fff9db"
    COLOR_PARAGRAFO = "#e8f5e9"

    # ---------- Cabeçalho ----------
    header = tk.Frame(win, bg="#f4f4f4")
    header.pack(fill=tk.X, pady=(10, 5))
    titulo_lbl = tk.Label(
        header,
        text="Revise e edite o relatório antes da geração final:",
        bg="#f4f4f4",
        font=("Arial", 14, "bold")
    )
    titulo_lbl.pack(side=tk.LEFT, padx=14)

    # ---------- Barra de Ações ----------
    bar = tk.Frame(win, bg="#f4f4f4")
    bar.pack(fill=tk.X, padx=12, pady=(0, 8))

    def confirmar():
        state["confirmado"] = True
        win.destroy()

    def cancelar():
        state["confirmado"] = False
        win.destroy()

    def mover_sel(d):
        if not state["selecionados"]:
            messagebox.showinfo("Aviso", "Nenhum item selecionado.")
            return
        indices = sorted(state["selecionados"])
        nova = state["conteudo"]
        if d < 0:
            for i in indices:
                if i > 0:
                    nova[i], nova[i - 1] = nova[i - 1], nova[i]
            state["selecionados"] = {i - 1 for i in indices if i > 0}
        else:
            for i in reversed(indices):
                if i < len(nova) - 1:
                    nova[i], nova[i + 1] = nova[i + 1], nova[i]
            state["selecionados"] = {i + 1 for i in indices if i < len(nova) - 1}
        render()

    def excluir_sel():
        if not state["selecionados"]:
            messagebox.showinfo("Aviso", "Nenhum item selecionado.")
            return
        if not messagebox.askyesno("Confirmar", "Remover todos os itens selecionados?"):
            return
        state["conteudo"] = [v for i, v in enumerate(state["conteudo"]) if i not in state["selecionados"]]
        state["selecionados"].clear()
        render()

    tk.Button(bar, text="▲ Mover Selecionados", command=lambda: mover_sel(-1),
              bg="#2563eb", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=4)
    tk.Button(bar, text="▼ Mover Selecionados", command=lambda: mover_sel(1),
              bg="#2563eb", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=4)
    tk.Button(bar, text="❌ Excluir Selecionados", command=excluir_sel,
              bg="#ef4444", fg="white", font=("Arial", 10, "bold")).pack(side=tk.LEFT, padx=4)
    tk.Button(bar, text="Cancelar", command=cancelar,
              bg="#f43f5e", fg="white", font=("Arial", 10, "bold")).pack(side=tk.RIGHT, padx=4)
    tk.Button(bar, text="Confirmar e Gerar Relatório", command=confirmar,
              bg="#16a34a", fg="white", font=("Arial", 10, "bold")).pack(side=tk.RIGHT, padx=4)

    # ---------- Área Scroll ----------
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

    # ---------- Edição ----------
    def editar(idx):
        item = state["conteudo"][idx]

        if isinstance(item, str):
            top = tk.Toplevel(win)
            top.title("Editar Tópico")
            tk.Label(top, text="Novo nome do tópico:").pack(pady=6)
            entrada = tk.Entry(top, width=80)
            entrada.insert(0, item)
            entrada.pack(pady=6)

            def salvar():
                state["conteudo"][idx] = entrada.get()
                top.destroy()
                render()

            tk.Button(top, text="Salvar", command=salvar, bg="#16a34a", fg="white").pack(pady=6)
            top.grab_set()
            win.wait_window(top)

        elif isinstance(item, dict) and ("quebra_pagina" in item or "paragrafo" in item):
            top = tk.Toplevel(win)
            top.title("Editar Tipo")
            tipo_atual = "quebra" if "quebra_pagina" in item else "paragrafo"

            escolha = tk.StringVar(value=tipo_atual)
            tk.Label(top, text="Converter este elemento em:").pack(pady=6)
            tk.Radiobutton(top, text="Manter como Quebra de Página", variable=escolha, value="quebra").pack(anchor="w", padx=10)
            tk.Radiobutton(top, text="Converter em Parágrafo", variable=escolha, value="paragrafo").pack(anchor="w", padx=10)

            def salvar():
                state["conteudo"][idx] = {"quebra_pagina": True} if escolha.get() == "quebra" else {"paragrafo": True}
                top.destroy()
                render()

            tk.Button(top, text="Salvar", command=salvar, bg="#16a34a", fg="white").pack(pady=8)
            top.grab_set()
            win.wait_window(top)

    def mover_uma(idx, d):
        nova = idx + d
        if 0 <= nova < len(state["conteudo"]):
            state["conteudo"][idx], state["conteudo"][nova] = state["conteudo"][nova], state["conteudo"][idx]
            render()

    def remover_uma(idx):
        if messagebox.askyesno("Remover", "Remover este item?"):
            state["conteudo"].pop(idx)
            render()

    # ---------- Paginação ----------
    paginador = tk.Frame(win, bg="#f4f4f4")
    paginador.pack(fill=tk.X, pady=(0, 10))

    pagina_lbl = tk.Label(paginador, bg="#f4f4f4", font=("Arial", 10))
    pagina_lbl.pack(side=tk.LEFT, padx=12)

    def mudar_pagina(delta):
        total_paginas = math.ceil(len(state["conteudo"]) / ITENS_POR_PAGINA)
        nova = state["pagina"] + delta
        if 1 <= nova <= total_paginas:
            state["pagina"] = nova
            render()

    tk.Button(paginador, text="◀ Página anterior", command=lambda: mudar_pagina(-1),
              bg="#d1d5db").pack(side=tk.RIGHT, padx=6)
    tk.Button(paginador, text="Próxima página ▶", command=lambda: mudar_pagina(1),
              bg="#d1d5db").pack(side=tk.RIGHT, padx=6)

    # ---------- Renderização ----------
    def render():
        for c in content.winfo_children():
            c.destroy()
        state["thumb_refs"].clear()

        total_itens = len(state["conteudo"])
        total_paginas = max(1, math.ceil(total_itens / ITENS_POR_PAGINA))
        pagina_lbl.config(text=f"Página {state['pagina']} de {total_paginas} ({total_itens} itens)")

        inicio = (state["pagina"] - 1) * ITENS_POR_PAGINA
        fim = min(inicio + ITENS_POR_PAGINA, total_itens)
        subset = state["conteudo"][inicio:fim]

        for idx_global, item in enumerate(subset, start=inicio):
            # Tipo
            if isinstance(item, dict) and "imagem" in item:
                bg, icon, texto = COLOR_IMAGE, "🖼️", item["imagem"]
            elif isinstance(item, dict) and "quebra_pagina" in item:
                bg, icon, texto = COLOR_BREAK, "⤴", "[Quebra de página]"
            elif isinstance(item, dict) and "paragrafo" in item:
                bg, icon, texto = COLOR_PARAGRAFO, "¶", "[Parágrafo]"
            elif isinstance(item, str):
                bg, icon, texto = COLOR_TOPIC, "📁" if "»" not in item else "🔹", item
            else:
                bg, icon, texto = COLOR_IMAGE, "•", str(item)

            row = tk.Frame(content, bg=bg, bd=1, relief=tk.SOLID)
            row.pack(fill=tk.X, pady=3, padx=4)

            var = tk.BooleanVar(value=(idx_global in state["selecionados"]))
            def toggle(i=idx_global, v=var):
                if v.get():
                    state["selecionados"].add(i)
                else:
                    state["selecionados"].discard(i)
            tk.Checkbutton(row, variable=var, bg=bg, command=toggle).pack(side=tk.LEFT, padx=6)

            col_thumb = tk.Frame(row, width=170, height=150, bg=bg)
            col_thumb.pack(side=tk.LEFT, padx=(6, 10), pady=6)
            col_thumb.pack_propagate(False)

            if isinstance(item, dict) and "imagem" in item:
                thumb = gerar_thumbnail(item["imagem"], master=win)
                state["thumb_refs"][idx_global] = thumb
                lbl = tk.Label(col_thumb, image=thumb, bg=bg)
                lbl.image = thumb
                lbl.pack(fill=tk.BOTH, expand=True)
            else:
                tk.Label(col_thumb, text=icon, bg=bg, font=("Arial", 20)).pack(expand=True)

            tk.Label(row, text=texto, bg=bg, anchor="w", font=("Arial", 11)).pack(
                side=tk.LEFT, fill=tk.X, expand=True, padx=4
            )
            col_tools = tk.Frame(row, bg=bg)
            col_tools.pack(side=tk.RIGHT, padx=10, pady=6)
            for txt, cmd in [("❌", lambda i=idx_global: remover_uma(i)),
                             ("✏️", lambda i=idx_global: editar(i)),
                             ("▲", lambda i=idx_global: mover_uma(i, -1)),
                             ("▼", lambda i=idx_global: mover_uma(i, 1))]:
                tk.Button(col_tools, text=txt, width=3, relief=tk.RAISED, command=cmd).pack(side=tk.LEFT, padx=2)
            row.image = state["thumb_refs"].get(idx_global)

    render()
    win.update_idletasks()
    win.deiconify()
    win.grab_set()
    root.wait_window(win)
    return state["conteudo"] if state["confirmado"] else None
