export interface ZodiacSign {
  name: string;
  symbol: string;
  emoji: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  elementEmoji: string;
  dates: string;
  trait: string;
  description: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "♈",
    emoji: "🐏",
    element: "Fire",
    elementEmoji: "🔥",
    dates: "Mar 21 – Apr 19",
    trait: "Bold & Passionate",
    description: "Fierce, independent, and full of energy. You lead with your heart.",
  },
  {
    name: "Taurus",
    symbol: "♉",
    emoji: "🐂",
    element: "Earth",
    elementEmoji: "🌿",
    dates: "Apr 20 – May 20",
    trait: "Grounded & Sensual",
    description: "Steady, loyal, and deeply in tune with your body and senses.",
  },
  {
    name: "Gemini",
    symbol: "♊",
    emoji: "👯",
    element: "Air",
    elementEmoji: "🌬️",
    dates: "May 21 – Jun 20",
    trait: "Curious & Expressive",
    description: "Quick-witted, adaptable, and endlessly curious about the world.",
  },
  {
    name: "Cancer",
    symbol: "♋",
    emoji: "🦀",
    element: "Water",
    elementEmoji: "💧",
    dates: "Jun 21 – Jul 22",
    trait: "Intuitive & Nurturing",
    description: "Deeply empathetic, fiercely protective, and in tune with emotions.",
  },
  {
    name: "Leo",
    symbol: "♌",
    emoji: "🦁",
    element: "Fire",
    elementEmoji: "🔥",
    dates: "Jul 23 – Aug 22",
    trait: "Radiant & Generous",
    description: "Confident, warm, and magnetic — you light up every room you enter.",
  },
  {
    name: "Virgo",
    symbol: "♍",
    emoji: "🌾",
    element: "Earth",
    elementEmoji: "🌿",
    dates: "Aug 23 – Sep 22",
    trait: "Thoughtful & Precise",
    description: "Detail-oriented, caring, and quietly brilliant at making things work.",
  },
  {
    name: "Libra",
    symbol: "♎",
    emoji: "⚖️",
    element: "Air",
    elementEmoji: "🌬️",
    dates: "Sep 23 – Oct 22",
    trait: "Balanced & Charming",
    description: "Diplomatic, graceful, and always searching for beauty and harmony.",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    emoji: "🦂",
    element: "Water",
    elementEmoji: "💧",
    dates: "Oct 23 – Nov 21",
    trait: "Intense & Perceptive",
    description: "Powerful, magnetic, and with an uncanny ability to read people deeply.",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    emoji: "🏹",
    element: "Fire",
    elementEmoji: "🔥",
    dates: "Nov 22 – Dec 21",
    trait: "Free & Adventurous",
    description: "Philosophical, optimistic, and always chasing the next horizon.",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    emoji: "🐐",
    element: "Earth",
    elementEmoji: "🌿",
    dates: "Dec 22 – Jan 19",
    trait: "Ambitious & Disciplined",
    description: "Quietly determined, responsible, and built for the long game.",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    emoji: "🏺",
    element: "Air",
    elementEmoji: "🌬️",
    dates: "Jan 20 – Feb 18",
    trait: "Visionary & Independent",
    description: "Original, humanitarian, and unafraid to question everything.",
  },
  {
    name: "Pisces",
    symbol: "♓",
    emoji: "🐟",
    element: "Water",
    elementEmoji: "💧",
    dates: "Feb 19 – Mar 20",
    trait: "Dreamy & Compassionate",
    description: "Deeply intuitive, artistic, and connected to the unseen currents of life.",
  },
];

const ELEMENT_COLORS: Record<string, string> = {
  Fire:  "#E8783A",
  Earth: "#6DAA60",
  Air:   "#70A8D8",
  Water: "#6090CC",
};

export function getElementColor(element: string) {
  return ELEMENT_COLORS[element] ?? "var(--primary)";
}

export function getZodiacSign(birthDate: Date): ZodiacSign {
  const month = birthDate.getMonth() + 1; // 1-12
  const day   = birthDate.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0];  // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1];  // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2];  // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3];  // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4];  // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5];  // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7];// Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8];// Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10]; // Aquarius
  return ZODIAC_SIGNS[11]; // Pisces
}

export function formatBirthDate(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
