"use client";

import { useState } from "react";

interface Props {
  token: string;
  existing: string | null | undefined;
}

export function PartnerMessageBox({ token, existing }: Props) {
  const [message, setMessage] = useState(existing ?? "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/partner/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, message }),
    });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💌</span>
          <p className="font-semibold text-sm">Leave her a message</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-semibold hover:opacity-70 transition-opacity"
            style={{ color: "var(--primary)" }}
          >
            {message ? "Edit" : "Write"}
          </button>
        )}
      </div>

      {!editing && message && (
        <div className="rounded-2xl p-4"
          style={{ background: "rgba(212,96,122,0.07)", border: "1px solid rgba(212,96,122,0.15)" }}>
          <p className="text-sm leading-relaxed italic" style={{ color: "var(--foreground)" }}>
            &ldquo;{message}&rdquo;
          </p>
        </div>
      )}

      {!editing && !message && (
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Write a short note — she&apos;ll see it on her dashboard 💕
        </p>
      )}

      {editing && (
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 280))}
            placeholder="Thinking of you today 💕"
            rows={3}
            className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none transition-all"
            style={{
              background: "var(--secondary)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            }}
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {280 - message.length} chars left
            </span>
            <div className="flex gap-2">
              <button onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold"
                style={{ background: "var(--secondary)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>
                Cancel
              </button>
              <button onClick={save} disabled={saving}
                className="btn-pink-gradient px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ opacity: saving ? 0.7 : 1 }}>
                {saving ? "Sending…" : "Send 💌"}
              </button>
            </div>
          </div>
        </div>
      )}

      {saved && (
        <p className="text-xs mt-2 font-semibold animate-fade-up" style={{ color: "var(--primary)" }}>
          ✦ Message sent — she&apos;ll see it on her Luna dashboard
        </p>
      )}
    </div>
  );
}
