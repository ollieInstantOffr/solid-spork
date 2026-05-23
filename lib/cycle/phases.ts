import { differenceInDays, addDays, startOfDay } from "date-fns";

export type Phase = "menstrual" | "follicular" | "ovulation" | "luteal";

export interface PhaseInfo {
  phase: Phase;
  dayOfCycle: number;
  daysUntilNextPeriod: number;
  fertileWindow: { start: number; end: number };
  nextPeriodDate: Date;
  ovulationDay: number;
  cycleStartDate: Date;
}

export interface PhaseDisplay {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
  partnerTitle: string;
  partnerDescription: string;
}

export const PHASE_DISPLAY: Record<Phase, PhaseDisplay> = {
  menstrual: {
    name: "Menstrual Phase",
    description: "Your period. Time to rest and restore. 🌹",
    color: "#D4607A",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    icon: "🌸",
    partnerTitle: "Rest & Recovery Week",
    partnerDescription:
      "Her body is working hard right now. She may feel more tired or need extra comfort.",
  },
  follicular: {
    name: "Follicular Phase",
    description: "Energy rising. Great time for new beginnings. ✨",
    color: "#E890B0",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    icon: "🌷",
    partnerTitle: "Energy Rising",
    partnerDescription:
      "She's likely feeling more energetic and social. A great time for dates and adventures.",
  },
  ovulation: {
    name: "Ovulation Phase",
    description: "Peak energy and confidence. You're radiant. 💫",
    color: "#D4A840",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    icon: "🌟",
    partnerTitle: "Peak Energy Week",
    partnerDescription:
      "She's at her most energetic and social. This is also her most fertile time.",
  },
  luteal: {
    name: "Luteal Phase",
    description: "Slowing down. Honor your need for quiet and comfort. 🫧",
    color: "#C090CC",
    bgColor: "bg-purple-50",
    textColor: "text-purple-500",
    icon: "🌙",
    partnerTitle: "Nesting Week",
    partnerDescription:
      "She may need more emotional support and cozy time at home. Small gestures go a long way.",
  },
};

export function calculatePhase(
  lastPeriodStart: Date | null,
  cycleLength: number = 28,
  periodLength: number = 5,
  today: Date = new Date()
): PhaseInfo | null {
  if (!lastPeriodStart) return null;

  const todayNorm = startOfDay(today);
  const cycleStart = startOfDay(lastPeriodStart);
  const dayOfCycle = differenceInDays(todayNorm, cycleStart) + 1;

  // If day is negative or way too far ahead, adjust
  if (dayOfCycle < 1) return null;

  // Normalize to current cycle (in case it's been multiple cycles)
  const normalizedDay = ((dayOfCycle - 1) % cycleLength) + 1;
  const cyclesCompleted = Math.floor((dayOfCycle - 1) / cycleLength);
  const currentCycleStart = addDays(cycleStart, cyclesCompleted * cycleLength);

  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 3;
  const fertileEnd = ovulationDay + 1;

  const daysUntilNextPeriod = cycleLength - normalizedDay + 1;
  const nextPeriodDate = addDays(currentCycleStart, cycleLength);

  let phase: Phase;
  if (normalizedDay <= periodLength) {
    phase = "menstrual";
  } else if (normalizedDay <= ovulationDay - 2) {
    phase = "follicular";
  } else if (normalizedDay <= ovulationDay + 1) {
    phase = "ovulation";
  } else {
    phase = "luteal";
  }

  return {
    phase,
    dayOfCycle: normalizedDay,
    daysUntilNextPeriod,
    fertileWindow: { start: fertileStart, end: fertileEnd },
    nextPeriodDate,
    ovulationDay,
    cycleStartDate: currentCycleStart,
  };
}

export function getPhaseProgress(dayOfCycle: number, cycleLength: number): number {
  return Math.round((dayOfCycle / cycleLength) * 100);
}

export function isFertile(phaseInfo: PhaseInfo): boolean {
  return (
    phaseInfo.dayOfCycle >= phaseInfo.fertileWindow.start &&
    phaseInfo.dayOfCycle <= phaseInfo.fertileWindow.end
  );
}
