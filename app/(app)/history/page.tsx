import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, differenceInDays, format, addDays } from "date-fns";
import Link from "next/link";
import { PHASE_DISPLAY } from "@/lib/cycle/phases";

interface Cycle {
  startDate: Date;
  endDate: Date | null;
  length: number | null;
  periodLength: number;
  peakFlow: string;
}

function deriveCycles(
  flowLogs: { date: Date; flowIntensity: string }[],
  cycleLength: number,
): Cycle[] {
  if (!flowLogs.length) return [];

  // Sort ascending
  const sorted = [...flowLogs].sort((a, b) => a.date.getTime() - b.date.getTime());

  // Group into consecutive runs (period bleed sequences)
  const runs: { date: Date; flowIntensity: string }[][] = [];
  let current: { date: Date; flowIntensity: string }[] = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    const gap = differenceInDays(sorted[i].date, sorted[i - 1].date);
    if (gap <= 2) { // allow 1-day gap (spotting break)
      current.push(sorted[i]);
    } else {
      runs.push(current);
      current = [sorted[i]];
    }
  }
  runs.push(current);

  // Each run is one period → one cycle
  const cycles: Cycle[] = runs.map((run, i) => {
    const startDate = run[0].date;
    const endDate = runs[i + 1] ? runs[i + 1][0].date : null;
    const length = endDate ? differenceInDays(endDate, startDate) : null;
    const periodLength = differenceInDays(run[run.length - 1].date, run[0].date) + 1;
    const flows = ["HEAVY", "MEDIUM", "LIGHT", "SPOTTING"];
    const peakFlow = flows.find((f) => run.some((l) => l.flowIntensity === f)) ?? "LIGHT";
    return { startDate, endDate, length, periodLength, peakFlow };
  });

  return cycles.reverse(); // most recent first
}

const FLOW_LABEL: Record<string, string> = {
  HEAVY: "Heavy", MEDIUM: "Medium", LIGHT: "Light", SPOTTING: "Spotting",
};
const FLOW_COLOR: Record<string, string> = {
  HEAVY: "#8B2252", MEDIUM: "#C4506A", LIGHT: "#E8708A", SPOTTING: "#F4A0B8",
};

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cycleLength: true, periodLength: true },
  });

  const flowLogs = await prisma.dailyLog.findMany({
    where: { userId, flowIntensity: { not: "NONE" } },
    orderBy: { date: "asc" },
    select: { date: true, flowIntensity: true },
  });

  const cycles = deriveCycles(flowLogs, user?.cycleLength ?? 28);

  const avgCycleLength = cycles.filter((c) => c.length !== null).reduce(
    (sum, c, _, arr) => sum + (c.length! / arr.length), 0
  );
  const avgPeriodLength = cycles.reduce(
    (sum, c, _, arr) => sum + (c.periodLength / arr.length), 0
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
          Cycle history ✦
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Your cycle record over time
        </p>
      </div>

      {cycles.length === 0 ? (
        /* ── Empty state ── */
        <div
          className="rounded-3xl p-12 text-center"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="text-5xl mb-4 animate-float">📅</div>
          <h2 className="text-2xl mb-3" style={{ fontFamily: "var(--font-display)" }}>
            No cycle history yet
          </h2>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "var(--muted-foreground)" }}>
            Start logging your period flow to build your personal cycle record.
          </p>
          <Link
            href="/log"
            className="btn-pink-gradient inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
            style={{ boxShadow: "0 4px 20px rgba(196,96,122,0.30)" }}
          >
            Log your period 🩸
          </Link>
        </div>
      ) : (
        <>
          {/* ── Stats summary ── */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Cycles tracked", value: cycles.length, emoji: "🔄" },
              { label: "Avg cycle", value: avgCycleLength ? `${Math.round(avgCycleLength)}d` : "—", emoji: "📅" },
              { label: "Avg period", value: avgPeriodLength ? `${Math.round(avgPeriodLength)}d` : "—", emoji: "🩸" },
            ].map(({ label, value, emoji }) => (
              <div key={label}
                className="rounded-2xl p-4 text-center"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-xl font-bold mb-0.5" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
                  {value}
                </p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{label}</p>
              </div>
            ))}
          </div>

          {/* ── Cycle timeline visual ── */}
          <div className="mb-6 rounded-3xl p-5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "var(--muted-foreground)" }}>
              Cycle lengths
            </p>
            <div className="flex items-end gap-2 h-20">
              {cycles.filter(c => c.length).slice(0, 12).reverse().map((c, i) => {
                const pct = Math.min(100, ((c.length ?? 28) / 45) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-xl transition-all"
                      style={{ height: `${pct}%`, background: `var(--primary)`, opacity: 0.6 + (i / 12) * 0.4 }}
                    />
                    <span className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                      {c.length}d
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Cycle cards ── */}
          <div className="space-y-3">
            {cycles.map((cycle, i) => (
              <div
                key={i}
                className="rounded-3xl p-5 relative overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                {/* Cycle number badge */}
                <div className="absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                  Cycle {cycles.length - i}
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${FLOW_COLOR[cycle.peakFlow]}18`, border: `1px solid ${FLOW_COLOR[cycle.peakFlow]}30` }}
                  >
                    🩸
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
                      {format(cycle.startDate, "MMMM d, yyyy")}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 rounded-lg font-semibold"
                        style={{ background: "rgba(212,96,122,0.10)", color: "#D4607A" }}>
                        {cycle.periodLength}d period
                      </span>
                      {cycle.length !== null && (
                        <span className="px-2 py-1 rounded-lg font-semibold"
                          style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
                          {cycle.length}d cycle
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-lg font-semibold"
                        style={{ background: `${FLOW_COLOR[cycle.peakFlow]}15`, color: FLOW_COLOR[cycle.peakFlow] }}>
                        {FLOW_LABEL[cycle.peakFlow]} flow
                      </span>
                    </div>

                    {/* Cycle bar */}
                    {cycle.length !== null && (
                      <div className="mt-3">
                        <div className="flex rounded-xl overflow-hidden h-3 gap-px"
                          style={{ background: "var(--border)" }}>
                          {[
                            { phase: "menstrual",  pct: (cycle.periodLength / cycle.length) * 100 },
                            { phase: "follicular", pct: ((cycle.length - 14 - 2 - cycle.periodLength) / cycle.length) * 100 },
                            { phase: "ovulation",  pct: (3 / cycle.length) * 100 },
                            { phase: "luteal",     pct: (14 / cycle.length) * 100 },
                          ].map(({ phase, pct }) => (
                            <div key={phase}
                              style={{ width: `${Math.max(0, pct)}%`, background: PHASE_DISPLAY[phase as keyof typeof PHASE_DISPLAY].color, minWidth: pct > 0 ? "4%" : 0 }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
