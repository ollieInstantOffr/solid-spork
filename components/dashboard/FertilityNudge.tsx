import type { Phase } from "@/lib/cycle/phases";

interface Props {
  phase: Phase;
  wantPregnant: boolean;
  hadSexInFertileWindow: boolean;
  daysUntilNextPeriod: number;
}

export function FertilityNudge({ phase, wantPregnant, hadSexInFertileWindow, daysUntilNextPeriod }: Props) {
  // ── Two-week wait banner (luteal + trying to conceive + sex was logged) ──
  if (phase === "luteal" && wantPregnant && hadSexInFertileWindow) {
    const testDayApproaching = daysUntilNextPeriod <= 3;
    return (
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFF8E7 0%, #FFF0F5 100%)",
          border: "1px solid #E8C88055",
        }}
      >
        {/* Sparkles */}
        <span className="absolute top-3 right-5 text-sm animate-twinkle" style={{ color: "#E8C840" }}>✦</span>
        <span className="absolute bottom-3 right-12 text-xs animate-twinkle" style={{ color: "#D4607A", animationDelay: "1.1s" }}>✧</span>

        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">{testDayApproaching ? "🧪" : "🤞"}</span>
          <div>
            <p className="font-bold text-sm mb-0.5" style={{ color: "#C8A040" }}>
              {testDayApproaching ? "Test day is almost here" : "You're in the two-week wait"}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#6B4A30" }}>
              {testDayApproaching
                ? `Your period is due in ${daysUntilNextPeriod} day${daysUntilNextPeriod !== 1 ? "s" : ""}. A pregnancy test will be most accurate from the first day of a missed period.`
                : `You logged sex during your fertile window — a possible conception window has passed. Keep logging your symptoms and try not to test too early.`}
            </p>
            {!testDayApproaching && (
              <div className="flex gap-3 mt-3">
                {["Rest well", "Stay hydrated", "Log symptoms"].map((tip) => (
                  <span
                    key={tip}
                    className="text-[10px] font-semibold px-2 py-1 rounded-full"
                    style={{ background: "#E8C84022", color: "#C8A040" }}
                  >
                    {tip}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Contraception check nudge (luteal + not trying + sex was logged) ──
  if (phase === "luteal" && !wantPregnant && hadSexInFertileWindow) {
    return (
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{
          background: "#F5F0FF",
          border: "1px solid #C090CC44",
        }}
      >
        <span className="text-2xl mt-0.5">🔒</span>
        <div>
          <p className="font-bold text-sm mb-0.5" style={{ color: "#9060AA" }}>
            Fertile window has passed
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#5A4070" }}>
            You logged sex during your fertile window. If you&apos;re not trying to conceive, it&apos;s worth confirming your contraception method worked as expected.
          </p>
        </div>
      </div>
    );
  }

  // ── Ovulation nudge (trying to conceive + currently in ovulation) ──
  if (phase === "ovulation" && wantPregnant) {
    return (
      <div
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FFF9E0 100%)",
          border: "1px solid #E8C04055",
        }}
      >
        <span className="absolute top-3 right-5 text-base animate-twinkle" style={{ color: "#D4A840" }}>✦</span>
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">🌟</span>
          <div>
            <p className="font-bold text-sm mb-0.5" style={{ color: "#B88820" }}>
              Peak fertile window — right now
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#6B5020" }}>
              This is your most fertile time. Log intimacy in today&apos;s log to track your conception window accurately.
            </p>
            <a
              href="/log"
              className="inline-block mt-2.5 text-[11px] font-bold px-3 py-1.5 rounded-full"
              style={{ background: "#E8C84022", color: "#B88820" }}
            >
              Open today&apos;s log →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Fertile window approaching (follicular + trying to conceive) ──
  if (phase === "follicular" && wantPregnant) {
    return (
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: "#F0FFF4", border: "1px solid #90C88A44" }}
      >
        <span className="text-2xl mt-0.5">🌱</span>
        <div>
          <p className="font-bold text-sm mb-0.5" style={{ color: "#3A8A50" }}>
            Fertile window approaching
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#2A5A38" }}>
            Your fertile window is coming up soon. Sperm can survive up to 5 days — starting intimacy a few days before ovulation improves your chances.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
