import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  Save,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface ServiceData {
  name: string;
  photos: Array<{
    photo: string;
    observations: string;
    measurements: string;
  }>;
  detailPhotos: string[];
  completed: boolean;
}

interface CaptureScreenProps {
  environment: string;
  environmentData?: {
    widePhotos: string[];
    services: ServiceData[];
    completed?: boolean;
  };
  onUpdateData: (data: any) => void;
  onSave: () => void;
  onBack: () => void;
  onNavigateToService: (serviceName: string) => void;
}

export function CaptureScreen({
  environment,
  environmentData,
  onUpdateData,
  onSave,
  onBack,
  onNavigateToService,
}: CaptureScreenProps) {
  const [newServiceName, setNewServiceName] = useState("");

  const currentData = environmentData || {
    widePhotos: [],
    services: [],
    completed: false,
  };

  const updateField = (field: string, value: any) => {
    const updatedData = {
      ...currentData,
      [field]: value,
    };
    onUpdateData(updatedData);
  };

  const addWidePhoto = () => {
    const newPhoto = `photo-wide-${Date.now()}.jpg`;
    updateField("widePhotos", [...currentData.widePhotos, newPhoto]);
  };

  const removeWidePhoto = (index: number) => {
    const updatedPhotos = currentData.widePhotos.filter((_, i) => i !== index);
    updateField("widePhotos", updatedPhotos);
  };

  const handleAddService = () => {
    if (newServiceName.trim()) {
      // Navega para a tela de captura do serviço
      onNavigateToService(newServiceName.trim());
      setNewServiceName("");
    }
  };

  const handleServiceClick = (serviceName: string) => {
    onNavigateToService(serviceName);
  };

  const removeService = (index: number) => {
    const updatedServices = currentData.services.filter((_, i) => i !== index);
    updateField("services", updatedServices);
  };

  const handleSaveAndReturn = () => {
    // Marca como completo se tiver pelo menos um serviço com fotos de detalhe
    const hasCompletedService = currentData.services.some(
      (service) => service.completed && service.detailPhotos.length > 0
    );
    if (hasCompletedService) {
      onUpdateData({ ...currentData, completed: true });
    }
    onSave();
  };

  const isValid = currentData.services.some(
    (service) => service.completed && service.detailPhotos.length > 0
  );

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
          {environment}
        </h1>
        <p className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
          Capture fotos e registre serviços
        </p>

        {/* Status Badge */}
        <div
          className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded"
          style={{
            backgroundColor: isValid
              ? "rgba(100, 255, 218, 0.1)"
              : "rgba(255, 100, 100, 0.1)",
            border: `1px solid ${isValid ? "var(--tms-neon-green)" : "var(--tms-error)"}`,
          }}
        >
          {isValid ? (
            <>
              <CheckCircle2 size={16} style={{ color: "var(--tms-neon-green)" }} />
              <span className="text-sm font-body" style={{ color: "var(--tms-neon-green)" }}>
                Pronto para salvar
              </span>
            </>
          ) : (
            <>
              <AlertCircle size={16} style={{ color: "var(--tms-error)" }} />
              <span className="text-sm font-body" style={{ color: "var(--tms-error)" }}>
                Adicione pelo menos um serviço completo
              </span>
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Vista Ampla (Opcional) */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: "1px solid var(--tms-card-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="font-heading"
                style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
              >
                Vista Ampla
              </h3>
              <p className="text-sm font-body mt-1" style={{ color: "var(--tms-text-secondary)" }}>
                Opcional
              </p>
            </div>
            <div
              className="px-3 py-1 rounded font-mono"
              style={{
                backgroundColor: "var(--tms-cyan-vibrant)",
                color: "var(--tms-navy-deep)",
                fontSize: "0.875rem",
              }}
            >
              {currentData.widePhotos.length}
            </div>
          </div>

          {/* Wide Photos List */}
          {currentData.widePhotos.length > 0 && (
            <div className="space-y-3 mb-4">
              {currentData.widePhotos.map((photo, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--tms-navy-deep)",
                    border: "1px solid var(--tms-navy-light)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Camera size={20} style={{ color: "var(--tms-cyan-vibrant)" }} />
                      <p
                        className="text-sm font-mono"
                        style={{ color: "var(--tms-cyan-vibrant)" }}
                      >
                        {photo}
                      </p>
                    </div>
                    <button
                      onClick={() => removeWidePhoto(index)}
                      className="p-1 rounded"
                      style={{ color: "var(--tms-error)" }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Wide Photo Button */}
          <Button
            onClick={addWidePhoto}
            className="w-full h-12 rounded-lg flex items-center justify-center gap-2 font-body"
            style={{
              backgroundColor: "var(--tms-navy-deep)",
              border: "2px dashed var(--tms-cyan-vibrant)",
              color: "var(--tms-cyan-vibrant)",
            }}
          >
            <Camera size={20} />
            Adicionar Foto de Vista Ampla
          </Button>
        </div>

        {/* Serviços */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: "1px solid var(--tms-card-border)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="font-heading"
                style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
              >
                Serviços Executados
              </h3>
              <p className="text-sm font-body mt-1" style={{ color: "var(--tms-text-secondary)" }}>
                Adicione os serviços realizados
              </p>
            </div>
            <div
              className="px-3 py-1 rounded font-mono"
              style={{
                backgroundColor: "var(--tms-neon-green)",
                color: "var(--tms-navy-deep)",
                fontSize: "0.875rem",
              }}
            >
              {currentData.services.length}
            </div>
          </div>

          {/* Existing Services */}
          {currentData.services.length > 0 && (
            <div className="space-y-3 mb-4">
              {currentData.services.map((service, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg cursor-pointer transition-all duration-200"
                  style={{
                    backgroundColor: "var(--tms-navy-deep)",
                    border: service.completed
                      ? "2px solid var(--tms-neon-green)"
                      : "2px solid var(--tms-error)",
                  }}
                  onClick={() => handleServiceClick(service.name)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = service.completed
                      ? "0 0 15px rgba(100, 255, 218, 0.3)"
                      : "0 0 15px rgba(255, 100, 100, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4
                          className="font-heading"
                          style={{
                            color: "var(--tms-text-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {service.name}
                        </h4>
                        {service.completed ? (
                          <CheckCircle2 size={18} style={{ color: "var(--tms-neon-green)" }} />
                        ) : (
                          <AlertCircle size={18} style={{ color: "var(--tms-error)" }} />
                        )}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span style={{ color: "var(--tms-text-secondary)" }}>
                          Fotos:{" "}
                          <span
                            className="font-mono"
                            style={{ color: "var(--tms-cyan-vibrant)" }}
                          >
                            {service.photos.length}
                          </span>
                        </span>
                        <span style={{ color: "var(--tms-text-secondary)" }}>
                          Detalhes:{" "}
                          <span
                            className="font-mono"
                            style={{
                              color: service.detailPhotos.length > 0
                                ? "var(--tms-neon-green)"
                                : "var(--tms-error)",
                            }}
                          >
                            {service.detailPhotos.length}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeService(index);
                        }}
                        className="p-2 rounded"
                        style={{ color: "var(--tms-error)" }}
                      >
                        <X size={18} />
                      </button>
                      <ChevronRight size={20} style={{ color: "var(--tms-neon-green)" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Service */}
          <div className="space-y-3">
            <Input
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Nome do serviço (ex: Pintura acrílica)"
              className="h-12 border-2 rounded-lg font-body"
              style={{
                backgroundColor: "var(--tms-input-bg)",
                borderColor: "var(--tms-input-border)",
                color: "var(--tms-text-primary)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--tms-neon-green)";
                e.target.style.boxShadow = "0 0 0 3px rgba(100, 255, 218, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--tms-input-border)";
                e.target.style.boxShadow = "none";
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddService();
                }
              }}
            />
            <Button
              onClick={handleAddService}
              disabled={!newServiceName.trim()}
              className="w-full h-12 rounded-lg flex items-center justify-center gap-2 font-body"
              style={{
                backgroundColor: newServiceName.trim() ? "var(--tms-neon-green)" : "var(--tms-navy-light)",
                color: newServiceName.trim() ? "var(--tms-navy-deep)" : "var(--tms-text-secondary)",
              }}
            >
              <Plus size={20} />
              Adicionar Foto de Serviço
            </Button>
          </div>
        </div>
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
          onClick={handleSaveAndReturn}
          disabled={!isValid}
          className="w-full h-14 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-2 font-body"
          style={{
            backgroundColor: isValid ? "var(--tms-neon-green)" : "var(--tms-navy-light)",
            color: isValid ? "var(--tms-navy-deep)" : "var(--tms-text-secondary)",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (isValid) {
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
          <Save size={20} />
          Salvar Ambiente
        </Button>
      </div>
    </div>
  );
}