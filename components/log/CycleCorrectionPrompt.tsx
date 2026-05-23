"use client";

import { useState } from "react";

interface Props {
  daysOff: number;       // negative = early, positive = late
  suggestedLength: number;
  currentLength: number;
  onDismiss: () => void;
}

export function CycleCorrectionPrompt({ daysOff, suggestedLength, currentLength, onDismiss }: Props) {
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const early = daysOff < 0;
  const abs = Math.abs(daysOff);

  async function update() {
    setSaving(true);
    await fetch("/api/user/cycle-length", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cycleLength: suggestedLength }),
    });
    setSaving(false);
    setDone(true);
    setTimeout(onDismiss, 1500);
  }

  if (done) {
    return (
      <div className="rounded-2xl p-4 text-center animate-fade-up"
        style={{ background: "rgba(76,175,136,0.10)", border: "1px solid rgba(76,175,136,0.25)" }}>
        <p className="text-sm font-semibold" style={{ color: "#4CAF88" }}>
          ✓ Cycle length updated to {suggestedLength} days
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 animate-fade-up"
      style={{ background: "var(--card)", border: "1px solid rgba(212,96,122,0.25)", boxShadow: "0 4px 20px rgba(196,96,122,0.08)" }}>
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl">📅</span>
        <div>
          <p className="font-semibold text-sm mb-1">Your period came {abs} days {early ? "early" : "late"}</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            Luna predicted your period on a different day. Would you like to update your cycle length
            from <strong>{currentLength} days</strong> to <strong>{suggestedLength} days</strong>?
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onDismiss}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
          Keep {currentLength}d
        </button>
        <button onClick={update} disabled={saving}
          className="btn-pink-gradient flex-1 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? "Saving…" : `Update to ${suggestedLength}d 🌸`}
        </button>
      </div>
    </div>
  );
}
