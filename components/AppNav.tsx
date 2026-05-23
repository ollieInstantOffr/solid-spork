"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Today",    emoji: "🌸" },
  { href: "/log",       label: "Log",      emoji: "📓" },
  { href: "/insights",  label: "Insights", emoji: "🔮" },
  { href: "/partner",   label: "Partner",  emoji: "💕" },
  { href: "/profile",   label: "Profile",  emoji: "✨" },
];

export function AppNav() {
  const pathname = usePathname();
  const [ripple, setRipple]         = useState<string | null>(null);
  const [popping, setPopping]       = useState<string | null>(null);
  const [prevIndex, setPrevIndex]   = useState<number>(-1);
  const mounted = useRef(false);

  const activeIndex = NAV_ITEMS.findIndex(
    ({ href }) => pathname === href || pathname.startsWith(href + "/")
  );

  // Fire pop animation only when active tab changes (not on first render)
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (activeIndex >= 0) {
      const href = NAV_ITEMS[activeIndex].href;
      setPopping(href);
      setTimeout(() => setPopping(null), 500);
    }
    setPrevIndex(activeIndex);
  }, [activeIndex]);

  function handleTap(href: string) {
    setRipple(href);
    setTimeout(() => setRipple(null), 500);
  }

  const N = NAV_ITEMS.length; // 5
  const slotPct = 100 / N;   // 20%

  // Pill slides to active index: each slot = 1/N of bar width
  const pillLeft = activeIndex >= 0
    ? `calc(${activeIndex} * ${slotPct}% + 6px)`
    : "-999px";

  return (
    <>
      {/* ── Mobile bottom bar ─────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div
          className="relative mx-3 mb-3 flex items-center overflow-hidden"
          style={{
            height: "72px",
            borderRadius: "28px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow:
              "0 8px 32px rgba(196,96,122,0.14), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          {/* ── Sliding background pill ── */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "10px",
              bottom: "10px",
              left: pillLeft,
              width: `calc(${slotPct}% - 12px)`,
              borderRadius: "18px",
              background: "linear-gradient(135deg, var(--primary) 0%, #D468A8 100%)",
              boxShadow: "0 4px 16px rgba(196,96,122,0.38)",
              transition: "left 0.42s cubic-bezier(0.34,1.56,0.64,1)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            {/* Gloss shine on pill */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "18px",
              background: "linear-gradient(160deg,rgba(255,255,255,0.28) 0%,transparent 55%)",
            }} />
          </div>

          {/* ── Tabs ── */}
          {NAV_ITEMS.map(({ href, label, emoji }) => {
            const active   = pathname === href || pathname.startsWith(href + "/");
            const isPop    = popping === href;
            const isRipple = ripple === href;

            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleTap(href)}
                style={{
                  flex: 1,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  height: "100%",
                  zIndex: 1,
                  textDecoration: "none",
                  overflow: "hidden",
                }}
              >
                {/* Ripple */}
                {isRipple && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "rgba(196,96,122,0.25)",
                      animation: "nav-ripple 0.5s ease-out forwards",
                      pointerEvents: "none",
                    }}
                  />
                )}

                {/* Emoji */}
                <span
                  style={{
                    fontSize: "20px",
                    lineHeight: 1,
                    display: "block",
                    animation: isPop ? "nav-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
                    filter: active ? "none" : "opacity(0.45)",
                    transition: "filter 0.25s ease",
                  }}
                >
                  {emoji}
                </span>

                {/* Label — always visible, scales with active state */}
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: active ? 700 : 500,
                    color: active ? "white" : "var(--muted-foreground)",
                    letterSpacing: "0.01em",
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    animation: active ? "label-up 0.3s ease both" : "none",
                    transition: "color 0.25s ease",
                  }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop sidebar ──────────────────────────────── */}
      <nav
        className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 flex-col z-40"
        style={{
          background: "var(--card)",
          borderRight: "1px solid var(--border)",
          boxShadow: "2px 0 20px rgba(196,96,122,0.06)",
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-7 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl animate-float shrink-0"
              style={{
                background: "linear-gradient(135deg, var(--primary) 0%, #D470A8 100%)",
                boxShadow: "0 4px 14px rgba(196,96,122,0.30)",
              }}
            >🌸</div>
            <div>
              <h1 className="text-xl shimmer-text leading-none" style={{ fontFamily: "var(--font-display)" }}>Luna</h1>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--muted-foreground)" }}>Your cycle, understood</p>
            </div>
          </div>
        </div>

        <div className="mx-4 h-px mb-3" style={{ background: "var(--border)" }} />

        {/* Nav */}
        <div className="flex flex-col gap-1 px-3 flex-1">
          {NAV_ITEMS.map(({ href, label, emoji }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200"
                style={{
                  background: active
                    ? "linear-gradient(135deg,rgba(196,96,122,0.10) 0%,rgba(212,112,168,0.06) 100%)"
                    : "transparent",
                  textDecoration: "none",
                  borderLeft: `3px solid ${active ? "var(--primary)" : "transparent"}`,
                  transition: "all 0.22s ease",
                }}
                onMouseEnter={(e) => { if (!active)(e.currentTarget as HTMLElement).style.background = "var(--secondary)"; }}
                onMouseLeave={(e) => { if (!active)(e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                  style={{
                    background: active ? "linear-gradient(135deg,var(--primary) 0%,#D470A8 100%)" : "var(--secondary)",
                    boxShadow: active ? "0 3px 10px rgba(196,96,122,0.28)" : "none",
                    transition: "all 0.22s ease",
                    transform: active ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span style={{ filter: active ? "none" : "opacity(0.6)" }}>{emoji}</span>
                </div>
                <span className="text-sm" style={{ fontWeight: active ? 700 : 500, color: active ? "var(--primary)" : "var(--muted-foreground)" }}>
                  {label}
                </span>
                <span className="ml-auto text-sm opacity-0 group-hover:opacity-25 transition-opacity" style={{ color: "var(--muted-foreground)" }}>→</span>
              </Link>
            );
          })}
        </div>

        {/* History link — desktop only utility link */}
        <div className="px-3 mb-2">
          <Link
            href="/history"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-200 text-sm"
            style={{
              background: pathname === "/history" ? "var(--secondary)" : "transparent",
              color: pathname === "/history" ? "var(--foreground)" : "var(--muted-foreground)",
              textDecoration: "none",
              fontWeight: pathname === "/history" ? 600 : 400,
            }}
          >
            <span className="text-base">📅</span>
            Cycle history
          </Link>
        </div>

        <div className="px-4 pb-6 mt-4">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "var(--secondary)" }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: "#4CAF88" }} />
            <p className="text-[11px] font-medium" style={{ color: "var(--muted-foreground)" }}>Data stays private &amp; secure</p>
          </div>
        </div>
      </nav>
    </>
  );
}
