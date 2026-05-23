import { Phase } from "./phases";

export interface Recommendation {
  title: string;
  body: string;
  category: "nutrition" | "movement" | "mindset" | "intimacy" | "fertility";
  icon: string;
}

type PhaseRecs = Record<string, Recommendation[]>;

const RECOMMENDATIONS: Record<Phase, PhaseRecs> = {
  menstrual: {
    general: [
      {
        title: "Rest is productive",
        body: "Your body is doing a lot right now. Prioritise sleep and gentle movement like walking or stretching.",
        category: "movement",
        icon: "🛁",
      },
      {
        title: "Iron-rich foods",
        body: "Top up with lentils, leafy greens, and lean red meat to replenish iron lost during your period.",
        category: "nutrition",
        icon: "🥗",
      },
      {
        title: "Heat therapy",
        body: "A warm water bottle on your lower abdomen can significantly reduce cramping.",
        category: "mindset",
        icon: "🌡️",
      },
      {
        title: "Magnesium helps",
        body: "Dark chocolate, nuts, and seeds are rich in magnesium which can ease period pain.",
        category: "nutrition",
        icon: "🍫",
      },
    ],
    wantPregnant: [
      {
        title: "Prepare for your fertile window",
        body: "Your fertile window is roughly day 11–16 of your cycle. Start tracking cervical mucus now.",
        category: "fertility",
        icon: "🌱",
      },
    ],
    noPregnant: [
      {
        title: "Contraception check-in",
        body: "A good time to review your contraception method and ensure it's still right for you.",
        category: "intimacy",
        icon: "🔒",
      },
    ],
  },
  follicular: {
    general: [
      {
        title: "Try something new",
        body: "Rising oestrogen gives you a boost of creativity and motivation. Start that project you've been putting off.",
        category: "mindset",
        icon: "✨",
      },
      {
        title: "Build strength",
        body: "Your body recovers faster in this phase. Great time for strength training or trying a new workout class.",
        category: "movement",
        icon: "💪",
      },
      {
        title: "Fresh, light foods",
        body: "Your digestion is stronger now. Enjoy salads, fermented foods, and lighter meals.",
        category: "nutrition",
        icon: "🥙",
      },
    ],
    wantPregnant: [
      {
        title: "Fertile window approaching",
        body: "Start having sex every 1–2 days from now as you approach ovulation. Sperm can survive 5 days.",
        category: "fertility",
        icon: "💛",
      },
      {
        title: "Prenatal vitamins",
        body: "If you're not already taking folic acid (400mcg/day), now is a great time to start.",
        category: "nutrition",
        icon: "💊",
      },
    ],
    noPregnant: [
      {
        title: "Libido rising",
        body: "Oestrogen is climbing — you may notice increased desire. This is completely normal.",
        category: "intimacy",
        icon: "🌸",
      },
    ],
  },
  ovulation: {
    general: [
      {
        title: "Peak confidence",
        body: "Hormones are at their peak — use this energy for social events, presentations, or asking for what you want.",
        category: "mindset",
        icon: "👑",
      },
      {
        title: "High-intensity workouts",
        body: "Your body handles stress and exertion best now. Great time for HIIT, runs, or cycling.",
        category: "movement",
        icon: "🏃‍♀️",
      },
      {
        title: "Anti-inflammatory foods",
        body: "Support your body with berries, salmon, and turmeric-rich foods.",
        category: "nutrition",
        icon: "🫐",
      },
    ],
    wantPregnant: [
      {
        title: "Your most fertile time",
        body: "The egg is released in the next 24–48 hours. Have sex today and tomorrow for the best chance.",
        category: "fertility",
        icon: "🌟",
      },
      {
        title: "Lie down after sex",
        body: "While not proven, many couples try lying down for 15–20 minutes after sex during ovulation.",
        category: "fertility",
        icon: "💤",
      },
    ],
    noPregnant: [
      {
        title: "Fertility awareness",
        body: "This is your most fertile time. Be mindful if you're not trying to conceive.",
        category: "intimacy",
        icon: "⚠️",
      },
    ],
  },
  luteal: {
    general: [
      {
        title: "Honour your slower pace",
        body: "Energy naturally dips in the second half of your cycle. Lighter workouts like yoga or pilates are perfect.",
        category: "movement",
        icon: "🧘‍♀️",
      },
      {
        title: "Complex carbs for mood",
        body: "Sweet potato, oats, and legumes support serotonin production to help with PMS-related mood shifts.",
        category: "nutrition",
        icon: "🍠",
      },
      {
        title: "Journal your thoughts",
        body: "The veil is thinner in the luteal phase — many find clarity and insight in journalling now.",
        category: "mindset",
        icon: "📓",
      },
      {
        title: "Prepare your environment",
        body: "Batch cook, do laundry, and set up cosy spaces for when your period arrives.",
        category: "mindset",
        icon: "🏡",
      },
    ],
    wantPregnant: [
      {
        title: "Two-week wait",
        body: "Now is the waiting period. Try to stay busy, rest well, and avoid testing too early — most tests are reliable from day 1 of a missed period.",
        category: "fertility",
        icon: "⏳",
      },
    ],
    wantPregnantSexLogged: [
      {
        title: "You're in the two-week wait 🤞",
        body: "You logged sex during your fertile window — a possible conception may have happened. Avoid testing before your period is due; rest, stay hydrated, and try to keep busy.",
        category: "fertility",
        icon: "✨",
      },
      {
        title: "Early signs to watch for",
        body: "Implantation can cause light spotting, mild cramps, or breast tenderness around 6–12 days after ovulation. These are easy to miss — note anything unusual in your daily log.",
        category: "fertility",
        icon: "🌱",
      },
    ],
    noPregnant: [
      {
        title: "Period is coming",
        body: "Your period will arrive soon. Stock up on pads/tampons/cup and prepare your comfort essentials.",
        category: "mindset",
        icon: "📅",
      },
    ],
    noPregnantSexLogged: [
      {
        title: "Fertile window passed — check in with your method",
        body: "You logged sex during your fertile window. If you're not trying to conceive, now is a good moment to check that your contraception method is working as expected.",
        category: "intimacy",
        icon: "🔒",
      },
    ],
  },
};

export function getRecommendations(
  phase: Phase,
  wantPregnant: boolean,
  hadSexInFertileWindow = false
): Recommendation[] {
  const phaseRecs = RECOMMENDATIONS[phase] as Record<string, Recommendation[]>;
  const result = [...phaseRecs.general];

  if (phase === "luteal") {
    if (wantPregnant) {
      // Use the sex-aware tip if we know sex was logged; fallback to generic
      const lutealPregnant = hadSexInFertileWindow
        ? phaseRecs.wantPregnantSexLogged
        : phaseRecs.wantPregnant;
      result.push(...lutealPregnant);
    } else {
      const lutealNoPregnant = hadSexInFertileWindow
        ? phaseRecs.noPregnantSexLogged
        : phaseRecs.noPregnant;
      result.push(...lutealNoPregnant);
    }
  } else {
    const specific = wantPregnant ? phaseRecs.wantPregnant : phaseRecs.noPregnant;
    result.push(...specific);
  }

  return result.slice(0, 5);
}
