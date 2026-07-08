import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  Folder,
  Keyboard,
  Layers,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";

/**
 * Protótipo Interativo (alta fidelidade) — Organizador de Levantamentos via WhatsApp
 * - Conceito central: AMBIENTE ATIVO (não muda sozinho)
 * - Sugestões aparecem como PROMPT (você confirma ou ignora)
 * - Atalhos de teclado para trocar ambiente e aplicar em massa
 * - Seleção + aplicação em lote
 * - “Pendentes” (sem ambiente) para revisão rápida
 */

const ENV_ORDER = [
  "1 - Autoatendimento",
  "2 - Atendimento",
  "3 - Caiex",
  "4 - Suporte",
  "5 - Sala de apoio operacional",
  "6 - Corredor de acesso",
  "7 - Copa",
  "8 - Sala online",
  "9 - Banheiro PNE",
  "10 - Banheiro feminino",
  "11 - Banheiro masculino",
  "12 - Corredor de abastecimento",
  "13 - Cofre",
  "14 - Casa de máquina",
  "15 - Casa de máquina 2",
];

const envId = (label) =>
  label
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

const ENV = ENV_ORDER.map((label, idx) => ({
  id: envId(label),
  label,
  order: idx + 1,
}));

const ACCENT = {
  green: "#32ff7e",
  blue: "#22d3ee",
  bg: "#070A0F",
  panel: "#0B1220",
  panel2: "#0E1A2D",
  stroke: "rgba(255,255,255,0.08)",
  stroke2: "rgba(34,211,238,0.25)",
  text: "rgba(255,255,255,0.92)",
  sub: "rgba(255,255,255,0.62)",
  danger: "#ff4d4d",
  warn: "#fbbf24",
};

const pill = (tone) => {
  switch (tone) {
    case "ok":
      return "bg-[rgba(50,255,126,0.12)] border-[rgba(50,255,126,0.35)] text-[rgba(50,255,126,0.95)]";
    case "warn":
      return "bg-[rgba(251,191,36,0.10)] border-[rgba(251,191,36,0.35)] text-[rgba(251,191,36,0.95)]";
    case "danger":
      return "bg-[rgba(255,77,77,0.10)] border-[rgba(255,77,77,0.35)] text-[rgba(255,77,77,0.95)]";
    case "info":
      return "bg-[rgba(34,211,238,0.10)] border-[rgba(34,211,238,0.35)] text-[rgba(34,211,238,0.95)]";
    default:
      return "bg-[rgba(255,255,255,0.06)] border-[rgba(255,255,255,0.10)] text-[rgba(255,255,255,0.72)]";
  }
};

const KeyHint = ({ children }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-[11px] text-[rgba(255,255,255,0.78)]">
    <Keyboard className="h-3 w-3" />
    <span className="font-mono">{children}</span>
  </span>
);

const mkFiles = (prefix, count, start = 1) =>
  Array.from({ length: count }).map((_, i) => `${prefix}${String(start + i).padStart(4, "0")}.jpg`);

// Mock “export do WhatsApp” já interpretado (eventos)
const EXAMPLE_EVENTS = [
  {
    id: "e1",
    type: "photos",
    time: "08:44",
    sender: "Antonio",
    files: mkFiles("IMG_20251224_", 8, 28),
    assignedEnvId: null,
  },
  {
    id: "e2",
    type: "message",
    time: "08:47",
    sender: "Antonio",
    text: "Autoatendimento — pintura / retoque",
    suggestEnvLabel: "1 - Autoatendimento",
    confidence: 0.92,
  },
  {
    id: "e3",
    type: "photos",
    time: "08:48",
    sender: "Danillo",
    files: mkFiles("IMG_20251224_", 10, 36),
    assignedEnvId: null,
  },
  {
    id: "e4",
    type: "message",
    time: "08:49",
    sender: "Danillo",
    text: "Copa — torneira / pia (verificar)",
    suggestEnvLabel: "7 - Copa",
    confidence: 0.78,
  },
  {
    id: "e5",
    type: "photos",
    time: "08:50",
    sender: "Joao",
    files: mkFiles("IMG_20251224_", 12, 46),
    assignedEnvId: null,
  },
  {
    id: "e6",
    type: "message",
    time: "08:52",
    sender: "Joao",
    text: "Atendimento — parede com avaria",
    suggestEnvLabel: "2 - Atendimento",
    confidence: 0.84,
  },
  {
    id: "e7",
    type: "photos",
    time: "08:53",
    sender: "Antonio",
    files: mkFiles("IMG_20251224_", 14, 58),
    assignedEnvId: null,
  },
  {
    id: "e8",
    type: "message",
    time: "08:54",
    sender: "Antonio",
    text: "Copa — voltou (sem querer mandei fora de ordem)",
    suggestEnvLabel: "7 - Copa",
    confidence: 0.65,
  },
  {
    id: "e9",
    type: "photos",
    time: "08:55",
    sender: "Danillo",
    files: mkFiles("IMG_20251224_", 10, 72),
    assignedEnvId: null,
  },
  {
    id: "e10",
    type: "message",
    time: "08:56",
    sender: "Danillo",
    text: "Fachada — placa (novo ambiente)",
    suggestEnvLabel: "Fachada",
    confidence: 0.71,
  },
  {
    id: "e11",
    type: "photos",
    time: "08:57",
    sender: "Joao",
    files: mkFiles("IMG_20251224_", 9, 82),
    assignedEnvId: null,
  },
];

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function confidenceTone(c) {
  if (c >= 0.85) return "ok";
  if (c >= 0.7) return "warn";
  return "danger";
}

