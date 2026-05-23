"use client";

import { useState, useEffect } from "react";

interface Props {
  notificationTime: string;
  notifyPeriod: boolean;
  notifyOvulation: boolean;
}

export function NotificationSettings({ notificationTime, notifyPeriod, notifyOvulation }: Props) {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [time, setTime] = useState(notificationTime);
  const [period, setPeriod] = useState(notifyPeriod);
  const [ovulation, setOvulation] = useState(notifyOvulation);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    setSupported("serviceWorker" in navigator && "PushManager" in window);
    if ("Notification" in window) setPermission(Notification.permission);
    // Check if already subscribed
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setSubscribed(!!sub);
      }).catch(() => {});
    }
  }, []);

  async function requestAndSubscribe() {
    if (!("serviceWorker" in navigator)) return;
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== "granted") return;

    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub.toJSON()),
    });
    setSubscribed(true);
  }

  async function unsubscribe() {
    if (!("serviceWorker" in navigator)) return;
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
    await fetch("/api/notifications/subscribe", { method: "DELETE" });
    setSubscribed(false);
  }

  async function savePrefs(updates: Partial<{ time: string; period: boolean; ovulation: boolean }>) {
    setStatus("saving");
    const next = { time, period, ovulation, ...updates };
    await fetch("/api/user/notification-prefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationTime: next.time, notifyPeriod: next.period, notifyOvulation: next.ovulation }),
    });
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 2000);
  }

  if (!supported) {
    return (
      <div className="rounded-2xl p-4 text-sm" style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>
        Push notifications aren&apos;t supported in this browser.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enable / disable toggle */}
      {!subscribed ? (
        <div className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">🔔</span>
            <div>
              <p className="font-semibold text-sm">Enable reminders</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                Get a gentle heads-up before your period and when your fertile window starts.
              </p>
            </div>
          </div>
          {permission === "denied" ? (
            <p className="text-xs" style={{ color: "var(--destructive)" }}>
              Notifications are blocked. Enable them in your browser settings.
            </p>
          ) : (
            <button onClick={requestAndSubscribe}
              className="btn-pink-gradient w-full py-3 rounded-xl text-sm font-semibold text-white"
              style={{ boxShadow: "0 4px 14px rgba(196,96,122,0.25)" }}>
              Turn on reminders 🌸
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔔</span>
              <p className="font-semibold text-sm">Reminders are on</p>
            </div>
            <button onClick={unsubscribe}
              className="text-xs font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted-foreground)" }}>
              Turn off
            </button>
          </div>

          {/* What to notify */}
          <div className="space-y-3 mb-4">
            {[
              { key: "period", label: "Period approaching (2 days before)", emoji: "🩸", value: period, set: setPeriod },
              { key: "ovulation", label: "Fertile window starting", emoji: "🌟", value: ovulation, set: setOvulation },
            ].map(({ key, label, emoji, value, set }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2 text-sm">
                  <span>{emoji}</span>
                  <span>{label}</span>
                </div>
                <div
                  className="w-11 h-6 rounded-full relative transition-colors duration-200 cursor-pointer"
                  style={{ background: value ? "var(--primary)" : "var(--border)" }}
                  onClick={() => {
                    const next = !value;
                    set(next);
                    savePrefs({ [key === "period" ? "period" : "ovulation"]: next });
                  }}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-sm"
                    style={{ left: value ? "calc(100% - 1.35rem)" : "0.15rem" }} />
                </div>
              </label>
            ))}
          </div>

          {/* Notification time */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wide block mb-2"
              style={{ color: "var(--muted-foreground)" }}>
              Preferred time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => { setTime(e.target.value); savePrefs({ time: e.target.value }); }}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "var(--secondary)",
                border: "1px solid var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>

          {status !== "idle" && (
            <p className="text-xs mt-2 text-right animate-fade-up"
              style={{ color: status === "saved" ? "var(--primary)" : "var(--muted-foreground)" }}>
              {status === "saving" ? "Saving…" : "Saved ✦"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
