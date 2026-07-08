import { ArrowLeft } from "lucide-react";
import { tmsColors } from "./ThemeProvider";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
}

export function ScreenHeader({ title, subtitle, onBack }: ScreenHeaderProps) {
  return (
    <div
      className="px-6 py-6 sticky top-0 z-10"
      style={{
        backgroundColor: tmsColors.navyMedium,
        borderBottom: `1px solid ${tmsColors.borderSubtle}`,
      }}
    >
      <button onClick={onBack} className="flex items-center gap-2 mb-4">
        <ArrowLeft size={20} style={{ color: tmsColors.textSecondary }} />
        <span style={{ color: tmsColors.textSecondary }}>Voltar</span>
      </button>
      <h1
        className="text-2xl mb-1 font-heading"
        style={{ color: tmsColors.textPrimary, fontWeight: 700 }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="font-body" style={{ color: tmsColors.textSecondary }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