function formatPct(c) {
  return `${Math.round(clamp01(c) * 100)}%`;
}

function useHotkeys({
  enabled,
  onSetActiveEnv,
  onApplyActiveToSelection,
  onJumpNextPending,
  onToggleShowMessages,
}) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

      // 1..9 -> env 1..9
      // 0 -> env 10
      // Alt+1..5 -> env 11..15
      if (!e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key >= "1" && e.key <= "9") {
          const idx = Number(e.key) - 1;
          const env = ENV[idx];
          if (env) onSetActiveEnv(env.id);
        }
        if (e.key === "0") {
          const env = ENV[9];
          if (env) onSetActiveEnv(env.id);
        }
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key >= "1" && e.key <= "5") {
          const idx = 10 + (Number(e.key) - 1); // 11..15
          const env = ENV[idx];
          if (env) onSetActiveEnv(env.id);
        }
      }

      // A = aplicar ambiente ativo nos selecionados
      if (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        onApplyActiveToSelection();
      }

      // J = pular para próximo pendente
      if (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        onJumpNextPending();
      }

      // M = mostrar/ocultar mensagens
      if (!e.altKey && !e.ctrlKey && !e.metaKey && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        onToggleShowMessages();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onSetActiveEnv, onApplyActiveToSelection, onJumpNextPending, onToggleShowMessages]);
}

function TinyThumb({ label }) {
  // Thumb fake (placeholder) com estética neon/tech
  const hash = Array.from(label).reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  return (
    <div
      className="relative h-12 w-12 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.10)]"
      style={{
        background:
          `radial-gradient(circle at 20% 20%, rgba(34,211,238,0.35), transparent 55%), ` +
          `radial-gradient(circle at 80% 60%, rgba(50,255,126,0.22), transparent 55%), ` +
          `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `conic-gradient(from 180deg, hsla(${hue}, 95%, 60%, 0.35), transparent, hsla(${(hue + 90) % 360}, 95%, 60%, 0.18))`,
        }}
      />
      <div className="absolute bottom-1 left-1 right-1 truncate text-[10px] text-[rgba(255,255,255,0.78)]">
        {label.replace(/\.jpg$/i, "")}
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#0B1220] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] px-5 py-4">
          <div className="text-sm font-semibold text-[rgba(255,255,255,0.9)]">{title}</div>
          <button
            onClick={onClose}
            className="rounded-lg border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.06)] p-2 text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.10)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Chip({ tone = "default", children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${pill(tone)}`}>
      {children}
    </span>
  );
}

function Button({ tone = "default", onClick, children, className = "", disabled = false }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    default:
      "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.10)]",
    primary:
      "border-[rgba(34,211,238,0.35)] bg-[rgba(34,211,238,0.12)] text-[rgba(34,211,238,0.95)] hover:bg-[rgba(34,211,238,0.18)]",
    success:
      "border-[rgba(50,255,126,0.35)] bg-[rgba(50,255,126,0.12)] text-[rgba(50,255,126,0.95)] hover:bg-[rgba(50,255,126,0.18)]",
    danger:
      "border-[rgba(255,77,77,0.35)] bg-[rgba(255,77,77,0.10)] text-[rgba(255,77,77,0.95)] hover:bg-[rgba(255,77,77,0.16)]",
  };
  return (
    <button disabled={disabled} onClick={onClick} className={`${base} ${styles[tone]} ${className}`}>
      {children}
    </button>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-3 py-2 pr-9 text-sm text-[rgba(255,255,255,0.90)] outline-none hover:bg-[rgba(255,255,255,0.10)]"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(255,255,255,0.55)]" />
    </div>
  );
}

function ProgressBar({ value }) {
  const pct = Math.round(clamp01(value) * 100);
  return (
    <div className="h-2 w-full overflow-hidden rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.06)]">
      <div
        className="h-full"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(90deg, rgba(34,211,238,0.85), rgba(50,255,126,0.85))",
        }}
      />
    </div>
  );
}

