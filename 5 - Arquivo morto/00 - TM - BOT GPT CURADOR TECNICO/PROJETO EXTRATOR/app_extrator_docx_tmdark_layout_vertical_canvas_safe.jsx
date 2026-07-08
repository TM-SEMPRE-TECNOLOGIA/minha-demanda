import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CloudUpload,
  FileText,
  Loader2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sigma,
} from "lucide-react";
import * as XLSX from "xlsx";
import JSZip from "jszip";

/**
 * TM Sempre Tecnologia — Extrator de Itens DOCX (Online)
 * Layout VERTICAL (Canvas-safe) + melhorias de hierarquia visual.
 *
 * Principais regras:
 * - Procura tabelas em word/document.xml com cabeçalho contendo “Itens” (1ª linha da tabela)
 * - Col 1: Código (aceita números e números com ponto, ex: 17.4). Ignora vazio/#N/D
 * - Col 2: Descrição
 * - Quantidade: prefere 3ª coluna; fallback por regex na linha (formato pt-BR)
 * - Exporta Excel bruto e consolidado (somado) + Log TXT
 */

const COLORS = {
  bg: "#1c1917",
  card: "#292524",
  primary: "#b91c1c",
  text: "#f5f5f4",
  muted: "#d6d3d1",
  border: "#44403c",
  good: "#22c55e",
};

const CODE_RE = /^\s*\d+(?:\.\d+)?\s*$/;

/** @typedef {{ codigo: string; descricao: string; quantidade_raw: string; quantidade: number; origem?: string }} Item */

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

function norm(s) {
  return (s ?? "").replace(/\u00A0/g, " ").trim();
}

function fmtInt(n) {
  try {
    return new Intl.NumberFormat("pt-BR").format(n);
  } catch {
    return String(n);
  }
}

function fmtQty(q) {
  if (!Number.isFinite(q)) return "";
  try {
    return new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 6 }).format(q);
  } catch {
    return String(q);
  }
}

function parsePtNumber(s) {
  const t = norm(s);
  if (!t) return NaN;
  const cleaned = t.replace(/\./g, "").replace(/,/g, ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

function safeBaseName(name) {
  const base = String(name || "documento")
    .replace(/\.docx$/i, "")
    .replace(/[^a-zA-Z0-9\-_. ]+/g, "_")
    .trim();
  return base || "documento";
}

function makeName(docxName, prefix, ext) {
  return `${prefix}_${safeBaseName(docxName)}.${ext}`;
}

function isInIframe() {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function fallbackDownload({ filename, mime, data }) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function saveFile({ filename, mime, data, hint }) {
  const inIframe = typeof window !== "undefined" && isInIframe();

  if (!inIframe && typeof window !== "undefined" && window.showSaveFilePicker) {
    try {
      const ext = filename.split(".").pop() || "";
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: hint?.toUpperCase() || "Arquivo",
            accept: { [mime]: [`.${ext}`] },
          },
        ],
      });
      const writable = await handle.createWritable();
      const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
      await writable.write(blob);
      await writable.close();
      return;
    } catch (e) {
      console.warn("showSaveFilePicker falhou; usando fallback.", e);
    }
  }

  fallbackDownload({ filename, mime, data });
}

