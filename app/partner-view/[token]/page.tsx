import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calculatePhase, PHASE_DISPLAY, isFertile, type Phase } from "@/lib/cycle/phases";
import { parsePreferences, PHASE_SUGGESTIONS } from "@/lib/phasePreferences";
import { CodeEntry } from "@/components/partner/CodeEntry";
import { PartnerMessageBox } from "@/components/partner/PartnerMessageBox";
import { format, addDays, startOfDay, differenceInDays } from "date-fns";

interface Props {
  params: Promise<{ token: string }>;
}

function getPartnerTips(phase: string, name: string, pronoun: string): { icon: string; text: string }[] {
  const they = pronoun === "they/them" ? "they" : pronoun.split("/")[0];
  const their = pronoun === "they/them" ? "their" : pronoun === "he/him" ? "his" : "her";
  const theyre = pronoun === "they/them" ? "they're" : pronoun === "he/him" ? "he's" : "she's";
  const tips: Record<string, { icon: string; text: string }[]> = {
    menstrual: [
      { icon: "🌡️", text: `Offer warmth — a hot water bottle or heating pad goes a long way for ${name}` },
      { icon: "💬", text: `Don't take mood shifts personally; ${their} body is working hard right now` },
      { icon: "🎬", text: `Suggest a cosy movie night in rather than going out` },
    ],
    follicular: [
      { icon: "🌿", text: `${name} is likely feeling more energetic and up for adventures` },
      { icon: "🗓️", text: `Great time to plan a date, a hike, or try something new together` },
      { icon: "💬", text: `${theyre.charAt(0).toUpperCase() + theyre.slice(1)} probably more talkative and social — lean into good conversation` },
    ],
    ovulation: [
      { icon: "✨", text: `${name} is at ${their} most confident and communicative this week` },
      { icon: "💬", text: `This is a great time for deeper conversations and real connection` },
      { icon: "⚡", text: `${they.charAt(0).toUpperCase() + they.slice(1)} ${they === "they" ? "have" : "has"} the most energy right now — suggest activities you both enjoy` },
    ],
    luteal: [
      { icon: "🤍", text: `${name} may need more quiet time and emotional support` },
      { icon: "☕", text: `Small gestures matter a lot this week — a coffee, a hug, a kind word` },
      { icon: "🏡", text: `Try not to plan too many social commitments right now` },
    ],
  };
  return tips[phase] ?? [];
}

const PHASE_ORDER: Phase[] = ["menstrual", "follicular", "ovulation", "luteal"];

function getPhaseBoundaries(cycleLength: number, periodLength: number) {
  const ovDay = cycleLength - 14;
  return {
    menstrual:  { start: 1,               end: periodLength },
    follicular: { start: periodLength + 1, end: Math.max(periodLength + 1, ovDay - 2) },
    ovulation:  { start: Math.max(periodLength + 2, ovDay - 1), end: ovDay + 1 },
    luteal:     { start: ovDay + 2,        end: cycleLength },
  };
}

// Find the actual first day of the last period (same logic as dashboard)
function findLastPeriodStart(
  flowLogs: { date: Date }[]
): Date | null {
  if (!flowLogs.length) return null;
  const sorted = [...flowLogs].sort((a, b) => b.date.getTime() - a.date.getTime());
  let periodStart = startOfDay(sorted[0].date);
  for (let i = 1; i < sorted.length; i++) {
    const thisDay = startOfDay(sorted[i].date);
    const prevDay = startOfDay(sorted[i - 1].date);
    if (differenceInDays(prevDay, thisDay) <= 1) {
      periodStart = thisDay;
    } else {
      break;
    }
  }
  return periodStart;
}

const NEXT_PHASE_BLURB: Record<Phase, string> = {
  menstrual:  "Her period will start. Plan for cosy time, warmth, and patience.",
  follicular: "Energy will return — she'll feel lighter and more social again.",
  ovulation:  "She'll be at her most confident and radiant. A great week to connect.",
  luteal:     "She'll start winding down. Small acts of care will mean the world.",
};