export default function PrototypeOrganizadorWhatsApp() {
  const [step, setStep] = useState("intro"); // intro | review
  const [events, setEvents] = useState(EXAMPLE_EVENTS);

  const [activeEnvId, setActiveEnvId] = useState(ENV[0]?.id ?? "");
  const [showMessages, setShowMessages] = useState(true);
  const [filterEnvId, setFilterEnvId] = useState("all");
  const [selectedPhotoEventIds, setSelectedPhotoEventIds] = useState(() => new Set());

  const [toast, setToast] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [addEnvOpen, setAddEnvOpen] = useState(false);
  const [pendingNewEnvLabel, setPendingNewEnvLabel] = useState("");

  const listRef = useRef(null);
  const eventRefs = useRef({});

  const envOptions = useMemo(
    () => ENV.map((e) => ({ value: e.id, label: e.label })),
    []
  );

  const activeEnv = useMemo(() => ENV.find((e) => e.id === activeEnvId), [activeEnvId]);

  const photoEvents = useMemo(() => events.filter((e) => e.type === "photos"), [events]);

  const totals = useMemo(() => {
    const totalPhotos = photoEvents.reduce((sum, e) => sum + e.files.length, 0);
    const assignedPhotos = photoEvents.reduce(
      (sum, e) => sum + (e.assignedEnvId ? e.files.length : 0),
      0
    );
    const pendingPhotos = totalPhotos - assignedPhotos;
    return { totalPhotos, assignedPhotos, pendingPhotos };
  }, [photoEvents]);

  const countsByEnvId = useMemo(() => {
    const base = Object.fromEntries(ENV.map((e) => [e.id, 0]));
    base.__pending__ = 0;

    for (const pe of photoEvents) {
      if (!pe.assignedEnvId) {
        base.__pending__ += pe.files.length;
        continue;
      }
      if (base[pe.assignedEnvId] != null) base[pe.assignedEnvId] += pe.files.length;
      else base[pe.assignedEnvId] = (base[pe.assignedEnvId] || 0) + pe.files.length;
    }

    return base;
  }, [photoEvents]);

  const filteredEvents = useMemo(() => {
    const wantsAll = filterEnvId === "all";
    const wantsPending = filterEnvId === "pending";

    return events.filter((e) => {
      if (e.type === "message") return showMessages;

      if (wantsAll) return true;
      if (wantsPending) return !e.assignedEnvId;
      return e.assignedEnvId === filterEnvId;
    });
  }, [events, filterEnvId, showMessages]);

  const selectedCount = useMemo(() => selectedPhotoEventIds.size, [selectedPhotoEventIds]);

  const selectedPhotoCount = useMemo(() => {
    if (selectedPhotoEventIds.size === 0) return 0;
    let sum = 0;
    for (const e of events) {
      if (e.type === "photos" && selectedPhotoEventIds.has(e.id)) sum += e.files.length;
    }
    return sum;
  }, [events, selectedPhotoEventIds]);

  const recentEnvSwitches = useMemo(() => {
    // Conta trocas de ambiente ativo nas últimas ações (simulado por histórico simples)
    // Aqui vamos estimar por “mensagens com sugestão” para demonstrar detector de bagunça.
    const lastSuggestions = events.filter((e) => e.type === "message" && e.suggestEnvLabel).slice(-6);
    const labels = lastSuggestions.map((m) => m.suggestEnvLabel);
    let switches = 0;
    for (let i = 1; i < labels.length; i++) if (labels[i] !== labels[i - 1]) switches++;
    return switches;
  }, [events]);

  function showToast(message, tone = "info") {
    setToast({ message, tone });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2200);
  }

  function toggleSelect(eventId) {
    setSelectedPhotoEventIds((prev) => {
      const next = new Set(prev);
      if (next.has(eventId)) next.delete(eventId);
      else next.add(eventId);
      return next;
    });
  }

  function clearSelection() {
    setSelectedPhotoEventIds(new Set());
  }

  function applyEnvToPhotoEventIds(envIdToApply, ids) {
    setEvents((prev) =>
      prev.map((e) => {
        if (e.type !== "photos") return e;
        if (!ids.has(e.id)) return e;
        return { ...e, assignedEnvId: envIdToApply };
      })
    );
  }

  function applyActiveToSelection() {
    if (!activeEnvId || selectedPhotoEventIds.size === 0) {
      showToast("Selecione ao menos 1 bloco de fotos para aplicar.", "warn");
      return;
    }
    applyEnvToPhotoEventIds(activeEnvId, selectedPhotoEventIds);
    showToast(`Aplicado: ${activeEnv?.label ?? "Ambiente"} (${selectedPhotoCount} fotos)`, "ok");
    clearSelection();
  }

  function jumpNextPending() {
    const idx = filteredEvents.findIndex((e) => e.type === "photos" && !e.assignedEnvId);
    if (idx === -1) {
      showToast("Nenhum pendente no filtro atual.", "info");
      return;
    }
    const target = filteredEvents[idx];
    const el = eventRefs.current[target.id];
    if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Pulando para próximo pendente.", "info");
  }

  function findLastPhotoBlockBefore(messageEventId) {
    const idx = events.findIndex((e) => e.id === messageEventId);
    if (idx <= 0) return null;
    for (let i = idx - 1; i >= 0; i--) {
      const e = events[i];
      if (e.type === "photos") return e;
    }
    return null;
  }

  function applySuggestion({
    messageId,
    action, // keep | switch
    applyToLastPhotoBlock,
  }) {
    const msg = events.find((e) => e.id === messageId);
    if (!msg || msg.type !== "message") return;

    const label = msg.suggestEnvLabel?.trim();
    const known = ENV.find((e) => e.label.toLowerCase() === label?.toLowerCase());

    if (!known) {
      // sugestão de ambiente novo
      setPendingNewEnvLabel(label || "Novo ambiente");
      setAddEnvOpen(true);
      return;
    }

    if (action === "switch") {
      setActiveEnvId(known.id);
      showToast(`Ambiente ATIVO: ${known.label}`, "info");
    } else {
      showToast(`Mantido ambiente ATIVO: ${activeEnv?.label ?? "—"}`, "info");
    }

    if (applyToLastPhotoBlock) {
      const lastBlock = findLastPhotoBlockBefore(messageId);
      if (lastBlock) {
        const ids = new Set([lastBlock.id]);
        const envToApply = action === "switch" ? known.id : activeEnvId;
        applyEnvToPhotoEventIds(envToApply, ids);
        const appliedLabel = ENV.find((e) => e.id === envToApply)?.label ?? "Ambiente";
        showToast(`Aplicado ao último bloco: ${appliedLabel} (${lastBlock.files.length} fotos)`, "ok");
      }
    }
  }

  function addNewEnvironment(label) {
    const clean = label.trim();
    if (!clean) {
      showToast("Informe um nome de ambiente.", "warn");
      return;
    }

    // adiciona no final (neste protótipo). No produto real, você escolheria posição/ordem.
    const exists = ENV_ORDER.some((x) => x.toLowerCase() === clean.toLowerCase());
    if (exists) {
      showToast("Esse ambiente já existe na lista.", "warn");
      setAddEnvOpen(false);
      return;
    }

    // ⚠️ Protótipo: ENV é constante. Vamos “simular” adicionando como opção extra via estado.
    // Para não quebrar o demo, iremos registrar num campo especial em eventos e sugerir uso de "PENDENTES".
    showToast(`Ambiente "${clean}" adicionado (simulação).`, "ok");
    setAddEnvOpen(false);
  }

  useHotkeys({
    enabled: step === "review",
    onSetActiveEnv: (id) => {
      setActiveEnvId(id);
      const e = ENV.find((x) => x.id === id);
      showToast(`Ambiente ATIVO: ${e?.label ?? "—"}`, "info");
    },
    onApplyActiveToSelection: applyActiveToSelection,
    onJumpNextPending: jumpNextPending,
    onToggleShowMessages: () => setShowMessages((v) => !v),
  });

  const shortcuts = useMemo(() => {
    const base = [
      { k: "1..9", v: "Ambientes 1–9" },
      { k: "0", v: "Ambiente 10" },
      { k: "Alt+1..5", v: "Ambientes 11–15" },
      { k: "A", v: "Aplicar ambiente ativo (seleção)" },
      { k: "J", v: "Pular para próximo pendente" },
      { k: "M", v: "Mostrar/ocultar mensagens" },
    ];
    return base;
  }, []);

  const bgStyle = {
    background:
      "radial-gradient(circle at 10% 10%, rgba(34,211,238,0.10), transparent 35%)," +
      "radial-gradient(circle at 80% 20%, rgba(50,255,126,0.08), transparent 40%)," +
      "radial-gradient(circle at 50% 90%, rgba(34,211,238,0.10), transparent 38%)," +
      "linear-gradient(180deg, #070A0F, #060814)",
  };

  return (
    <div className="min-h-screen w-full" style={bgStyle}>
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="h-9 w-9 rounded-2xl border border-[rgba(34,211,238,0.30)]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.35), rgba(50,255,126,0.10))",
                }}
              />
              <div>
                <div className="text-sm font-semibold text-[rgba(255,255,255,0.92)]">
                  Organizador de Levantamentos — WhatsApp
                </div>
                <div className="text-xs text-[rgba(255,255,255,0.62)]">
                  Protótipo interativo (conceito: Ambiente Ativo + Sugestões confirmáveis)
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === "review" ? (
              <>
                <Button tone="primary" onClick={() => setExportOpen(true)}>
                  <Download className="h-4 w-4" /> Exportar
                </Button>
                <Button
                  tone="default"
                  onClick={() => {
                    setEvents(EXAMPLE_EVENTS);
                    setActiveEnvId(ENV[0]?.id ?? "");
                    setFilterEnvId("all");
                    clearSelection();
                    showToast("Demo reiniciado.", "info");
                  }}
                >
                  Reiniciar demo
                </Button>
              </>
            ) : null}
          </div>
        </header>

        {step === "intro" ? (
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-3">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#0B1220] p-5 shadow-[0_0_0_1px_rgba(34,211,238,0.05)]">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[rgba(34,211,238,0.9)]" />
                  <div className="text-sm font-semibold text-[rgba(255,255,255,0.92)]">Importação</div>
                </div>

                <div className="text-sm text-[rgba(255,255,255,0.72)]">
                  Arraste o <span className="font-mono">.txt</span> exportado do WhatsApp + a pasta de fotos.
                  <div className="mt-2 text-xs text-[rgba(255,255,255,0.58)]">
                    Neste protótipo, você pode usar dados de exemplo para simular 1000+ fotos.
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] p-4">
                    <div className="text-xs font-semibold text-[rgba(255,255,255,0.85)]">Arquivos selecionados</div>
                    <div className="mt-2 space-y-2 text-xs text-[rgba(255,255,255,0.65)]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono">Conversa.txt</span>
                        <Chip tone="info">mensagens</Chip>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono">/Fotos/</span>
                        <Chip tone="info">imagens</Chip>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] p-4">
                    <div className="text-xs font-semibold text-[rgba(255,255,255,0.85)]">Configuração rápida</div>
                    <div className="mt-2 space-y-2 text-xs text-[rgba(255,255,255,0.65)]">
                      <div className="flex items-center justify-between">
                        <span>Ambiente inicial</span>
                        <span className="text-[rgba(255,255,255,0.85)]">{ENV[0]?.label}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Padrão</span>
                        <span className="text-[rgba(255,255,255,0.85)]">Não muda sozinho</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    tone="success"
                    onClick={() => {
                      // Simula um lote grande (1000+) duplicando eventos/fotos
                      const mega = [];
                      let idc = 1;
                      let fileCounter = 1;
                      const rotateSuggest = [
                        "1 - Autoatendimento",
                        "7 - Copa",
                        "2 - Atendimento",
                        "1 - Autoatendimento",
                        "4 - Suporte",
                        "1 - Autoatendimento",
                      ];
                      for (let b = 0; b < 30; b++) {
                        mega.push({
                          id: `p_${idc++}`,
                          type: "photos",
                          time: `0${8 + (b % 2)}:${String(10 + (b % 50)).padStart(2, "0")}`,
                          sender: ["Antonio", "Danillo", "Joao"][b % 3],
                          files: mkFiles("IMG_20251224_", 35, fileCounter),
                          assignedEnvId: null,
                        });
                        fileCounter += 35;
                        mega.push({
                          id: `m_${idc++}`,
                          type: "message",
                          time: `0${8 + (b % 2)}:${String(11 + (b % 50)).padStart(2, "0")}`,
                          sender: ["Antonio", "Danillo", "Joao"][b % 3],
                          text: `Sugestão: ${rotateSuggest[b % rotateSuggest.length]} — item ${b + 1}`,
                          suggestEnvLabel: rotateSuggest[b % rotateSuggest.length],
                          confidence: 0.65 + ((b % 4) * 0.1),
                        });
                      }
                      setEvents(mega);
                      setActiveEnvId(ENV[0]?.id ?? "");
                      setStep("review");
                      showToast("Dados de exemplo carregados (1000+ fotos).", "ok");
                    }}
                  >
                    <Layers className="h-4 w-4" /> Usar dados de exemplo (1000+)
                  </Button>

                  <Button
                    tone="primary"
                    onClick={() => {
                      setEvents(EXAMPLE_EVENTS);
                      setActiveEnvId(ENV[0]?.id ?? "");
                      setStep("review");
                      showToast("Dados de exemplo carregados.", "ok");
                    }}
                  >
                    Usar exemplo pequeno
                  </Button>
                </div>

                <div className="mt-5 rounded-2xl border border-[rgba(34,211,238,0.18)] bg-[rgba(34,211,238,0.06)] p-4 text-xs text-[rgba(255,255,255,0.70)]">
                  <div className="mb-2 font-semibold text-[rgba(34,211,238,0.95)]">Como esse produto resolve sua dor</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <b>Ambiente Ativo</b> fica travado: o sistema <b>não troca sozinho</b>.
                    </li>
                    <li>
                      Quando aparece texto sugerindo outro ambiente, vira um <b>prompt</b> (você decide).
                    </li>
                    <li>
                      Para 1000 fotos: revisão rápida com <b>atalhos</b>, <b>seleção em lote</b> e <b>pendências</b>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#0B1220] p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Keyboard className="h-4 w-4 text-[rgba(255,255,255,0.75)]" />
                  <div className="text-sm font-semibold text-[rgba(255,255,255,0.92)]">Atalhos</div>
                </div>
                <div className="space-y-2">
                  {shortcuts.map((s) => (
                    <div key={s.k} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[rgba(255,255,255,0.62)]">{s.v}</span>
                      <span className="font-mono text-[rgba(255,255,255,0.88)]">{s.k}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] p-4">
                  <div className="text-xs font-semibold text-[rgba(255,255,255,0.85)]">Lista oficial de ambientes</div>
                  <div className="mt-2 max-h-52 overflow-auto pr-1 text-xs text-[rgba(255,255,255,0.62)]">
                    <ol className="list-decimal space-y-1 pl-5">
                      {ENV_ORDER.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="grid gap-4 md:grid-cols-12">
            {/* Sidebar */}
            <aside className="md:col-span-4">
              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#0B1220] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-sm font-semibold text-[rgba(255,255,255,0.92)]">Revisão por ambiente</div>
                  <Chip tone={totals.pendingPhotos === 0 ? "ok" : "warn"}>
                    {totals.pendingPhotos === 0 ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" /> 100% atribuídas
                      </>
                    ) : (
                      <>
                        <TriangleAlert className="h-3.5 w-3.5" /> {totals.pendingPhotos} pendentes
                      </>
                    )}
                  </Chip>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-[rgba(255,255,255,0.62)]">Progresso</div>
                  <ProgressBar value={totals.totalPhotos ? totals.assignedPhotos / totals.totalPhotos : 0} />
                  <div className="flex items-center justify-between text-xs text-[rgba(255,255,255,0.62)]">
                    <span>{totals.assignedPhotos} atribuídas</span>
                    <span>{totals.totalPhotos} total</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    tone="default"
                    onClick={() => {
                      setFilterEnvId("pending");
                      showToast("Filtro: Pendentes", "info");
                    }}
                  >
                    <Filter className="h-4 w-4" /> Pendentes
                  </Button>
                  <Button
                    tone="default"
                    onClick={() => {
                      setFilterEnvId("all");
                      showToast("Filtro: Todos", "info");
                    }}
                  >
                    Todos
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.70)]">
                    <input
                      type="checkbox"
                      checked={showMessages}
                      onChange={(e) => setShowMessages(e.target.checked)}
                      className="h-4 w-4 rounded border border-[rgba(255,255,255,0.25)] bg-transparent"
                    />
                    Mostrar mensagens
                  </label>
                  <KeyHint>M</KeyHint>
                </div>

                <div className="mt-4">
                  <div className="mb-2 text-xs font-semibold text-[rgba(255,255,255,0.85)]">Ambientes</div>
                  <div className="max-h-[52vh] overflow-auto pr-1">
                    <div className="space-y-1">
                      {ENV.map((e) => {
                        const count = countsByEnvId[e.id] || 0;
                        const isActive = filterEnvId === e.id;
                        return (
                          <button
                            key={e.id}
                            onClick={() => setFilterEnvId(e.id)}
                            className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs transition ${
                              isActive
                                ? "border-[rgba(34,211,238,0.40)] bg-[rgba(34,211,238,0.10)]"
                                : "border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)]"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="truncate text-[rgba(255,255,255,0.88)]">{e.label}</div>
                              <div className="text-[10px] text-[rgba(255,255,255,0.55)]">
                                atalho: {e.order <= 9 ? e.order : e.order === 10 ? "0" : `Alt+${e.order - 10}`}
                              </div>
                            </div>
                            <Chip tone={count === 0 ? "default" : "info"}>{count}</Chip>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {recentEnvSwitches >= 4 ? (
                  <div className="mt-4 rounded-2xl border border-[rgba(255,77,77,0.25)] bg-[rgba(255,77,77,0.08)] p-3 text-xs text-[rgba(255,255,255,0.72)]">
                    <div className="mb-1 font-semibold text-[rgba(255,77,77,0.95)]">Bagunça detectada</div>
                    Muitas sugestões diferentes em sequência. Recomendação UX: mantenha o <b>Ambiente Ativo</b> travado e confirme as trocas.
                    <div className="mt-2">
                      <KeyHint>J</KeyHint> para pular pendentes rapidamente.
                    </div>
                  </div>
                ) : null}
              </div>
            </aside>

            {/* Main */}
            <main className="md:col-span-8">
              {/* Top bar */}
              <div className="mb-4 rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#0B1220] p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl border border-[rgba(34,211,238,0.22)] bg-[rgba(34,211,238,0.08)] px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wide text-[rgba(34,211,238,0.9)]">
                        Ambiente ATIVO (não muda sozinho)
                      </div>
                      <div className="mt-1 text-sm font-semibold text-[rgba(255,255,255,0.92)]">
                        {activeEnv?.label ?? "—"}
                      </div>
                    </div>

                    <div className="min-w-[220px]">
                      <Select
                        value={activeEnvId}
                        onChange={(v) => {
                          setActiveEnvId(v);
                          const e = ENV.find((x) => x.id === v);
                          showToast(`Ambiente ATIVO: ${e?.label ?? "—"}`, "info");
                        }}
                        options={envOptions}
                      />
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                      <KeyHint>1..9</KeyHint>
                      <KeyHint>0</KeyHint>
                      <KeyHint>Alt+1..5</KeyHint>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button tone="default" onClick={jumpNextPending}>
                      <TriangleAlert className="h-4 w-4" /> Próximo pendente <span className="ml-1 opacity-70">(J)</span>
                    </Button>
                    <Button
                      tone="default"
                      onClick={() => {
                        setFilterEnvId("pending");
                        showToast("Filtro: Pendentes", "info");
                      }}
                    >
                      Ver pendentes
                    </Button>
                  </div>
                </div>

                {/* Bulk bar */}
                {selectedCount > 0 ? (
                  <div className="mt-3 rounded-2xl border border-[rgba(50,255,126,0.25)] bg-[rgba(50,255,126,0.08)] p-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div className="text-xs text-[rgba(255,255,255,0.80)]">
                        Seleção: <b>{selectedCount}</b> bloco(s) — <b>{selectedPhotoCount}</b> foto(s)
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button tone="success" onClick={applyActiveToSelection}>
                          Aplicar ambiente ATIVO <span className="opacity-80">(A)</span>
                        </Button>
                        <Button tone="default" onClick={clearSelection}>
                          Limpar
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 flex items-center justify-between text-xs text-[rgba(255,255,255,0.62)]">
                  <div>
                    Filtro atual: <span className="text-[rgba(255,255,255,0.85)]">{filterEnvId === "all" ? "Todos" : filterEnvId === "pending" ? "Pendentes" : ENV.find((e) => e.id === filterEnvId)?.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder className="h-3.5 w-3.5" />
                    <span>
                      Objetivo: manter continuidade e corrigir trocas indevidas de ambiente
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline list */}
              <div
                ref={listRef}
                className="max-h-[68vh] overflow-auto rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[#0B1220] p-4"
              >
                <div className="space-y-3">
                  {filteredEvents.map((e) => {
                    if (e.type === "message") {
                      const tone = confidenceTone(e.confidence ?? 0.7);
                      const known = ENV.some((x) => x.label.toLowerCase() === (e.suggestEnvLabel || "").toLowerCase());
                      return (
                        <div
                          key={e.id}
                          ref={(node) => (eventRefs.current[e.id] = node)}
                          className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Chip tone="info">{e.time}</Chip>
                              <div className="text-xs text-[rgba(255,255,255,0.78)]">
                                <span className="text-[rgba(255,255,255,0.92)] font-semibold">{e.sender}</span>
                                <span className="mx-2 text-[rgba(255,255,255,0.35)]">•</span>
                                <span className="text-[rgba(255,255,255,0.70)]">Mensagem</span>
                              </div>
                            </div>
                            {e.suggestEnvLabel ? (
                              <div className="flex items-center gap-2">
                                <Chip tone={tone}>
                                  Sugestão: {e.suggestEnvLabel} <span className="opacity-80">({formatPct(e.confidence ?? 0.7)})</span>
                                </Chip>
                              </div>
                            ) : null}
                          </div>

                          <div className="mt-3 text-sm text-[rgba(255,255,255,0.86)]">{e.text}</div>

                          {e.suggestEnvLabel ? (
                            <div className="mt-3 rounded-2xl border border-[rgba(34,211,238,0.18)] bg-[rgba(34,211,238,0.06)] p-3">
                              <div className="text-xs text-[rgba(255,255,255,0.72)]">
                                O sistema detectou possível mudança de ambiente. <b>Ele não muda sozinho.</b>
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Button
                                  tone="default"
                                  onClick={() =>
                                    applySuggestion({
                                      messageId: e.id,
                                      action: "keep",
                                      applyToLastPhotoBlock: true,
                                    })
                                  }
                                >
                                  Manter ({activeEnv?.label ?? "—"})
                                </Button>

                                <Button
                                  tone="primary"
                                  onClick={() =>
                                    applySuggestion({
                                      messageId: e.id,
                                      action: "switch",
                                      applyToLastPhotoBlock: true,
                                    })
                                  }
                                >
                                  {known ? "Trocar" : "Adicionar"} para “{e.suggestEnvLabel}”
                                </Button>

                                <Button
                                  tone="default"
                                  onClick={() =>
                                    applySuggestion({
                                      messageId: e.id,
                                      action: "switch",
                                      applyToLastPhotoBlock: false,
                                    })
                                  }
                                >
                                  Trocar só ambiente ATIVO
                                </Button>
                              </div>

                              <div className="mt-2 text-[11px] text-[rgba(255,255,255,0.58)]">
                                Por padrão, ao confirmar, o app aplica ao <b>último bloco de fotos</b> (caso a mensagem venha depois das fotos).
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    }

                    // Photos block
                    const assigned = e.assignedEnvId ? ENV.find((x) => x.id === e.assignedEnvId)?.label : null;
                    const isPending = !e.assignedEnvId;
                    const isSelected = selectedPhotoEventIds.has(e.id);

                    return (
                      <div
                        key={e.id}
                        ref={(node) => (eventRefs.current[e.id] = node)}
                        className={`rounded-2xl border p-4 transition ${
                          isPending
                            ? "border-[rgba(251,191,36,0.22)] bg-[rgba(251,191,36,0.05)]"
                            : "border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)]"
                        } ${isSelected ? "ring-1 ring-[rgba(50,255,126,0.45)]" : ""}`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelect(e.id)}
                                className="h-4 w-4 rounded border border-[rgba(255,255,255,0.25)] bg-transparent"
                              />
                              <Chip tone="info">{e.time}</Chip>
                            </label>
                            <div className="text-xs text-[rgba(255,255,255,0.78)]">
                              <span className="text-[rgba(255,255,255,0.92)] font-semibold">{e.sender}</span>
                              <span className="mx-2 text-[rgba(255,255,255,0.35)]">•</span>
                              <span>{e.files.length} foto(s)</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {assigned ? (
                              <Chip tone="ok">{assigned}</Chip>
                            ) : (
                              <Chip tone="warn">
                                <TriangleAlert className="h-3.5 w-3.5" /> Sem ambiente
                              </Chip>
                            )}
                            <Button
                              tone={isPending ? "success" : "default"}
                              onClick={() => {
                                setEvents((prev) =>
                                  prev.map((x) => (x.id === e.id ? { ...x, assignedEnvId: activeEnvId } : x))
                                );
                                showToast(`Atribuído: ${activeEnv?.label ?? "—"} (${e.files.length} fotos)`, "ok");
                              }}
                            >
                              Atribuir ao ATIVO
                            </Button>

                            <div className="w-[220px]">
                              <Select
                                value={e.assignedEnvId || ""}
                                placeholder="Escolher ambiente"
                                onChange={(v) => {
                                  setEvents((prev) =>
                                    prev.map((x) => (x.id === e.id ? { ...x, assignedEnvId: v || null } : x))
                                  );
                                  const chosen = ENV.find((x) => x.id === v)?.label;
                                  showToast(`Atribuído: ${chosen ?? "—"}`, "info");
                                }}
                                options={envOptions}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
                          {e.files.slice(0, 8).map((f) => (
                            <div key={f} className="flex items-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] p-2">
                              <TinyThumb label={f} />
                              <div className="min-w-0">
                                <div className="truncate text-xs text-[rgba(255,255,255,0.86)]">{f}</div>
                                <div className="text-[11px] text-[rgba(255,255,255,0.55)]">mock</div>
                              </div>
                            </div>
                          ))}
                          {e.files.length > 8 ? (
                            <div className="flex items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.03)] p-2 text-xs text-[rgba(255,255,255,0.70)]">
                              +{e.files.length - 8} fotos
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[rgba(255,255,255,0.62)]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[rgba(251,191,36,0.9)]" />
                    pendente
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[rgba(50,255,126,0.9)]" />
                    atribuído
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[rgba(34,211,238,0.9)]" />
                    sugestão
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyHint>A</KeyHint>
                  <span>aplica ambiente ativo na seleção</span>
                </div>
              </div>
            </main>
          </div>
        ) : null}

        {/* Toast */}
        {toast ? (
          <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
            <div className={`rounded-2xl border px-4 py-3 text-sm shadow-xl ${pill(toast.tone)}`}>
              {toast.message}
            </div>
          </div>
        ) : null}

        {/* Export modal */}
        {exportOpen ? (
          <Modal title="Exportar (simulação)" onClose={() => setExportOpen(false)}>
            <div className="space-y-3">
              <div className="text-sm text-[rgba(255,255,255,0.80)]">
                Aqui você escolheria o que gerar:
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] p-4">
                  <div className="text-sm font-semibold text-[rgba(255,255,255,0.90)]">Pastas organizadas</div>
                  <div className="mt-1 text-xs text-[rgba(255,255,255,0.62)]">
                    Estrutura por ambiente + renome opcional.
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] p-4">
                  <div className="text-sm font-semibold text-[rgba(255,255,255,0.90)]">Manifest (CSV/JSON)</div>
                  <div className="mt-1 text-xs text-[rgba(255,255,255,0.62)]">
                    Lista foto → ambiente → origem → observações.
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(34,211,238,0.20)] bg-[rgba(34,211,238,0.06)] p-4 text-xs text-[rgba(255,255,255,0.70)]">
                Estado atual: <b>{totals.assignedPhotos}</b> atribuídas / <b>{totals.pendingPhotos}</b> pendentes.
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  tone="primary"
                  onClick={() => {
                    setExportOpen(false);
                    showToast("Exportação simulada: OK", "ok");
                  }}
                >
                  <Download className="h-4 w-4" /> Gerar
                </Button>
                <Button tone="default" onClick={() => setExportOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </Modal>
        ) : null}

        {/* Add environment modal (simulação) */}
        {addEnvOpen ? (
          <Modal title="Adicionar ambiente (simulação)" onClose={() => setAddEnvOpen(false)}>
            <div className="space-y-3">
              <div className="text-sm text-[rgba(255,255,255,0.80)]">
                A sugestão não existe na sua lista oficial. No produto real, você escolheria:
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[rgba(255,255,255,0.65)]">
                  <li>Nome do novo ambiente</li>
                  <li>Posição na ordem oficial</li>
                  <li>Se deve virar atalho</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] p-4">
                <div className="text-xs font-semibold text-[rgba(255,255,255,0.85)]">Nome</div>
                <input
                  value={pendingNewEnvLabel}
                  onChange={(e) => setPendingNewEnvLabel(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-3 py-2 text-sm text-[rgba(255,255,255,0.90)] outline-none"
                  placeholder="Ex.: Fachada"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button tone="success" onClick={() => addNewEnvironment(pendingNewEnvLabel)}>
                  Adicionar
                </Button>
                <Button
                  tone="default"
                  onClick={() => {
                    setAddEnvOpen(false);
                    showToast("Mantido como pendente (sem ambiente).", "warn");
                  }}
                >
                  Deixar pendente
                </Button>
              </div>
            </div>
          </Modal>
        ) : null}
      </div>
    </div>
  );
}