function buildXlsx(items, filenameBase) {
  const rows = items.map((it) => ({
    Codigo: it.codigo,
    Descricao: it.descricao,
    Quantidade: Number.isFinite(it.quantidade) ? it.quantidade : it.quantidade_raw,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Itens");
  ws["!cols"] = [{ wch: 16 }, { wch: 56 }, { wch: 14 }];

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([out], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  void saveFile({
    filename: `${filenameBase}.xlsx`,
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    data: blob,
    hint: "xlsx",
  });
}

function buildLogText({ fileName, statusLines, meta, items, aggregated }) {
  const now = new Date();
  const header = [
    "TM Sempre Tecnologia — Extrator de Itens DOCX",
    `Data: ${now.toLocaleString("pt-BR")}`,
    `Arquivo: ${fileName || "(nenhum)"}`,
    "",
    "--- Status ---",
    ...statusLines.map((s) => `- ${s}`),
    "",
    "--- Métricas ---",
    `Tabelas totais no DOCX: ${meta?.tables_total ?? 0}`,
    `Tabelas identificadas como 'Itens': ${meta?.itens_tables ?? 0}`,
    `Linhas extraídas (total): ${meta?.rows_extracted ?? 0}`,
    `Linhas ignoradas: ${meta?.rows_ignored ?? 0}`,
    aggregated ? `Itens únicos (somados): ${aggregated.length}` : "",
    "",
  ].filter(Boolean);

  const ignored = (meta?.ignored_details ?? []).slice(0, 300);
  const ignoredBlock = ignored.length
    ? [
        "--- Detalhes ignorados (amostra) ---",
        ...ignored.map((d) => `- ${d}`),
        ignored.length < (meta?.ignored_details ?? []).length
          ? `... (${(meta?.ignored_details ?? []).length - ignored.length} a mais)`
          : "",
        "",
      ].filter(Boolean)
    : [];

  const sample = (items ?? []).slice(0, 20).map(
    (it, i) =>
      `${String(i + 1).padStart(2, "0")}. ${it.codigo} | ${it.descricao} | qtd=${it.quantidade_raw}`
  );

  return [...header, ...ignoredBlock, "--- Saída (amostra) ---", ...sample].join("\n");
}

function xmlTextOf(node) {
  const ts = node.getElementsByTagName("w:t");
  let out = "";
  for (let i = 0; i < ts.length; i++) out += ts[i].textContent ?? "";
  return norm(out);
}

function pickQuantityFromRow(cellsText) {
  if (cellsText.length >= 3) {
    const q = norm(cellsText[2]);
    if (q && q.toUpperCase() !== "#N/D") return q;
  }
  const joined = cellsText.join(" ");
  const m = joined.match(/(\d{1,3}(?:\.\d{3})*,\d+|\d+,\d+|\d+)/);
  return m?.[1] ?? "";
}

async function extractItemsFromDocx(file) {
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);

  const docXml = await zip.file("word/document.xml")?.async("string");
  if (!docXml) throw new Error("Não foi possível ler word/document.xml do DOCX.");

  const parser = new DOMParser();
  const xml = parser.parseFromString(docXml, "application/xml");
  const perr = xml.getElementsByTagName("parsererror");
  if (perr?.length) throw new Error("Falha ao interpretar o XML do DOCX.");

  const tables = Array.from(xml.getElementsByTagName("w:tbl"));

  /** @type {Item[]} */
  const results = [];
  /** @type {string[]} */
  const ignored = [];
  let itensTables = 0;

  tables.forEach((tbl, tIndex) => {
    const rows = Array.from(tbl.getElementsByTagName("w:tr"));
    if (!rows.length) return;

    const headerCells = Array.from(rows[0].getElementsByTagName("w:tc"));
    const headerTexts = headerCells.map((tc) => xmlTextOf(tc));
    const isItens = headerTexts.some((t) => norm(t).toLowerCase() === "itens");
    if (!isItens) return;

    itensTables += 1;

    rows.slice(1).forEach((tr, rOffset) => {
      const rNumber = rOffset + 2;
      const tNumber = tIndex + 1;

      const tcs = Array.from(tr.getElementsByTagName("w:tc"));
      if (!tcs.length) {
        ignored.push(`T${tNumber} L${rNumber}: skip_empty_row`);
        return;
      }

      const cellsText = tcs.map((tc) => xmlTextOf(tc));
      const code = norm(cellsText[0] ?? "");
      const desc = norm(cellsText[1] ?? "");

      if (!code || code.toUpperCase() === "#N/D") {
        ignored.push(`T${tNumber} L${rNumber}: skip_code_empty_or_ND`);
        return;
      }
      if (!CODE_RE.test(code)) {
        ignored.push(`T${tNumber} L${rNumber}: skip_code_invalid ${code}`);
        return;
      }

      const qtyRaw = pickQuantityFromRow(cellsText);
      if (!qtyRaw || qtyRaw.toUpperCase() === "#N/D") {
        ignored.push(`T${tNumber} L${rNumber}: skip_qty_empty_or_ND ${code}`);
        return;
      }

      const qty = parsePtNumber(qtyRaw);

      results.push({
        codigo: code,
        descricao: desc,
        quantidade_raw: qtyRaw,
        quantidade: qty,
        origem: `T${tNumber}/L${rNumber}`,
      });
    });
  });

  const meta = {
    tables_total: tables.length,
    itens_tables: itensTables,
    rows_extracted: results.length,
    rows_ignored: ignored.length,
    ignored_details: ignored,
  };

  return { items: results, meta };
}

function aggregateItems(items, rule) {
  /** @type {Map<string, {codigo:string, descricao:string, quantidade:number}>} */
  const map = new Map();

  const keyOf = (it) => {
    if (rule === "code_only") return norm(it.codigo).toLowerCase();
    if (rule === "desc_only") return norm(it.descricao).toLowerCase();
    return `${norm(it.codigo).toLowerCase()}|${norm(it.descricao).toLowerCase()}`;
  };

  items.forEach((it) => {
    const key = keyOf(it);
    const prev = map.get(key);
    const q = Number.isFinite(it.quantidade) ? it.quantidade : parsePtNumber(it.quantidade_raw);
    const safeQ = Number.isFinite(q) ? q : 0;

    if (!prev) {
      map.set(key, {
        codigo: rule === "desc_only" ? "" : it.codigo,
        descricao: rule === "code_only" ? "" : it.descricao,
        quantidade: safeQ,
      });
    } else {
      prev.quantidade += safeQ;
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const ak = `${a.codigo} ${a.descricao}`.trim().toLowerCase();
    const bk = `${b.codigo} ${b.descricao}`.trim().toLowerCase();
    return ak.localeCompare(bk, "pt-BR");
  });
}

function Badge({ kind, icon, children }) {
  const cls =
    kind === "idle"
      ? "bg-amber-500/10 text-amber-200 border-amber-500/40"
      : kind === "work"
      ? "bg-red-500/10 text-red-200 border-red-500/40"
      : kind === "ok"
      ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/40"
      : "bg-rose-500/10 text-rose-200 border-rose-500/40";

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-bold", cls)}>
      <span className="opacity-90">{icon}</span>
      <span>{children}</span>
    </span>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div
      className="rounded-lg border p-3"
      style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)" }}
    >
      <div className="text-[11px]" style={{ color: COLORS.muted }}>
        {label}
      </div>
      <div className="mt-1 font-mono text-[16px] font-black" style={{ color: COLORS.text }}>
        {value}
      </div>
      {sub ? (
        <div className="mt-1 text-[11px] font-mono" style={{ color: "#a8a29e" }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, desc, right, children }) {
  return (
    <section
      className="rounded-xl border p-5 shadow-sm"
      style={{ background: COLORS.card, borderColor: COLORS.border }}
    >
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2 className="text-[16px] font-extrabold tracking-tight">{title}</h2>
          {desc ? (
            <p className="mt-1 text-[13px]" style={{ color: COLORS.muted }}>
              {desc}
            </p>
          ) : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      {children}
    </section>
  );
}

export default function AppExtratorDocxTMDark() {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  const [file, setFile] = useState(null);
  const [phase, setPhase] = useState("idle"); // idle | work | ok | err
  const [statusText, setStatusText] = useState("Envie um .docx para iniciar.");
  const [lines, setLines] = useState(["Pronto para receber arquivo."]);

  const [items, setItems] = useState(/** @type {Item[]} */ ([]));
  const [meta, setMeta] = useState(null);
  const [logText, setLogText] = useState("");

  const [aggRule, setAggRule] = useState("code_desc");
  const [aggPhase, setAggPhase] = useState("idle");
  const [aggText, setAggText] = useState("Escolha a regra e gere a planilha consolidada.");
  const [aggLines, setAggLines] = useState(["Aguardando ação."]);
  const [aggItems, setAggItems] = useState([]);

  const canProcess = !!file && phase !== "work";
  const canAggregate = phase === "ok" && items.length > 0 && aggPhase !== "work";

  const onPick = useCallback(() => inputRef.current?.click(), []);

  const onFileSelected = useCallback((f) => {
    if (!f) return;

    if (!String(f.name).toLowerCase().endsWith(".docx")) {
      setPhase("err");
      setStatusText("Arquivo inválido. Envie um .docx.");
      setLines(["O arquivo selecionado não é .docx."]);
      return;
    }

    setFile(f);
    setPhase("idle");
    setStatusText("Arquivo carregado. Pronto para processar.");
    setLines(["Arquivo selecionado", "Clique em PROCESSAR DOCUMENTO"]);

    setItems([]);
    setMeta(null);
    setLogText("");

    setAggPhase("idle");
    setAggText("Escolha a regra e gere a planilha consolidada.");
    setAggLines(["Aguardando ação."]);
    setAggItems([]);
  }, []);

  const onInputChange = useCallback(
    (e) => {
      const f = e.target.files?.[0];
      onFileSelected(f);
    },
    [onFileSelected]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDrag(false);
      const f = e.dataTransfer?.files?.[0];
      onFileSelected(f);
    },
    [onFileSelected]
  );

  const processDoc = useCallback(async () => {
    if (!file) return;

    setPhase("work");
    setStatusText("Processando documento...");
    setLines(["Lendo tabelas", "Extraindo códigos e quantidades", "Preparando saída"]);

    const step = async (ms, msg) => {
      await new Promise((r) => setTimeout(r, ms));
      setLines((prev) => [...prev.slice(0, 1), msg]);
    };

    try {
      await step(200, "Abrindo arquivo e lendo XML...");
      const { items: extracted, meta: m } = await extractItemsFromDocx(file);

      await step(200, `Tabelas: ${m.tables_total} • Itens: ${m.itens_tables}`);
      await step(200, `Válidas: ${m.rows_extracted} • Ignoradas: ${m.rows_ignored}`);

      setMeta(m);

      if (!extracted.length) {
        setPhase("err");
        setStatusText("Nenhuma linha válida foi encontrada nas tabelas 'Itens'.");
        setLines([
          "Nenhum item extraído.",
          "Verifique se existe uma tabela com cabeçalho 'Itens' (1ª linha).",
        ]);

        const t = buildLogText({
          fileName: file.name,
          statusLines: ["Sem dados"],
          meta: m,
          items: [],
        });
        setLogText(t);
        return;
      }

      setItems(extracted);

      const t = buildLogText({
        fileName: file.name,
        statusLines: ["Extração concluída"],
        meta: m,
        items: extracted,
      });
      setLogText(t);

      setPhase("ok");
      setStatusText("Extração concluída!");
      setLines([
        `Itens encontrados: ${fmtInt(extracted.length)}`,
        "Gere Excel bruto e (opcional) consolidado",
        "Log disponível para auditoria",
      ]);
    } catch (err) {
      setPhase("err");
      setStatusText("Erro ao processar o DOCX.");
      setLines([
        String(err?.message ?? err),
        "Dica: tente exportar o Word novamente (DOCX padrão).",
      ]);

      const m = meta ?? {
        tables_total: 0,
        itens_tables: 0,
        rows_extracted: 0,
        rows_ignored: 0,
        ignored_details: [],
      };
      const t = buildLogText({
        fileName: file?.name,
        statusLines: ["Erro"],
        meta: m,
        items: [],
      });
      setLogText(t);
    }
  }, [file, meta]);

  const downloadBruto = useCallback(() => {
    if (!items.length) return;
    buildXlsx(items, `itens_bruto_${safeBaseName(file?.name)}`);
  }, [items, file]);

  const downloadSomado = useCallback(() => {
    if (!aggItems.length) return;
    const rows = aggItems.map((x) => ({
      codigo: x.codigo,
      descricao: x.descricao,
      quantidade_raw: fmtQty(x.quantidade),
      quantidade: x.quantidade,
    }));
    buildXlsx(rows, `itens_somados_${safeBaseName(file?.name)}`);
  }, [aggItems, file]);

  const downloadLog = useCallback(() => {
    if (!logText) return;
    void saveFile({
      filename: makeName(file?.name, "itens_log", "txt"),
      mime: "text/plain;charset=utf-8",
      data: new Blob([logText], { type: "text/plain;charset=utf-8" }),
      hint: "txt",
    });
  }, [logText, file]);

  const doAggregate = useCallback(async () => {
    if (!canAggregate) return;

    setAggPhase("work");
    setAggText("Consolidando itens...");
    setAggLines(["Definindo chave", "Somando quantidades", "Preparando saída"]);

    try {
      await new Promise((r) => setTimeout(r, 200));
      const ag = aggregateItems(items, aggRule);
      setAggItems(ag);

      setAggPhase("ok");
      const keyLabel =
        aggRule === "code_only"
          ? "Apenas Código"
          : aggRule === "desc_only"
          ? "Apenas Descrição"
          : "Código + Descrição";
      setAggText("Soma concluída!");
      setAggLines([
        `Regra: ${keyLabel}`,
        `Itens únicos: ${fmtInt(ag.length)}`,
        "Excel consolidado pronto",
      ]);

      if (file) {
        const extra = `\n\n--- Consolidado (amostra) ---\n${ag
          .slice(0, 10)
          .map(
            (x, i) =>
              `${String(i + 1).padStart(2, "0")}. ${x.codigo} | ${x.descricao} | qtd=${fmtQty(
                x.quantidade
              )}`
          )
          .join("\n")}`;
        setLogText((prev) => (prev ? prev + extra : extra));
      }
    } catch (err) {
      setAggPhase("err");
      setAggText("Erro na consolidação.");
      setAggLines([String(err?.message ?? err)]);
    }
  }, [aggRule, canAggregate, items, file]);

  const badge = useMemo(() => {
    if (phase === "work") return { kind: "work", icon: <Loader2 className="h-4 w-4 animate-spin" /> };
    if (phase === "ok") return { kind: "ok", icon: <CheckCircle2 className="h-4 w-4" /> };
    if (phase === "err") return { kind: "err", icon: <AlertTriangle className="h-4 w-4" /> };
    return { kind: "idle", icon: <Info className="h-4 w-4" /> };
  }, [phase]);

  const aggBadge = useMemo(() => {
    if (aggPhase === "work") return { kind: "work", icon: <Loader2 className="h-4 w-4 animate-spin" /> };
    if (aggPhase === "ok") return { kind: "ok", icon: <Sigma className="h-4 w-4" /> };
    if (aggPhase === "err") return { kind: "err", icon: <AlertTriangle className="h-4 w-4" /> };
    return { kind: "idle", icon: <Info className="h-4 w-4" /> };
  }, [aggPhase]);

  const keyLabel =
    aggRule === "code_only" ? "Apenas Código" : aggRule === "desc_only" ? "Apenas Descrição" : "Código + Descrição";

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background:
          "radial-gradient(1200px 500px at 10% 0%, rgba(185,28,28,.10), transparent 60%), radial-gradient(900px 420px at 95% 12%, rgba(180,83,9,.12), transparent 55%), " +
          COLORS.bg,
        color: COLORS.text,
      }}
    >
      {/* ✅ container fluido e sem grid horizontal */}
      <div className="mx-auto w-full max-w-3xl px-4 py-5 md:px-6">
        {/* Header mais compacto (menos altura) */}
        <header
          className="mb-4 flex flex-col gap-3 rounded-xl border p-4 shadow-sm md:flex-row md:items-center md:justify-between"
          style={{ background: COLORS.card, borderColor: COLORS.border }}
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-[16px] font-extrabold tracking-tight" style={{ color: COLORS.primary }}>
              TM Sempre Tecnologia
            </h1>
            <p className="text-[12px]" style={{ color: COLORS.muted }}>
              Extrator de Itens DOCX • Layout Vertical (Canvas-safe)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-2 rounded-full border px-3 py-2 text-[12px]"
              style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)", color: COLORS.muted }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: COLORS.good, boxShadow: "0 0 12px rgba(34,197,94,.55)" }}
              />
              Online
            </div>
            <div
              className="rounded-full border px-3 py-2 text-[12px] font-mono"
              style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)", color: COLORS.muted }}
            >
              v1.3
            </div>
          </div>
        </header>

        {/* ✅ fluxo vertical linear */}
        <main className="flex flex-col gap-4">
          {/* 1) Upload + Processamento */}
          <Section
            title="📄 1) Enviar e processar"
            desc={
              <>
                Envie um arquivo <b>.docx</b>. Depois gere o <b>Excel bruto</b> e (opcional) o <b>consolidado</b>.
              </>
            }
            right={
              <Badge kind={badge.kind} icon={badge.icon}>
                {phase === "idle" ? "⏳ Aguardando" : phase === "work" ? "⚙️ Processando" : phase === "ok" ? "✅ Sucesso" : "⚠️ Erro"}
              </Badge>
            }
          >
            {/* Dropzone */}
            <div
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDrag(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDrag(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDrag(false);
              }}
              onDrop={onDrop}
              className={cn(
                "flex flex-col gap-3 rounded-lg border border-dashed p-4 transition md:flex-row md:items-center md:justify-between",
                drag ? "ring-2 ring-red-500/30" : ""
              )}
              style={{
                borderColor: drag ? COLORS.primary : COLORS.border,
                background: "rgba(255,255,255,.03)",
              }}
              role="button"
              tabIndex={0}
              onClick={onPick}
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-[42px] w-[42px] place-items-center rounded-xl text-[12px] font-black"
                  style={{
                    background: "linear-gradient(135deg, rgba(185,28,28,.95), rgba(220,38,38,.65))",
                    color: "#faf7f5",
                  }}
                >
                  DOCX
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="text-[13px] font-bold">Arraste o arquivo aqui</div>
                  <div className="text-[12px]" style={{ color: COLORS.muted }}>
                    ou clique para selecionar
                  </div>
                </div>
              </div>
              <div className="text-[12px]" style={{ color: COLORS.muted }}>
                Máx. recomendado: 20MB
              </div>
            </div>

            <input ref={inputRef} type="file" accept=".docx" className="hidden" onChange={onInputChange} />

            {/* Ações primárias (peso visual claro) */}
            <div className="mt-3 flex flex-col gap-2 md:flex-row">
              <button
                type="button"
                onClick={processDoc}
                disabled={!canProcess}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[12px] font-extrabold uppercase tracking-widest shadow-sm transition disabled:opacity-50 md:w-auto"
                style={{
                  background: COLORS.primary,
                  color: "#faf7f5",
                  boxShadow: "0 8px 20px rgba(185,28,28,.18)",
                }}
              >
                {phase === "work" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                🔴 Processar documento
              </button>

              <button
                type="button"
                onClick={onPick}
                disabled={phase === "work"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[12px] font-extrabold uppercase tracking-widest transition disabled:opacity-50 md:w-auto"
                style={{ borderColor: COLORS.border, color: COLORS.text, background: "rgba(0,0,0,.06)" }}
              >
                <CloudUpload className="h-4 w-4" />
                Selecionar outro
              </button>
            </div>

            {/* Status + Arquivo atual */}
            <div
              className="mt-3 rounded-lg border p-4"
              style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)" }}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-[12px]" style={{ color: COLORS.muted }}>
                  {statusText}
                </div>
                <div className="font-mono text-[12px]" style={{ color: COLORS.text }}>
                  {file?.name ?? "(nenhum)"}
                </div>
              </div>

              <div className="mt-3 space-y-1 font-mono text-[12px] leading-relaxed break-words" style={{ color: COLORS.muted }}>
                {lines.map((l, i) => (
                  <div key={i}>• {l}</div>
                ))}
              </div>

              {/* Downloads (secundários) */}
              <div className="mt-3 flex flex-col gap-2 md:flex-row">
                <button
                  type="button"
                  onClick={downloadBruto}
                  disabled={phase !== "ok" || items.length === 0}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[12px] font-extrabold uppercase tracking-widest transition disabled:opacity-50 md:w-auto"
                  style={{ background: COLORS.primary, color: "#faf7f5" }}
                >
                  <Download className="h-4 w-4" />
                  Baixar Excel bruto
                </button>

                <button
                  type="button"
                  onClick={downloadLog}
                  disabled={!logText}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[12px] font-extrabold uppercase tracking-widest transition disabled:opacity-50 md:w-auto"
                  style={{ borderColor: COLORS.border, color: COLORS.text, background: "rgba(0,0,0,.06)" }}
                >
                  <Download className="h-4 w-4" />
                  Baixar Log
                </button>
              </div>
            </div>
          </Section>

          {/* 2) Resumo (antes de preview) */}
          <Section
            title="📊 2) Resumo"
            desc="Métricas do processamento e do consolidado (quando gerado)."
          >
            <div className="grid grid-cols-2 gap-2">
              <StatCard label="Itens extraídos" value={fmtInt(items.length)} />
              <StatCard label="Itens somados" value={fmtInt(aggItems.length)} sub={aggPhase === "ok" ? `Regra: ${keyLabel}` : "-"} />
              <div className="col-span-2 grid grid-cols-2 gap-2">
                <StatCard label="Tabelas / “Itens”" value={meta ? `${meta.tables_total} / ${meta.itens_tables}` : "-"} />
                <StatCard label="Ignoradas" value={meta ? fmtInt(meta.rows_ignored) : "-"} />
              </div>
            </div>
          </Section>

          {/* 3) Consolidação (aparece só com sucesso) */}
          <AnimatePresence>
            {phase === "ok" && items.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <Section
                  title="🔢 3) Somar itens iguais"
                  desc={
                    <>
                      Gera uma planilha consolidada somando <b>Quantidade</b> para itens repetidos.
                    </>
                  }
                  right={
                    <Badge kind={aggBadge.kind} icon={aggBadge.icon}>
                      {aggPhase === "idle" ? "🧮 Pronto" : aggPhase === "work" ? "🧮 Somando" : aggPhase === "ok" ? "🧮 Concluído" : "⚠️ Erro"}
                    </Badge>
                  }
                >
                  <div className="text-[12px]" style={{ color: COLORS.muted }}>
                    Regra de chave:
                  </div>

                  <div className="mt-2 grid gap-2 md:grid-cols-3">
                    {[
                      { v: "code_desc", label: "Código + Descrição" },
                      { v: "code_only", label: "Apenas Código" },
                      { v: "desc_only", label: "Apenas Descrição" },
                    ].map((opt) => (
                      <label
                        key={opt.v}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-[12px] font-bold transition"
                        )}
                        style={{
                          borderColor: aggRule === opt.v ? COLORS.primary : COLORS.border,
                          background: "rgba(255,255,255,.03)",
                        }}
                      >
                        <input
                          type="radio"
                          name="rule"
                          value={opt.v}
                          checked={aggRule === opt.v}
                          onChange={() => setAggRule(opt.v)}
                          style={{ accentColor: COLORS.primary }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 md:flex-row">
                    <button
                      type="button"
                      onClick={doAggregate}
                      disabled={!canAggregate}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-[12px] font-extrabold uppercase tracking-widest transition disabled:opacity-50 md:w-auto"
                      style={{ background: COLORS.primary, color: "#faf7f5" }}
                    >
                      {aggPhase === "work" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sigma className="h-4 w-4" />
                      )}
                      🔴 Gerar planilha somada
                    </button>

                    <button
                      type="button"
                      onClick={downloadSomado}
                      disabled={aggPhase !== "ok" || aggItems.length === 0}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-[12px] font-extrabold uppercase tracking-widest transition disabled:opacity-50 md:w-auto"
                      style={{ borderColor: COLORS.border, color: COLORS.text, background: "rgba(0,0,0,.06)" }}
                    >
                      <Download className="h-4 w-4" />
                      Baixar Excel consolidado
                    </button>
                  </div>

                  <div
                    className="mt-3 rounded-lg border p-4"
                    style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)" }}
                  >
                    <div className="text-[12px]" style={{ color: COLORS.muted }}>
                      {aggText}
                    </div>
                    <div className="mt-3 space-y-1 font-mono text-[12px] leading-relaxed break-words" style={{ color: COLORS.muted }}>
                      {aggLines.map((l, i) => (
                        <div key={i}>• {l}</div>
                      ))}
                    </div>

                    {aggPhase === "ok" && aggItems.length ? (
                      <div
                        className="mt-3 rounded-lg border p-3"
                        style={{ borderColor: COLORS.border, background: "rgba(255,255,255,.03)" }}
                      >
                        <div className="mb-2 text-[12px] font-bold" style={{ color: COLORS.text }}>
                          Prévia do consolidado (8 primeiros)
                        </div>
                        <div className="grid gap-2">
                          {aggItems.slice(0, 8).map((x, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-3 rounded-md border px-3 py-2"
                              style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)" }}
                            >
                              <div className="min-w-0">
                                <div className="font-mono text-[12px]" style={{ color: COLORS.text }}>
                                  {x.codigo || "(sem código)"}
                                </div>
                                <div className="text-[12px] break-words whitespace-normal" style={{ color: COLORS.muted }}>
                                  {x.descricao || "(sem descrição)"}
                                </div>
                              </div>
                              <div className="shrink-0 font-mono text-[12px]" style={{ color: COLORS.text }}>
                                {fmtQty(x.quantidade)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </Section>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* 4) Preview itens extraídos */}
          <AnimatePresence>
            {phase === "ok" && items.length ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
              >
                <Section
                  title="👀 4) Prévia dos itens extraídos"
                  desc="Mostra os 10 primeiros itens extraídos para conferência rápida."
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="text-[12px] font-bold" style={{ color: COLORS.text }}>
                      Primeiros 10
                    </div>
                    <div className="text-[12px] font-mono" style={{ color: COLORS.muted }}>
                      {fmtInt(items.length)} linhas
                    </div>
                  </div>

                  <div className="grid gap-2">
                    {items.slice(0, 10).map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 rounded-md border px-3 py-2"
                        style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)" }}
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-[12px]" style={{ color: COLORS.text }}>
                            {it.codigo}
                          </div>
                          <div className="text-[12px] break-words whitespace-normal" style={{ color: COLORS.muted }}>
                            {it.descricao || "(sem descrição)"}
                          </div>
                          <div className="text-[11px]" style={{ color: "#a8a29e" }}>
                            origem: {it.origem}
                          </div>
                        </div>
                        <div className="shrink-0 text-right font-mono text-[12px]" style={{ color: COLORS.text }}>
                          {it.quantidade_raw}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* 5) Regras e privacidade (rodapé informativo, sem duplicar status) */}
          <Section
            title="ℹ️ Regras e privacidade"
            desc="Referência rápida das regras de extração e garantia de processamento local."
          >
            <div className="grid gap-3 md:grid-cols-2">
              <div
                className="rounded-lg border p-4"
                style={{ borderColor: COLORS.border, background: "rgba(0,0,0,.08)" }}
              >
                <div className="mb-2 text-[12px] font-bold" style={{ color: COLORS.text }}>
                  ⚙️ Regras de extração
                </div>
                <ul className="list-disc space-y-1 pl-5 text-[12px]" style={{ color: COLORS.muted }}>
                  <li>Busca tabelas com cabeçalho “Itens” na 1ª linha.</li>
                  <li>Coluna 1: Código (aceita 17.4 / 13.12 etc). Ignora #N/D.</li>
                  <li>Coluna 2: Descrição.</li>
                  <li>Quantidade: prefere 3ª coluna; fallback por número na linha.</li>
                  <li>Exporta Excel (.xlsx) e Log (.txt).</li>
                </ul>
              </div>

              <div
                className="rounded-lg border p-4"
                style={{ borderColor: COLORS.border, background: "rgba(255,255,255,.03)" }}
              >
                <div className="text-[12px] font-bold" style={{ color: COLORS.text }}>
                  🔒 Privacidade
                </div>
                <p className="mt-2 text-[12px]" style={{ color: COLORS.muted }}>
                  O processamento acontece no seu navegador. Nenhum arquivo é enviado para servidor.
                </p>
              </div>
            </div>
          </Section>
        </main>

        <footer className="mt-6 text-center text-[11px]" style={{ color: COLORS.muted }}>
          TM Sempre Tecnologia • Extrator DOCX — UI Dark • v1.3 • Layout Vertical
        </footer>
      </div>
    </div>
  );
}
