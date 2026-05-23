"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FLOW_OPTIONS = [
  { value: "NONE", label: "None", emoji: "✕", desc: "No flow today", color: "#A0A0B0" },
  { value: "SPOTTING", label: "Spotting", emoji: "💧", desc: "A little", color: "#F4A0B8" },
  { value: "LIGHT", label: "Light", emoji: "🩸", desc: "Light flow", color: "#E87090" },
  { value: "MEDIUM", label: "Medium", emoji: "🩸", desc: "Moderate", color: "#D4607A" },
  { value: "HEAVY", label: "Heavy", emoji: "🩸", desc: "Heavy flow", color: "#A83050" },
];

const MOOD_OPTIONS = [
  { value: "GREAT", label: "Glowing", emoji: "🌟", color: "#E8C840" },
  { value: "GOOD", label: "Balanced", emoji: "🌸", color: "#90C88A" },
  { value: "NEUTRAL", label: "So-so", emoji: "🌤️", color: "#90B8D8" },
  { value: "SWINGS", label: "Mood swings", emoji: "🎢", color: "#E8A840" },
  { value: "LOW", label: "Tender", emoji: "🫂", color: "#B090C8" },
  { value: "AWFUL", label: "Depleted", emoji: "🌧️", color: "#9090C8" },
];

const ENERGY_LEVELS = [
  { value: 1, label: "Exhausted", emoji: "🪫", color: "#C89090" },
  { value: 2, label: "Tired", emoji: "😴", color: "#D0A890" },
  { value: 3, label: "Okay", emoji: "⚡", color: "#90B8D8" },
  { value: 4, label: "Good", emoji: "✨", color: "#90C88A" },
  { value: 5, label: "Full of energy", emoji: "🔋", color: "#60B870" },
];

const SYMPTOM_OPTIONS = [
  { value: "cramps", label: "Cramps", emoji: "🌀" },
  { value: "headache", label: "Headache", emoji: "🤯" },
  { value: "bloating", label: "Bloating", emoji: "🎈" },
  { value: "fatigue", label: "Fatigue", emoji: "😪" },
  { value: "tender_breasts", label: "Tender", emoji: "🌸" },
  { value: "mood_swings", label: "Mood swings", emoji: "🎢" },
  { value: "acne", label: "Acne", emoji: "😤" },
  { value: "nausea", label: "Nausea", emoji: "🤢" },
];

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5">
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted-foreground)" }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)", opacity: 0.75 }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

