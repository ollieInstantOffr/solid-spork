"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  /** Pass the predicted next-period date if available */
  predictedDate?: string | null;
}

export function PeriodStartButton({ predictedDate }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleStart() {
    setLoading(true);
    await fetch("/api/log/quick", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flowIntensity: "MEDIUM" }),
    });
    setDone(true);
    setLoading(false);
    setTimeout(() => router.refresh(), 800);
  }

  if (done) {
    return (
      <div
        className="rounded-2xl px-5 py-3.5 flex items-center gap-3 animate-fade-up"
        style={{ background: "rgba(212,96,122,0.10)", border: "1px solid rgba(212,96,122,0.25)" }}
      >
        <span className="text-xl">🌸</span>
        <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
          Period logged — take care of yourself today 💕
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 flex items-center justify-between gap-4"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 2px 12px rgba(196,96,122,0.06)",
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: "rgba(212,96,122,0.10)", border: "1px solid rgba(212,96,122,0.20)" }}
        >
          🩸
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Did your period start today?
          </p>
          {predictedDate && (
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Predicted around {predictedDate}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleStart}
        disabled={loading}
        className="btn-pink-gradient px-4 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0 transition-all"
        style={{
          boxShadow: "0 4px 14px rgba(196,96,122,0.30)",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving…" : "Yes, log it 🌸"}
      </button>
    </div>
  );
}
