
import tkinter as tk
from tkinter import filedialog, scrolledtext, messagebox
import threading
import os
import sys
import io

# Importar a função de processamento do script de automação
from automacao_organizacao import processar_levantamento


class LogRedirector(io.StringIO):
    """Redireciona prints para o callback da interface"""
    def __init__(self, callback):
        super().__init__()
        self.callback = callback
    
    def write(self, text):
        if text.strip():  # Ignora linhas vazias
            self.callback(text.rstrip())
    
    def flush(self):
        pass


class Application(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Organizador de Fotos WhatsApp")
        self.geometry("600x450")
        self.resizable(False, False)

        # Configuração de Estilo
        self.configure(bg="#f0f0f0")
        
        # Variáveis
        self.selected_path = tk.StringVar()

        self.create_widgets()

    def create_widgets(self):
        # Frame Principal
        main_frame = tk.Frame(self, bg="#f0f0f0", padx=20, pady=20)
        main_frame.pack(fill=tk.BOTH, expand=True)

        # Título
        lbl_title = tk.Label(main_frame, text="Organizador Automático", font=("Arial", 16, "bold"), bg="#f0f0f0", fg="#333")
        lbl_title.pack(pady=(0, 20))

        # Seleção de Pasta
        lbl_instrucao = tk.Label(main_frame, text="Selecione a pasta onde estão as fotos e o log:", bg="#f0f0f0", font=("Arial", 10))
        lbl_instrucao.pack(anchor="w")

        frame_input = tk.Frame(main_frame, bg="#f0f0f0")
        frame_input.pack(fill=tk.X, pady=5)

        entry_path = tk.Entry(frame_input, textvariable=self.selected_path, font=("Arial", 10), state="readonly")
        entry_path.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 10))

        btn_browse = tk.Button(frame_input, text="Selecionar Pasta", command=self.browse_folder, bg="#ddd", height=1)
        btn_browse.pack(side=tk.RIGHT)

        # Botão de Ação
        self.btn_run = tk.Button(main_frame, text="INICIAR ORGANIZAÇÃO", command=self.start_processing, 
                            font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", height=2, cursor="hand2")
        self.btn_run.pack(fill=tk.X, pady=20)

        # Área de Log
        lbl_log = tk.Label(main_frame, text="Progresso:", bg="#f0f0f0", font=("Arial", 10, "bold"))
        lbl_log.pack(anchor="w")

        self.txt_log = scrolledtext.ScrolledText(main_frame, height=10, font=("Consolas", 9), state="disabled")
        self.txt_log.pack(fill=tk.BOTH, expand=True)

    def browse_folder(self):
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.selected_path.set(folder_selected)

    def log_message(self, message):
        """Adiciona mensagem ao log da interface de forma thread-safe"""
        def update():
            self.txt_log.config(state="normal")
            self.txt_log.insert(tk.END, message + "\n")
            self.txt_log.see(tk.END)
            self.txt_log.config(state="disabled")
        self.after(0, update)

    def start_processing(self):
        path = self.selected_path.get()
        if not path:
            messagebox.showwarning("Atenção", "Por favor, selecione uma pasta primeiro.")
            return

        if not os.path.exists(path):
            messagebox.showerror("Erro", "A pasta selecionada não existe.")
            return

        # Desabilita botão durante execução
        self.btn_run.config(state="disabled", text="Processando...")
        self.txt_log.config(state="normal")
        self.txt_log.delete(1.0, tk.END)
        self.txt_log.config(state="disabled")

        # Rodar em thread separada para não travar a interface
        thread = threading.Thread(target=self.run_automation, args=(path,))
        thread.start()

    def run_automation(self, path):
        # Guardar stdout original
        old_stdout = sys.stdout
        
        try:
            # Redirecionar prints para a interface
            sys.stdout = LogRedirector(self.log_message)
            
            # Executar a função de processamento
            processar_levantamento(path)
            
            self.after(0, lambda: messagebox.showinfo("Sucesso", "Organização finalizada com sucesso!"))
        except Exception as e:
            self.log_message(f"\nERRO CRÍTICO: {e}")
            self.after(0, lambda: messagebox.showerror("Erro", f"Ocorreu um erro durante o processo:\n{e}"))
        finally:
            # Restaurar stdout
            sys.stdout = old_stdout
            self.after(0, lambda: self.btn_run.config(state="normal", text="INICIAR ORGANIZAÇÃO"))

if __name__ == "__main__":
    app = Application()
    app.mainloop()
