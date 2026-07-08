import os
import json
import tkinter as tk
from tkinter import ttk, messagebox
from pathlib import Path
import unicodedata

# ============================
# CONFIGURAÇÕES BASE
# ============================
BASE_DIR = Path("LEVANTAMENTOS")
SUBPASTAS_PADRAO = ["Vista ampla", "Serviços e Itens", "Detalhes"]

def limpar_nome(texto):
    texto = unicodedata.normalize("NFKD", texto).encode("ASCII", "ignore").decode("utf-8")
    return texto.strip().replace("/", "-").replace("\\", "-").replace(" ", "_")

# ============================
# FUNÇÕES DE CRIAÇÃO
# ============================
def criar_levantamento(agencia, prefixo):
    if not agencia:
        messagebox.showerror("Erro", "Informe o nome da agência")
        return

    nome_pasta = f"{prefixo}_{limpar_nome(agencia)}" if prefixo else limpar_nome(agencia)
    caminho = BASE_DIR / nome_pasta
    os.makedirs(caminho, exist_ok=True)
    with open(caminho / "estrutura.json", "w", encoding="utf-8") as f:
        json.dump({"agencia": agencia, "ambientes": []}, f, ensure_ascii=False, indent=4)

    atualizar_arvore()
    messagebox.showinfo("Sucesso", f"Levantamento criado:\n{nome_pasta}")

def criar_ambiente(agencia, ambiente):
    if not agencia or not ambiente:
        messagebox.showerror("Erro", "Preencha todos os campos")
        return

    caminho_agencia = BASE_DIR / limpar_nome(agencia)
    caminho_ambiente = caminho_agencia / limpar_nome(ambiente)
    os.makedirs(caminho_ambiente, exist_ok=True)

    for sub in SUBPASTAS_PADRAO:
        os.makedirs(caminho_ambiente / limpar_nome(sub), exist_ok=True)

    # Atualiza estrutura.json
    estrutura_path = caminho_agencia / "estrutura.json"
    if estrutura_path.exists():
        with open(estrutura_path, "r", encoding="utf-8") as f:
            estrutura = json.load(f)
    else:
        estrutura = {"agencia": agencia, "ambientes": []}

    if ambiente not in [a["nome"] for a in estrutura["ambientes"]]:
        estrutura["ambientes"].append({"nome": ambiente, "subpastas": SUBPASTAS_PADRAO})
        with open(estrutura_path, "w", encoding="utf-8") as f:
            json.dump(estrutura, f, ensure_ascii=False, indent=4)

    atualizar_arvore()
    messagebox.showinfo("Ambiente", f"Ambiente criado: {ambiente}")

def simular_foto(agencia, ambiente, tipo):
    if not all([agencia, ambiente, tipo]):
        messagebox.showerror("Erro", "Selecione todos os campos para simular foto")
        return

    caminho = BASE_DIR / limpar_nome(agencia) / limpar_nome(ambiente) / limpar_nome(tipo)
    os.makedirs(caminho, exist_ok=True)
    arquivo = caminho / f"foto_{len(os.listdir(caminho))+1}.jpg"
    with open(arquivo, "w") as f:
        f.write("simulação")

    atualizar_arvore()
    messagebox.showinfo("Foto", f"Foto simulada salva em:\n{arquivo}")

# ============================
# INTERFACE TKINTER
# ============================
root = tk.Tk()
root.title("Gerador de Estrutura - Tempo Real")
root.geometry("800x500")

# Campos de entrada
frame_inputs = tk.Frame(root)
frame_inputs.pack(side="top", fill="x", pady=10)

tk.Label(frame_inputs, text="Nome da Agência:").grid(row=0, column=0, padx=5, sticky="e")
entry_agencia = tk.Entry(frame_inputs, width=30)
entry_agencia.grid(row=0, column=1, padx=5)

tk.Label(frame_inputs, text="Prefixo:").grid(row=0, column=2, padx=5, sticky="e")
entry_prefixo = tk.Entry(frame_inputs, width=10)
entry_prefixo.grid(row=0, column=3, padx=5)

tk.Button(frame_inputs, text="Criar Levantamento", command=lambda: criar_levantamento(entry_agencia.get(), entry_prefixo.get())).grid(row=0, column=4, padx=10)

# Ambiente
tk.Label(frame_inputs, text="Novo Ambiente:").grid(row=1, column=0, padx=5, sticky="e")
entry_ambiente = tk.Entry(frame_inputs, width=30)
entry_ambiente.grid(row=1, column=1, padx=5)

tk.Button(frame_inputs, text="Adicionar Ambiente", command=lambda: criar_ambiente(entry_agencia.get(), entry_ambiente.get())).grid(row=1, column=2, padx=10)

# Simulação de fotos
tk.Label(frame_inputs, text="Tipo de Foto:").grid(row=2, column=0, padx=5, sticky="e")
combo_tipo = ttk.Combobox(frame_inputs, values=SUBPASTAS_PADRAO, width=27)
combo_tipo.grid(row=2, column=1, padx=5)
tk.Button(frame_inputs, text="Simular Foto", command=lambda: simular_foto(entry_agencia.get(), entry_ambiente.get(), combo_tipo.get())).grid(row=2, column=2, padx=10)

# ============================
# VISUALIZAÇÃO EM TEMPO REAL
# ============================
frame_tree = tk.Frame(root)
frame_tree.pack(fill="both", expand=True, padx=10, pady=10)

tree = ttk.Treeview(frame_tree)
tree.pack(fill="both", expand=True)

def atualizar_arvore():
    tree.delete(*tree.get_children())
    for root_dir, dirs, files in os.walk(BASE_DIR):
        parent = ""
        path_parts = Path(root_dir).relative_to(BASE_DIR).parts
        for i, part in enumerate(path_parts):
            subpath = "_".join(path_parts[:i+1])
            if not tree.exists(subpath):
                tree.insert("_".join(path_parts[:i]) if i else "", "end", subpath, text=part)
        for f in files:
            tree.insert("_".join(path_parts), "end", f"{root_dir}_{f}", text=f)

atualizar_arvore()

root.mainloop()
														