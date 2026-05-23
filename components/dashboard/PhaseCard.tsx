"use client";

import { PhaseInfo, PHASE_DISPLAY, isFertile } from "@/lib/cycle/phases";
import { format, addDays } from "date-fns";

interface Props {
  phaseInfo: PhaseInfo | null;
  wantPregnant: boolean;
}

export function PhaseCard({ phaseInfo, wantPregnant }: Props) {
  if (!phaseInfo) {
    return (
      <div className="pink-card-glow p-6 text-center">
        <div className="text-5xl mb-3 animate-float">🌸</div>
        <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-display)" }}>
          Set up your cycle
        </h2>
        <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>
          Log your last period to start tracking your phases ✨
        </p>
        <a
          href="/log"
          className="btn-pink-gradient inline-block px-5 py-2.5 rounded-[var(--radius-md)] text-sm font-semibold text-white"
          style={{ boxShadow: "0 4px 12px rgba(196,96,122,0.3)" }}
        >
          🌸 Log first period
        </a>
      </div>
    );
  }

  const display = PHASE_DISPLAY[phaseInfo.phase];
  const fertile = isFertile(phaseInfo);
  const ovulationDate = addDays(phaseInfo.cycleStartDate, phaseInfo.ovulationDay - 1);
  const progress = phaseInfo.dayOfCycle / (phaseInfo.daysUntilNextPeriod + phaseInfo.dayOfCycle - 1);
  const circumference = 2 * Math.PI * 52;

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${display.color}18 0%, ${display.color}08 60%, rgba(232,200,138,0.06) 100%)`,
        border: `1px solid ${display.color}30`,
        boxShadow: `0 8px 32px ${display.color}15, 0 2px 8px ${display.color}10`,
      }}
    >
      {/* Background sparkle decoration */}
      <div className="absolute top-3 right-4 text-lg animate-twinkle" style={{ color: "var(--gold)", animationDelay: "0s" }}>✦</div>
      <div className="absolute bottom-4 right-10 text-sm animate-twinkle" style={{ color: display.color, animationDelay: "1.5s" }}>✧</div>
      <div className="absolute top-6 right-16 text-xs animate-twinkle" style={{ color: "var(--gold)", animationDelay: "0.8s" }}>✦</div>

      {/* Soft glow blob */}
      <div
        className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${display.color}, transparent)` }}
      />

      <div className="flex items-start gap-5 relative">
        {/* Cycle ring */}
        <div className="shrink-0">
          <svg width="116" height="116" viewBox="0 0 116 116">
            {/* Outer glow ring */}
            <circle cx="58" cy="58" r="52" fill="none" stroke={`${display.color}15`} strokeWidth="12" />
            {/* Track */}
            <circle cx="58" cy="58" r="52" fill="none" stroke={`${display.color}20`} strokeWidth="9" />
            {/* Progress */}
            <circle
              cx="58" cy="58" r="52"
              fill="none"
              stroke={display.color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              transform="rotate(-90 58 58)"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 4px ${display.color}80)` }}
            />
            {/* Center icon */}
            <text x="58" y="52" textAnchor="middle" fontSize="22">{display.icon}</text>
            {/* Day number */}
            <text x="58" y="70" textAnchor="middle" fill={display.color} fontSize="18" fontWeight="600">
              {phaseInfo.dayOfCycle}
            </text>
            <text x="58" y="82" textAnchor="middle" fill={`${display.color}80`} fontSize="9" fontWeight="500">
              of cycle
            </text>
          </svg>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-1">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: display.color }}
          >
            {display.name.replace(" Phase", "")} phase
          </p>
          <p className="text-sm leading-snug mb-4" style={{ color: "var(--muted-foreground)" }}>
            {display.description}
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <Stat
              label="Next period"
              value={phaseInfo.daysUntilNextPeriod <= 1 ? "Tomorrow" : `${phaseInfo.daysUntilNextPeriod}d`}
              color={display.color}
            />
            {wantPregnant || fertile ? (
              <Stat
                label={fertile ? "Fertile ✨" : "Ovulation"}
                value={fertile ? "Now 🌟" : format(ovulationDate, "MMM d")}
                color={fertile ? "#D4A840" : display.color}
              />
            ) : (
              <Stat
                label="Period date"
                value={format(phaseInfo.nextPeriodDate, "MMM d")}
                color={display.color}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}25`,
      }}
    >
      <div className="text-xs mb-0.5 font-medium" style={{ color: `${color}99` }}>{label}</div>
      <div className="text-sm font-bold" style={{ color }}>{value}</div>
    </div>
  );
}
