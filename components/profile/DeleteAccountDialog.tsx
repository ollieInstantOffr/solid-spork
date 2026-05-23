"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const CONFIRM_PHRASE = "delete my account";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const confirmed = input.trim().toLowerCase() === CONFIRM_PHRASE;

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setInput("");
      setError("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function handleDelete() {
    if (!confirmed || deleting) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      // Sign out and redirect
      router.push("/login?deleted=1");
    } catch {
      setError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-2xl text-sm font-semibold transition-all"
        style={{
          background: "transparent",
          border: "1.5px solid #E05070",
          color: "#E05070",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(224,80,112,0.06)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >
        Delete my account
      </button>

      {/* Backdrop + modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(30,10,20,0.55)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-sm rounded-2xl overflow-hidden animate-fade-up"
            style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}
          >
            {/* Header */}
            <div
              className="px-6 pt-6 pb-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                  style={{ background: "rgba(224,80,112,0.10)", border: "1px solid rgba(224,80,112,0.20)" }}
                >
                  ⚠️
                </div>
                <div>
                  <h2 className="font-bold text-base" style={{ color: "#C02050" }}>
                    Delete account permanently
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    This cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              {/* What gets deleted */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "rgba(224,80,112,0.05)", border: "1px solid rgba(224,80,112,0.15)" }}
              >
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "#C02050" }}>
                  The following will be permanently deleted
                </p>
                {[
                  "Your profile and all personal details",
                  "All daily logs, mood, flow, and symptom history",
                  "Your cycle settings and phase preferences",
                  "All partner links and access codes",
                  "Your account and login access",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: "#E05070" }}>✕</span>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>{item}</p>
                  </div>
                ))}
              </div>

              {/* Confirmation input */}
              <div className="space-y-2">
                <label className="text-xs font-semibold block" style={{ color: "var(--foreground)" }}>
                  Type{" "}
                  <span
                    className="px-1.5 py-0.5 rounded font-bold"
                    style={{ background: "rgba(224,80,112,0.10)", color: "#C02050", fontFamily: "monospace" }}
                  >
                    delete my account
                  </span>{" "}
                  to confirm
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleDelete()}
                  placeholder="delete my account"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "var(--secondary)",
                    border: `1.5px solid ${confirmed ? "#22C55E" : input ? "#E05070" : "var(--border)"}`,
                    color: "var(--foreground)",
                  }}
                />
                {confirmed && (
                  <p className="text-[11px]" style={{ color: "#16A34A" }}>✓ Confirmed — you can now delete your account</p>
                )}
                {error && (
                  <p className="text-[11px]" style={{ color: "#E05070" }}>{error}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "var(--secondary)",
                  color: "var(--foreground)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={!confirmed || deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: confirmed ? "#E05070" : "rgba(224,80,112,0.20)",
                  color: confirmed ? "white" : "rgba(224,80,112,0.50)",
                  cursor: confirmed && !deleting ? "pointer" : "not-allowed",
                  boxShadow: confirmed ? "0 4px 16px rgba(224,80,112,0.30)" : "none",
                }}
              >
                {deleting ? "Deleting…" : "Delete forever"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
