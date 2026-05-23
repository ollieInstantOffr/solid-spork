"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Phase, PHASE_DISPLAY } from "@/lib/cycle/phases";
import { PhasePreferences, PHASE_SUGGESTIONS } from "@/lib/phasePreferences";

interface Props {
  initialPreferences: PhasePreferences;
}

const PHASES: Phase[] = ["menstrual", "follicular", "ovulation", "luteal"];

type SaveStatus = "idle" | "saving" | "saved";

export function PhasePreferencesEditor({ initialPreferences }: Props) {
  const [prefs, setPrefs] = useState<PhasePreferences>(initialPreferences);
  const [activePhase, setActivePhase] = useState<Phase>("menstrual");
  const [customInput, setCustomInput] = useState("");
  const [status, setStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(false);

  const display = PHASE_DISPLAY[activePhase];
  const currentList = prefs[activePhase];
  const suggestions = PHASE_SUGGESTIONS[activePhase];

  const savePrefs = useCallback(async (updated: PhasePreferences) => {
    setStatus("saving");
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }, []);

  // Auto-save whenever prefs change (skip initial render)
  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => savePrefs(prefs), 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefs]);

  function toggle(label: string) {
    setPrefs((prev) => {
      const list = prev[activePhase];
      return {
        ...prev,
        [activePhase]: list.includes(label) ? list.filter((i) => i !== label) : [...list, label],
      };
    });
  }

  function addCustom() {
    const val = customInput.trim();
    if (!val || prefs[activePhase].includes(val)) return;
    setPrefs((prev) => ({ ...prev, [activePhase]: [...prev[activePhase], val] }));
    setCustomInput("");
  }

  function removeItem(label: string) {
    setPrefs((prev) => ({ ...prev, [activePhase]: prev[activePhase].filter((i) => i !== label) }));
  }

  // Count total selected across all phases
  const totalSelected = PHASES.reduce(
    (sum, p) => sum + prefs[p].length,
    0
  );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: "var(--secondary)" }}>
        <div>
          <h3 className="font-semibold text-sm">What I need from my partner ✦</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            Shown in the partner view for each phase
            {totalSelected > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                {totalSelected} set
              </span>
            )}
          </p>
        </div>
        {status !== "idle" && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: status === "saved" ? "rgba(34,197,94,0.12)" : "rgba(196,96,122,0.10)",
              color: status === "saved" ? "#16A34A" : "var(--muted-foreground)",
            }}>
            {status === "saving" ? "Saving…" : "✓ Saved"}
          </span>
        )}
      </div>

      {/* Phase tabs */}
      <div className="flex border-b overflow-x-auto" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
        {PHASES.map((phase) => {
          const d = PHASE_DISPLAY[phase];
          const active = activePhase === phase;
          const count = prefs[phase].length;
          return (
            <button
              key={phase}
              onClick={() => setActivePhase(phase)}
              className="flex-1 min-w-[80px] flex flex-col items-center gap-0.5 px-3 py-3 text-xs font-semibold transition-all border-b-2"
              style={{
                borderColor: active ? d.color : "transparent",
                color: active ? d.color : "var(--muted-foreground)",
                background: active ? `${d.color}08` : "transparent",
              }}
            >
              <span className="text-base">{d.icon}</span>
              <span>{phase.charAt(0).toUpperCase() + phase.slice(1)}</span>
              {count > 0 && (
                <span
                  className="px-1.5 py-0 rounded-full text-[9px] font-bold"
                  style={{ background: d.color, color: "white" }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-5 space-y-4" style={{ background: "var(--card)" }}>
        {/* Phase description */}
        <div
          className="rounded-xl px-4 py-3 text-xs"
          style={{ background: `${display.color}10`, border: `1px solid ${display.color}25` }}
        >
          <span style={{ color: display.color }} className="font-semibold">
            {display.icon} {display.name}
          </span>{" "}
          <span style={{ color: "var(--muted-foreground)" }}>
            — tap the things you want your partner to know about this phase
          </span>
        </div>

        {/* Selected items */}
        {currentList.length > 0 && (
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>
              Your picks for this phase
            </p>
            <div className="flex flex-wrap gap-2">
              {currentList.map((item) => {
                const suggestion = suggestions.find((s) => s.label === item);
                return (
                  <div
                    key={item}
                    className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-sm font-medium"
                    style={{
                      background: `${display.color}20`,
                      border: `1px solid ${display.color}40`,
                      color: display.color,
                    }}
                  >
                    {suggestion?.emoji && <span>{suggestion.emoji}</span>}
                    <span>{item}</span>
                    <button
                      onClick={() => removeItem(item)}
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold hover:opacity-75 ml-0.5"
                      style={{ background: `${display.color}30` }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>
            Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map(({ emoji, label }) => {
              const selected = currentList.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggle(label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all"
                  style={{
                    background: selected ? `${display.color}20` : "var(--secondary)",
                    border: `1px solid ${selected ? display.color + "50" : "var(--border)"}`,
                    color: selected ? display.color : "var(--muted-foreground)",
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom input */}
        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--muted-foreground)" }}>
            Add your own
          </p>
          <div className="flex gap-2">
            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="e.g. Surprise me with breakfast…"
              className="flex-1 h-9 px-3 rounded-xl text-sm border"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
            <button
              onClick={addCustom}
              disabled={!customInput.trim()}
              className="px-4 h-9 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{
                background: `${display.color}20`,
                color: display.color,
                border: `1px solid ${display.color}30`,
              }}
            >
              Add
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