export function QuickLog() {
  const router = useRouter();
  const [flow, setFlow] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [energy, setEnergy] = useState<number | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const toggleSymptom = (val: string) =>
    setSymptoms((prev) => prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]);

  const hasAnyInput = flow !== null || mood !== null || energy !== null || symptoms.length > 0;

  async function handleSave() {
    if (!hasAnyInput) return;
    setSaving(true);
    await fetch("/api/log/quick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flow: flow ?? "NONE", mood, energy, symptoms }),
    });
    setSaving(false);
    setDone(true);
    setTimeout(() => {
      router.refresh();
    }, 800);
  }

  if (done) {
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-2 text-center animate-fade-up"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <span className="text-3xl">🌸</span>
        <p className="font-semibold text-sm">Logged! Take care today.</p>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Your today&apos;s check-in is saved</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #C870A0 100%)",
        }}
      >
        <div>
          <h2 className="text-base font-bold text-white">Today&apos;s check-in ✨</h2>
          <p className="text-xs mt-0.5 text-white/75">
            Just a few taps — takes less than 30 seconds
          </p>
        </div>
        <a
          href="/log"
          className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
          style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
        >
          Full log →
        </a>
      </div>

      <div className="p-5 space-y-5" style={{ background: "var(--card)" }}>

        {/* ── Flow ── */}
        <Section title="Flow" subtitle="Are you on your period right now?">
          <div className="grid grid-cols-5 gap-1.5">
            {FLOW_OPTIONS.map((o) => {
              const active = flow === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => setFlow(flow === o.value ? null : o.value)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all text-xs"
                  style={{
                    background: active ? `${o.color}22` : "var(--secondary)",
                    border: `2px solid ${active ? o.color : "transparent"}`,
                    color: active ? o.color : "var(--muted-foreground)",
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <span
                    className="text-lg leading-none"
                    style={{
                      opacity: o.value === "NONE" ? (active ? 1 : 0.4) : 1,
                      filter: active ? "none" : "grayscale(40%)",
                    }}
                  >
                    {o.emoji}
                  </span>
                  <span className="font-semibold leading-tight text-center">{o.label}</span>
                </button>
              );
            })}
          </div>
          {flow && flow !== "NONE" && (
            <p className="text-[11px] mt-1.5 text-center animate-fade-up" style={{ color: "var(--muted-foreground)" }}>
              {FLOW_OPTIONS.find((o) => o.value === flow)?.desc} — hang in there 🌸
            </p>
          )}
        </Section>

        {/* Divider */}
        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* ── Mood ── */}
        <Section title="Mood" subtitle="Pick what resonates most right now">
          <div className="grid grid-cols-3 gap-1.5">
            {MOOD_OPTIONS.map((o) => {
              const active = mood === o.value;
              return (
                <button
                  key={o.value}
                  onClick={() => setMood(mood === o.value ? null : o.value)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all text-xs"
                  style={{
                    background: active ? `${o.color}22` : "var(--secondary)",
                    border: `2px solid ${active ? o.color : "transparent"}`,
                    color: active ? o.color : "var(--muted-foreground)",
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <span className="text-2xl leading-none">{o.emoji}</span>
                  <span className="font-semibold leading-tight text-center text-[10px]">{o.label}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Divider */}
        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* ── Energy ── */}
        <Section title="Energy level" subtitle="How does your body feel overall today?">
          <div className="flex gap-2">
            {ENERGY_LEVELS.map((e) => {
              const active = energy === e.value;
              return (
                <button
                  key={e.value}
                  onClick={() => setEnergy(energy === e.value ? null : e.value)}
                  className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all"
                  style={{
                    background: active ? `${e.color}22` : "var(--secondary)",
                    border: `2px solid ${active ? e.color : "transparent"}`,
                    transform: active ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <span className="text-xl leading-none">{e.emoji}</span>
                  <span
                    className="text-[10px] font-semibold text-center leading-tight"
                    style={{ color: active ? e.color : "var(--muted-foreground)" }}
                  >
                    {e.label}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Visual energy bar */}
          {energy !== null && (
            <div className="mt-2 flex gap-1 animate-fade-up">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    background: i < energy
                      ? ENERGY_LEVELS[energy - 1].color
                      : "var(--border)",
                  }}
                />
              ))}
            </div>
          )}
        </Section>

        {/* Divider */}
        <div className="h-px" style={{ background: "var(--border)" }} />

        {/* ── Symptoms ── */}
        <Section title="Symptoms" subtitle="Tap anything you&apos;re experiencing — select all that apply">
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((s) => {
              const active = symptoms.includes(s.value);
              return (
                <button
                  key={s.value}
                  onClick={() => toggleSymptom(s.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: active ? "var(--primary)" : "var(--secondary)",
                    color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    border: `1.5px solid ${active ? "var(--primary)" : "transparent"}`,
                    transform: active ? "scale(1.03)" : "scale(1)",
                    boxShadow: active ? "0 2px 8px rgba(196,96,122,0.25)" : "none",
                  }}
                >
                  <span>{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
          {symptoms.length === 0 && (
            <p className="text-[11px] mt-1.5" style={{ color: "var(--muted-foreground)", opacity: 0.65 }}>
              No symptoms? That&apos;s great — tap &quot;Save&quot; below anyway ✨
            </p>
          )}
        </Section>

        {/* ── Save ── */}
        <div className="pt-1">
          {hasAnyInput ? (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-pink-gradient w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all"
              style={{
                opacity: saving ? 0.75 : 1,
                boxShadow: "0 4px 16px rgba(196,96,122,0.35)",
              }}
            >
              {saving ? "Saving… 🌸" : "✨ Save today's check-in"}
            </button>
          ) : (
            <div
              className="text-center py-3 rounded-2xl text-xs"
              style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
            >
              Select at least one option above to save
            </div>
          )}
          <p className="text-[11px] text-center mt-2" style={{ color: "var(--muted-foreground)", opacity: 0.6 }}>
            Want to add notes, BBT, or more?{" "}
            <a href="/log" className="underline font-medium" style={{ color: "var(--primary)" }}>
              Open the full log
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
