"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CycleCorrectionPrompt } from "@/components/log/CycleCorrectionPrompt";
import { differenceInDays, startOfDay } from "date-fns";
const FLOW_OPTIONS = [
  { value: "NONE",     label: "None",     emoji: "✕",  color: "#A0A0B0", desc: "No flow today" },
  { value: "SPOTTING", label: "Spotting", emoji: "💧", color: "#F4A0B8", desc: "A little" },
  { value: "LIGHT",    label: "Light",    emoji: "🩸", color: "#E87090", desc: "Light flow" },
  { value: "MEDIUM",   label: "Medium",   emoji: "🩸", color: "#D4607A", desc: "Moderate" },
  { value: "HEAVY",    label: "Heavy",    emoji: "🩸", color: "#A83050", desc: "Heavy flow" },
];

const MOOD_OPTIONS = [
  { value: "GREAT",   emoji: "🌟", label: "Glowing",     color: "#E8C840" },
  { value: "GOOD",    emoji: "🌸", label: "Balanced",    color: "#90C88A" },
  { value: "NEUTRAL", emoji: "🌤️", label: "So-so",       color: "#90B8D8" },
  { value: "SWINGS",  emoji: "🎢", label: "Mood swings", color: "#E8A840" },
  { value: "LOW",     emoji: "🫂", label: "Tender",      color: "#B090C8" },
  { value: "AWFUL",   emoji: "🌧️", label: "Depleted",    color: "#9090C8" },
];

const ENERGY_LEVELS = [
  { value: 1, label: "Exhausted",       emoji: "🪫", color: "#C89090" },
  { value: 2, label: "Tired",           emoji: "😴", color: "#D0A890" },
  { value: 3, label: "Okay",            emoji: "⚡", color: "#90B8D8" },
  { value: 4, label: "Good",            emoji: "✨", color: "#90C88A" },
  { value: 5, label: "Full of energy",  emoji: "🔋", color: "#60B870" },
];

const SYMPTOM_OPTIONS = [
  { value: "cramps",        label: "Cramps",          icon: "🌀" },
  { value: "headache",      label: "Headache",        icon: "🤯" },
  { value: "bloating",      label: "Bloating",        icon: "🎈" },
  { value: "tender_breasts",label: "Tender breasts",  icon: "🌸" },
  { value: "fatigue",       label: "Fatigue",         icon: "😪" },
  { value: "acne",          label: "Acne",            icon: "😤" },
  { value: "nausea",        label: "Nausea",          icon: "🤢" },
  { value: "back_pain",     label: "Back pain",       icon: "🔙" },
  { value: "mood_swings",   label: "Mood swings",     icon: "🎢" },
  { value: "insomnia",      label: "Insomnia",        icon: "🌙" },
  { value: "cravings",      label: "Cravings",        icon: "🍫" },
  { value: "discharge",     label: "Discharge",       icon: "💧" },
];

const CERVICAL_OPTIONS = [
  { value: "DRY", label: "Dry" },
  { value: "STICKY", label: "Sticky" },
  { value: "CREAMY", label: "Creamy" },
  { value: "WATERY", label: "Watery" },
  { value: "EGG_WHITE", label: "Egg white" },
];

interface ExistingLog {
  flowIntensity: string;
  symptoms: string[];
  mood?: string;
  energyLevel?: number;
  bbt?: number;
  cervicalMucus?: string;
  hadSex: boolean;
  notes?: string;
}

interface Props {
  existingLog?: ExistingLog;
  currentCycleLength?: number;
  predictedNextPeriod?: string | null;
}

