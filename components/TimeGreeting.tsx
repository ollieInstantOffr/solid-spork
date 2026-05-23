"use client";

import { useEffect, useState } from "react";
import { getTimeOfDay, TIME_THEMES } from "@/lib/timeTheme";

const AFFIRMATIONS: Record<string, string[]> = {
  morning: [
    "Today is yours — make it beautiful 🌸",
    "A fresh start, a fresh you ✨",
    "Your body rested and is ready to glow 💫",
    "Rise slowly, shine fully 🌅",
    "Something wonderful is on its way to you 🌷",
    "You woke up — that's already enough 💕",
  ],
  afternoon: [
    "You're doing amazing sweetie!",
    "The best part of today might still be ahead ✨",
    "You are exactly where you need to be 🌸",
    "Proud of you for showing up today 💕",
    "Still shining, halfway through 🌟",
    "A little kindness to yourself goes a long way 🫶",
  ],
  evening: [
    "Wind down, you absolutely deserve it 🌙",
    "The softest hours are ahead of you 🕯️",
    "You did so much today — rest is next 💜",
    "Tonight, be gentle with yourself 🌸",
    "Let the day go — you showed up 💕",
    "Your only job now is to relax ✨",
  ],
  night: [
    "Rest is your superpower 🌙",
    "Your body heals beautifully as you sleep 💫",
    "Sweet dreams, beautiful soul 🌸",
    "Tomorrow is a fresh, soft start 💜",
    "You are so loved, even in your sleep ✨",
    "Let go of the day — you were enough 🫶",
  ],
};

function getDailyAffirmation(period: string): string {
  const list = AFFIRMATIONS[period] ?? AFFIRMATIONS.afternoon;
  const idx = new Date().getDay() % list.length;
  return list[idx];
}

export function TimeGreeting({ name }: { name?: string }) {
  const [theme, setTheme] = useState(TIME_THEMES[getTimeOfDay()]);
  const [scrolled, setScrolled] = useState(false);
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    function update() {
      const t = TIME_THEMES[getTimeOfDay()];
      setTheme(t);
      setAffirmation(getDailyAffirmation(t.period));
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 16); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const displayName = name ?? "lovely";

  return (
    <div
      className="sticky top-0 z-40 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,240,245,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        boxShadow: scrolled ? "0 2px 20px rgba(196,96,122,0.07)" : "none",
        marginLeft: "calc(-1rem)",
        marginRight: "calc(-1rem)",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      {/* ── Compact bar (scrolled) ── */}
      {scrolled && (
        <div className="max-w-2xl mx-auto py-2 flex items-center gap-3">
          {/* Time emoji */}
          <span className="text-2xl leading-none animate-float shrink-0">{theme.emoji}</span>

          {/* Name + affirmation */}
          <div className="flex-1 min-w-0">
            <p
              className="shimmer-text text-sm font-semibold leading-tight truncate"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {displayName} ✦
            </p>
            {affirmation && (
              <p
                className="text-[11px] truncate leading-tight mt-0.5"
                style={{ color: "var(--muted-foreground)", fontStyle: "italic" }}
              >
                {affirmation}
              </p>
            )}
          </div>

          {/* Time sparkle badge */}
          <div
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(196,96,122,0.12) 0%, rgba(214,112,160,0.12) 100%)",
              border: "1px solid rgba(196,96,122,0.18)",
              color: "var(--primary)",
            }}
          >
            <span className="animate-twinkle" style={{ animationDuration: "2s" }}>✦</span>
            <span>{theme.name}</span>
          </div>
        </div>
      )}

      {/* ── Full hero (at top) ── */}
      {!scrolled && (
        <div className="max-w-2xl mx-auto pt-7 pb-5 relative overflow-hidden animate-fade-up">

          {/* Decorative background blobs */}
          <div
            className="absolute -top-6 -right-8 w-40 h-40 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${theme.sparkle}28 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute top-2 right-24 w-20 h-20 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, var(--primary)18 0%, transparent 70%)`,
            }}
          />

          {/* Floating sparkles */}
          <span
            className="absolute top-3 right-8 text-base animate-twinkle pointer-events-none"
            style={{ color: theme.sparkle, animationDelay: "0s" }}
          >✦</span>
          <span
            className="absolute top-8 right-16 text-xs animate-twinkle pointer-events-none"
            style={{ color: "var(--primary)", animationDelay: "0.8s", opacity: 0.6 }}
          >✧</span>
          <span
            className="absolute bottom-6 right-6 text-xs animate-twinkle pointer-events-none"
            style={{ color: theme.sparkle, animationDelay: "1.6s", opacity: 0.5 }}
          >✦</span>

          {/* Time-of-day pill */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
              style={{
                background: "rgba(196,96,122,0.08)",
                color: "var(--primary)",
                border: "1px solid rgba(196,96,122,0.15)",
              }}
            >
              <span className="text-sm">{theme.emoji}</span>
              {theme.greeting}
            </span>
          </div>

          {/* Name */}
          <h1
            className="shimmer-text leading-none mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 8vw, 3rem)",
              fontWeight: 400,
            }}
          >
            {displayName} ✦
          </h1>

          {/* Affirmation */}
          {affirmation && (
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{
                color: "var(--muted-foreground)",
                fontStyle: "italic",
                fontFamily: "var(--font-display)",
                fontSize: "0.95rem",
                opacity: 0.85,
              }}
            >
              {affirmation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
