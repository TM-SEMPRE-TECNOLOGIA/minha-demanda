import { User, ClipboardList, Send, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { tmsColors } from "./ThemeProvider";

interface HomeScreenProps {
  onNavigateToSurveys: () => void;
  onNavigateToSent: () => void;
  onNavigateToSettings: () => void;
  userPhoto?: string;
  userName?: string;
}

export function HomeScreen({
  onNavigateToSurveys,
  onNavigateToSent,
  onNavigateToSettings,
  userPhoto,
  userName = "Técnico TMS",
}: HomeScreenProps) {
  const menuItems = [
    {
      id: "surveys",
      title: "Meus Levantamentos",
      description: "Ordens de serviço designadas",
      icon: ClipboardList,
      onClick: onNavigateToSurveys,
      color: tmsColors.neonGreen,
    },
    {
      id: "sent",
      title: "Levantamentos Enviados",
      description: "Histórico de levantamentos finalizados",
      icon: Send,
      onClick: onNavigateToSent,
      color: tmsColors.cyanVibrant,
    },
    {
      id: "settings",
      title: "Configurações",
      description: "Preferências e personalização",
      icon: Settings,
      onClick: onNavigateToSettings,
      color: tmsColors.textSecondary,
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: tmsColors.gradientBg,
      }}
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-8 text-center">
        <h1
          className="text-2xl mb-8 font-heading"
          style={{ color: tmsColors.neonGreen, fontWeight: 700, letterSpacing: "0.05em" }}
        >
          TMS
        </h1>

        {/* Profile Photo */}
        <div className="flex justify-center mb-6">
          <Avatar
            className="w-32 h-32 border-4"
            style={{
              borderColor: tmsColors.neonGreen,
              boxShadow: `0 0 30px ${tmsColors.neonGreen}4d`,
            }}
          >
            <AvatarImage src={userPhoto} alt={userName} />
            <AvatarFallback
              style={{
                backgroundColor: tmsColors.navyLight,
                color: tmsColors.neonGreen,
                fontSize: "2rem",
              }}
            >
              <User size={48} />
            </AvatarFallback>
          </Avatar>
        </div>

        <h2
          className="text-xl mb-2 font-heading"
          style={{ color: tmsColors.textPrimary, fontWeight: 600 }}
        >
          Bem-vindo(a)!
        </h2>
        <p className="font-body" style={{ color: tmsColors.textSecondary }}>
          {userName}
        </p>
      </div>

      {/* Menu Items */}
      <div className="px-6 pb-12 space-y-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className="w-full p-6 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: tmsColors.cardBg,
                border: `1px solid ${tmsColors.borderSubtle}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.boxShadow = `0 0 20px ${item.color}33`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = tmsColors.borderSubtle;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: tmsColors.navyDeep,
                    border: `2px solid ${item.color}`,
                  }}
                >
                  <Icon size={28} style={{ color: item.color }} />
                </div>
                <div className="flex-1 text-left">
                  <h3
                    className="text-lg mb-1 font-heading"
                    style={{ color: tmsColors.textPrimary, fontWeight: 600 }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm font-body" style={{ color: tmsColors.textSecondary }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center px-6 pb-8">
        <p className="text-sm font-body" style={{ color: tmsColors.textSecondary }}>
          Sistema MAFFENG - Levantamentos Fotográficos
        </p>
      </div>
    </div>
  );
}