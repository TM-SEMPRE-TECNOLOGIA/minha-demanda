import os
import shutil
import fitz  # PyMuPDF
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from PIL import Image, ImageTk

# ======================================================
# FUNÇÕES PRINCIPAIS
# ======================================================

def selecionar_pasta_origem():
    return filedialog.askdirectory(title="Selecione a pasta de origem")

def selecionar_pasta_destino():
    return filedialog.askdirectory(title="Selecione a pasta de destino")

def listar_pdfs(pasta_raiz):
    """Lista apenas PDFs que começam com 'RELATÓRIO FOTOGRÁFICO'."""
    pdfs = []
    for root, _, files in os.walk(pasta_raiz):
        for f in files:
            if f.lower().endswith(".pdf") and f.upper().startswith("RELATÓRIO FOTOGRÁFICO"):
                pdfs.append(os.path.join(root, f))
    return pdfs

def copiar_pdfs(lista_pdfs, pasta_destino):
    os.makedirs(pasta_destino, exist_ok=True)
    for caminho in lista_pdfs:
        nome_arquivo = os.path.basename(caminho)
        destino = os.path.join(pasta_destino, nome_arquivo)
        shutil.copy2(caminho, destino)
    messagebox.showinfo("Concluído", f"{len(lista_pdfs)} PDFs copiados com sucesso!")

# ======================================================
# GERA MINIATURA (PRIMEIRA PÁGINA DO PDF)
# ======================================================

def gerar_thumbnail_pdf(pdf_path, max_altura=180):
    try:
        with fitz.open(pdf_path) as doc:
            if len(doc) == 0:
                return None
            page = doc.load_page(0)
            pix = page.get_pixmap(matrix=fitz.Matrix(1.2, 1.2))
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            fator = max_altura / float(img.height)
            nova_largura = int(img.width * fator)
            img = img.resize((nova_largura, max_altura))
            return ImageTk.PhotoImage(img)
    except Exception:
        return None

# ======================================================
# INTERFACE TKINTER
# ======================================================

def iniciar_interface():
    root = tk.Tk()
    root.title("Copiador de PDFs — RELATÓRIO FOTOGRÁFICO")
    root.geometry("950x650")
    root.configure(bg="#f5f5f5")

    origem_var = tk.StringVar()
    destino_var = tk.StringVar()
    pdfs = []
    thumbs = {}

    # --------------------------------------
    def selecionar_origem():
        pasta = selecionar_pasta_origem()
        if pasta:
            origem_var.set(pasta)
            atualizar_lista()

    def selecionar_destino():
        pasta = selecionar_pasta_destino()
        if pasta:
            destino_var.set(pasta)

    def atualizar_lista():
        lista.delete(*lista.get_children())
        pasta = origem_var.get()
        if not pasta:
            return
        nonlocal pdfs
        pdfs = listar_pdfs(pasta)
        for i, path in enumerate(pdfs, start=1):
            lista.insert("", "end", values=(i, os.path.basename(path), path))
        lbl_total.config(text=f"{len(pdfs)} PDFs encontrados")

    def copiar():
        if not pdfs:
            messagebox.showwarning("Aviso", "Nenhum PDF listado.")
            return
        if not destino_var.get():
            messagebox.showwarning("Aviso", "Selecione a pasta de destino.")
            return
        copiar_pdfs(pdfs, destino_var.get())

    # --------------------------------------
    # VISUALIZADOR DE PDF
    # --------------------------------------
    def preview_pdf(event):
        sel = lista.selection()
        if not sel:
            return
        item = lista.item(sel[0])
        caminho = item["values"][2]

        thumb = gerar_thumbnail_pdf(caminho)
        preview_label.config(image="")
        if thumb:
            thumbs["atual"] = thumb
            preview_label.config(image=thumb)
            lbl_nome_pdf.config(text=os.path.basename(caminho))
        else:
            lbl_nome_pdf.config(text="Falha ao gerar prévia")

    # --------------------------------------
    # LAYOUT
    # --------------------------------------
    frm_top = tk.Frame(root, bg="#f5f5f5")
    frm_top.pack(pady=10, fill=tk.X)

    tk.Label(frm_top, text="Pasta de origem:", bg="#f5f5f5", font=("Arial", 10)).pack()
    tk.Entry(frm_top, textvariable=origem_var, width=100).pack(pady=2)
    tk.Button(frm_top, text="Selecionar origem", command=selecionar_origem,
              bg="#2563eb", fg="white").pack(pady=5)

    tk.Label(frm_top, text="Pasta de destino:", bg="#f5f5f5", font=("Arial", 10)).pack(pady=5)
    tk.Entry(frm_top, textvariable=destino_var, width=100).pack(pady=2)
    tk.Button(frm_top, text="Selecionar destino", command=selecionar_destino,
              bg="#2563eb", fg="white").pack(pady=5)

    cols = ("#", "Arquivo", "Caminho completo")
    lista = ttk.Treeview(root, columns=cols, show="headings", height=15)
    for c in cols:
        lista.heading(c, text=c)
    lista.column("#", width=40, anchor="center")
    lista.column("Arquivo", width=250, anchor="w")
    lista.column("Caminho completo", width=600, anchor="w")
    lista.bind("<<TreeviewSelect>>", preview_pdf)
    lista.pack(pady=10)

    lbl_total = tk.Label(root, text="", bg="#f5f5f5", font=("Arial", 10, "italic"))
    lbl_total.pack()

    frm_bottom = tk.Frame(root, bg="#f5f5f5")
    frm_bottom.pack(fill=tk.X, pady=10)

    tk.Button(frm_bottom, text="Atualizar lista", command=atualizar_lista,
              bg="#f59e0b", fg="white").pack(side=tk.LEFT, padx=10)
    tk.Button(frm_bottom, text="Copiar PDFs", command=copiar,
              bg="#16a34a", fg="white", font=("Arial", 11, "bold")).pack(side=tk.RIGHT, padx=10)

    # --------------------------------------
    # PREVIEW
    # --------------------------------------
    lbl_nome_pdf = tk.Label(root, text="", bg="#f5f5f5", font=("Arial", 11, "bold"))
    lbl_nome_pdf.pack(pady=(20, 5))

    preview_label = tk.Label(root, bg="#dcdcdc", width=400, height=220)
    preview_label.pack()

    root.mainloop()


if __name__ == "__main__":
    try:
        import fitz
    except ImportError:
        import subprocess, sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf"])
    iniciar_interface()
