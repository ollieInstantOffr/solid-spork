export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface TimeTheme {
  name: string;
  emoji: string;
  greeting: string;
  period: TimeOfDay;

  // CSS variable overrides (all as raw values, set on :root)
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  border: string;
  input: string;
  gold: string;
  goldDark: string;

  // Phase colors
  menstrual: string;
  follicular: string;
  ovulation: string;
  luteal: string;

  // Background mesh gradient
  meshGradient: string;

  // Sparkle color
  sparkle: string;
}

export const TIME_THEMES: Record<TimeOfDay, TimeTheme> = {
  morning: {
    name: "Morning",
    emoji: "🌅",
    greeting: "Good morning",
    period: "morning",

    background: "#FFF8F0",
    foreground: "#3D1F10",
    card: "#FFFCF8",
    cardForeground: "#3D1F10",
    primary: "#D46848",
    primaryForeground: "#FFF8F0",
    secondary: "#FDEEE4",
    secondaryForeground: "#8B4030",
    muted: "#FAE4D4",
    mutedForeground: "#A06048",
    accent: "#F4B090",
    border: "#F0D0B8",
    input: "#F0D0B8",
    gold: "#F0C868",
    goldDark: "#D0A840",
    menstrual: "#D46858",
    follicular: "#F4A888",
    ovulation: "#E8C050",
    luteal: "#C098B8",
    sparkle: "#F0C050",
    meshGradient: `
      radial-gradient(ellipse at 15% 5%, rgba(255,180,120,0.45) 0%, transparent 50%),
      radial-gradient(ellipse at 85% 85%, rgba(240,160,100,0.3) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 50%, rgba(255,220,180,0.2) 0%, transparent 50%)
    `,
  },

  afternoon: {
    name: "Afternoon",
    emoji: "☀️",
    greeting: "Good afternoon",
    period: "afternoon",

    background: "#FFF0F5",
    foreground: "#3D1A2E",
    card: "#FFFAFC",
    cardForeground: "#3D1A2E",
    primary: "#C4607A",
    primaryForeground: "#FFF0F5",
    secondary: "#FCE8F0",
    secondaryForeground: "#8B3A56",
    muted: "#FAE0EB",
    mutedForeground: "#A0607A",
    accent: "#E8B4C8",
    border: "#F2CCDA",
    input: "#F2CCDA",
    gold: "#E8C88A",
    goldDark: "#C8A860",
    menstrual: "#D4607A",
    follicular: "#E890B0",
    ovulation: "#D4A840",
    luteal: "#C090CC",
    sparkle: "#E8C88A",
    meshGradient: `
      radial-gradient(ellipse at 20% 10%, rgba(240,180,210,0.35) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 90%, rgba(220,160,200,0.25) 0%, transparent 45%),
      radial-gradient(ellipse at 60% 40%, rgba(255,220,235,0.2) 0%, transparent 40%)
    `,
  },

  evening: {
    name: "Evening",
    emoji: "🌆",
    greeting: "Good evening",
    period: "evening",

    background: "#FDF0EC",
    foreground: "#2E1418",
    card: "#FEF8F5",
    cardForeground: "#2E1418",
    primary: "#A8506A",
    primaryForeground: "#FDF0EC",
    secondary: "#F8E4DC",
    secondaryForeground: "#7A3040",
    muted: "#F4D8CC",
    mutedForeground: "#9A5860",
    accent: "#D4906A",
    border: "#ECC8B8",
    input: "#ECC8B8",
    gold: "#D4986A",
    goldDark: "#B87848",
    menstrual: "#C04860",
    follicular: "#D4887A",
    ovulation: "#C89040",
    luteal: "#A87888",
    sparkle: "#D09868",
    meshGradient: `
      radial-gradient(ellipse at 10% 0%, rgba(220,140,100,0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 90% 95%, rgba(200,100,100,0.3) 0%, transparent 45%),
      radial-gradient(ellipse at 50% 60%, rgba(240,180,140,0.2) 0%, transparent 50%)
    `,
  },

  night: {
    name: "Night",
    emoji: "🌙",
    greeting: "Good night",
    period: "night",

    background: "#140E22",
    foreground: "#F0E8FC",
    card: "#1E1630",
    cardForeground: "#F0E8FC",
    primary: "#C890CC",
    primaryForeground: "#140E22",
    secondary: "#261C3A",
    secondaryForeground: "#D4B8E8",
    muted: "#2E2040",
    mutedForeground: "#9880B8",
    accent: "#A070C8",
    border: "#3A2858",
    input: "#3A2858",
    gold: "#C8A868",
    goldDark: "#A88848",
    menstrual: "#C07098",
    follicular: "#9870C0",
    ovulation: "#C8A050",
    luteal: "#8070C8",
    sparkle: "#C8B0F0",
    meshGradient: `
      radial-gradient(ellipse at 20% 15%, rgba(120,80,180,0.4) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 85%, rgba(80,40,140,0.35) 0%, transparent 45%),
      radial-gradient(ellipse at 55% 45%, rgba(160,100,200,0.15) 0%, transparent 50%)
    `,
  },
};

export function getTimeOfDay(hour?: number): TimeOfDay {
  const h = hour ?? new Date().getHours();
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}
