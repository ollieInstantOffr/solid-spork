"use client";

import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, isSameMonth, addMonths, subMonths, isToday, isFuture,
  differenceInDays, startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { calculatePhase, PHASE_DISPLAY } from "@/lib/cycle/phases";
import type { Phase } from "@/lib/cycle/phases";

interface LogEntry {
  date: string;
  flowIntensity: string;
}

interface Props {
  logs: LogEntry[];
  /** ISO string of the confirmed first day of the last period — drives all phase forecasts */
  lastPeriodStart: string | null;
  cycleLength: number;
  periodLength: number;
}

const FLOW_META: Record<string, { color: string; drops: number; label: string }> = {
  SPOTTING: { color: "#F4A0B8", drops: 1, label: "Spotting" },
  LIGHT:    { color: "#E8708A", drops: 1, label: "Light"    },
  MEDIUM:   { color: "#C4506A", drops: 2, label: "Medium"   },
  HEAVY:    { color: "#8B2252", drops: 3, label: "Heavy"    },
};

const DAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

// ── Per-day phase data ──────────────────────────────────────────────────────
function getDayData(
  day: Date,
  lastPeriodStart: Date | null,
  cycleLength: number,
  periodLength: number,
): { phase: Phase; color: string; icon: string; dayOfCycle: number; isFertile: boolean } | null {
  if (!lastPeriodStart) return null;
  const info = calculatePhase(lastPeriodStart, cycleLength, periodLength, day);
  if (!info) return null;
  const d = PHASE_DISPLAY[info.phase];
  const fertile =
    info.dayOfCycle >= info.fertileWindow.start &&
    info.dayOfCycle <= info.fertileWindow.end;
  return { phase: info.phase, color: d.color, icon: d.icon, dayOfCycle: info.dayOfCycle, isFertile: fertile };
}

