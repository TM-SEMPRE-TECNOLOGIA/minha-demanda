import { ArrowLeft, CheckCircle2, Calendar, MapPin } from "lucide-react";
import { WorkOrder } from "../App";

interface SentSurveysScreenProps {
  onBack: () => void;
}

const mockSentSurveys: (WorkOrder & {
  completedDate: string;
  environmentsCount: number;
})[] = [
  {
    id: "4",
    number: "OS-2025-004",
    location: "Agência Industrial",
    agency: "AG-078",
    manager: "Ana Costa",
    status: "Concluído",
    progress: 100,
    completedDate: "2025-10-25T14:30:00",
    environmentsCount: 8,
  },
  {
    id: "5",
    number: "OS-2025-005",
    location: "Agência Matriz",
    agency: "AG-001",
    manager: "Pedro Alves",
    status: "Concluído",
    progress: 100,
    completedDate: "2025-10-20T16:45:00",
    environmentsCount: 12,
  },
  {
    id: "6",
    number: "OS-2025-006",
    location: "Agência Norte",
    agency: "AG-032",
    manager: "Julia Martins",
    status: "Concluído",
    progress: 100,
    completedDate: "2025-10-15T09:15:00",
    environmentsCount: 6,
  },
];

export function SentSurveysScreen({ onBack }: SentSurveysScreenProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dateFormatted = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeFormatted = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateFormatted} às ${timeFormatted}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--tms-navy-deep)" }}>
      {/* Header */}
      <div
        className="px-6 py-6 sticky top-0 z-10"
        style={{
          backgroundColor: "var(--tms-navy-medium)",
          borderBottom: "1px solid var(--tms-border-subtle)",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4"
          style={{ color: "var(--tms-text-secondary)" }}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1
          className="text-2xl mb-1 font-heading"
          style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
        >
          Levantamentos Enviados
        </h1>
        <p className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
          Histórico de levantamentos finalizados
        </p>
      </div>

      {/* Sent Surveys List */}
      <div className="px-6 py-6 space-y-4">
        {mockSentSurveys.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 size={48} style={{ color: "var(--tms-text-secondary)", margin: "0 auto", marginBottom: "16px" }} />
            <p className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
              Nenhum levantamento enviado ainda
            </p>
          </div>
        ) : (
          mockSentSurveys.map((survey) => (
            <div
              key={survey.id}
              className="rounded-xl p-5"
              style={{
                backgroundColor: "var(--tms-card-bg)",
                border: "1px solid var(--tms-card-border)",
              }}
            >
              {/* Header with Check Icon */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className="text-lg font-mono"
                      style={{
                        color: "var(--tms-text-primary)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {survey.number}
                    </h3>
                    <CheckCircle2 size={20} style={{ color: "var(--tms-neon-green)" }} />
                  </div>
                  <p
                    className="text-sm font-body flex items-center gap-1"
                    style={{ color: "var(--tms-text-primary)" }}
                  >
                    <MapPin size={14} style={{ color: "var(--tms-text-secondary)" }} />
                    {survey.location}
                  </p>
                </div>
              </div>

              {/* Agency and Manager */}
              <div className="flex gap-4 mb-3">
                <div
                  className="px-3 py-1 rounded text-sm font-mono"
                  style={{
                    backgroundColor: "var(--tms-navy-deep)",
                    color: "var(--tms-cyan-vibrant)",
                    border: "1px solid var(--tms-cyan-vibrant)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {survey.agency}
                </div>
                <div className="text-sm" style={{ color: "var(--tms-text-secondary)" }}>
                  Gerente:{" "}
                  <span style={{ color: "var(--tms-text-primary)" }}>{survey.manager}</span>
                </div>
              </div>

              {/* Completion Info */}
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: "var(--tms-neon-green)" }} />
                  <span className="text-sm font-body" style={{ color: "var(--tms-text-secondary)" }}>
                    Concluído em:{" "}
                    <span style={{ color: "var(--tms-neon-green)" }}>
                      {formatDate(survey.completedDate)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Environments Count */}
              <div
                className="mt-3 pt-3"
                style={{ borderTop: "1px solid var(--tms-border-subtle)" }}
              >
                <span className="text-sm font-body" style={{ color: "var(--tms-text-secondary)" }}>
                  Ambientes fotografados:{" "}
                  <span
                    className="font-mono"
                    style={{ color: "var(--tms-cyan-vibrant)", fontWeight: 600 }}
                  >
                    {survey.environmentsCount}
                  </span>
                </span>
              </div>

              {/* Status Badge */}
              <div className="mt-3">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded"
                  style={{
                    backgroundColor: "rgba(100, 255, 218, 0.1)",
                    border: "1px solid var(--tms-neon-green)",
                  }}
                >
                  <span className="text-sm font-body" style={{ color: "var(--tms-neon-green)" }}>
                    ✓ Enviado com sucesso
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}