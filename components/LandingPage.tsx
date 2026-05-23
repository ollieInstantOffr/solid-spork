"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getTimeOfDay, TIME_THEMES } from "@/lib/timeTheme";

// ── Sparkle particle ────────────────────────────────────────────────────────
function Sparkle({ style }: { style: React.CSSProperties }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none select-none absolute animate-twinkle"
      style={{ fontSize: "14px", color: "var(--gold)", ...style }}
    >
      ✦
    </span>
  );
}

// ── Scroll-reveal hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Phase data ───────────────────────────────────────────────────────────────
const PHASES = [
  { name: "Menstrual",  emoji: "🌸", color: "#D4607A", days: "Days 1–5",   desc: "Rest & restore. Your body deserves tenderness." },
  { name: "Follicular", emoji: "🌷", color: "#E890B0", days: "Days 6–13",  desc: "Energy rises. Creativity and confidence bloom." },
  { name: "Ovulation",  emoji: "🌟", color: "#D4A840", days: "Days 14–16", desc: "Peak radiance. You're magnetic and unstoppable." },
  { name: "Luteal",     emoji: "🌙", color: "#C090CC", days: "Days 17–28", desc: "Wind down. Honour your need for quiet and warmth." },
];

const FEATURES = [
  { emoji: "📊", title: "Cycle tracking",       desc: "Log flow, symptoms, mood and energy — and watch patterns emerge across months.",       color: "#D4607A" },
  { emoji: "💡", title: "Phase wisdom",          desc: "Personalised tips for nutrition, movement and mindset for every phase of your cycle.", color: "#E890B0" },
  { emoji: "💕", title: "Partner view",          desc: "Share a private link so your partner always knows how to support you, phase by phase.", color: "#C090CC" },
  { emoji: "🔮", title: "Zodiac + birthdate",   desc: "Add your birthdate and discover your zodiac sign alongside your cycle insights.",       color: "#D4A840" },
  { emoji: "🌙", title: "Time-aware themes",    desc: "The app shifts its mood from dawn blush to midnight violet — automatically.",           color: "#9070CC" },
  { emoji: "🔒", title: "Radically private",    desc: "Your data never leaves your device. No ads. No tracking. Just you and your cycle.",    color: "#4CAF88" },
];

