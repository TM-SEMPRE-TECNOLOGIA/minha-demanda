import {
  ArrowLeft,
  Moon,
  Sun,
  Camera,
  User,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { tmsColors } from "./ThemeProvider";

interface SettingsScreenProps {
  onBack: () => void;
  theme: "dark" | "light";
  onThemeChange: (theme: "dark" | "light") => void;
  userPhoto?: string;
  onPhotoChange: (photo: string) => void;
}

export function SettingsScreen({
  onBack,
  theme,
  onThemeChange,
  userPhoto,
  onPhotoChange,
}: SettingsScreenProps) {
  const handlePhotoChange = () => {
    // Simula upload de foto
    const newPhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    onPhotoChange(newPhoto);
  };

  const isDark = theme === "dark";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: tmsColors.navyDeep,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-6 sticky top-0 z-10"
        style={{
          backgroundColor: tmsColors.navyMedium,
          borderBottom: `1px solid ${tmsColors.borderSubtle}`,
          transition: "all 0.3s ease",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4"
          style={{ color: tmsColors.textSecondary }}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
        <h1
          className="text-2xl mb-1 font-heading"
          style={{
            color: tmsColors.textPrimary,
            fontWeight: 600,
          }}
        >
          Configurações
        </h1>
        <p
          className="font-body"
          style={{ color: tmsColors.textSecondary }}
        >
          Personalize sua experiência
        </p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Photo */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: tmsColors.cardBg,
            border: `1px solid ${tmsColors.borderSubtle}`,
          }}
        >
          <h3
            className="font-heading mb-4"
            style={{
              color: tmsColors.textPrimary,
              fontWeight: 600,
            }}
          >
            Foto de Perfil
          </h3>

          <div className="flex items-center gap-6">
            <Avatar
              className="w-24 h-24 border-4"
              style={{
                borderColor: tmsColors.neonGreen,
                boxShadow: `0 0 20px ${tmsColors.neonGreen}33`,
              }}
            >
              <AvatarImage src={userPhoto} alt="Usuário" />
              <AvatarFallback
                style={{
                  backgroundColor: tmsColors.navyLight,
                  color: tmsColors.neonGreen,
                }}
              >
                <User size={32} />
              </AvatarFallback>
            </Avatar>

            <Button
              onClick={handlePhotoChange}
              className="h-12 rounded-lg flex items-center gap-2 font-body"
              style={{
                backgroundColor: tmsColors.neonGreen,
                color: tmsColors.navyDeep,
              }}
            >
              <Camera size={18} />
              Alterar Foto
            </Button>
          </div>
        </div>

        {/* Theme Toggle */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: tmsColors.cardBg,
            border: `1px solid ${tmsColors.borderSubtle}`,
          }}
        >
          <h3
            className="font-heading mb-4"
            style={{
              color: tmsColors.textPrimary,
              fontWeight: 600,
            }}
          >
            Aparência
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? (
                <Moon size={24} style={{ color: tmsColors.neonGreen }} />
              ) : (
                <Sun size={24} style={{ color: "#ffc107" }} />
              )}
              <div>
                <Label
                  htmlFor="theme-toggle"
                  className="font-body"
                  style={{
                    color: tmsColors.textPrimary,
                    cursor: "pointer",
                  }}
                >
                  Modo {isDark ? "Escuro" : "Claro"}
                </Label>
                <p
                  className="text-sm font-body"
                  style={{
                    color: tmsColors.textSecondary,
                  }}
                >
                  {isDark
                    ? "Tema escuro ativado"
                    : "Tema claro ativado"}
                </p>
              </div>
            </div>

            <Switch
              id="theme-toggle"
              checked={isDark}
              onCheckedChange={(checked) =>
                onThemeChange(checked ? "dark" : "light")
              }
              style={{
                backgroundColor: isDark ? tmsColors.neonGreen : tmsColors.cyanVibrant,
              }}
            />
          </div>
        </div>

        {/* App Info */}
        <div
          className="p-6 rounded-xl"
          style={{
            backgroundColor: tmsColors.cardBg,
            border: `1px solid ${tmsColors.borderSubtle}`,
          }}
        >
          <h3
            className="font-heading mb-4"
            style={{
              color: tmsColors.textPrimary,
              fontWeight: 600,
            }}
          >
            Sobre o Aplicativo
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span
                className="font-body"
                style={{
                  color: tmsColors.textSecondary,
                }}
              >
                Versão
              </span>
              <span
                className="font-mono"
                style={{
                  color: tmsColors.textPrimary,
                }}
              >
                1.0.0
              </span>
            </div>
            <div className="flex justify-between">
              <span
                className="font-body"
                style={{
                  color: tmsColors.textSecondary,
                }}
              >
                Sistema
              </span>
              <span
                className="font-mono"
                style={{
                  color: tmsColors.textPrimary,
                }}
              >
                TMS
              </span>
            </div>
            <div className="flex justify-between">
              <span
                className="font-body"
                style={{
                  color: tmsColors.textSecondary,
                }}
              >
                Empresa
              </span>
              <span
                className="font-mono"
                style={{
                  color: tmsColors.textPrimary,
                }}
              >
                MAFFENG
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}