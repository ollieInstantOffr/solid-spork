"use client";

import { useEffect, useRef } from "react";
import { getTimeOfDay, TIME_THEMES, TimeTheme } from "@/lib/timeTheme";

function applyTheme(theme: TimeTheme) {
  const r = document.documentElement;
  r.style.setProperty("--background", theme.background);
  r.style.setProperty("--foreground", theme.foreground);
  r.style.setProperty("--card", theme.card);
  r.style.setProperty("--card-foreground", theme.cardForeground);
  r.style.setProperty("--primary", theme.primary);
  r.style.setProperty("--primary-foreground", theme.primaryForeground);
  r.style.setProperty("--secondary", theme.secondary);
  r.style.setProperty("--secondary-foreground", theme.secondaryForeground);
  r.style.setProperty("--muted", theme.muted);
  r.style.setProperty("--muted-foreground", theme.mutedForeground);
  r.style.setProperty("--accent", theme.accent);
  r.style.setProperty("--border", theme.border);
  r.style.setProperty("--input", theme.input);
  r.style.setProperty("--ring", theme.primary);
  r.style.setProperty("--gold", theme.gold);
  r.style.setProperty("--gold-dark", theme.goldDark);
  r.style.setProperty("--menstrual", theme.menstrual);
  r.style.setProperty("--follicular", theme.follicular);
  r.style.setProperty("--ovulation", theme.ovulation);
  r.style.setProperty("--luteal", theme.luteal);
  r.style.setProperty("--sparkle-color", theme.sparkle);

  // Apply mesh gradient via body data attribute (read in globals.css)
  document.body.style.backgroundImage = theme.meshGradient;

  // Store period so other components can read it
  r.setAttribute("data-time", theme.period);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Smooth transition on theme changes
    document.documentElement.style.transition =
      "background-color 2s ease, color 1s ease";
    document.body.style.transition = "background-image 2s ease";

    function update() {
      const period = getTimeOfDay();
      const theme = TIME_THEMES[period];
      applyTheme(theme);

      // Schedule next update at the top of the next hour
      const now = new Date();
      const msUntilNextHour =
        (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;
      timerRef.current = setTimeout(update, msUntilNextHour);
    }

    update();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return <>{children}</>;
}
