import { ArrowLeft, Send, Camera, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { WorkOrder, LevantamentoData } from "../App";

interface ReviewScreenProps {
  levantamentoData: LevantamentoData;
  workOrder: WorkOrder | null;
  onSubmit: () => void;
  onBack: () => void;
}

export function ReviewScreen({
  levantamentoData,
  workOrder,
  onSubmit,
  onBack,
}: ReviewScreenProps) {
  const getEnvironmentStats = (env: string) => {
    const data = levantamentoData.environmentData[env];
    if (!data)
      return { widePhotos: 0, services: 0, totalServicePhotos: 0, totalDetailPhotos: 0 };

    const totalServicePhotos = data.services.reduce(
      (sum, service) => sum + service.photos.length,
      0
    );
    const totalDetailPhotos = data.services.reduce(
      (sum, service) => sum + service.detailPhotos.length,
      0
    );

    return {
      widePhotos: data.widePhotos.length,
      services: data.services.length,
      totalServicePhotos,
      totalDetailPhotos,
    };
  };

  const isEnvironmentComplete = (env: string) => {
    const data = levantamentoData.environmentData[env];
    return data?.completed && data.services.some((s) => s.completed);
  };

  const allEnvironments = [
    ...levantamentoData.selectedEnvironments,
    ...levantamentoData.customEnvironments,
  ];
  const allComplete = allEnvironments.every(isEnvironmentComplete);

  const getTotalPhotos = () => {
    let total = 0;
    allEnvironments.forEach((env) => {
      const stats = getEnvironmentStats(env);
      total += stats.widePhotos + stats.totalServicePhotos + stats.totalDetailPhotos;
    });
    return total;
  };

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: "var(--tms-navy-deep)" }}>
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
          Revisão e Finalização
        </h1>
        <p className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
          Confira os dados antes de enviar
        </p>
      </div>

      {/* Summary */}
      <div className="px-6 py-6 space-y-4">
        {/* OS Info */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: "1px solid var(--tms-card-border)",
          }}
        >
          <h3
            className="text-lg mb-4 font-heading"
            style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
          >
            Informações da OS
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Número:
              </span>
              <span
                className="font-mono"
                style={{ color: "var(--tms-neon-green)", letterSpacing: "0.02em" }}
              >
                {workOrder?.number}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Local:
              </span>
              <span className="font-body" style={{ color: "var(--tms-text-primary)" }}>
                {levantamentoData.localName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Agência:
              </span>
              <span
                className="font-mono"
                style={{ color: "var(--tms-text-primary)", letterSpacing: "0.02em" }}
              >
                {levantamentoData.agencyCode}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Gerente:
              </span>
              <span className="font-body" style={{ color: "var(--tms-text-primary)" }}>
                {levantamentoData.managerName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Técnico:
              </span>
              <span className="font-body" style={{ color: "var(--tms-text-primary)" }}>
                {levantamentoData.technicianId}
              </span>
            </div>
          </div>
        </div>

        {/* Photo Count Summary */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: "1px solid var(--tms-card-border)",
          }}
        >
          <h3
            className="text-lg mb-4 font-heading"
            style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
          >
            Resumo do Levantamento
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Total de Ambientes:
              </span>
              <span
                className="font-mono"
                style={{ color: "var(--tms-cyan-vibrant)", fontWeight: 600 }}
              >
                {allEnvironments.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Total de Fotos:
              </span>
              <span
                className="font-mono"
                style={{ color: "var(--tms-cyan-vibrant)", fontWeight: 600 }}
              >
                {getTotalPhotos()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                Status:
              </span>
              <span
                className="flex items-center gap-2"
                style={{ color: allComplete ? "var(--tms-neon-green)" : "var(--tms-error)" }}
              >
                {allComplete ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span className="font-body">Completo</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} />
                    <span className="font-body">Incompleto</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Environments List */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: "1px solid var(--tms-card-border)",
          }}
        >
          <h3
            className="text-lg mb-4 font-heading"
            style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
          >
            Ambientes Fotografados
          </h3>
          <div className="space-y-3">
            {allEnvironments.map((env) => {
              const stats = getEnvironmentStats(env);
              const isComplete = isEnvironmentComplete(env);
              const envData = levantamentoData.environmentData[env];

              return (
                <div
                  key={env}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--tms-navy-deep)",
                    border: `1px solid ${isComplete ? "var(--tms-neon-green)" : "var(--tms-navy-light)"}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4
                        className="font-heading mb-1"
                        style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
                      >
                        {env}
                      </h4>
                      <div className="flex items-center gap-2">
                        {isComplete ? (
                          <CheckCircle2 size={16} style={{ color: "var(--tms-neon-green)" }} />
                        ) : (
                          <AlertCircle size={16} style={{ color: "var(--tms-error)" }} />
                        )}
                        <span
                          className="text-sm font-body"
                          style={{
                            color: isComplete ? "var(--tms-neon-green)" : "var(--tms-error)",
                          }}
                        >
                          {isComplete ? "Completo" : "Incompleto"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                        Fotos Vista Ampla:
                      </span>
                      <span className="font-mono" style={{ color: "var(--tms-cyan-vibrant)" }}>
                        {stats.widePhotos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                        Serviços:
                      </span>
                      <span className="font-mono" style={{ color: "var(--tms-cyan-vibrant)" }}>
                        {stats.services}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                        Fotos de Serviços:
                      </span>
                      <span className="font-mono" style={{ color: "var(--tms-cyan-vibrant)" }}>
                        {stats.totalServicePhotos}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
                        Fotos de Detalhes:
                      </span>
                      <span
                        className="font-mono"
                        style={{
                          color: stats.totalDetailPhotos > 0 ? "var(--tms-neon-green)" : "var(--tms-error)",
                        }}
                      >
                        {stats.totalDetailPhotos}
                      </span>
                    </div>

                    {/* Service Details */}
                    {envData && envData.services.length > 0 && (
                      <div
                        className="mt-3 pt-3"
                        style={{ borderTop: "1px solid var(--tms-navy-light)" }}
                      >
                        <p
                          className="text-xs font-body mb-2"
                          style={{ color: "var(--tms-text-secondary)" }}
                        >
                          Serviços executados:
                        </p>
                        <div className="space-y-1">
                          {envData.services.map((service, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between"
                            >
                              <span
                                className="text-xs font-body"
                                style={{ color: "var(--tms-text-primary)" }}
                              >
                                • {service.name}
                              </span>
                              <div className="flex gap-2 text-xs">
                                <span
                                  className="font-mono"
                                  style={{ color: "var(--tms-text-secondary)" }}
                                >
                                  F:{service.photos.length}
                                </span>
                                <span
                                  className="font-mono"
                                  style={{
                                    color:
                                      service.detailPhotos.length > 0
                                        ? "var(--tms-neon-green)"
                                        : "var(--tms-error)",
                                  }}
                                >
                                  D:{service.detailPhotos.length}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warning if incomplete */}
        {!allComplete && (
          <div
            className="p-5 rounded-xl flex items-start gap-3"
            style={{
              backgroundColor: "rgba(255, 100, 100, 0.1)",
              border: "1px solid var(--tms-error)",
            }}
          >
            <AlertCircle size={20} style={{ color: "var(--tms-error)", flexShrink: 0 }} />
            <div>
              <h4
                className="font-heading mb-1"
                style={{ color: "var(--tms-error)", fontWeight: 600 }}
              >
                Atenção!
              </h4>
              <p className="text-sm font-body" style={{ color: "var(--tms-error)" }}>
                Alguns ambientes estão incompletos. Certifique-se de que todos os
                serviços possuem fotos de detalhes antes de enviar.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-6 py-6"
        style={{
          backgroundColor: "var(--tms-navy-medium)",
          borderTop: "1px solid var(--tms-border-subtle)",
        }}
      >
        <Button
          onClick={onSubmit}
          disabled={!allComplete}
          className="w-full h-14 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-2 font-body"
          style={{
            backgroundColor: allComplete ? "var(--tms-neon-green)" : "var(--tms-navy-light)",
            color: allComplete ? "var(--tms-navy-deep)" : "var(--tms-text-secondary)",
            cursor: allComplete ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (allComplete) {
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(100, 255, 218, 0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Send size={20} />
          Enviar Levantamento
        </Button>
      </div>
    </div>
  );
}