/**
 * TMS Theme Helper
 * Provides a centralized way to access theme colors via CSS variables
 */

export const tmsColors = {
  navyDeep: "var(--tms-navy-deep)",
  navyMedium: "var(--tms-navy-medium)",
  navyLight: "var(--tms-navy-light)",
  neonGreen: "var(--tms-neon-green)",
  cyanVibrant: "var(--tms-cyan-vibrant)",
  textPrimary: "var(--tms-text-primary)",
  textSecondary: "var(--tms-text-secondary)",
  textEmphasis: "var(--tms-text-emphasis)",
  statusPending: "var(--tms-status-pending)",
  statusProgress: "var(--tms-status-progress)",
  statusComplete: "var(--tms-status-complete)",
  warning: "var(--tms-warning)",
  error: "var(--tms-error)",
  borderSubtle: "var(--tms-border-subtle)",
  cardBg: "var(--tms-card-bg)",
  cardBorder: "var(--tms-card-border)",
  inputBg: "var(--tms-input-bg)",
  inputBorder: "var(--tms-input-border)",
  gradientBg: "var(--tms-gradient-bg)",
  gradientLogin: "var(--tms-gradient-login)",
} as const;

export type TmsColorKey = keyof typeof tmsColors;
