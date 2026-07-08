import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  IdCard,
  MapPin,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { WorkOrder, LevantamentoData } from "../App";

interface OSDetailsScreenProps {
  workOrder: WorkOrder | null;
  onStart: () => void;
  onBack: () => void;
  onDataUpdate: (data: Partial<LevantamentoData>) => void;
}

export function OSDetailsScreen({
  workOrder,
  onStart,
  onBack,
  onDataUpdate,
}: OSDetailsScreenProps) {
  const [formData, setFormData] = useState({
    localName: workOrder?.location || "",
    agencyCode: workOrder?.agency || "",
    managerName: workOrder?.manager || "",
    technicianId: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStart = () => {
    onDataUpdate(formData);
    onStart();
  };

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

  if (!workOrder) return null;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--tms-navy-deep)" }}
    >
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
          Detalhes da OS
        </h1>
        <p className="font-body" style={{ color: "var(--tms-text-secondary)" }}>
          Preencha os dados obrigatórios
        </p>
      </div>

      <div className="px-6 py-6">
        {/* OS Summary */}
        <div
          className="p-6 rounded-xl mb-6"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: "1px solid var(--tms-card-border)",
          }}
        >
          <div
            className="inline-block px-4 py-2 rounded-lg mb-4"
            style={{
              backgroundColor: "var(--tms-navy-deep)",
              border: "1px solid var(--tms-neon-green)",
            }}
          >
            <span
              className="font-mono"
              style={{
                color: "var(--tms-neon-green)",
                letterSpacing: "0.02em",
              }}
            >
              {workOrder.number}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin size={18} style={{ color: "var(--tms-text-secondary)" }} />
              <span
                className="font-body"
                style={{ color: "var(--tms-text-primary)" }}
              >
                {workOrder.location}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Building2
                size={18}
                style={{ color: "var(--tms-text-secondary)" }}
              />
              <span
                className="font-body"
                style={{ color: "var(--tms-text-primary)" }}
              >
                Agência:{" "}
                <span className="font-mono">
                  {workOrder.agency}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <User size={18} style={{ color: "var(--tms-text-secondary)" }} />
              <span
                className="font-body"
                style={{ color: "var(--tms-text-primary)" }}
              >
                Gerente: {workOrder.manager}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div
          className="p-6 rounded-xl mb-6"
          style={{
            backgroundColor: "var(--tms-card-bg)",
            border: "1px solid var(--tms-card-border)",
          }}
        >
          <h2
            className="text-lg mb-6"
            style={{ color: "var(--tms-text-primary)" }}
          >
            Dados do Levantamento
          </h2>

          <div className="space-y-6">
            {/* Local Name */}

            {/* Agency Code */}

            {/* Manager Name */}
            <div>
              <Label
                htmlFor="managerName"
                className="mb-2 flex items-center gap-1"
                style={{ color: "var(--tms-text-primary)" }}
              >
                Nome do Gerente
                <span style={{ color: "var(--tms-neon-green)" }}>*</span>
              </Label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: "var(--tms-text-secondary)" }}
                />
                <Input
                  id="managerName"
                  type="text"
                  value={formData.managerName}
                  onChange={(e) =>
                    handleInputChange(
                      "managerName",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: Carlos Silva"
                  className="pl-12 h-12 border-2 rounded-lg"
                  style={{
                    backgroundColor: "var(--tms-input-bg)",
                    borderColor: "var(--tms-input-border)",
                    color: "var(--tms-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--tms-neon-green)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(100, 255, 218, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--tms-input-border)";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>
            </div>

            {/* Technician ID */}
            <div>
              <Label
                htmlFor="technicianId"
                className="mb-2 flex items-center gap-1"
                style={{ color: "var(--tms-text-primary)" }}
              >
                Matrícula do Gerente
                <span style={{ color: "var(--tms-neon-green)" }}>*</span>
              </Label>
              <div className="relative">
                <IdCard
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  size={18}
                  style={{ color: "var(--tms-text-secondary)" }}
                />
                <Input
                  id="technicianId"
                  type="text"
                  value={formData.technicianId}
                  onChange={(e) =>
                    handleInputChange(
                      "technicianId",
                      e.target.value,
                    )
                  }
                  placeholder="Ex: TEC-12345"
                  className="pl-12 h-12 border-2 rounded-lg"
                  style={{
                    backgroundColor: "var(--tms-input-bg)",
                    borderColor: "var(--tms-input-border)",
                    color: "var(--tms-text-primary)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--tms-neon-green)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(100, 255, 218, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--tms-input-border)";
                    e.target.style.boxShadow = "none";
                  }}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleStart}
            disabled={!isFormValid}
            className="w-full h-14 rounded-lg text-lg transition-all duration-200"
            style={{
              backgroundColor: isFormValid
                ? "var(--tms-neon-green)"
                : "var(--tms-navy-light)",
              color: isFormValid ? "var(--tms-navy-deep)" : "var(--tms-text-secondary)",
              cursor: isFormValid ? "pointer" : "not-allowed",
            }}
            onMouseEnter={(e) => {
              if (isFormValid) {
                e.currentTarget.style.boxShadow =
                  "0 0 20px rgba(100, 255, 218, 0.5)";
                e.currentTarget.style.transform =
                  "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Iniciar Levantamento
          </Button>

          <button
            onClick={onBack}
            className="w-full text-center py-3"
            style={{ color: "var(--tms-text-secondary)" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}