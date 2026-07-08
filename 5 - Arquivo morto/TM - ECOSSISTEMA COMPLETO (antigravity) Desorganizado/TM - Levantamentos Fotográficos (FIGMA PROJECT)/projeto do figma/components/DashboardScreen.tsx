import { useState } from "react";
import {
  Search,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { WorkOrder } from "../App";
import { tmsColors } from "./ThemeProvider";

interface DashboardScreenProps {
  onSelectOS: (os: WorkOrder) => void;
  onBack?: () => void;
}

const mockWorkOrders: WorkOrder[] = [
  {
    id: "1",
    number: "OS-2025-001",
    location: "Agência Centro",
    agency: "AG-001",
    manager: "Carlos Silva",
    status: "Pendente",
    progress: 0,
  },
  {
    id: "2",
    number: "OS-2025-002",
    location: "Agência Boa Vista",
    agency: "AG-045",
    manager: "Maria Santos",
    status: "Em Andamento",
    progress: 45,
  },
  {
    id: "3",
    number: "OS-2025-003",
    location: "Agência Shopping",
    agency: "AG-112",
    manager: "João Oliveira",
    status: "Pendente",
    progress: 0,
  },
  {
    id: "4",
    number: "OS-2025-004",
    location: "Agência Industrial",
    agency: "AG-078",
    manager: "Ana Costa",
    status: "Concluído",
    progress: 100,
  },
];

export function DashboardScreen({
  onSelectOS,
  onBack,
}: DashboardScreenProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtra para remover levantamentos concluídos
  const filteredOrders = mockWorkOrders
    .filter((order) => order.status !== "Concluído")
    .filter(
      (order) =>
        order.number
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.agency
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );

  const getStatusIcon = (status: WorkOrder["status"]) => {
    switch (status) {
      case "Pendente":
        return <Clock size={20} style={{ color: tmsColors.statusPending }} />;
      case "Em Andamento":
        return (
          <AlertCircle size={20} style={{ color: tmsColors.statusProgress }} />
        );
      case "Concluído":
        return (
          <CheckCircle2
            size={20}
            style={{ color: tmsColors.statusComplete }}
          />
        );
    }
  };

  const getStatusColor = (status: WorkOrder["status"]) => {
    switch (status) {
      case "Pendente":
        return tmsColors.textSecondary;
      case "Em Andamento":
        return tmsColors.statusPending;
      case "Concluído":
        return tmsColors.statusComplete;
    }
  };

  return (
    <div
      className="min-h-screen pb-24"
      style={{ backgroundColor: tmsColors.navyDeep }}
    >
      {/* Header */}
      <div
        className="px-6 py-6 sticky top-0 z-10"
        style={{
          backgroundColor: tmsColors.navyMedium,
          borderBottom: `1px solid ${tmsColors.borderSubtle}`,
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-4"
            style={{ color: tmsColors.textSecondary }}
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        )}
        <h1
          className="text-2xl mb-1 font-heading"
          style={{ color: tmsColors.textPrimary, fontWeight: 600 }}
        >
          Ordens de Serviço
        </h1>
        <p className="font-body" style={{ color: tmsColors.textSecondary }}>
          Levantamentos designados
        </p>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2"
            size={20}
            style={{ color: tmsColors.textSecondary }}
          />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por número, local ou agência..."
            className="pl-12 h-12 border-2 rounded-lg"
            style={{
              backgroundColor: tmsColors.inputBg,
              borderColor: tmsColors.inputBorder,
              color: tmsColors.textPrimary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = tmsColors.neonGreen;
              e.target.style.boxShadow =
                `0 0 0 3px ${tmsColors.neonGreen}1a`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = tmsColors.inputBorder;
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* Work Orders List */}
      <div className="px-6 py-6 space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => onSelectOS(order)}
            className="rounded-xl p-5 cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: tmsColors.cardBg,
              border: `1px solid ${tmsColors.borderSubtle}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = tmsColors.neonGreen;
              e.currentTarget.style.boxShadow =
                `0 0 20px ${tmsColors.neonGreen}33`;
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                tmsColors.borderSubtle;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3
                  className="text-lg mb-1 font-mono"
                  style={{
                    color: tmsColors.textPrimary,
                    letterSpacing: "0.02em",
                  }}
                >
                  {order.number}
                </h3>
                <p
                  className="text-sm font-body"
                  style={{ color: tmsColors.textPrimary }}
                >
                  {order.location}
                </p>
              </div>
              <ChevronRight
                size={24}
                style={{ color: tmsColors.neonGreen }}
              />
            </div>

            {/* Agency and Manager */}
            <div className="flex gap-4 mb-3">
              <div
                className="px-3 py-1 rounded text-sm font-mono"
                style={{
                  backgroundColor: tmsColors.navyDeep,
                  color: tmsColors.cyanVibrant,
                  border: `1px solid ${tmsColors.cyanVibrant}`,
                  letterSpacing: "0.02em",
                }}
              >
                {order.agency}
              </div>
              <div
                className="text-sm"
                style={{ color: tmsColors.textSecondary }}
              >
                Gerente:{" "}
                <span style={{ color: tmsColors.textPrimary }}>
                  {order.manager}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(order.status)}
              <span
                className="text-sm"
                style={{ color: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
            </div>

            {/* Progress Bar */}
            {order.progress > 0 && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="text-sm"
                    style={{ color: tmsColors.textSecondary }}
                  >
                    Progresso
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: tmsColors.cyanVibrant }}
                  >
                    {order.progress}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: tmsColors.navyLight }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      backgroundColor: tmsColors.cyanVibrant,
                      width: `${order.progress}%`,
                      boxShadow:
                        `0 0 10px ${tmsColors.cyanVibrant}80`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}