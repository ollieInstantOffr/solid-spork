"use client";

import { useState } from "react";

interface Props { userId: string; }

const STEPS = [
  {
    emoji: "🌸",
    title: "Your cycle, in four phases",
    body: "Luna tracks your menstrual cycle across four phases — Menstrual, Follicular, Ovulation, and Luteal. Each has its own energy, mood, and needs. Understanding them helps you plan, feel better, and support your wellbeing.",
    hint: "Based on your period start date and cycle length.",
    visual: (
      <div className="flex rounded-2xl overflow-hidden h-8 gap-px mt-4" style={{ background: "var(--border)" }}>
        {[
          { color: "#D4607A", icon: "🌸", label: "Menstrual", pct: 18 },
          { color: "#E890B0", icon: "🌷", label: "Follicular", pct: 32 },
          { color: "#D4A840", icon: "🌟", label: "Ovulation",  pct: 11 },
          { color: "#C090CC", icon: "🌙", label: "Luteal",     pct: 39 },
        ].map(({ color, icon, pct }) => (
          <div key={icon} className="flex items-center justify-center"
            style={{ width: `${pct}%`, background: color, minWidth: "10%" }}>
            <span className="text-xs">{icon}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    emoji: "📓",
    title: "Log daily — it takes 10 seconds",
    body: "Each day, tap Log to record your flow, mood, energy, and symptoms. The more you log, the smarter Luna gets — it learns your patterns and gives you personalised tips.",
    hint: "You can also quick-log from the Today page.",
    visual: (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          { emoji: "🩸", label: "Flow" },
          { emoji: "😊", label: "Mood" },
          { emoji: "⚡", label: "Energy" },
          { emoji: "🌀", label: "Symptoms" },
        ].map(({ emoji, label }) => (
          <div key={label}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
            style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
            <span className="text-base">{emoji}</span> {label}
          </div>
        ))}
      </div>
    ),
  },
  {
    emoji: "💕",
    title: "Share with your partner",
    body: "Luna lets you share a private link with your partner. They see your current phase, what you need from them, and how to support you — without ever seeing your health details.",
    hint: "Set it up any time in the Partner tab.",
    visual: (
      <div className="mt-4 rounded-2xl p-4"
        style={{ background: "rgba(212,96,122,0.08)", border: "1px solid rgba(212,96,122,0.20)" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "#D4607A" }}>💌 What Regina needs right now</p>
        <div className="flex flex-wrap gap-1.5">
          {["🍫 Chocolate", "💆 Massage", "🎬 Movie night"].map((t) => (
            <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(212,96,122,0.12)", color: "#D4607A" }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
  },
];

export function OnboardingTutorial({ userId }: Props) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  async function dismiss() {
    setVisible(false);
    await fetch("/api/user/tutorial-seen", { method: "POST" });
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div
        className="w-full max-w-sm rounded-3xl overflow-hidden animate-fade-up relative"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
        }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, var(--primary), #D470A0, var(--gold))" }} />

        <div className="p-7">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? "24px" : "8px",
                    background: i <= step ? "var(--primary)" : "var(--border)",
                  }} />
              ))}
            </div>
            <button onClick={dismiss}
              className="text-xs font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted-foreground)" }}>
              Skip
            </button>
          </div>

          {/* Content */}
          <div className="text-4xl mb-3 animate-float" style={{ animationDuration: "4s" }}>
            {current.emoji}
          </div>
          <h2 className="text-xl mb-2" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
            {current.title}
          </h2>
          <p className="text-sm leading-relaxed mb-1" style={{ color: "var(--muted-foreground)" }}>
            {current.body}
          </p>
          <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
            ✦ {current.hint}
          </p>

          {/* Visual */}
          {current.visual}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
              >
                ← Back
              </button>
            )}
            <button
              onClick={isLast ? dismiss : () => setStep(step + 1)}
              className="btn-pink-gradient flex-1 py-3 rounded-2xl text-sm font-bold text-white"
              style={{ boxShadow: "0 4px 16px rgba(196,96,122,0.30)" }}
            >
              {isLast ? "Start tracking 🌸" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
