"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getZodiacSign, getElementColor } from "@/lib/zodiac";
import { BirthdatePicker } from "@/components/ui/BirthdatePicker";

interface Props {
  initialData: {
    name: string;
    birthDate: string;
    goal: string;
    wantPregnant: boolean;
    cycleLength: number;
    periodLength: number;
    pronouns: string;
  };
}

const GOALS = [
  { id: "avoid", icon: "🔒", title: "Avoiding pregnancy",  desc: "Cycle awareness without fertility focus" },
  { id: "ttc",   icon: "🌱", title: "Trying to conceive",  desc: "Fertile window highlighted with tips"    },
  { id: "track", icon: "📊", title: "Just tracking",       desc: "Understand my cycle better"              },
];

const PRONOUN_OPTIONS = [
  { value: "she/her",   label: "she/her" },
  { value: "he/him",   label: "he/him" },
  { value: "they/them", label: "they/them" },
  { value: "ze/zir",   label: "ze/zir" },
];

const PHASE_COLORS = {
  menstrual: "#D4607A",
  follicular: "#E890B0",
  ovulation: "#D4A840",
  luteal: "#C090CC",
};

function cycleLengthLabel(days: number) {
  if (days <= 24) return { text: "Short cycle", color: "#E890B0" };
  if (days <= 30) return { text: "Typical cycle", color: "#4CAF88" };
  if (days <= 35) return { text: "Longer cycle", color: "#C090CC" };
  return { text: "Long cycle", color: "#C090CC" };
}

function periodLengthLabel(days: number) {
  if (days <= 3) return { text: "Short period", color: "#E890B0" };
  if (days <= 6) return { text: "Typical period", color: "#4CAF88" };
  return { text: "Longer period", color: "#C090CC" };
}

function getPhaseSegments(cycleLength: number, periodLength: number) {
  const ovulationDay = cycleLength - 14;
  const menstrualDays = periodLength;
  const follicularDays = Math.max(1, ovulationDay - 2 - menstrualDays);
  const ovulationDays = 3;
  const lutealDays = Math.max(1, cycleLength - menstrualDays - follicularDays - ovulationDays);
  return [
    { phase: "Menstrual", days: menstrualDays, color: PHASE_COLORS.menstrual, icon: "🌸" },
    { phase: "Follicular", days: follicularDays, color: PHASE_COLORS.follicular, icon: "🌷" },
    { phase: "Ovulation", days: ovulationDays, color: PHASE_COLORS.ovulation, icon: "🌟" },
    { phase: "Luteal", days: lutealDays, color: PHASE_COLORS.luteal, icon: "🌙" },
  ];
}

type SaveStatus = "idle" | "saving" | "saved";

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full transition-all"
      style={{
        background: status === "saved" ? "rgba(34,197,94,0.12)" : "rgba(196,96,122,0.10)",
        color: status === "saved" ? "#16A34A" : "var(--muted-foreground)",
      }}
    >
      {status === "saving" ? "Saving…" : "✓ Saved"}
    </span>
  );
}

