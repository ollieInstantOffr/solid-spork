"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getZodiacSign, getElementColor } from "@/lib/zodiac";
import { BirthdatePicker } from "@/components/ui/BirthdatePicker";

interface Props {
  email: string;
}

const GOALS = [
  { id: "avoid", goal: "avoid", wantPregnant: false, icon: "🔒", title: "Avoiding pregnancy", desc: "Recommendations focus on cycle awareness and contraception" },
  { id: "ttc",   goal: "ttc",   wantPregnant: true,  icon: "🌱", title: "Trying to conceive", desc: "Fertile window is highlighted with timing tips" },
  { id: "track", goal: "track", wantPregnant: false, icon: "📊", title: "Just tracking",       desc: "I want to understand my cycle better" },
];

export function OnboardingForm({ email }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [saving, setSaving] = useState(false);

  const selectedGoalObj = GOALS.find((g) => g.id === selectedGoal);
  const wantPregnant    = selectedGoalObj?.wantPregnant ?? false;
  const goalValue       = selectedGoalObj?.goal ?? "avoid";

  const zodiac = birthDate ? getZodiacSign(new Date(birthDate)) : null;
  const elementColor = zodiac ? getElementColor(zodiac.element) : "var(--primary)";

  async function handleFinish() {
    setSaving(true);
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthDate: birthDate || null, goal: goalValue, wantPregnant, cycleLength, periodLength }),
    });
    router.push("/dashboard");
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 justify-center">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="flex items-center gap-2"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all"
              style={{
                background: s <= step ? "var(--primary)" : "var(--secondary)",
                color: s <= step ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              {s < step ? "✓" : s}
            </div>
            {s < 3 && (
              <div
                className="w-8 h-px"
                style={{ background: s < step ? "var(--primary)" : "var(--border)" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Name */}
      {step === 1 && (
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
            What should we call you?
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
            Signing in as <strong>{email}</strong>
          </p>

          <div className="space-y-4 mb-6">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your first name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Regine"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label>Date of birth</Label>
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Used to show your zodiac sign — nothing else
              </p>
              <BirthdatePicker value={birthDate} onChange={setBirthDate} />
            </div>

            {/* Zodiac preview */}
            {zodiac && (
              <div
                className="rounded-xl p-4 flex items-center gap-3 animate-fade-up"
                style={{ background: `${elementColor}12`, border: `1px solid ${elementColor}30` }}
              >
                <span className="text-3xl">{zodiac.emoji}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: elementColor }}>
                    {zodiac.symbol} {zodiac.name} · {zodiac.element} {zodiac.elementEmoji}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {zodiac.trait} · {zodiac.dates}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button onClick={() => setStep(2)} className="w-full" size="lg">
            Continue →
          </Button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full text-center text-xs mt-3"
            style={{ color: "var(--muted-foreground)" }}
          >
            Skip for now
          </button>
        </div>
      )}

      {/* Step 2: Goal */}
      {step === 2 && (
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
            What&#39;s your goal?
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
            This shapes your recommendations. You can change it anytime.
          </p>

          <div className="space-y-3 mb-6">
            {GOALS.map((goal) => (
              <button
                key={goal.id}
                type="button"
                onClick={() => setSelectedGoal(goal.id)}
                className="w-full text-left p-4 rounded-xl transition-all"
                style={{
                  background: selectedGoal === goal.id ? "var(--primary)" : "var(--secondary)",
                  color: selectedGoal === goal.id ? "var(--primary-foreground)" : "var(--foreground)",
                  border: `2px solid ${selectedGoal === goal.id ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{goal.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{goal.title}</p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color: selectedGoal === goal.id ? "rgba(255,255,255,0.75)" : "var(--muted-foreground)",
                      }}
                    >
                      {goal.desc}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              ← Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="flex-1"
              disabled={!selectedGoal}
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Cycle details */}
      {step === 3 && (
        <div
          className="rounded-2xl p-8"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
            About your cycle
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted-foreground)" }}>
            These help Luna predict your phases. Typical defaults are fine if you&#39;re not sure.
          </p>

          <div className="space-y-5 mb-6">
            <div>
              <Label htmlFor="cycleLength" className="mb-1 block">
                Average cycle length
              </Label>
              <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
                From the first day of one period to the first day of the next
              </p>
              <div className="flex items-center gap-4">
                <input
                  id="cycleLength"
                  type="range"
                  min={21}
                  max={45}
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  className="flex-1 accent-[var(--primary)]"
                />
                <span
                  className="w-16 text-center font-semibold text-sm py-1.5 rounded-lg"
                  style={{ background: "var(--secondary)" }}
                >
                  {cycleLength} days
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="periodLength" className="mb-1 block">
                Average period length
              </Label>
              <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
                How many days your period typically lasts
              </p>
              <div className="flex items-center gap-4">
                <input
                  id="periodLength"
                  type="range"
                  min={2}
                  max={10}
                  value={periodLength}
                  onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                  className="flex-1 accent-[var(--primary)]"
                />
                <span
                  className="w-16 text-center font-semibold text-sm py-1.5 rounded-lg"
                  style={{ background: "var(--secondary)" }}
                >
                  {periodLength} days
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="flex-1"
            >
              ← Back
            </Button>
            <Button
              onClick={handleFinish}
              className="flex-1"
              disabled={saving}
            >
              {saving ? "Setting up…" : "Go to Luna →"}
            </Button>
          </div>

          <p className="text-center text-xs pt-2" style={{ color: "var(--muted-foreground)" }}>
            By finishing setup you agree to our{" "}
            <Link href="/terms" target="_blank" className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
              style={{ color: "var(--primary)" }}>
              Terms
            </Link>
            {" & "}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2 font-medium hover:opacity-80 transition-opacity"
              style={{ color: "var(--primary)" }}>
              Privacy Policy
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