export function CycleCalendar({ logs, lastPeriodStart, cycleLength, periodLength }: Props) {
  const [month, setMonth] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const periodStart = lastPeriodStart ? startOfDay(new Date(lastPeriodStart)) : null;
  const today = startOfDay(new Date());

  const monthStart = startOfMonth(month);
  const monthEnd   = endOfMonth(month);
  const calStart   = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd     = endOfWeek(monthEnd,     { weekStartsOn: 1 });

  const days: Date[] = [];
  let curr = calStart;
  while (curr <= calEnd) { days.push(curr); curr = addDays(curr, 1); }

  const logMap = new Map<string, LogEntry>();
  logs.forEach((l) => logMap.set(format(new Date(l.date), "yyyy-MM-dd"), l));

  // Build a single predicted-cycle strip to show how many cycles ahead we're displaying
  const isCurrentMonth = isSameMonth(month, new Date());
  const monthsAhead = differenceInDays(startOfMonth(month), startOfMonth(new Date()));

  return (
    <div
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        boxShadow: "0 4px 24px rgba(196,96,122,0.08), 0 1px 4px rgba(196,96,122,0.06)",
      }}
    >
      {/* Subtle sparkle decorations */}
      <span className="absolute top-3 right-16 text-xs animate-twinkle pointer-events-none select-none"
        style={{ color: "var(--gold)", opacity: 0.6, animationDelay: "0.3s" }}>✦</span>
      <span className="absolute top-5 right-12 text-[9px] animate-twinkle pointer-events-none select-none"
        style={{ color: "var(--primary)", opacity: 0.5, animationDelay: "1.1s" }}>✧</span>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2">
          <span className="text-lg animate-float" style={{ animationDuration: "4s" }}>🌸</span>
          <h2 className="text-lg" style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
            {format(month, "MMMM")}
            <span className="ml-1.5 text-sm font-normal" style={{ color: "var(--muted-foreground)" }}>
              {format(month, "yyyy")}
            </span>
          </h2>
          {/* Future forecast badge */}
          {monthsAhead > 0 && periodStart && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(192,144,204,0.15)", color: "#C090CC", border: "1px solid rgba(192,144,204,0.3)" }}>
              ✦ forecast
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {[
            { fn: () => setMonth(subMonths(month, 1)), icon: <ChevronLeft className="w-4 h-4" />, label: "Previous month" },
            { fn: () => setMonth(addMonths(month, 1)), icon: <ChevronRight className="w-4 h-4" />, label: "Next month"     },
          ].map(({ fn, icon, label }) => (
            <button key={label} aria-label={label} onClick={fn}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ color: "var(--muted-foreground)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--secondary)";
                (e.currentTarget as HTMLElement).style.color = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
              }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* ── Weekday labels ─────────────────────────────────────── */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold uppercase tracking-widest py-2"
              style={{ color: "var(--muted-foreground)", letterSpacing: "0.08em" }}>
              {d}
            </div>
          ))}
        </div>

        {/* ── Days grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const key      = format(day, "yyyy-MM-dd");
            const log      = logMap.get(key);
            const isDay    = isToday(day);
            const inMonth  = isSameMonth(day, month);
            const isFut    = isFuture(startOfDay(day));          // strictly after today
            const isHov    = hoveredDay === key && inMonth;
            const flowMeta = log && log.flowIntensity !== "NONE" ? FLOW_META[log.flowIntensity] : null;

            // Phase data for every day (past confirmed, future = forecast)
            const phaseData = getDayData(day, periodStart, cycleLength, periodLength);

            // Background logic:
            // - Flow logged     → flow tint (strongest, user-confirmed)
            // - Past/today, no log → phase tint at normal opacity (derived from period start)
            // - Future          → phase tint at ~40% opacity (forecast, not confirmed)
            let bgStyle: React.CSSProperties = {};
            if (!inMonth) {
              bgStyle = {};
            } else if (flowMeta) {
              bgStyle = { background: `${flowMeta.color}28` };
            } else if (phaseData) {
              const opacity = isFut ? "10" : "18";
              bgStyle = { background: `${phaseData.color}${opacity}` };
            }

            // Outline: today = solid primary ring; future phase day = very faint dashed phase colour
            let outlineStyle: React.CSSProperties = { outline: "2px solid transparent" };
            if (isDay) {
              outlineStyle = {
                outline: "2.5px solid var(--primary)",
                outlineOffset: "-2px",
                boxShadow: "0 0 12px rgba(196,96,122,0.28)",
              };
            } else if (isFut && phaseData && inMonth) {
              outlineStyle = {
                outline: `1.5px dashed ${phaseData.color}50`,
                outlineOffset: "-1px",
              };
            }

            return (
              <div key={i}
                className="relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 cursor-default select-none"
                style={{
                  aspectRatio: "1",
                  opacity: inMonth ? 1 : 0.22,
                  transform: isHov && inMonth ? "scale(1.08)" : "scale(1)",
                  boxShadow: isHov && inMonth && phaseData
                    ? `0 2px 10px ${phaseData.color}22`
                    : "none",
                  ...bgStyle,
                  ...outlineStyle,
                }}
                onMouseEnter={() => inMonth && setHoveredDay(key)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Fertile window shimmer strip */}
                {phaseData?.isFertile && !flowMeta && inMonth && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: "linear-gradient(135deg, rgba(232,200,138,0.22) 0%, transparent 70%)" }} />
                )}

                {/* Today sparkle */}
                {isDay && (
                  <span className="absolute -top-1 -right-0.5 text-[9px] animate-twinkle pointer-events-none"
                    style={{ color: "var(--gold)", animationDelay: "0.2s" }}>✦</span>
                )}

                {/* Future ✦ faint hint */}
                {isFut && phaseData && inMonth && !flowMeta && (
                  <span className="absolute top-0.5 right-0.5 text-[7px] pointer-events-none"
                    style={{ color: phaseData.color, opacity: 0.5 }}>✦</span>
                )}

                {/* Day number */}
                <span className="text-[13px] leading-none"
                  style={{
                    color: isDay
                      ? "var(--primary)"
                      : phaseData && inMonth
                      ? phaseData.color
                      : "var(--foreground)",
                    fontWeight: isDay ? 700 : isFut ? 400 : 500,
                    opacity: isFut && !isDay ? 0.75 : 1,
                  }}>
                  {format(day, "d")}
                </span>

                {/* Flow droplets (logged) */}
                {flowMeta && (
                  <div className="flex gap-px mt-0.5">
                    {Array.from({ length: flowMeta.drops }).map((_, di) => (
                      <svg key={di} width="4" height="5" viewBox="0 0 4 5" style={{ fill: flowMeta.color, flexShrink: 0 }}>
                        <path d="M2 0 C2 0 0 2.5 0 3.5 A2 2 0 0 0 4 3.5 C4 2.5 2 0 2 0Z" />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Phase dot (confirmed past, no flow logged) */}
                {!flowMeta && phaseData && inMonth && !isFut && (
                  <div className="w-1 h-1 rounded-full mt-0.5"
                    style={{ background: phaseData.color, opacity: 0.5 }} />
                )}

                {/* Forecast dot (future) */}
                {!flowMeta && phaseData && inMonth && isFut && (
                  <div className="w-1 h-1 rounded-full mt-0.5"
                    style={{ background: phaseData.color, opacity: 0.28 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Phase legend ────────────────────────────────────────── */}
        <div className="mt-4 pt-4 space-y-3" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(PHASE_DISPLAY).map(([key, d]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0"
                  style={{ background: `${d.color}20`, border: `1px solid ${d.color}40` }}>
                  {d.icon}
                </div>
                <span className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                  {d.name.replace(" Phase", "")}
                </span>
              </div>
            ))}
          </div>

          {/* Flow + forecast indicators */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {/* Flow droplets */}
            <div className="flex items-center gap-3">
              {Object.entries(FLOW_META).map(([key, { color, label }]) => (
                <div key={key} className="flex items-center gap-1">
                  <svg width="5" height="7" viewBox="0 0 5 7" style={{ fill: color, flexShrink: 0 }}>
                    <path d="M2.5 0 C2.5 0 0 3.5 0 4.5 A2.5 2.5 0 0 0 5 4.5 C5 3.5 2.5 0 2.5 0Z" />
                  </svg>
                  <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Forecast key */}
            {periodStart && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-lg border border-dashed"
                  style={{ borderColor: "rgba(192,144,204,0.5)", background: "rgba(192,144,204,0.08)" }} />
                <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Forecast</span>
              </div>
            )}

            {/* Fertile window key */}
            {periodStart && (
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-lg"
                  style={{ background: "linear-gradient(135deg, rgba(232,200,138,0.45), rgba(232,200,138,0.15))", border: "1px solid rgba(232,200,138,0.5)" }} />
                <span className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>Fertile window</span>
              </div>
            )}
          </div>

          {/* Empty state — no period logged yet */}
          {!periodStart && (
            <p className="text-xs text-center py-2" style={{ color: "var(--muted-foreground)" }}>
              Log your period flow to unlock phase forecasting ✦
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