export function ProfileForm({ initialData }: Props) {
  const [name, setName] = useState(initialData.name);
  const [birthDate, setBirthDate] = useState(initialData.birthDate);
  const [goal, setGoal] = useState(initialData.goal ?? "avoid");
  const [cycleLength, setCycleLength] = useState(initialData.cycleLength);
  const [periodLength, setPeriodLength] = useState(initialData.periodLength);
  const [pronouns, setPronouns] = useState(initialData.pronouns);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(false);

  const zodiac = birthDate ? getZodiacSign(new Date(birthDate)) : null;
  const elementColor = zodiac ? getElementColor(zodiac.element) : "var(--primary)";
  const segments = getPhaseSegments(cycleLength, periodLength);
  const cycleLbl = cycleLengthLabel(cycleLength);
  const periodLbl = periodLengthLabel(periodLength);

  const save = useCallback(
    async (data: { name: string; birthDate: string; goal: string; cycleLength: number; periodLength: number; pronouns: string }) => {
      setStatus("saving");
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, birthDate: data.birthDate || null }),
      });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    },
    []
  );

  function scheduleSave(overrides: Partial<{ name: string; birthDate: string; goal: string; cycleLength: number; periodLength: number; pronouns: string }> = {}, delay = 700) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      save({ name, birthDate, goal, cycleLength, periodLength, pronouns, ...overrides });
    }, delay);
  }

  // Skip save on first render
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    scheduleSave({ name }, 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleSave({ birthDate }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthDate]);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleSave({ goal }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goal]);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleSave({ cycleLength }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleLength]);

  useEffect(() => {
    if (!isMounted.current) return;
    scheduleSave({ periodLength }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [periodLength]);

  return (
    <div className="space-y-4">
      {/* Personal details */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Personal details</h3>
          <SaveIndicator status={status} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="How should we call you?" />
        </div>

        {/* Pronouns */}
        <div className="space-y-2">
          <Label>Pronouns</Label>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Used in your partner view and tips
          </p>
          <div className="flex flex-wrap gap-2">
            {PRONOUN_OPTIONS.map((opt) => {
              const active = pronouns === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setPronouns(opt.value); scheduleSave({ pronouns: opt.value }, 0); }}
                  className="px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200"
                  style={{
                    background: active ? "var(--primary)" : "var(--secondary)",
                    color: active ? "white" : "var(--foreground)",
                    border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`,
                    boxShadow: active ? "0 4px 12px rgba(196,96,122,0.25)" : "none",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Date of birth</Label>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Used to show your zodiac sign</p>
          <BirthdatePicker value={birthDate} onChange={setBirthDate} />
        </div>

        {zodiac ? (
          <div className="rounded-xl p-4" style={{ background: `${elementColor}10`, border: `1px solid ${elementColor}25` }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{zodiac.emoji}</span>
              <div>
                <p className="font-bold text-sm" style={{ color: elementColor }}>{zodiac.symbol} {zodiac.name}</p>
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{zodiac.element} {zodiac.elementEmoji} · {zodiac.dates}</p>
              </div>
              <div className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
                style={{ background: `${elementColor}20`, color: elementColor }}>{zodiac.trait}</div>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{zodiac.description}</p>
          </div>
        ) : (
          <div className="rounded-xl p-3 text-xs text-center"
            style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
            ✨ Add your date of birth to reveal your zodiac sign
          </div>
        )}
      </div>

      {/* Goal */}
      <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-0.5">
          <h3 className="font-semibold text-sm">Your goal</h3>
          <SaveIndicator status={status} />
        </div>
        <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
          This shapes your recommendations and how the fertile window is shown
        </p>
        <div className="grid grid-cols-3 gap-2">
          {GOALS.map((g) => (
            <GoalCard
              key={g.id}
              active={goal === g.id}
              icon={g.icon}
              title={g.title}
              desc={g.desc}
              onClick={() => setGoal(g.id)}
            />
          ))}
        </div>
      </div>

      {/* Cycle settings */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: "var(--secondary)" }}>
          <div>
            <h3 className="font-semibold text-sm">Cycle settings</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Help Luna predict your phases accurately</p>
          </div>
          <SaveIndicator status={status} />
        </div>

        <div className="p-5 space-y-6" style={{ background: "var(--card)" }}>
          {/* Phase preview bar */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>Your estimated phase breakdown</p>
            <div className="rounded-xl overflow-hidden h-7 flex" style={{ border: "1px solid var(--border)" }}>
              {segments.map((seg) => (
                <div key={seg.phase} className="flex items-center justify-center transition-all duration-300"
                  style={{ width: `${(seg.days / cycleLength) * 100}%`, background: seg.color, minWidth: "4%" }}
                  title={`${seg.phase}: ${seg.days} days`}>
                  <span className="text-[10px] text-white font-bold hidden sm:block">{seg.days}d</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-2">
              {segments.map((seg) => (
                <div key={seg.phase} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
                  <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                    {seg.icon} {seg.phase} <span className="font-semibold">{seg.days}d</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Cycle length */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <label className="text-sm font-semibold block">Cycle length</label>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>Day 1 of your period → day 1 of your next period</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>{cycleLength}</span>
                <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>days</span>
                <div className="text-[10px] font-bold mt-0.5 px-2 py-0.5 rounded-full"
                  style={{ background: `${cycleLbl.color}20`, color: cycleLbl.color }}>{cycleLbl.text}</div>
              </div>
            </div>
            <input type="range" min={21} max={45} value={cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${((cycleLength - 21) / 24) * 100}%, var(--border) ${((cycleLength - 21) / 24) * 100}%, var(--border) 100%)` }} />
            <div className="flex justify-between">
              {[21, 28, 35, 45].map((v) => (
                <button key={v} type="button" onClick={() => setCycleLength(v)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg transition-all"
                  style={{ background: cycleLength === v ? "var(--primary)" : "var(--secondary)", color: cycleLength === v ? "white" : "var(--muted-foreground)" }}>
                  {v}d
                </button>
              ))}
            </div>
            <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
              <strong className="block mb-1" style={{ color: "var(--secondary-foreground)" }}>💡 What&apos;s typical?</strong>
              Most cycles are <strong>21–35 days</strong>, with 28 days being the classic average. Cycles under 21 or over 35 days are worth discussing with a doctor.
            </div>
          </div>

          <div className="h-px" style={{ background: "var(--border)" }} />

          {/* Period length */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <label className="text-sm font-semibold block">Period length</label>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>How many days your period typically lasts</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: PHASE_COLORS.menstrual }}>{periodLength}</span>
                <span className="text-xs ml-1" style={{ color: "var(--muted-foreground)" }}>days</span>
                <div className="text-[10px] font-bold mt-0.5 px-2 py-0.5 rounded-full"
                  style={{ background: `${periodLbl.color}20`, color: periodLbl.color }}>{periodLbl.text}</div>
              </div>
            </div>
            <input type="range" min={2} max={10} value={periodLength}
              onChange={(e) => setPeriodLength(parseInt(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, ${PHASE_COLORS.menstrual} 0%, ${PHASE_COLORS.menstrual} ${((periodLength - 2) / 8) * 100}%, var(--border) ${((periodLength - 2) / 8) * 100}%, var(--border) 100%)` }} />
            <div className="flex justify-between">
              {[2, 3, 5, 7, 10].map((v) => (
                <button key={v} type="button" onClick={() => setPeriodLength(v)}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg transition-all"
                  style={{ background: periodLength === v ? PHASE_COLORS.menstrual : "var(--secondary)", color: periodLength === v ? "white" : "var(--muted-foreground)" }}>
                  {v}d
                </button>
              ))}
            </div>
            <div>
              <p className="text-[10px] font-semibold mb-1.5" style={{ color: "var(--muted-foreground)" }}>Typical flow pattern over {periodLength} days</p>
              <div className="flex gap-1">
                {Array.from({ length: periodLength }, (_, i) => {
                  const intensity = i === 0 ? 0.4 : i <= 1 ? 0.9 : i <= 2 ? 1 : i <= 3 ? 0.75 : i <= 4 ? 0.5 : 0.25;
                  return (
                    <div key={i} className="flex-1 rounded-full transition-all duration-300"
                      style={{ height: `${Math.round(intensity * 20) + 6}px`, background: PHASE_COLORS.menstrual, opacity: Math.max(0.2, intensity) }} />
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
              <strong className="block mb-1" style={{ color: "var(--secondary-foreground)" }}>💡 What&apos;s typical?</strong>
              Most periods last <strong>3–7 days</strong>. Shorter than 2 or longer than 8 days is worth tracking closely.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoalCard({ active, icon, title, desc, onClick }: {
  active: boolean; icon: string; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-3 rounded-2xl transition-all duration-200"
      style={{
        background: active ? "var(--primary)" : "var(--secondary)",
        color: active ? "var(--primary-foreground)" : "var(--foreground)",
        border: `2px solid ${active ? "var(--primary)" : "var(--border)"}`,
        boxShadow: active ? "0 4px 14px rgba(196,96,122,0.28)" : "none",
        transform: active ? "scale(1.02)" : "scale(1)",
      }}
    >
      <div className="text-xl mb-2">{icon}</div>
      <p className="text-xs font-bold leading-snug mb-1">{title}</p>
      <p className="text-[11px] leading-snug" style={{ opacity: 0.72 }}>{desc}</p>
    </button>
  );
}
