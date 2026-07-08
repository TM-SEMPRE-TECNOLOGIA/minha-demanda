import { useState } from "react";
import { ArrowLeft, Camera, X, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface ServicePhoto {
  photo: string;
  observations: string;
  measurements: string;
}

interface ServiceCaptureScreenProps {
  serviceName: string;
  environment: string;
  servicePhotos: ServicePhoto[];
  detailPhotos: string[];
  onUpdatePhotos: (photos: ServicePhoto[]) => void;
  onUpdateDetailPhotos: (photos: string[]) => void;
  onComplete: () => void;
  onBack: () => void;
}

export function ServiceCaptureScreen({
  serviceName,
  environment,
  servicePhotos,
  detailPhotos,
  onUpdatePhotos,
  onUpdateDetailPhotos,
  onComplete,
  onBack,
}: ServiceCaptureScreenProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string>("");
  const [observations, setObservations] = useState("");
  const [measurements, setMeasurements] = useState("");
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);

  const handleCapturePhoto = () => {
    const newPhoto = `photo-service-${serviceName}-${Date.now()}.jpg`;
    setCurrentPhoto(newPhoto);
    setShowPhotoCapture(true);
  };

  const handleConfirmPhoto = () => {
    if (currentPhoto) {
      const newServicePhoto: ServicePhoto = {
        photo: currentPhoto,
        observations,
        measurements,
      };
      onUpdatePhotos([...servicePhotos, newServicePhoto]);
      
      // Reset form
      setCurrentPhoto("");
      setObservations("");
      setMeasurements("");
      setShowPhotoCapture(false);
      setCurrentPhotoIndex(null);
    }
  };

  const handleCancelPhoto = () => {
    setCurrentPhoto("");
    setObservations("");
    setMeasurements("");
    setShowPhotoCapture(false);
    setCurrentPhotoIndex(null);
  };

  const removeServicePhoto = (index: number) => {
    const updatedPhotos = servicePhotos.filter((_, i) => i !== index);
    onUpdatePhotos(updatedPhotos);
  };

  const addDetailPhoto = () => {
    const newDetailPhoto = `photo-detail-${serviceName}-${Date.now()}.jpg`;
    onUpdateDetailPhotos([...detailPhotos, newDetailPhoto]);
  };

  const removeDetailPhoto = (index: number) => {
    const updatedPhotos = detailPhotos.filter((_, i) => i !== index);
    onUpdateDetailPhotos(updatedPhotos);
  };

  const isValid = detailPhotos.length > 0;

  // Se está capturando uma foto
  if (showPhotoCapture && currentPhoto) {
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
            onClick={handleCancelPhoto}
            className="flex items-center gap-2 mb-4"
            style={{ color: "var(--tms-text-secondary)" }}
          >
            <X size={20} />
            <span>Cancelar</span>
          </button>
          <h1
            className="text-2xl mb-1 font-heading"
            style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
          >
            {serviceName}
          </h1>
          <p className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
            Adicione observações e medidas
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Photo Preview */}
          <div
            className="p-5 rounded-xl"
            style={{
              backgroundColor: "var(--tms-card-bg)",
              border: "1px solid var(--tms-card-border)",
            }}
          >
            <h3
              className="font-heading mb-4"
              style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
            >
              Foto Capturada
            </h3>
            <div
              className="h-48 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "var(--tms-navy-light)",
                border: "2px dashed var(--tms-neon-green)",
              }}
            >
              <div className="text-center">
                <Camera size={32} style={{ color: "var(--tms-neon-green)", margin: "0 auto" }} />
                <p
                  className="mt-2 font-mono"
                  style={{ color: "var(--tms-neon-green)", fontSize: "0.875rem" }}
                >
                  {currentPhoto}
                </p>
              </div>
            </div>
          </div>

          {/* Observations */}
          <div
            className="p-5 rounded-xl"
            style={{
              backgroundColor: "var(--tms-card-bg)",
              border: "1px solid var(--tms-card-border)",
            }}
          >
            <Label
              htmlFor="observations"
              className="font-heading mb-2 block"
              style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
            >
              Observações
              <span
                className="text-sm font-body ml-2"
                style={{ color: "var(--tms-text-secondary)", fontWeight: 400 }}
              >
                (Opcional)
              </span>
            </Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Notas sobre o serviço executado..."
              rows={4}
              className="border-2 rounded-lg font-body"
              style={{
                backgroundColor: "var(--tms-input-bg)",
                borderColor: "var(--tms-input-border)",
                color: "var(--tms-text-primary)",
                resize: "vertical",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--tms-neon-green)";
                e.target.style.boxShadow = "0 0 0 3px rgba(100, 255, 218, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--tms-input-border)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Measurements */}
          <div
            className="p-5 rounded-xl"
            style={{
              backgroundColor: "var(--tms-card-bg)",
              border: "1px solid var(--tms-card-border)",
            }}
          >
            <Label
              htmlFor="measurements"
              className="font-heading mb-2 block"
              style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
            >
              Medidas
              <span
                className="text-sm font-body ml-2"
                style={{ color: "var(--tms-text-secondary)", fontWeight: 400 }}
              >
                (Opcional)
              </span>
            </Label>
            <Input
              id="measurements"
              value={measurements}
              onChange={(e) => setMeasurements(e.target.value)}
              placeholder="Ex: 5,5m x 4,2m"
              className="h-12 border-2 rounded-lg font-mono"
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
            />
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
            onClick={handleConfirmPhoto}
            className="w-full h-14 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-2 font-body"
            style={{
              backgroundColor: "var(--tms-neon-green)",
              color: "var(--tms-navy-deep)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(100, 255, 218, 0.5)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <CheckCircle2 size={20} />
            Confirmar Foto
          </Button>
        </div>
      </div>
    );
  }

  // Tela principal de serviço
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
          <span>Voltar para {environment}</span>
        </button>
        <h1
          className="text-2xl mb-1 font-heading"
          style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
        >
          {serviceName}
        </h1>
        <p className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
          Ambiente: {environment}
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
                Pronto para finalizar
              </span>
            </>
          ) : (
            <>
              <AlertCircle size={16} style={{ color: "var(--tms-error)" }} />
              <span className="text-sm font-body" style={{ color: "var(--tms-error)" }}>
                Adicione pelo menos 1 foto de detalhe
              </span>
            </>
          )}
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Service Photos */}
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
                Fotos do Serviço
              </h3>
              <p className="text-sm font-body mt-1" style={{ color: "var(--tms-text-secondary)" }}>
                Adicione quantas fotos precisar
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
              {servicePhotos.length}
            </div>
          </div>

          {/* Existing Photos */}
          {servicePhotos.length > 0 && (
            <div className="space-y-3 mb-4">
              {servicePhotos.map((photo, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--tms-navy-deep)",
                    border: "1px solid var(--tms-card-border)",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Camera size={20} style={{ color: "var(--tms-cyan-vibrant)" }} />
                    <button
                      onClick={() => removeServicePhoto(index)}
                      className="p-1 rounded"
                      style={{ color: "var(--tms-error)" }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <p
                    className="text-sm font-mono mb-2"
                    style={{ color: "var(--tms-text-secondary)" }}
                  >
                    {photo.photo}
                  </p>
                  {photo.observations && (
                    <p
                      className="text-sm font-body mb-1"
                      style={{ color: "var(--tms-text-primary)" }}
                    >
                      <span style={{ color: "var(--tms-text-secondary)" }}>Obs:</span>{" "}
                      {photo.observations}
                    </p>
                  )}
                  {photo.measurements && (
                    <p
                      className="text-sm font-mono"
                      style={{ color: "var(--tms-cyan-vibrant)" }}
                    >
                      <span style={{ color: "var(--tms-text-secondary)" }}>Medidas:</span>{" "}
                      {photo.measurements}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Photo Button */}
          <Button
            onClick={handleCapturePhoto}
            className="w-full h-12 rounded-lg flex items-center justify-center gap-2 font-body"
            style={{
              backgroundColor: "var(--tms-cyan-vibrant)",
              color: "var(--tms-navy-deep)",
            }}
          >
            <Plus size={20} />
            Adicionar Foto
          </Button>
        </div>

        {/* Detail Photos - OBRIGATÓRIO */}
        <div
          className="p-5 rounded-xl"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: `2px solid ${detailPhotos.length > 0 ? "var(--tms-neon-green)" : "var(--tms-error)"}`,
            boxShadow:
              detailPhotos.length > 0
                ? "0 0 15px rgba(100, 255, 218, 0.2)"
                : "0 0 15px rgba(255, 100, 100, 0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="font-heading"
                style={{ color: "var(--tms-text-primary)", fontWeight: 600 }}
              >
                Fotos de Detalhes
              </h3>
              <p
                className="text-sm font-body mt-1"
                style={{
                  color: detailPhotos.length > 0 ? "var(--tms-neon-green)" : "var(--tms-error)",
                }}
              >
                Obrigatório *
              </p>
            </div>
            <div
              className="px-3 py-1 rounded font-mono"
              style={{
                backgroundColor: detailPhotos.length > 0 ? "var(--tms-neon-green)" : "var(--tms-error)",
                color: "var(--tms-navy-deep)",
                fontSize: "0.875rem",
              }}
            >
              {detailPhotos.length}
            </div>
          </div>

          {/* Detail Photos List */}
          {detailPhotos.length > 0 && (
            <div className="space-y-3 mb-4">
              {detailPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--tms-navy-deep)",
                    border: "2px solid var(--tms-neon-green)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Camera size={20} style={{ color: "var(--tms-neon-green)" }} />
                      <p
                        className="text-sm font-mono"
                        style={{ color: "var(--tms-neon-green)" }}
                      >
                        {photo}
                      </p>
                    </div>
                    <button
                      onClick={() => removeDetailPhoto(index)}
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

          {/* Add Detail Photo Button */}
          <Button
            onClick={addDetailPhoto}
            className="w-full h-12 rounded-lg flex items-center justify-center gap-2 font-body"
            style={{
              backgroundColor: "var(--tms-navy-deep)",
              border: "2px dashed var(--tms-neon-green)",
              color: "var(--tms-neon-green)",
            }}
          >
            <Camera size={20} />
            Capturar Foto de Detalhe
          </Button>
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
          onClick={onComplete}
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
          <CheckCircle2 size={20} />
          Finalizar {serviceName}
        </Button>
      </div>
    </div>
  );
}