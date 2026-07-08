import os
import tkinter as tk
from tkinter import filedialog

EXTENSOES = (".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff")

def contar_imagens(diretorio):
    total = 0
    relatorio = {}
    por_formato = {ext: 0 for ext in EXTENSOES}

    for raiz, _, arquivos in os.walk(diretorio):
        count_pasta = 0
        for f in arquivos:
            f_lower = f.lower()
            if f_lower.endswith(EXTENSOES):
                total += 1
                count_pasta += 1
                for ext in EXTENSOES:
                    if f_lower.endswith(ext):
                        por_formato[ext] += 1
                        break
        if count_pasta > 0:
            relatorio[raiz] = count_pasta

    return total, relatorio, por_formato

def selecionar_pasta():
    pasta = filedialog.askdirectory(title="Selecione a pasta para contar imagens")
    if not pasta:
        return
    
    total, relatorio, por_formato = contar_imagens(pasta)
    
    # Monta o texto do resultado
    linhas = [f"Total de imagens encontradas: {total}", ""]
    
    linhas.append("Resumo por formato:")
    for ext, qtd in por_formato.items():
        linhas.append(f"{ext} -> {qtd} imagens")
    
    linhas.append("")
    linhas.append("Resumo por pasta:")
    for p, qtd in sorted(relatorio.items(), key=lambda x: x[0].lower()):
        linhas.append(f"{p} -> {qtd} imagens")
    
    resultado = "\n".join(linhas)

    # Janela com scroll para exibir resultados longos
    win = tk.Toplevel()
    win.title("Resultado - Contador de Imagens")
    txt = tk.Text(win, wrap="word", width=100, height=30)
    scroll = tk.Scrollbar(win, command=txt.yview)
    txt.configure(yscrollcommand=scroll.set)
    txt.insert("1.0", resultado)
    txt.config(state="disabled")
    txt.grid(row=0, column=0, sticky="nsew")
    scroll.grid(row=0, column=1, sticky="ns")
    win.grid_rowconfigure(0, weight=1)
    win.grid_columnconfigure(0, weight=1)

# Interface Tkinter
root = tk.Tk()
root.title("Contador de Imagens (Tkinter)")

frm = tk.Frame(root, padx=16, pady=16)
frm.pack(fill="both", expand=True)

lbl = tk.Label(frm, text="Clique no botão para selecionar a pasta a ser analisada:")
lbl.pack(pady=(0, 12))

btn = tk.Button(frm, text="Selecionar Pasta", command=selecionar_pasta, width=22, height=2)
btn.pack()

rodape = tk.Label(frm, text="Formatos: .jpg, .jpeg, .png, .gif, .bmp, .tiff", fg="gray")
rodape.pack(pady=(12, 0))

root.mainloop()
