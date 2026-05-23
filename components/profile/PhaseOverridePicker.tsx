"use client";

import { useState } from "react";
import { PHASE_DISPLAY } from "@/lib/cycle/phases";
import type { Phase } from "@/lib/cycle/phases";

const PHASES: Phase[] = ["menstrual", "follicular", "ovulation", "luteal"];

interface Props {
  currentOverride: string | null;
  calculatedPhase: string | null;
}

export function PhaseOverridePicker({ currentOverride, calculatedPhase }: Props) {
  const [selected, setSelected] = useState<Phase | null>(currentOverride as Phase | null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function setPhase(phase: Phase | null) {
    setSelected(phase);
    setStatus("saving");
    await fetch("/api/user/phase-override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase }),
    });
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
        Luna calculates your phase from your logs. If it doesn&apos;t feel right, you can pin a different
        phase for up to 3 days — it won&apos;t affect your cycle data.
      </p>

      {calculatedPhase && (
        <p className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
          Calculated: {PHASE_DISPLAY[calculatedPhase as Phase]?.name ?? calculatedPhase}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {PHASES.map((phase) => {
          const pd = PHASE_DISPLAY[phase];
          const isActive = selected === phase;
          return (
            <button
              key={phase}
              onClick={() => setPhase(isActive ? null : phase)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-2xl text-left transition-all duration-200"
              style={{
                background: isActive ? `${pd.color}18` : "var(--secondary)",
                border: `1.5px solid ${isActive ? pd.color : "var(--border)"}`,
                boxShadow: isActive ? `0 4px 14px ${pd.color}20` : "none",
              }}
            >
              <span className="text-xl">{pd.icon}</span>
              <div>
                <p className="text-xs font-bold" style={{ color: isActive ? pd.color : "var(--foreground)" }}>
                  {pd.name.replace(" Phase", "")}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <button
          onClick={() => setPhase(null)}
          className="text-xs font-semibold hover:opacity-70 transition-opacity"
          style={{ color: "var(--muted-foreground)" }}
        >
          ✕ Clear override — use calculated phase
        </button>
      )}

      {status !== "idle" && (
        <p className="text-xs animate-fade-up"
          style={{ color: status === "saved" ? "var(--primary)" : "var(--muted-foreground)" }}>
          {status === "saving" ? "Saving…" : "Saved ✦"}
        </p>
      )}
    </div>
  );
}
