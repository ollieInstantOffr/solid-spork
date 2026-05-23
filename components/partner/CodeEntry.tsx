"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  token: string;
  ownerName: string;
}

export function CodeEntry({ token, ownerName }: Props) {
  const router    = useRouter();
  const [digits, setDigits]   = useState<string[]>(Array(6).fill(""));
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake]     = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function handleChange(index: number, value: string) {
    if (value.length > 1) {
      const cleaned   = value.replace(/\D/g, "").slice(0, 6);
      const newDigits = Array(6).fill("");
      cleaned.split("").forEach((c, i) => { newDigits[i] = c; });
      setDigits(newDigits);
      setError("");
      inputRefs.current[Math.min(cleaned.length, 5)]?.focus();
      if (cleaned.length === 6) submit(newDigits);
      return;
    }
    const digit     = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError("");
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
    if (newDigits.every((d) => d !== "")) submit(newDigits);
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        const nd = [...digits]; nd[index - 1] = ""; setDigits(nd);
        inputRefs.current[index - 1]?.focus();
      } else {
        const nd = [...digits]; nd[index] = ""; setDigits(nd);
      }
    }
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  async function submit(d: string[] = digits) {
    const code = d.join("");
    if (code.length < 6) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/partner/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, code }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      const { error: msg } = await res.json();
      setError(msg === "Incorrect code"
        ? "That code doesn't match — try again 💕"
        : "Something went wrong");
      setDigits(Array(6).fill(""));
      setShake(true);
      setTimeout(() => { setShake(false); inputRefs.current[0]?.focus(); }, 600);
    }
    setLoading(false);
  }

  const filled = digits.filter(Boolean).length;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "var(--background)", position: "relative", overflow: "hidden" }}
    >
      {/* ── Background blobs ──────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-18"
          style={{ background: "radial-gradient(circle, #D470A0, transparent 70%)" }} />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full blur-3xl opacity-12"
          style={{ background: "radial-gradient(circle, var(--gold), transparent 70%)" }} />

        {/* Sparkles */}
        <span className="absolute top-16 left-10 text-lg animate-twinkle"
          style={{ color: "var(--gold)", animationDelay: "0s" }}>✦</span>
        <span className="absolute top-24 right-16 text-base animate-twinkle"
          style={{ color: "var(--primary)", animationDelay: "0.7s" }}>✧</span>
        <span className="absolute bottom-32 left-16 text-sm animate-twinkle"
          style={{ color: "var(--gold)", animationDelay: "1.3s" }}>✦</span>
        <span className="absolute bottom-20 right-12 text-xs animate-twinkle"
          style={{ color: "var(--primary)", animationDelay: "1.8s" }}>✧</span>
        <span className="absolute top-[45%] left-8 text-xs animate-twinkle"
          style={{ color: "var(--gold)", animationDelay: "0.5s", opacity: 0.6 }}>✦</span>
      </div>

      <div className="relative w-full max-w-sm animate-fade-up">
        {/* ── Header ────────────────────────────────────────── */}
        <div className="text-center mb-8">
          {/* Animated emoji */}
          <div className="relative inline-block mb-5">
            <div className="text-6xl animate-float" style={{ animationDuration: "4s" }}>🌸</div>
            <span className="absolute -top-1 -right-2 text-sm animate-twinkle"
              style={{ color: "var(--gold)" }}>✦</span>
            <span className="absolute bottom-1 -left-3 text-xs animate-twinkle"
              style={{ color: "var(--primary)", animationDelay: "1s" }}>✧</span>
          </div>

          <h1
            className="mb-2"
            style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 400, color: "var(--foreground)" }}
          >
            You&apos;re invited ✦
          </h1>
          <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: "var(--muted-foreground)" }}>
            <strong style={{ color: "var(--foreground)" }}>{ownerName}</strong> shared her Luna cycle
            view with you. Enter the 6-digit code to continue.
          </p>
        </div>

        {/* ── Code input card ────────────────────────────────── */}
        <div
          className="rounded-3xl p-7 relative overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "0 12px 48px rgba(196,96,122,0.10), 0 2px 8px rgba(196,96,122,0.06)",
          }}
        >
          {/* Subtle corner glow */}
          <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
            style={{ background: "radial-gradient(circle at top right, rgba(232,200,138,0.15), transparent 70%)" }} />

          <p className="text-[11px] font-bold uppercase tracking-widest text-center mb-6"
            style={{ color: "var(--muted-foreground)", letterSpacing: "0.12em" }}>
            Enter your access code
          </p>

          {/* 6 digit boxes */}
          <div
            className="flex gap-2 justify-center mb-6"
            style={{ animation: shake ? "shake 0.5s ease" : "none" }}
          >
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                className="w-11 h-14 text-center text-xl font-bold rounded-2xl transition-all duration-200 outline-none"
                style={{
                  background: digit ? "var(--primary)" : "var(--secondary)",
                  color: digit ? "white" : "var(--foreground)",
                  border: `2px solid ${digit ? "var(--primary)" : "var(--border)"}`,
                  boxShadow: digit ? "0 4px 14px rgba(196,96,122,0.32)" : "none",
                  transform: digit ? "scale(1.05)" : "scale(1)",
                  fontFamily: "var(--font-sans)",
                  caretColor: "var(--primary)",
                }}
              />
            ))}
          </div>

          {/* Progress hint */}
          {!error && filled > 0 && filled < 6 && (
            <p className="text-xs text-center mb-4" style={{ color: "var(--muted-foreground)" }}>
              {6 - filled} more digit{6 - filled !== 1 ? "s" : ""}…
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-center mb-4 font-semibold animate-fade-up"
              style={{ color: "#D4607A" }}>
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            onClick={() => submit()}
            disabled={digits.some((d) => !d) || loading}
            className="btn-pink-gradient w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{
              opacity: digits.some((d) => !d) || loading ? 0.5 : 1,
              boxShadow: digits.every(Boolean) ? "0 6px 24px rgba(196,96,122,0.32)" : "none",
              transform: digits.every(Boolean) ? "translateY(-1px)" : "none",
            }}
          >
            {loading ? "Checking… 🌸" : "View partner page ✨"}
          </button>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          Don&apos;t have the code? Ask{" "}
          <strong style={{ color: "var(--foreground)" }}>{ownerName}</strong> to share it with you 💕
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </main>
  );
}
