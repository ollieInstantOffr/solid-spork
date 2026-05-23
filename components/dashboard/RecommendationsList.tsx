import { Recommendation } from "@/lib/cycle/recommendations";

interface Props {
  recommendations: Recommendation[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  nutrition: { bg: "#FEF9C3", text: "#A16207" },
  movement: { bg: "#DCFCE7", text: "#15803D" },
  mindset: { bg: "#EDE9FE", text: "#7C3AED" },
  intimacy: { bg: "#FCE7F3", text: "#BE185D" },
  fertility: { bg: "#FEF3C7", text: "#B45309" },
};

export function RecommendationsList({ recommendations }: Props) {
  return (
    <div>
      <h2 className="text-xl mb-3 flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
        For you today <span className="text-base animate-twinkle" style={{ color: "var(--gold)" }}>✦</span>
      </h2>
      <div className="grid gap-3">
        {recommendations.map((rec, i) => {
          const colors = CATEGORY_COLORS[rec.category] ?? { bg: "var(--secondary)", text: "var(--secondary-foreground)" };
          return (
            <div
              key={i}
              className="rounded-2xl p-4 flex gap-4"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: colors.bg }}
              >
                {rec.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-0.5">{rec.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {rec.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
