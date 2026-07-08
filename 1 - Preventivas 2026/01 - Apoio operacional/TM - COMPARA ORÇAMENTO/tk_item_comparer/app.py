from __future__ import annotations

import os
import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter import ttk

from comparer import (
    compare_items,
    load_budget_items,
    load_report_items,
    summarize,
    write_outputs,
)


APP_TITLE = "Comparador de Itens (Relatório x Orçamento)"


class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title(APP_TITLE)
        self.geometry("980x560")
        self.minsize(900, 520)

        self.report_path = tk.StringVar(value="")
        self.budget_path = tk.StringVar(value="")
        self.status_var = tk.StringVar(value="Selecione o relatório (DOCX) e o orçamento (XLSX).")

        self._build_ui()

    def _build_ui(self):
        top = ttk.Frame(self, padding=12)
        top.pack(fill=tk.X)

        # Row 1: report
        row1 = ttk.Frame(top)
        row1.pack(fill=tk.X, pady=(0, 6))
        ttk.Label(row1, text="Relatório (DOCX):", width=18).pack(side=tk.LEFT)
        ttk.Entry(row1, textvariable=self.report_path).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 8))
        ttk.Button(row1, text="Selecionar...", command=self.pick_report).pack(side=tk.LEFT)

        # Row 2: budget
        row2 = ttk.Frame(top)
        row2.pack(fill=tk.X, pady=(0, 10))
        ttk.Label(row2, text="Orçamento (XLSX):", width=18).pack(side=tk.LEFT)
        ttk.Entry(row2, textvariable=self.budget_path).pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(0, 8))
        ttk.Button(row2, text="Selecionar...", command=self.pick_budget).pack(side=tk.LEFT)

        # Actions
        actions = ttk.Frame(top)
        actions.pack(fill=tk.X)
        ttk.Button(actions, text="Comparar", command=self.run_compare).pack(side=tk.LEFT)
        ttk.Button(actions, text="Abrir pasta de saída", command=self.open_output_dir).pack(side=tk.LEFT, padx=8)

        # Summary
        self.summary_lbl = ttk.Label(actions, text="")
        self.summary_lbl.pack(side=tk.LEFT, padx=12)

        # Status bar
        ttk.Label(self, textvariable=self.status_var, padding=(12, 6)).pack(fill=tk.X)

        # Table
        table_frame = ttk.Frame(self, padding=(12, 0, 12, 12))
        table_frame.pack(fill=tk.BOTH, expand=True)

        cols = ("Item", "Qtd_relatorio", "Qtd_orcamento", "Status")
        self.tree = ttk.Treeview(table_frame, columns=cols, show="headings")
        self.tree.heading("Item", text="Item")
        self.tree.heading("Qtd_relatorio", text="Qtd. relatório")
        self.tree.heading("Qtd_orcamento", text="Qtd. orçamento")
        self.tree.heading("Status", text="Status")

        self.tree.column("Item", width=90, anchor=tk.CENTER)
        self.tree.column("Qtd_relatorio", width=150, anchor=tk.E)
        self.tree.column("Qtd_orcamento", width=150, anchor=tk.E)
        self.tree.column("Status", width=240, anchor=tk.W)

        vsb = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        hsb = ttk.Scrollbar(table_frame, orient="horizontal", command=self.tree.xview)
        self.tree.configure(yscroll=vsb.set, xscroll=hsb.set)

        self.tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")
        hsb.grid(row=1, column=0, sticky="ew")

        table_frame.rowconfigure(0, weight=1)
        table_frame.columnconfigure(0, weight=1)

        # Output area
        self.output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")

    def pick_report(self):
        path = filedialog.askopenfilename(
            title="Selecione o Relatório (DOCX)",
            filetypes=[("Relatório DOCX", "*.docx"), ("Todos os arquivos", "*.*")],
        )
        if path:
            self.report_path.set(path)

    def pick_budget(self):
        path = filedialog.askopenfilename(
            title="Selecione o Orçamento (XLSX)",
            filetypes=[("Orçamento XLSX", "*.xlsx"), ("Todos os arquivos", "*.*")],
        )
        if path:
            self.budget_path.set(path)

    def run_compare(self):
        rep = self.report_path.get().strip()
        bud = self.budget_path.get().strip()
        if not rep or not os.path.exists(rep):
            messagebox.showerror("Erro", "Selecione um relatório DOCX válido.")
            return
        if not bud or not os.path.exists(bud):
            messagebox.showerror("Erro", "Selecione um orçamento XLSX válido.")
            return

        try:
            self.status_var.set("Lendo relatório (tabelas de Itens)...")
            self.update_idletasks()
            report_items = load_report_items(rep)

            self.status_var.set("Lendo orçamento (aba RAT)...")
            self.update_idletasks()
            budget_items = load_budget_items(bud)

            self.status_var.set("Comparando...")
            self.update_idletasks()
            rows = compare_items(report_items, budget_items)

            # Fill table
            for i in self.tree.get_children():
                self.tree.delete(i)

            for r in rows:
                qr = "—" if r.qtd_relatorio is None else f"{r.qtd_relatorio:.2f}".replace(".", ",")
                qb = "—" if r.qtd_orcamento is None else f"{r.qtd_orcamento:.2f}".replace(".", ",")
                self.tree.insert("", tk.END, values=(r.item, qr, qb, r.status))

            summ = summarize(rows)
            self.summary_lbl.config(
                text=(
                    f"Total: {summ['total']} | Compatíveis: {summ['compatível']} | "
                    f"Divergentes: {summ['divergente']} | Só orçamento: {summ['não citado no relatório']} | "
                    f"Só relatório: {summ['não previsto no orçamento']}"
                )
            )

            log_path, csv_path = write_outputs(self.output_dir, rep, bud, rows)

            self.status_var.set(
                f"Concluído. Log: {os.path.basename(log_path)} | CSV: {os.path.basename(csv_path)}"
            )

        except Exception as e:
            messagebox.showerror("Falha na comparação", str(e))
            self.status_var.set("Falha. Verifique os arquivos selecionados.")

    def open_output_dir(self):
        os.makedirs(self.output_dir, exist_ok=True)
        try:
            os.startfile(self.output_dir)  # type: ignore[attr-defined]
        except Exception:
            messagebox.showinfo("Saída", f"Pasta de saída: {self.output_dir}")


if __name__ == "__main__":
    # Improve ttk look on Windows
    try:
        from ctypes import windll

        windll.shcore.SetProcessDpiAwareness(1)
    except Exception:
        pass

    app = App()
    app.mainloop()