export function LogForm({ existingLog, currentCycleLength, predictedNextPeriod }: Props) {
  const router = useRouter();
  const [flow, setFlow] = useState(existingLog?.flowIntensity ?? "NONE");
  const [mood, setMood] = useState(existingLog?.mood ?? "");
  const [energy, setEnergy] = useState(existingLog?.energyLevel ?? 3);
  const [symptoms, setSymptoms] = useState<string[]>(existingLog?.symptoms ?? []);
  const [bbt, setBbt] = useState(existingLog?.bbt?.toString() ?? "");
  const [cervical, setCervical] = useState(existingLog?.cervicalMucus ?? "");
  const [hadSex, setHadSex] = useState(existingLog?.hadSex ?? false);
  const [notes, setNotes] = useState(existingLog?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctionDaysOff, setCorrectionDaysOff] = useState(0);

  function toggleSymptom(val: string) {
    setSymptoms((prev) =>
      prev.includes(val) ? prev.filter((s) => s !== val) : [...prev, val]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flowIntensity: flow,
        mood: mood || null,
        energyLevel: energy,
        symptoms,
        bbt: bbt ? parseFloat(bbt) : null,
        cervicalMucus: cervical || null,
        hadSex,
        notes: notes || null,
      }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);

    // Cycle correction check: if user just logged flow and has a predicted date
    if (flow !== "NONE" && predictedNextPeriod && currentCycleLength) {
      const predicted = startOfDay(new Date(predictedNextPeriod));
      const today = startOfDay(new Date());
      const daysOff = differenceInDays(today, predicted); // negative = early, positive = late
      if (Math.abs(daysOff) >= 3 && Math.abs(daysOff) <= 14) {
        setCorrectionDaysOff(daysOff);
        setShowCorrection(true);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Flow */}
      <Section title="Period flow" subtitle="How heavy is your flow today?">
        <div className="grid grid-cols-5 gap-1.5">
          {FLOW_OPTIONS.map((o) => {
            const active = flow === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => setFlow(o.value)}
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
                  style={{ opacity: o.value === "NONE" ? (active ? 1 : 0.4) : 1 }}
                >
                  {o.emoji}
                </span>
                <span className="font-semibold leading-tight text-center">{o.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Symptoms */}
      <Section title="Symptoms" subtitle="Select all that apply">
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_OPTIONS.map((s) => {
            const active = symptoms.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSymptom(s.value)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all"
                style={{
                  background: active ? "var(--primary)" : "var(--secondary)",
                  color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Mood */}
      <Section title="Mood" subtitle="Pick what resonates most right now">
        <div className="grid grid-cols-3 gap-1.5">
          {MOOD_OPTIONS.map((o) => {
            const active = mood === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => setMood(mood === o.value ? "" : o.value)}
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

      {/* Energy */}
      <Section title="Energy level" subtitle="How does your body feel overall today?">
        <div className="flex gap-2">
          {ENERGY_LEVELS.map((e) => {
            const active = energy === e.value;
            return (
              <button
                key={e.value}
                type="button"
                onClick={() => setEnergy(e.value)}
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
        <div className="flex gap-1 mt-2">
          {ENERGY_LEVELS.map((e) => (
            <div
              key={e.value}
              className="flex-1 h-1.5 rounded-full transition-all"
              style={{ background: e.value <= energy ? ENERGY_LEVELS[energy - 1].color : "var(--border)" }}
            />
          ))}
        </div>
      </Section>

      {/* Advanced section */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="px-5 py-4" style={{ background: "var(--secondary)" }}>
          <p className="text-sm font-medium">Advanced tracking</p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Optional fertility indicators
          </p>
        </div>

        <div className="p-5 space-y-5" style={{ background: "var(--card)" }}>
          {/* BBT */}
          <div>
            <Label htmlFor="bbt" className="text-sm mb-1.5 block">
              Basal body temperature (°C)
            </Label>
            <input
              id="bbt"
              type="number"
              step="0.01"
              min="35"
              max="39"
              value={bbt}
              onChange={(e) => setBbt(e.target.value)}
              placeholder="e.g. 36.5"
              className="w-full h-10 px-3 rounded-[var(--radius-md)] text-sm border"
              style={{ background: "var(--background)", borderColor: "var(--border)" }}
            />
          </div>

          {/* Cervical mucus */}
          <div>
            <Label className="text-sm mb-2 block">Cervical mucus</Label>
            <div className="flex flex-wrap gap-2">
              {CERVICAL_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setCervical(cervical === o.value ? "" : o.value)}
                  className="px-3 py-1.5 rounded-full text-xs transition-all"
                  style={{
                    background: cervical === o.value ? "var(--primary)" : "var(--secondary)",
                    color: cervical === o.value ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    border: `1px solid ${cervical === o.value ? "var(--primary)" : "var(--border)"}`,
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sex */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm">Intimacy today</Label>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                Used to personalise recommendations — if sex occurred during your fertile window, Luna will show two-week-wait tips or a contraception check-in
              </p>
            </div>
            <Switch checked={hadSex} onCheckedChange={setHadSex} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <Section title="Notes" subtitle="Anything else to capture?">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling? Any observations..."
          rows={3}
        />
      </Section>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full" disabled={saving}>
        {saved ? "✓ Saved!" : saving ? "Saving…" : existingLog ? "Update today's log" : "Save today's log"}
      </Button>

      {/* Cycle length correction prompt */}
      {showCorrection && currentCycleLength && (
        <CycleCorrectionPrompt
          daysOff={correctionDaysOff}
          currentLength={currentCycleLength}
          suggestedLength={Math.max(18, Math.min(60, currentCycleLength - correctionDaysOff))}
          onDismiss={() => setShowCorrection(false)}
        />
      )}
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="mb-3">
        <h3 className="text-base font-medium">{title}</h3>
        {subtitle && (
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
