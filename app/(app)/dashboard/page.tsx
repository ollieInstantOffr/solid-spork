import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePhase, PHASE_DISPLAY } from "@/lib/cycle/phases";
import { getRecommendations } from "@/lib/cycle/recommendations";
import { PhaseCard } from "@/components/dashboard/PhaseCard";
import { CycleCalendar } from "@/components/dashboard/CycleCalendar";
import { QuickLog } from "@/components/dashboard/QuickLog";
import { RecommendationsList } from "@/components/dashboard/RecommendationsList";
import { TimeGreeting } from "@/components/TimeGreeting";
import { FertilityNudge } from "@/components/dashboard/FertilityNudge";
import { PeriodStartButton } from "@/components/dashboard/PeriodStartButton";
import { OnboardingTutorial } from "@/components/dashboard/OnboardingTutorial";
import { startOfDay, addDays, differenceInDays, format } from "date-fns";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true, wantPregnant: true, cycleLength: true, periodLength: true,
      tutorialSeen: true, phaseOverride: true, phaseOverrideAt: true,
    },
  });

  const showTutorial = user && !user.tutorialSeen;

  // Fetch partner message if any accepted invite has one
  const partnerInvite = await prisma.partnerInvite.findFirst({
    where: { ownerId: userId, status: "ACCEPTED", partnerMessage: { not: null } },
    orderBy: { updatedAt: "desc" },
    select: { partnerMessage: true },
  });

  // Walk back through recent flow logs to find the *first* day of the last period.
  // We can't just take the most-recent flow log — it might be day 4 of a period,
  // which would throw off all phase calculations by several days.
  const recentFlowLogs = await prisma.dailyLog.findMany({
    where: { userId, flowIntensity: { not: "NONE" } },
    orderBy: { date: "desc" },
    take: 30,
    select: { date: true },
  });

  let lastPeriodStart: Date | null = null;
  if (recentFlowLogs.length > 0) {
    let periodStart = startOfDay(recentFlowLogs[0].date);
    for (let i = 1; i < recentFlowLogs.length; i++) {
      const thisDay = startOfDay(recentFlowLogs[i].date);
      const prevDay = startOfDay(recentFlowLogs[i - 1].date);
      // If the gap between consecutive flow logs is > 1 day, we've found the start
      if (differenceInDays(prevDay, thisDay) <= 1) {
        periodStart = thisDay;
      } else {
        break;
      }
    }
    lastPeriodStart = periodStart;
  }

  // Get logs for the last 6 months for calendar display
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const logs = await prisma.dailyLog.findMany({
    where: { userId, date: { gte: sixMonthsAgo } },
    orderBy: { date: "asc" },
  });

  // Check if today is logged
  const todayStart = startOfDay(new Date());
  const todayLog = await prisma.dailyLog.findUnique({
    where: { userId_date: { userId, date: todayStart } },
  });

  const phaseInfo = calculatePhase(
    lastPeriodStart,
    user?.cycleLength ?? 28,
    user?.periodLength ?? 5
  );

  // Check whether sex was logged during the current cycle's fertile window
  let hadSexInFertileWindow = false;
  if (phaseInfo) {
    const fertileStart = addDays(phaseInfo.cycleStartDate, phaseInfo.fertileWindow.start - 1);
    const fertileEnd = addDays(phaseInfo.cycleStartDate, phaseInfo.fertileWindow.end);
    const sexLog = await prisma.dailyLog.findFirst({
      where: {
        userId,
        hadSex: true,
        date: { gte: fertileStart, lte: fertileEnd },
      },
    });
    hadSexInFertileWindow = !!sexLog;
  }

  const recommendations = phaseInfo
    ? getRecommendations(phaseInfo.phase, user?.wantPregnant ?? false, hadSexInFertileWindow)
    : [];

  // Determine if period-start button should show:
  // Show when today has no flow logged AND we're in luteal (period approaching) or period is overdue
  const todayHasFlow = todayLog && todayLog.flowIntensity !== "NONE";
  const showPeriodButton = !todayHasFlow && phaseInfo && (
    phaseInfo.phase === "luteal" && phaseInfo.daysUntilNextPeriod <= 5
    || phaseInfo.daysUntilNextPeriod <= 0
  );

  // Apply phase override if set within last 3 days
  const effectivePhaseInfo = (() => {
    if (!phaseInfo || !user?.phaseOverride || !user?.phaseOverrideAt) return phaseInfo;
    const overrideAge = differenceInDays(new Date(), user.phaseOverrideAt);
    if (overrideAge > 3) return phaseInfo; // expired
    return { ...phaseInfo, phase: user.phaseOverride as typeof phaseInfo.phase };
  })();

  return (
    <div
      className="max-w-2xl mx-auto px-4"
      style={{ "--page-px": "1rem" } as React.CSSProperties}
    >
      {/* Onboarding tutorial overlay — only on first visit */}
      {showTutorial && <OnboardingTutorial userId={userId} />}

      {/* Sticky greeting header */}
      <TimeGreeting name={user?.name?.split(" ")[0]} />

      {/* Scrollable content */}
      <div className="space-y-6 py-6">

      {/* Partner message — love note from partner */}
      {partnerInvite?.partnerMessage && (
        <div
          className="rounded-2xl px-5 py-4 flex items-start gap-3 animate-fade-up"
          style={{
            background: "rgba(212,96,122,0.07)",
            border: "1px solid rgba(212,96,122,0.18)",
            animationDelay: "0.02s",
          }}
        >
          <span className="text-xl flex-shrink-0">💌</span>
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "var(--primary)" }}>From your partner</p>
            <p className="text-sm leading-relaxed italic" style={{ color: "var(--foreground)" }}>
              &ldquo;{partnerInvite.partnerMessage}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Period start shortcut — show when period is due/overdue */}
      {showPeriodButton && (
        <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <PeriodStartButton
            predictedDate={phaseInfo ? format(phaseInfo.nextPeriodDate, "MMMM d") : null}
          />
        </div>
      )}

      {/* Phase card */}
      <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <PhaseCard phaseInfo={effectivePhaseInfo} wantPregnant={user?.wantPregnant ?? false} />
      </div>

      {/* Fertility nudge — ovulation reminder or two-week-wait banner */}
      {phaseInfo && (
        <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <FertilityNudge
            phase={phaseInfo.phase}
            wantPregnant={user?.wantPregnant ?? false}
            hadSexInFertileWindow={hadSexInFertileWindow}
            daysUntilNextPeriod={phaseInfo.daysUntilNextPeriod}
          />
        </div>
      )}

      {/* Quick log strip */}
      {!todayLog && (
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <QuickLog />
        </div>
      )}

      {todayLog && (() => {
        const MOOD_EMOJI: Record<string, string> = {
          GREAT: "🌟", GOOD: "🌸", NEUTRAL: "🌤️", SWINGS: "🎢", LOW: "🫂", AWFUL: "🌧️",
        };
        const MOOD_LABEL: Record<string, string> = {
          GREAT: "Glowing", GOOD: "Balanced", NEUTRAL: "So-so", SWINGS: "Mood swings", LOW: "Tender", AWFUL: "Depleted",
        };
        const FLOW_LABEL: Record<string, string> = {
          NONE: "No flow", SPOTTING: "Spotting", LIGHT: "Light flow", MEDIUM: "Medium flow", HEAVY: "Heavy flow",
        };
        const ENERGY_EMOJI = ["", "🪫", "😴", "⚡", "✨", "🔋"];
        const ENERGY_LABEL = ["", "Exhausted", "Tired", "Okay", "Good", "Full of energy"];
        const symptoms: string[] = (() => { try { return JSON.parse(todayLog.symptoms ?? "[]"); } catch { return []; } })();

        return (
          <div
            className="rounded-2xl overflow-hidden animate-fade-up"
            style={{ border: "1px solid var(--border)", animationDelay: "0.2s" }}
          >
            {/* Header strip */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{
                background: "linear-gradient(135deg, var(--primary) 0%, #D470A0 100%)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <p className="text-sm font-semibold text-white">Today&apos;s check-in done!</p>
              </div>
              <a
                href="/log"
                className="text-[11px] font-bold px-3 py-1.5 rounded-full transition-all"
                style={{ background: "rgba(255,255,255,0.22)", color: "white" }}
              >
                Edit →
              </a>
            </div>

            {/* Summary chips */}
            <div className="px-5 py-4 flex flex-wrap gap-2" style={{ background: "var(--card)" }}>
              {/* Flow */}
              {todayLog.flowIntensity && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(212,96,122,0.10)", color: "#D4607A" }}
                >
                  🩸 {FLOW_LABEL[todayLog.flowIntensity] ?? todayLog.flowIntensity}
                </div>
              )}
              {/* Mood */}
              {todayLog.mood && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(176,144,200,0.12)", color: "#9060A8" }}
                >
                  {MOOD_EMOJI[todayLog.mood] ?? "💭"} {MOOD_LABEL[todayLog.mood] ?? todayLog.mood}
                </div>
              )}
              {/* Energy */}
              {todayLog.energyLevel && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(144,184,216,0.15)", color: "#4878A0" }}
                >
                  {ENERGY_EMOJI[todayLog.energyLevel]} {ENERGY_LABEL[todayLog.energyLevel]}
                </div>
              )}
              {/* Symptoms */}
              {symptoms.length > 0 && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(232,200,138,0.15)", color: "#A07828" }}
                >
                  🌀 {symptoms.length} symptom{symptoms.length !== 1 ? "s" : ""}
                </div>
              )}
              {/* Nothing logged but entry exists */}
              {!todayLog.mood && !todayLog.energyLevel && symptoms.length === 0 && todayLog.flowIntensity === "NONE" && (
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  Log saved — tap Edit to add more details
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* Cycle calendar */}
      <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <CycleCalendar
          logs={logs.map((l) => ({
            date: l.date.toISOString(),
            flowIntensity: l.flowIntensity,
          }))}
          lastPeriodStart={lastPeriodStart?.toISOString() ?? null}
          cycleLength={user?.cycleLength ?? 28}
          periodLength={user?.periodLength ?? 5}
        />
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <RecommendationsList recommendations={recommendations} />
        </div>
      )}

      {/* Empty state — no logs yet */}
      {!lastPeriodStart && logs.length === 0 && (
        <div
          className="rounded-3xl p-8 text-center animate-fade-up"
          style={{ background: "var(--card)", border: "1px solid var(--border)", animationDelay: "0.5s" }}
        >
          <div className="text-5xl mb-4 animate-float">🌸</div>
          <h3 className="text-xl mb-2" style={{ fontFamily: "var(--font-display)" }}>
            Start your cycle journey
          </h3>
          <p className="text-sm mb-5 max-w-xs mx-auto" style={{ color: "var(--muted-foreground)" }}>
            Log your first period to unlock phase tracking, forecasts, and personalised tips.
          </p>
          <a
            href="/log"
            className="btn-pink-gradient inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white"
            style={{ boxShadow: "0 4px 20px rgba(196,96,122,0.30)" }}
          >
            Log today 🩸
          </a>
        </div>
      )}
      </div>{/* end scrollable content */}
    </div>
  );
}

