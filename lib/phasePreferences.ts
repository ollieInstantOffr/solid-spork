import { Phase } from "./cycle/phases";

export interface PhasePreferences {
  menstrual: string[];
  follicular: string[];
  ovulation: string[];
  luteal: string[];
}

export const EMPTY_PREFERENCES: PhasePreferences = {
  menstrual: [],
  follicular: [],
  ovulation: [],
  luteal: [],
};

export function parsePreferences(raw: string): PhasePreferences {
  try {
    const parsed = JSON.parse(raw);
    return {
      menstrual: Array.isArray(parsed.menstrual) ? parsed.menstrual : [],
      follicular: Array.isArray(parsed.follicular) ? parsed.follicular : [],
      ovulation: Array.isArray(parsed.ovulation) ? parsed.ovulation : [],
      luteal: Array.isArray(parsed.luteal) ? parsed.luteal : [],
    };
  } catch {
    return EMPTY_PREFERENCES;
  }
}

// Suggested preferences per phase
export const PHASE_SUGGESTIONS: Record<Phase, { emoji: string; label: string }[]> = {
  menstrual: [
    { emoji: "🍫", label: "Chocolate" },
    { emoji: "💆", label: "Massage" },
    { emoji: "🫂", label: "Cuddles" },
    { emoji: "🛁", label: "Draw me a bath" },
    { emoji: "🌡️", label: "Hot water bottle" },
    { emoji: "🍕", label: "Comfort food" },
    { emoji: "🎬", label: "Movie night in" },
    { emoji: "🌸", label: "Flowers" },
    { emoji: "🤫", label: "Give me space" },
    { emoji: "☕", label: "Hot drinks" },
    { emoji: "🧦", label: "Cozy socks" },
    { emoji: "📖", label: "Quiet time" },
  ],
  follicular: [
    { emoji: "🌿", label: "Fresh flowers" },
    { emoji: "🏃", label: "Active date" },
    { emoji: "🍳", label: "Cook together" },
    { emoji: "🗣️", label: "Good conversations" },
    { emoji: "🎉", label: "Spontaneity" },
    { emoji: "🌅", label: "Morning walks" },
    { emoji: "💃", label: "Dancing" },
    { emoji: "🎨", label: "Creative projects" },
    { emoji: "🍷", label: "Wine & dine" },
    { emoji: "🏕️", label: "Adventure" },
  ],
  ovulation: [
    { emoji: "💕", label: "Quality time" },
    { emoji: "🌹", label: "Romance" },
    { emoji: "🎤", label: "Be my hype person" },
    { emoji: "🥂", label: "Celebrate with me" },
    { emoji: "📸", label: "Take photos of me" },
    { emoji: "👗", label: "Dress-up date" },
    { emoji: "🏝️", label: "Getaway" },
    { emoji: "💌", label: "Love notes" },
    { emoji: "💃", label: "Go out together" },
    { emoji: "🌟", label: "Tell me I'm great" },
  ],
  luteal: [
    { emoji: "🍫", label: "Chocolate" },
    { emoji: "🫂", label: "Extra cuddles" },
    { emoji: "🤐", label: "Don't take it personally" },
    { emoji: "🏠", label: "Stay in together" },
    { emoji: "💆", label: "Back rub" },
    { emoji: "🍜", label: "Comfort meals" },
    { emoji: "📺", label: "Binge-watch together" },
    { emoji: "🧘", label: "Calm energy only" },
    { emoji: "☕", label: "Morning coffee in bed" },
    { emoji: "🤗", label: "Patient with me" },
    { emoji: "🛒", label: "Grocery run for me" },
    { emoji: "🌙", label: "Early nights" },
  ],
};