export default async function PartnerViewPage({ params }: Props) {
  const { token } = await params;

  const invite = await prisma.partnerInvite.findUnique({
    where: { token },
    include: {
      owner: {
        select: {
          name: true,
          wantPregnant: true,
          cycleLength: true,
          periodLength: true,
          phasePreferences: true,
          pronouns: true,
          dailyLogs: {
            where: { flowIntensity: { not: "NONE" } },
            orderBy: { date: "desc" },
            take: 30,
            select: { date: true },
          },
        },
      },
    },
  });

  if (!invite || invite.status === "REVOKED") notFound();

  if (invite.status === "PENDING") {
    const ownerName = invite.owner.name?.split(" ")[0] ?? "your partner";
    return <CodeEntry token={token} ownerName={ownerName} />;
  }

  const owner = invite.owner;
  const lastPeriodStart = findLastPeriodStart(owner.dailyLogs);

  const phaseInfo = calculatePhase(
    lastPeriodStart,
    owner.cycleLength,
    owner.periodLength
  );

  const displayName = owner.name?.split(" ")[0] ?? "your partner";
  const pronouns    = owner.pronouns ?? "she/her";
  const display     = phaseInfo ? PHASE_DISPLAY[phaseInfo.phase] : null;
  const fertile     = phaseInfo ? isFertile(phaseInfo) : false;
  const tips        = phaseInfo ? getPartnerTips(phaseInfo.phase, displayName, pronouns) : [];

  const allPrefs  = parsePreferences(owner.phasePreferences ?? "{}");
  const phasePrefs = phaseInfo ? allPrefs[phaseInfo.phase] : [];

  const boundaries = phaseInfo
    ? getPhaseBoundaries(owner.cycleLength, owner.periodLength)
    : null;

  const currentPhaseEnd  = boundaries && phaseInfo ? boundaries[phaseInfo.phase].end : null;
  const daysLeftInPhase  = currentPhaseEnd && phaseInfo
    ? Math.max(0, currentPhaseEnd - phaseInfo.dayOfCycle + 1)
    : null;

  const currentPhaseIdx  = phaseInfo ? PHASE_ORDER.indexOf(phaseInfo.phase) : -1;
  const nextPhase: Phase | null = phaseInfo ? PHASE_ORDER[(currentPhaseIdx + 1) % 4] : null;
  const nextDisplay      = nextPhase ? PHASE_DISPLAY[nextPhase] : null;
  const nextPhaseStartDate = phaseInfo && daysLeftInPhase !== null
    ? addDays(new Date(), daysLeftInPhase)
    : null;

  // Progress within current phase (0–1)
  const phaseProgress = boundaries && phaseInfo
    ? Math.min(1, (phaseInfo.dayOfCycle - boundaries[phaseInfo.phase].start) /
        Math.max(1, boundaries[phaseInfo.phase].end - boundaries[phaseInfo.phase].start))
    : 0;

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--background)", position: "relative", overflowX: "hidden" }}
    >
      {/* ── Mesh background blobs ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: display ? `${display.color}18` : "rgba(196,96,122,0.12)" }} />
        <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full blur-3xl"
          style={{ background: display ? `${display.color}10` : "rgba(196,96,122,0.08)" }} />
        {/* Sparkles */}
        <span className="absolute top-24 left-8 text-base animate-twinkle"
          style={{ color: "var(--gold)", animationDelay: "0.3s", opacity: 0.6 }}>✦</span>
        <span className="absolute top-40 right-10 text-xs animate-twinkle"
          style={{ color: "var(--primary)", animationDelay: "1.1s", opacity: 0.5 }}>✧</span>
        <span className="absolute top-[60%] left-6 text-sm animate-twinkle"
          style={{ color: "var(--gold)", animationDelay: "0.8s", opacity: 0.4 }}>✦</span>
        <span className="absolute top-[75%] right-8 text-xs animate-twinkle"
          style={{ color: "var(--primary)", animationDelay: "1.6s", opacity: 0.35 }}>✧</span>
      </div>

      {/* ── Nav bar ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5"
        style={{
          background: "rgba(255,240,245,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl animate-float" style={{ animationDuration: "4s" }}>🌸</span>
          <span className="text-xl font-semibold shimmer-text" style={{ fontFamily: "var(--font-display)" }}>
            Luna
          </span>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{ background: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
          {displayName}&apos;s view 💕
        </div>
      </header>

      <div className="relative max-w-lg mx-auto px-4 py-8 space-y-5">

        {!phaseInfo ? (
          /* ── No cycle data ─────────────────────────────────── */
          <div
            className="rounded-3xl p-12 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 8px 32px rgba(196,96,122,0.08)" }}
          >
            <div className="text-6xl mb-4 animate-float">🌸</div>
            <h2 className="text-2xl mb-3" style={{ fontFamily: "var(--font-display)" }}>
              No cycle data yet
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {displayName} hasn&apos;t logged their cycle yet. Check back soon — it&apos;s worth the wait 💕
            </p>
          </div>
        ) : (
          <>
            {/* ── Phase hero card ─────────────────────────────── */}
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(140deg, ${display!.color}22 0%, ${display!.color}08 100%)`,
                border: `1px solid ${display!.color}35`,
                boxShadow: `0 12px 48px ${display!.color}18, 0 2px 8px ${display!.color}10`,
              }}
            >
              {/* Sparkle decorations */}
              <span className="absolute top-4 right-5 text-sm animate-twinkle"
                style={{ color: display!.color, animationDelay: "0s" }}>✦</span>
              <span className="absolute bottom-5 right-14 text-xs animate-twinkle"
                style={{ color: display!.color, animationDelay: "1.2s" }}>✧</span>
              <span className="absolute top-12 left-4 text-[10px] animate-twinkle"
                style={{ color: display!.color, animationDelay: "0.7s", opacity: 0.5 }}>✦</span>

              <div className="flex items-start gap-5">
                {/* Phase emoji */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 animate-float"
                  style={{
                    background: `${display!.color}18`,
                    border: `1.5px solid ${display!.color}30`,
                    animationDuration: "5s",
                  }}
                >
                  {display!.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5"
                    style={{ color: display!.color }}>
                    {displayName}&apos;s cycle · Day {phaseInfo.dayOfCycle} of {owner.cycleLength}
                  </p>
                  <h2
                    className="mb-2 leading-tight"
                    style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 400 }}
                  >
                    {display!.partnerTitle}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                    {display!.partnerDescription}
                  </p>

                  {/* Phase progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] mb-1.5"
                      style={{ color: "var(--muted-foreground)" }}>
                      <span>Phase progress</span>
                      <span style={{ color: display!.color, fontWeight: 600 }}>
                        {daysLeftInPhase === 1 ? "Last day" : `${daysLeftInPhase} days left`}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: `${display!.color}20` }}>
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.round(phaseProgress * 100)}%`,
                          background: `linear-gradient(90deg, ${display!.color}80, ${display!.color})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Cycle timeline ──────────────────────────────── */}
            <div
              className="rounded-3xl p-5"
              style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 2px 16px rgba(196,96,122,0.05)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
                Cycle timeline
              </p>

              {/* Segmented bar */}
              <div className="relative mb-3">
                <div className="flex rounded-2xl overflow-hidden h-9 gap-px"
                  style={{ background: "var(--border)" }}>
                  {PHASE_ORDER.map((phase) => {
                    const b  = boundaries![phase];
                    const pd = PHASE_DISPLAY[phase];
                    const isCurrent = phase === phaseInfo.phase;
                    const pct = ((b.end - b.start + 1) / owner.cycleLength) * 100;
                    return (
                      <div
                        key={phase}
                        className="relative flex items-center justify-center transition-all"
                        title={pd.name}
                        style={{
                          width: `${pct}%`,
                          background: isCurrent
                            ? `linear-gradient(135deg, ${pd.color} 0%, ${pd.color}CC 100%)`
                            : `${pd.color}35`,
                          minWidth: "5%",
                        }}
                      >
                        <span className="text-xs select-none"
                          style={{ filter: isCurrent ? "none" : "grayscale(0.2)", opacity: isCurrent ? 1 : 0.7 }}>
                          {pd.icon}
                        </span>
                        {/* Current day needle */}
                        {isCurrent && (() => {
                          const withinPhase = phaseInfo.dayOfCycle - b.start;
                          const phaseSpan   = b.end - b.start + 1;
                          const needlePct   = (withinPhase / phaseSpan) * 100;
                          return (
                            <div className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
                              style={{
                                left: `${needlePct}%`,
                                background: "rgba(255,255,255,0.9)",
                                boxShadow: "0 0 6px rgba(255,255,255,0.6)",
                              }} />
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phase labels */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {PHASE_ORDER.map((phase) => {
                  const b   = boundaries![phase];
                  const pd  = PHASE_DISPLAY[phase];
                  const isCurrent = phase === phaseInfo.phase;
                  return (
                    <div key={phase} className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-[11px] flex-shrink-0"
                        style={{
                          background: `${pd.color}${isCurrent ? "25" : "12"}`,
                          border: `1px solid ${pd.color}${isCurrent ? "50" : "25"}`,
                        }}
                      >
                        {pd.icon}
                      </div>
                      <span className="text-xs truncate"
                        style={{
                          color: isCurrent ? "var(--foreground)" : "var(--muted-foreground)",
                          fontWeight: isCurrent ? 700 : 400,
                        }}>
                        {pd.name.replace(" Phase", "")}
                        <span className="ml-1 text-[10px]" style={{ opacity: 0.55 }}>d{b.start}–{b.end}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── What she needs (preferences) ────────────────── */}
            {phasePrefs.length > 0 && (
              <div
                className="rounded-3xl p-5 relative overflow-hidden"
                style={{
                  background: "var(--card)",
                  border: `1.5px solid ${display!.color}35`,
                  boxShadow: `0 4px 24px ${display!.color}10`,
                }}
              >
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top right, ${display!.color}12, transparent 70%)` }} />

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${display!.color}15`, border: `1px solid ${display!.color}25` }}>
                    💌
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">What {displayName} needs right now</h3>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      She set these herself — take notes 💕
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {phasePrefs.map((pref) => {
                    const suggestion = PHASE_SUGGESTIONS[phaseInfo.phase]?.find((s) => s.label === pref);
                    return (
                      <div
                        key={pref}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-sm font-semibold"
                        style={{
                          background: `${display!.color}14`,
                          border: `1px solid ${display!.color}28`,
                          color: display!.color,
                        }}
                      >
                        {suggestion?.emoji && <span>{suggestion.emoji}</span>}
                        <span>{pref}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Coming up next ──────────────────────────────── */}
            {nextPhase && nextDisplay && (
              <div
                className="rounded-3xl p-5 flex gap-4 relative overflow-hidden"
                style={{
                  background: `${nextDisplay.color}0C`,
                  border: `1px solid ${nextDisplay.color}28`,
                }}
              >
                <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none"
                  style={{ background: `radial-gradient(circle at bottom right, ${nextDisplay.color}15, transparent 70%)` }} />

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${nextDisplay.color}18`, border: `1px solid ${nextDisplay.color}30` }}
                >
                  {nextDisplay.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: nextDisplay.color }}>
                    Coming up next
                  </p>
                  <p className="font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-display)" }}>
                    {nextDisplay.name}
                  </p>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--muted-foreground)" }}>
                    {NEXT_PHASE_BLURB[nextPhase]}
                  </p>
                  {nextPhaseStartDate && daysLeftInPhase !== null && (
                    <p className="text-xs font-bold" style={{ color: nextDisplay.color }}>
                      {daysLeftInPhase <= 1
                        ? "✦ Starts tomorrow"
                        : `✦ In ${daysLeftInPhase} days · ${format(nextPhaseStartDate, "EEEE, MMMM d")}`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Fertile window ──────────────────────────────── */}
            {owner.wantPregnant && (
              <div
                className="rounded-3xl p-5 flex items-center gap-4"
                style={{
                  background: fertile
                    ? "linear-gradient(135deg, rgba(232,200,138,0.18) 0%, rgba(232,200,138,0.08) 100%)"
                    : "var(--card)",
                  border: `1px solid ${fertile ? "rgba(232,200,138,0.5)" : "var(--border)"}`,
                  boxShadow: fertile ? "0 4px 20px rgba(232,200,138,0.15)" : "none",
                }}
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: fertile ? "rgba(232,200,138,0.25)" : "var(--secondary)",
                    border: `1px solid ${fertile ? "rgba(232,200,138,0.4)" : "var(--border)"}`,
                  }}
                >
                  {fertile ? "🌟" : "📅"}
                </div>
                <div>
                  <p className="font-semibold text-sm mb-0.5">
                    {fertile ? "Fertile window — right now ✨" : "Next fertile window"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {fertile
                      ? "She is in her fertile window this week"
                      : `Around day ${phaseInfo.fertileWindow.start}–${phaseInfo.fertileWindow.end} of her cycle`}
                  </p>
                </div>
              </div>
            )}

            {/* ── How to support her ──────────────────────────── */}
            <div>
              <h3 className="text-lg mb-3 flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>
                How to support her ✦
              </h3>
              <div className="space-y-2.5">
                {tips.map(({ icon, text }, i) => (
                  <div
                    key={i}
                    className="flex gap-3.5 p-4 rounded-2xl text-sm transition-all duration-200"
                    style={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      boxShadow: "0 1px 4px rgba(196,96,122,0.04)",
                    }}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                    <span style={{ color: "var(--foreground)", lineHeight: 1.5 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Period countdown ────────────────────────────── */}
            <div
              className="rounded-3xl p-5 flex items-center gap-4"
              style={{
                background: "var(--secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 2px 8px rgba(196,96,122,0.08)" }}
              >
                🩸
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5"
                  style={{ color: "var(--muted-foreground)", letterSpacing: "0.1em" }}>
                  Next period
                </p>
                <p className="font-semibold text-base" style={{ fontFamily: "var(--font-display)" }}>
                  In {phaseInfo.daysUntilNextPeriod} day{phaseInfo.daysUntilNextPeriod !== 1 ? "s" : ""}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                  Expected around {format(phaseInfo.nextPeriodDate, "EEEE, MMMM d")}
                </p>
              </div>
            </div>
          </>
        )}

        {/* ── Partner message ─────────────────────────────────── */}
        <PartnerMessageBox token={token} existing={invite.partnerMessage} />

        {/* ── Footer ──────────────────────────────────────────── */}
        <div className="text-center pt-4 pb-8">
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <span className="text-base animate-twinkle" style={{ color: "var(--gold)" }}>✦</span>
            <span className="font-semibold shimmer-text text-base" style={{ fontFamily: "var(--font-display)" }}>Luna</span>
            <span className="text-base animate-twinkle" style={{ color: "var(--gold)", animationDelay: "0.8s" }}>✦</span>
          </div>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Shared privately via Luna · Her detailed health data is always her own.
          </p>
        </div>
      </div>
    </main>
  );
}
