import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfDay, differenceInDays } from "date-fns";
import { calculatePhase, PHASE_DISPLAY, type Phase } from "@/lib/cycle/phases";

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: "Cramps", headache: "Headache", bloating: "Bloating",
  tender_breasts: "Tender breasts", acne: "Acne", fatigue: "Fatigue",
  backache: "Backache", nausea: "Nausea", mood_swings: "Mood swings",
  insomnia: "Insomnia", food_cravings: "Food cravings",
};
const SYMPTOM_EMOJI: Record<string, string> = {
  cramps: "😣", headache: "🤕", bloating: "🫃", tender_breasts: "💜",
  acne: "😮", fatigue: "🥱", backache: "🔙", nausea: "🤢",
  mood_swings: "🎢", insomnia: "😴", food_cravings: "🍫",
};
const MOOD_LABELS: Record<string, string> = {
  GREAT: "Glowing", GOOD: "Balanced", NEUTRAL: "So-so",
  SWINGS: "Mood swings", LOW: "Tender", AWFUL: "Depleted",
};
const MOOD_EMOJI: Record<string, string> = {
  GREAT: "🌟", GOOD: "🌸", NEUTRAL: "🌤️", SWINGS: "🎢", LOW: "🫂", AWFUL: "🌧️",
};

export default async function InsightsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cycleLength: true, periodLength: true },
  });

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const logs = await prisma.dailyLog.findMany({
    where: { userId, date: { gte: sixMonthsAgo } },
    orderBy: { date: "asc" },
    select: { date: true, flowIntensity: true, symptoms: true, mood: true, energyLevel: true },
  });

  if (logs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
            Insights ✦
          </h1>
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Patterns and trends from your logs
          </p>
        </div>
        <div className="rounded-3xl p-12 text-center"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="text-5xl mb-4 animate-float">🔮</div>
          <h2 className="text-2xl mb-3" style={{ fontFamily: "var(--font-display)" }}>No insights yet</h2>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "var(--muted-foreground)" }}>
            Log a few weeks of data and Luna will surface patterns in your mood, energy, and symptoms.
          </p>
          <a href="/log"
            className="btn-pink-gradient inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
            style={{ boxShadow: "0 4px 20px rgba(196,96,122,0.30)" }}>
            Start logging 📓
          </a>
        </div>
      </div>
    );
  }

  // Find last period start
  const flowLogs = logs.filter((l) => l.flowIntensity !== "NONE").sort((a, b) => b.date.getTime() - a.date.getTime());
  let lastPeriodStart: Date | null = null;
  if (flowLogs.length > 0) {
    let ps = startOfDay(flowLogs[0].date);
    for (let i = 1; i < flowLogs.length; i++) {
      const diff = differenceInDays(startOfDay(flowLogs[i - 1].date), startOfDay(flowLogs[i].date));
      if (diff <= 1) ps = startOfDay(flowLogs[i].date);
      else break;
    }
    lastPeriodStart = ps;
  }

  // Build phase → log buckets
  type Bucket = { symptoms: string[]; moods: string[]; energies: number[] };
  const buckets: Record<Phase, Bucket> = {
    menstrual:  { symptoms: [], moods: [], energies: [] },
    follicular: { symptoms: [], moods: [], energies: [] },
    ovulation:  { symptoms: [], moods: [], energies: [] },
    luteal:     { symptoms: [], moods: [], energies: [] },
  };

  for (const log of logs) {
    const info = lastPeriodStart
      ? calculatePhase(lastPeriodStart, user?.cycleLength ?? 28, user?.periodLength ?? 5, log.date)
      : null;
    if (!info) continue;
    const b = buckets[info.phase];
    const syms: string[] = (() => { try { return JSON.parse(log.symptoms ?? "[]"); } catch { return []; } })();
    b.symptoms.push(...syms);
    if (log.mood) b.moods.push(log.mood);
    if (log.energyLevel) b.energies.push(log.energyLevel);
  }

  // Compute top symptom per phase
  function topSymptoms(syms: string[], n = 3) {
    const counts: Record<string, number> = {};
    for (const s of syms) counts[s] = (counts[s] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
  }
  function topMood(moods: string[]) {
    const counts: Record<string, number> = {};
    for (const m of moods) counts[m] = (counts[m] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  }
  function avgEnergy(energies: number[]) {
    if (!energies.length) return null;
    return (energies.reduce((s, e) => s + e, 0) / energies.length).toFixed(1);
  }

  const totalLogs = logs.length;
  const loggedDays = new Set(logs.map((l) => l.date.toISOString().split("T")[0])).size;
  const streak = (() => {
    const days = [...new Set(logs.map((l) => l.date.toISOString().split("T")[0]))].sort().reverse();
    let s = 0;
    let d = startOfDay(new Date());
    for (const day of days) {
      if (day === d.toISOString().split("T")[0]) { s++; d = new Date(d.getTime() - 86400000); }
      else break;
    }
    return s;
  })();

  const PHASES: Phase[] = ["menstrual", "follicular", "ovulation", "luteal"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
          Insights ✦
        </h1>
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Patterns from your last 6 months
        </p>
      </div>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { emoji: "📓", value: totalLogs, label: "Days logged" },
          { emoji: "🔥", value: streak || "—", label: "Day streak" },
          { emoji: "📊", value: `${Math.round((loggedDays / 180) * 100)}%`, label: "Consistency" },
        ].map(({ emoji, value, label }) => (
          <div key={label} className="rounded-2xl p-4 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="text-2xl mb-1">{emoji}</div>
            <p className="text-xl font-bold mb-0.5" style={{ fontFamily: "var(--font-display)", color: "var(--primary)" }}>
              {value}
            </p>
            <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* ── Per-phase breakdown ── */}
      <div className="space-y-4">
        {PHASES.map((phase) => {
          const pd   = PHASE_DISPLAY[phase];
          const b    = buckets[phase];
          const top  = topSymptoms(b.symptoms);
          const mood = topMood(b.moods);
          const eng  = avgEnergy(b.energies);

          if (!b.symptoms.length && !b.moods.length) return null;

          return (
            <div key={phase}
              className="rounded-3xl p-5 relative overflow-hidden"
              style={{ background: "var(--card)", border: `1px solid ${pd.color}25` }}>
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                style={{ background: `radial-gradient(circle at top right, ${pd.color}12, transparent 70%)` }} />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${pd.color}18`, border: `1px solid ${pd.color}30` }}>
                  {pd.icon}
                </div>
                <div>
                  <p className="font-semibold text-sm">{pd.name.replace(" Phase", "")} phase</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {b.moods.length} logs analysed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Top mood */}
                {mood && (
                  <div className="rounded-2xl p-3"
                    style={{ background: `${pd.color}08`, border: `1px solid ${pd.color}18` }}>
                    <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5"
                      style={{ color: "var(--muted-foreground)" }}>
                      Typical mood
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{MOOD_EMOJI[mood[0]]}</span>
                      <span className="text-sm font-semibold" style={{ color: pd.color }}>
                        {MOOD_LABELS[mood[0]]}
                      </span>
                    </div>
                  </div>
                )}

                {/* Average energy */}
                {eng && (
                  <div className="rounded-2xl p-3"
                    style={{ background: `${pd.color}08`, border: `1px solid ${pd.color}18` }}>
                    <p className="text-[11px] font-bold uppercase tracking-wide mb-1.5"
                      style={{ color: "var(--muted-foreground)" }}>
                      Avg energy
                    </p>
                    <div className="flex items-end gap-1">
                      <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: pd.color }}>
                        {eng}
                      </span>
                      <span className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)" }}>/5</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Top symptoms */}
              {top.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wide mb-2"
                    style={{ color: "var(--muted-foreground)" }}>
                    Common symptoms
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {top.map(([sym, count]) => (
                      <div key={sym}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold"
                        style={{ background: `${pd.color}12`, border: `1px solid ${pd.color}22`, color: pd.color }}>
                        {SYMPTOM_EMOJI[sym] ?? "•"} {SYMPTOM_LABELS[sym] ?? sym}
                        <span className="ml-0.5 opacity-60">×{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