// ── Floating phone mockup ───────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div
      className="relative mx-auto"
      style={{ width: "220px", height: "440px" }}
    >
      {/* Phone shell */}
      <div
        className="absolute inset-0 rounded-[36px]"
        style={{
          background: "linear-gradient(160deg, #fff8fc 0%, #ffe8f4 100%)",
          border: "2px solid rgba(196,96,122,0.25)",
          boxShadow: "0 32px 80px rgba(196,96,122,0.22), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 rounded-full"
          style={{ background: "rgba(196,96,122,0.12)" }} />

        {/* Screen content */}
        <div className="absolute inset-3 top-8 rounded-[28px] overflow-hidden flex flex-col gap-2 p-3"
          style={{ background: "var(--background)" }}>

          {/* Greeting bar */}
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🌸</span>
            <div>
              <div className="h-1.5 w-16 rounded-full" style={{ background: "var(--primary)", opacity: 0.8 }} />
              <div className="h-1 w-10 rounded-full mt-0.5" style={{ background: "var(--muted)", opacity: 0.4 }} />
            </div>
          </div>

          {/* Phase card */}
          <div className="rounded-2xl p-3 flex items-center gap-2"
            style={{ background: "rgba(212,96,122,0.10)", border: "1px solid rgba(212,96,122,0.20)" }}>
            <span className="text-2xl">🌸</span>
            <div>
              <div className="h-1.5 w-20 rounded-full mb-1" style={{ background: "var(--primary)", opacity: 0.9 }} />
              <div className="h-1 w-14 rounded-full" style={{ background: "var(--muted-foreground)", opacity: 0.35 }} />
            </div>
          </div>

          {/* Quick log */}
          <div className="rounded-2xl p-2.5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
            <div className="h-1.5 w-20 rounded-full mb-2" style={{ background: "var(--primary)", opacity: 0.6 }} />
            <div className="flex gap-1.5">
              {["😌","🌸","😪","✨"].map((e,i) => (
                <div key={i} className="flex-1 h-7 rounded-xl flex items-center justify-center text-sm"
                  style={{ background: i===1 ? "var(--primary)" : "var(--secondary)" }}>
                  {e}
                </div>
              ))}
            </div>
          </div>

          {/* Mini calendar strip */}
          <div className="flex gap-1 justify-center">
            {Array.from({length:7},(_,i)=>(
              <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: i===2 ? "var(--primary)" : i<2 ? "rgba(212,96,122,0.15)" : "var(--secondary)",
                  fontSize:"9px", fontWeight:700,
                  color: i===2 ? "white" : "var(--muted-foreground)"
                }}>
                {i+18}
              </div>
            ))}
          </div>

          {/* Recommendation pills */}
          <div className="space-y-1.5">
            {["🥗 Iron-rich foods","🛁 Rest is key","💊 Take folic acid"].map((t,i) => (
              <div key={i} className="rounded-xl px-2.5 py-1.5 flex items-center gap-1.5"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
                <div className="h-1.5 rounded-full flex-1" style={{ background: "var(--muted)", opacity:0.3 }} />
                <span style={{ fontSize:"10px" }}>{t.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating decorations around phone */}
      <div className="absolute -top-4 -right-6 text-2xl animate-float" style={{ animationDelay:"0.5s" }}>✦</div>
      <div className="absolute top-12 -left-8 text-base animate-twinkle" style={{ color:"var(--primary)", animationDelay:"1s" }}>✧</div>
      <div className="absolute bottom-16 -right-8 text-lg animate-twinkle" style={{ color:"var(--gold)", animationDelay:"0.3s" }}>✦</div>
      <div className="absolute -bottom-4 -left-4 text-base animate-float" style={{ animationDelay:"1.5s" }}>🌸</div>
    </div>
  );
}

// ── Main landing page ────────────────────────────────────────────────────────
export function LandingPage() {
  const theme = TIME_THEMES[getTimeOfDay()];

  const featuresReveal = useReveal();
  const phasesReveal   = useReveal();
  const partnerReveal  = useReveal();
  const ctaReveal      = useReveal();

  // Random sparkle positions (stable — computed once)
  const sparkles = [
    { top:"8%",  left:"5%",  animationDelay:"0s",   fontSize:"10px" },
    { top:"15%", right:"8%", animationDelay:"0.7s",  fontSize:"16px" },
    { top:"30%", left:"2%",  animationDelay:"1.3s",  fontSize:"8px"  },
    { top:"55%", right:"4%", animationDelay:"0.4s",  fontSize:"12px" },
    { top:"70%", left:"6%",  animationDelay:"1.8s",  fontSize:"9px"  },
    { top:"82%", right:"7%", animationDelay:"1.1s",  fontSize:"14px" },
    { top:"92%", left:"12%", animationDelay:"0.2s",  fontSize:"10px" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--background)", overflowX: "hidden" }}>

      {/* ── Nav bar ─────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(255,240,245,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl animate-float">🌸</span>
          <span className="text-xl font-semibold shimmer-text" style={{ fontFamily: "var(--font-display)" }}>
            Luna
          </span>
        </div>
        <Link
          href="/login"
          className="btn-pink-gradient px-5 py-2 rounded-full text-sm font-semibold text-white"
          style={{ boxShadow: "0 4px 16px rgba(196,96,122,0.30)" }}
        >
          Get started ✨
        </Link>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden">

        {/* Animated mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-float"
            style={{ background: "var(--primary)", animationDuration: "8s" }} />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 animate-float"
            style={{ background: "var(--gold)", animationDuration: "10s", animationDelay: "2s" }} />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-15 animate-float"
            style={{ background: "#D090CC", animationDuration: "12s", animationDelay: "1s" }} />
        </div>

        {/* Sparkles */}
        {sparkles.map((s, i) => (
          <Sparkle key={i} style={{ ...s, animationDelay: s.animationDelay }} />
        ))}

        {/* Content */}
        <div className="relative max-w-6xl w-full mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Left: text */}
          <div className="text-center md:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6 uppercase tracking-widest animate-fade-up"
              style={{
                background: "rgba(196,96,122,0.10)",
                border: "1px solid rgba(196,96,122,0.20)",
                color: "var(--primary)",
                animationDelay: "0.1s",
              }}
            >
              <span className="animate-twinkle">✦</span>
              {theme.greeting} · {theme.name} mode
              <span className="animate-twinkle" style={{ animationDelay: "0.5s" }}>✦</span>
            </div>

            <h1
              className="leading-none mb-4 animate-fade-up"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                fontWeight: 400,
                color: "var(--foreground)",
                animationDelay: "0.2s",
              }}
            >
              Your cycle,{" "}
              <span className="shimmer-text italic">finally</span>
              <br />understood.
            </h1>

            <p
              className="text-lg leading-relaxed mb-8 max-w-md animate-fade-up"
              style={{ color: "var(--muted-foreground)", animationDelay: "0.35s" }}
            >
              Luna tracks your menstrual cycle, predicts your phases, and helps the people you love support you — beautifully.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start animate-fade-up" style={{ animationDelay: "0.5s" }}>
              <Link
                href="/login"
                className="btn-pink-gradient px-8 py-4 rounded-2xl text-base font-bold text-white inline-flex items-center justify-center gap-2"
                style={{ boxShadow: "0 6px 28px rgba(196,96,122,0.35)" }}
              >
                Start tracking free 🌸
              </Link>
              <a
                href="#features"
                className="px-8 py-4 rounded-2xl text-base font-semibold inline-flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "var(--secondary)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                See how it works ↓
              </a>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-6 animate-fade-up" style={{ animationDelay: "0.65s" }}>
              {["🔒 100% private", "✨ Free forever", "💕 Partner-friendly", "🌍 Works offline"].map((t) => (
                <span key={t} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="flex justify-center md:justify-end animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div className="animate-float" style={{ animationDuration: "6s" }}>
              <PhoneMockup />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-fade-up" style={{ animationDelay: "1s" }}>
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>Scroll to explore</span>
          <div className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
            style={{ borderColor: "var(--border)" }}>
            <div className="w-1 h-2 rounded-full animate-bounce" style={{ background: "var(--primary)" }} />
          </div>
        </div>
      </section>

      {/* ── Phases ribbon ─────────────────────────────────────────── */}
      <section id="features" className="py-6 overflow-hidden">
        <div className="flex gap-0">
          {PHASES.map(({ name, emoji, color, days, desc }) => (
            <div
              key={name}
              className="group flex-1 min-w-[180px] p-8 flex flex-col gap-3 transition-all duration-500 cursor-default relative overflow-hidden"
              style={{ background: `${color}12`, borderTop: `3px solid ${color}` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}20 0%, transparent 70%)` }} />

              <span className="text-4xl transition-transform duration-500 group-hover:scale-125 group-hover:-translate-y-1 inline-block">{emoji}</span>
              <div>
                <p className="font-bold text-sm" style={{ color }}>{name}</p>
                <p className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>{days}</p>
              </div>
              <p className="text-xs leading-relaxed hidden sm:block" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div ref={featuresReveal.ref}>
            <div className="text-center mb-16"
              style={{
                opacity: featuresReveal.visible ? 1 : 0,
                transform: featuresReveal.visible ? "translateY(0)" : "translateY(32px)",
                transition: "all 0.7s ease",
              }}
            >
              <h2
                className="mb-3"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 400 }}
              >
                Everything your cycle deserves ✦
              </h2>
              <p style={{ color: "var(--muted-foreground)", fontSize: "1.05rem" }}>
                Thoughtfully designed for every phase of your life.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map(({ emoji, title, desc, color }, i) => (
                <div
                  key={title}
                  className="group p-6 rounded-3xl relative overflow-hidden transition-all duration-300 cursor-default"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    boxShadow: "0 2px 12px rgba(196,96,122,0.05)",
                    opacity: featuresReveal.visible ? 1 : 0,
                    transform: featuresReveal.visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)",
                    transition: `all 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) scale(1.02)";
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${color}22`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(196,96,122,0.05)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                >
                  {/* Corner glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`, transform: "translate(30%,-30%)" }} />

                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    {emoji}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: "var(--foreground)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner section ───────────────────────────────────────── */}
      <section className="py-24 px-6 overflow-hidden" style={{ background: "var(--secondary)" }}>
        <div className="max-w-5xl mx-auto" ref={partnerReveal.ref}>
          <div
            className="grid md:grid-cols-2 gap-12 items-center"
            style={{
              opacity: partnerReveal.visible ? 1 : 0,
              transition: "all 0.8s ease",
              transform: partnerReveal.visible ? "none" : "translateY(40px)",
            }}
          >
            {/* Visual */}
            <div className="relative">
              <div
                className="rounded-3xl p-6 relative overflow-hidden"
                style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(196,96,122,0.10)" }}
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🌸</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-display)" }}>Luna</p>
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Partner view for Sofia</p>
                  </div>
                </div>

                {/* Phase hero mini */}
                <div className="rounded-2xl p-4 mb-3" style={{ background: "rgba(212,96,122,0.10)", border: "1px solid rgba(212,96,122,0.20)" }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#D4607A" }}>Menstrual phase · Day 3</p>
                  <p className="font-semibold" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Rest & Recovery Week</p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Her body is doing a lot right now. She may need extra comfort.</p>
                </div>

                {/* Needs */}
                <div className="rounded-2xl p-3" style={{ background: "var(--secondary)" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "var(--muted-foreground)" }}>💌 What Sofia needs right now</p>
                  <div className="flex flex-wrap gap-1.5">
                    {["🍫 Chocolate", "💆 Massage", "🎬 Movie night", "🌡️ Hot water bottle"].map((t) => (
                      <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "rgba(212,96,122,0.12)", color: "#D4607A", border: "1px solid rgba(212,96,122,0.20)" }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating decorations */}
              <div className="absolute -top-4 -right-4 text-2xl animate-twinkle" style={{ color: "var(--gold)" }}>✦</div>
              <div className="absolute -bottom-2 -left-4 text-base animate-float" style={{ animationDelay: "1s" }}>💕</div>
            </div>

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4 uppercase tracking-widest"
                style={{ background: "rgba(192,144,204,0.12)", border: "1px solid rgba(192,144,204,0.25)", color: "#C090CC" }}>
                ✦ Partner view
              </div>
              <h2 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 400 }}>
                Help the people who love you, love you better.
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "var(--muted-foreground)" }}>
                Share a private, secure link with your partner. They see your current phase, what you need, and how to support you — without accessing any of your private health data.
              </p>
              <div className="space-y-3">
                {[
                  { icon: "🔗", text: "One private link, protected by a 6-digit code" },
                  { icon: "💌", text: "They see exactly what you need from them this phase" },
                  { icon: "📅", text: "Coming up next — so they can plan ahead" },
                  { icon: "🔒", text: "Revoke access at any time" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm">
                    <span className="text-xl">{icon}</span>
                    <span style={{ color: "var(--foreground)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Time-of-day section ───────────────────────────────────── */}
      <section className="py-24 px-6" ref={phasesReveal.ref}>
        <div className="max-w-4xl mx-auto text-center">
          <div style={{
            opacity: phasesReveal.visible ? 1 : 0,
            transform: phasesReveal.visible ? "none" : "translateY(30px)",
            transition: "all 0.7s ease",
          }}>
            <h2 className="mb-4" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 400 }}>
              The app that feels like the time of day ✦
            </h2>
            <p className="text-base leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "var(--muted-foreground)" }}>
              Luna reads the clock and shifts its whole mood — warm golden mornings, soft pink afternoons, deep violet nights. Open it at any hour and it feels right.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: "Morning",   emoji: "🌅", gradient: "from-amber-100 to-orange-50",   color: "#D46848", desc: "Warm & golden" },
                { name: "Afternoon", emoji: "☀️",  gradient: "from-pink-100 to-rose-50",    color: "#C4607A", desc: "Soft & rosy" },
                { name: "Evening",   emoji: "🌆", gradient: "from-rose-100 to-red-50",      color: "#A8506A", desc: "Cosy & warm" },
                { name: "Night",     emoji: "🌙", gradient: "from-purple-200 to-indigo-100", color: "#C890CC", desc: "Deep & dreamy" },
              ].map(({ name, emoji, color, desc }, i) => (
                <div
                  key={name}
                  className="p-5 rounded-3xl text-center transition-all duration-300 cursor-default"
                  style={{
                    background: "var(--card)",
                    border: `1px solid ${color}30`,
                    opacity: phasesReveal.visible ? 1 : 0,
                    transform: phasesReveal.visible ? "none" : "scale(0.9)",
                    transition: `all 0.5s ease ${i * 100}ms`,
                    boxShadow: `0 4px 20px ${color}15`,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.05) translateY(-4px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1) translateY(0)"; }}
                >
                  <div className="text-3xl mb-2 animate-float" style={{ animationDelay: `${i * 0.4}s` }}>{emoji}</div>
                  <p className="font-bold text-sm mb-0.5" style={{ color }}>{name}</p>
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden" ref={ctaReveal.ref}>
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-20 animate-float"
            style={{ background: "var(--primary)", animationDuration: "9s" }} />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full blur-3xl opacity-15 animate-float"
            style={{ background: "var(--gold)", animationDuration: "11s", animationDelay: "3s" }} />
        </div>

        <div
          className="relative max-w-2xl mx-auto text-center"
          style={{
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? "none" : "translateY(40px)",
            transition: "all 0.8s ease",
          }}
        >
          <div className="text-5xl mb-6 animate-float" style={{ animationDuration: "4s" }}>🌸</div>
          <h2
            className="mb-4"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 400 }}
          >
            Your cycle is telling you something. Luna helps you listen.
          </h2>
          <p className="text-lg mb-8" style={{ color: "var(--muted-foreground)" }}>
            Free, private, and beautifully designed for you.
          </p>
          <Link
            href="/login"
            className="btn-pink-gradient inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-lg font-bold text-white"
            style={{ boxShadow: "0 8px 32px rgba(196,96,122,0.35)" }}
          >
            Begin your journey 🌸
          </Link>
          <p className="text-xs mt-4" style={{ color: "var(--muted-foreground)" }}>
            No credit card · No ads · No tracking
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg animate-twinkle">🌸</span>
            <span className="font-semibold shimmer-text" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Luna</span>
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>· Your cycle, understood</span>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <Link href="/terms" className="hover:underline underline-offset-2">Terms</Link>
            <Link href="/privacy" className="hover:underline underline-offset-2">Privacy</Link>
            <span>Made with 💕 · {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
